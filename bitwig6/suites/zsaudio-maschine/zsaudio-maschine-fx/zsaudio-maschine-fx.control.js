loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "ZSAudio Maschine FX",
    "0.1",
    "e7f8a9b0-c1d2-4567-890a-bcdef0123456",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

const USER_CHANNEL = 5; // User Mode 6 (0-based channel 5)

const TARGET_TRACK_NAME = "Premaster";
const CURSOR_ID = "maschine-fx-premaster";
const CURSOR_NAME = "Maschine FX Premaster";
const FLAT_BANK_SIZE = 256;

const NUM_COLUMNS = 8;
const COLUMNAR_PARAM_OFFSET = 0;
const COLUMNAR_PARAMS_PER_PAGE = 3;
const FX_MIX_TAG = "fx-mix";
const FX_MIX_PARAMS = 8;
const ID_PREFIX = "premaster-";

const COLUMNAR_TAGS = [];
for (let i = 0; i < NUM_COLUMNS; i++) {
    COLUMNAR_TAGS.push("fx-" + (i + 1));
}

const KNOBS_TOP = [];
const KNOBS_MID = [];
const KNOBS_BOT = [];
const FADERS = [];
for (let c = 0; c < NUM_COLUMNS; c++) {
    KNOBS_TOP.push(0x0D + c);
    KNOBS_MID.push(0x1D + c);
    KNOBS_BOT.push(0x31 + c);
    FADERS.push(0x4D + c);
}

const REDO_BUTTON_CC = 0x6B;
const REDO_BUTTON_NOTE = 0x2A;
const UNDO_BUTTON_CC = 0x6C;
const UNDO_BUTTON_NOTE = 0x2B;

let midiOut;
let application;
let detectBank;
let cursorTrack;
let primaryDevice;
let chainSelector;
let fxMixPage;
let columnarPages = [];
let remotePages = [];
let found = false;
let selectedIndex = -1;
let resolveTrackTaskPending = false;

function init() {
    host.getMidiInPort(0).setMidiCallback(onMidi);
    midiOut = host.getMidiOutPort(0);
    application = host.createApplication();
    application.projectName().markInterested();
    application.projectName().addValueObserver(function () {
        selectedIndex = -1;
        scheduleResolveTargetTrack();
    });

    cursorTrack = host.createCursorTrack(CURSOR_ID, CURSOR_NAME, 0, 0, false);
    cursorTrack.isPinned().markInterested();

    const devBank = cursorTrack.createDeviceBank(1);
    primaryDevice = devBank.getDevice(0);
    primaryDevice.exists().markInterested();
    primaryDevice.name().markInterested();
    primaryDevice.exists().addValueObserver(function () {
        scheduleResolveTargetTrack();
    });
    primaryDevice.name().addValueObserver(function () {
        scheduleResolveTargetTrack();
    });

    chainSelector = primaryDevice.createChainSelector();
    chainSelector.exists().markInterested();
    chainSelector.activeChainIndex().markInterested();
    chainSelector.chainCount().markInterested();
    chainSelector.activeChainIndex().addValueObserver(function () {
        reselectAllRemotePages();
    });
    chainSelector.chainCount().addValueObserver(function () {
        reselectAllRemotePages();
    });

    fxMixPage = primaryDevice.createCursorRemoteControlsPage(
        ID_PREFIX + FX_MIX_TAG, FX_MIX_PARAMS, FX_MIX_TAG
    );
    markPageParams(fxMixPage, FX_MIX_PARAMS);
    remotePages.push(fxMixPage);

    for (let col = 0; col < NUM_COLUMNS; col++) {
        const tag = COLUMNAR_TAGS[col];
        const page = primaryDevice.createCursorRemoteControlsPage(
            ID_PREFIX + tag, COLUMNAR_PARAMS_PER_PAGE, tag
        );
        markPageParams(page, COLUMNAR_PARAMS_PER_PAGE);
        columnarPages[col] = page;
        remotePages.push(page);
    }

    setupDetection();

    host.scheduleTask(function () {
        cursorTrack.isPinned().set(true);
        resolveTargetTrack(true);
    }, 200);

    status("ready");
}

function status(message) {
    host.println(CURSOR_NAME + ": " + message);
}

function reselectAllRemotePages() {
    for (let i = 0; i < remotePages.length; i++) {
        ensureRemotePageSelected(remotePages[i]);
    }
}

function ensureRemotePageSelected(page) {
    const count = page.pageCount().get();
    if (count > 0) {
        page.selectedPageIndex().set(0);
    }
}

function markPageParams(page, count) {
    for (let i = 0; i < count; i++) {
        const param = page.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(function () {
            ensureRemotePageSelected(page);
        });
    }
    autoSelectPageWhenAvailable(page);
}

function autoSelectPageWhenAvailable(page) {
    page.selectedPageIndex().markInterested();
    page.pageCount().markInterested();
    page.pageNames().markInterested();
    page.pageCount().addValueObserver(function (count) {
        if (count > 0) {
            ensureRemotePageSelected(page);
        }
    });
    page.pageNames().addValueObserver(function () {
        ensureRemotePageSelected(page);
    });
}

function scheduleResolveTargetTrack() {
    if (resolveTrackTaskPending) {
        return;
    }
    resolveTrackTaskPending = true;
    host.scheduleTask(function () {
        resolveTrackTaskPending = false;
        resolveTargetTrack();
    }, 100);
}

function setupDetection() {
    const rootGroup = host.getProject().getRootTrackGroup();
    detectBank = rootGroup.createTrackBank(FLAT_BANK_SIZE, 0, 0, true);
    for (let i = 0; i < FLAT_BANK_SIZE; i++) {
        const t = detectBank.getItemAt(i);
        t.exists().markInterested();
        t.name().markInterested();
        t.exists().addValueObserver(function () { scheduleResolveTargetTrack(); });
        t.name().addValueObserver(function () { scheduleResolveTargetTrack(); });
    }
}

function findTrackIndex(name) {
    for (let i = 0; i < FLAT_BANK_SIZE; i++) {
        const t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function resolveTargetTrack(forceLog) {
    const idx = findTrackIndex(TARGET_TRACK_NAME);
    if (idx !== selectedIndex) {
        selectedIndex = idx;
        if (idx !== -1) {
            cursorTrack.selectChannel(detectBank.getItemAt(idx));
        }
    }

    const newFound = idx !== -1;
    if (forceLog || newFound !== found) {
        status("track " + (newFound ? (TARGET_TRACK_NAME + " @ " + idx) : "NOT FOUND"));
    }
    if (newFound !== found) {
        found = newFound;
    }
    if (newFound) {
        reselectAllRemotePages();
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const msgType = status & 0xF0;

    if (channel !== USER_CHANNEL) {
        return;
    }

    if (msgType === 0xB0) {
        handleCC(data1, data2);
    } else if (msgType === 0x90 || msgType === 0x80) {
        handleCC(data1, msgType === 0x90 ? data2 : 0);
    }
}

function handleCC(cc, value) {
    if (cc === REDO_BUTTON_CC && value > 0) {
        application.redo();
        return;
    }
    if (cc === UNDO_BUTTON_CC && value > 0) {
        application.undo();
        return;
    }

    if (!found) {
        return;
    }

    const val = value / 127.0;

    for (let i = 0; i < NUM_COLUMNS; i++) {
        if (cc === FADERS[i]) {
            fxMixPage.getParameter(i).set(val);
            return;
        }
    }

    for (let col = 0; col < NUM_COLUMNS; col++) {
        const page = columnarPages[col];
        if (cc === KNOBS_TOP[col]) {
            page.getParameter(COLUMNAR_PARAM_OFFSET + 0).set(val);
            return;
        }
        if (cc === KNOBS_MID[col]) {
            page.getParameter(COLUMNAR_PARAM_OFFSET + 1).set(val);
            return;
        }
        if (cc === KNOBS_BOT[col]) {
            page.getParameter(COLUMNAR_PARAM_OFFSET + 2).set(val);
            return;
        }
    }
}

function flush() {
    midiOut.sendMidi(0x90 + USER_CHANNEL, REDO_BUTTON_NOTE, 127);
    midiOut.sendMidi(0x90 + USER_CHANNEL, UNDO_BUTTON_NOTE, 127);
}

function exit() {
    status("exit");
}
