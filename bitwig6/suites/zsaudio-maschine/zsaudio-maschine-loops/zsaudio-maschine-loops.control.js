loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);
host.defineController(
    "Korg",
    "ZSAudio Maschine Loops",
    "0.1",
    "f6a7b8c9-d0e1-2345-f678-901234567890",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["nanoKONTROL2"], ["nanoKONTROL2"]);

const DEBUG = false;

const CC_S_BUTTONS = [32, 33, 34, 35, 36, 37, 38, 39];
const CC_M_BUTTONS = [48, 49, 50, 51, 52, 53, 54, 55];
const CC_R_BUTTONS = [64, 65, 66, 67, 68, 69, 70, 71];

const CC_TRANS_REW = 43;
const CC_TRANS_FF = 44;
const CC_TRANS_STOP = 42;
const CC_TRANS_PLAY = 41;
const CC_TRANS_REC = 45;
const CC_TRANS_BUTTONS = [CC_TRANS_REW, CC_TRANS_FF, CC_TRANS_STOP, CC_TRANS_PLAY, CC_TRANS_REC];

const CC_NEXT_TRACK = 59;
const CC_CYCLE = 46;

const CC_MARKER_SET = 60;
const CC_MARKER_PREV = 61;
const CC_MARKER_NEXT = 62;

const CC_KNOBS = [16, 17, 18, 19, 20, 21, 22, 23];
const CC_FADERS = [0, 1, 2, 3, 4, 5, 6, 7];

const FLAT_BANK_SIZE = 256;
const TARGET_TRACK_NAME = "Loops";
const CURSOR_ID = "maschine-loops";
const CURSOR_NAME = "Maschine Loops";
const P0_TAG = "p0";
const VOLS_TAG = "vols";

const NUM_KORG_COLUMNS = 8;
const NUM_CHILD_TRACKS = 5;
const DM_CHILD_TRACK_INDEX = 0;
// Korg column (0-based) -> Loops child index (0-based). -1 = inactive.
const KORG_TO_CHILD = [0, -1, -1, -1, 1, 2, 3, 4];
const NUM_DM_SLOTS = 4;
const BANK_SIZE = 6; // 3 or 6
const NUM_CLIPS = 5 * BANK_SIZE;
const LONG_PRESS_DELAY = 500;

let midiIn, midiOut;
let detectBank = null;
let cursorTrack = null;
let found = false;
let selectedIndex = -1;
let pageP0 = null;
let pageVols = null;
let childTrackBank = null;
let sceneBank = null;
let childTrackSlots = [];
let slotChainSelectors = [];

let isClipPage2 = false;
let isChainLinkedToBank = false;
let currentBank = 0;
let buttonStates = {};

function status(message) {
    host.println(CURSOR_NAME + ": " + message);
}

function log(message) {
    if (DEBUG) {
        status(message);
    }
}

function getTotalOffset() {
    const bankOffset = currentBank * BANK_SIZE;
    const pageOffset = (BANK_SIZE === 6 && isClipPage2) ? 3 : 0;
    return bankOffset + pageOffset;
}

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    setupDetection();

    cursorTrack = host.createCursorTrack(CURSOR_ID, CURSOR_NAME, 0, 0, false);
    cursorTrack.isPinned().markInterested();
    setupDeviceControls(cursorTrack);
    setupChildTracks(cursorTrack);
    setupSlotChainSelectors();

    host.scheduleTask(function () {
        cursorTrack.isPinned().set(true);
        resolveTargetTrack(true);
        turnOffAllLeds();
        updateTransportLeds();
        updateCycleLed();
    }, 200);

    status("ready");
}

function setupDetection() {
    var rootGroup = host.getProject().getRootTrackGroup();
    detectBank = rootGroup.createTrackBank(FLAT_BANK_SIZE, 0, 0, true);
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        t.exists().markInterested();
        t.name().markInterested();
        t.exists().addValueObserver(function () { resolveTargetTrack(); });
        t.name().addValueObserver(function () { resolveTargetTrack(); });
    }
}

function findTrackIndex() {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === TARGET_TRACK_NAME.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function resolveTargetTrack(forceLog) {
    var idx = findTrackIndex();
    if (idx !== selectedIndex) {
        selectedIndex = idx;
        if (idx !== -1) {
            cursorTrack.selectChannel(detectBank.getItemAt(idx));
        }
    }

    var newFound = idx !== -1;
    if (forceLog || newFound !== found) {
        status("track " + (newFound ? (TARGET_TRACK_NAME + " @ index " + idx) : "NOT FOUND"));
    }
    if (newFound !== found) {
        found = newFound;
        refreshGridLeds();
    }
}

function autoSelectPageWhenAvailable(page) {
    page.selectedPageIndex().markInterested();
    page.pageCount().markInterested();
    page.pageCount().addValueObserver(function (count) {
        if (count > 0 && page.selectedPageIndex().get() < 0) {
            page.selectedPageIndex().set(0);
        }
    });
}

function setupDeviceControls(track) {
    var device = track.createDeviceBank(1).getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();

    pageP0 = device.createCursorRemoteControlsPage("loops-p0", 8, P0_TAG);
    pageVols = device.createCursorRemoteControlsPage("loops-vols", 8, VOLS_TAG);

    for (var i = 0; i < 8; i++) {
        pageP0.getParameter(i).markInterested();
        pageP0.getParameter(i).setIndication(true);
        pageVols.getParameter(i).markInterested();
        pageVols.getParameter(i).setIndication(true);
    }
    autoSelectPageWhenAvailable(pageP0);
    autoSelectPageWhenAvailable(pageVols);
}

function korgColumnToChild(korgColumn) {
    if (korgColumn < 0 || korgColumn >= NUM_KORG_COLUMNS) {
        return -1;
    }
    return KORG_TO_CHILD[korgColumn];
}

function childToKorgColumn(childIndex) {
    for (var k = 0; k < NUM_KORG_COLUMNS; k++) {
        if (KORG_TO_CHILD[k] === childIndex) {
            return k;
        }
    }
    return -1;
}

function setupChildTracks(groupTrack) {
    childTrackBank = groupTrack.createTrackBank(NUM_CHILD_TRACKS, 0, NUM_CLIPS, false);
    sceneBank = childTrackBank.sceneBank();

    for (var s = 0; s < NUM_CLIPS; s++) {
        sceneBank.getScene(s).exists().markInterested();
    }

    for (var i = 0; i < NUM_CHILD_TRACKS; i++) {
        var track = childTrackBank.getItemAt(i);
        track.exists().markInterested();
        childTrackSlots[i] = [];

        var clipLauncher = track.clipLauncherSlotBank();
        for (var j = 0; j < NUM_CLIPS; j++) {
            var clip = clipLauncher.getItemAt(j);
            clip.exists().markInterested();
            clip.isPlaying().markInterested();
            childTrackSlots[i][j] = clip;

            (function (childIndex, clipIndex) {
                clip.isPlaying().addValueObserver(function (isPlaying) {
                    updateLed(childIndex, clipIndex, isPlaying);
                });
            })(i, j);
        }
    }
}

function setupSlotChainSelectors() {
    slotChainSelectors = [];
    if (!childTrackBank) {
        return;
    }

    var childTrack = childTrackBank.getItemAt(DM_CHILD_TRACK_INDEX);
    childTrack.exists().markInterested();

    var deviceBank = childTrack.createDeviceBank(1);
    var instrumentMatcher = host.createInstrumentMatcher();
    deviceBank.setDeviceMatcher(instrumentMatcher);
    var dmDevice = deviceBank.getDevice(0);
    dmDevice.exists().markInterested();
    dmDevice.name().markInterested();

    var drumPadBank = dmDevice.createDrumPadBank(NUM_DM_SLOTS);
    drumPadBank.exists().markInterested();

    for (var s = 0; s < NUM_DM_SLOTS; s++) {
        var pad = drumPadBank.getItemAt(s);
        pad.exists().markInterested();

        var padDeviceBank = pad.createDeviceBank(1);
        padDeviceBank.setDeviceMatcher(instrumentMatcher);
        var padDevice = padDeviceBank.getDevice(0);
        padDevice.exists().markInterested();
        padDevice.name().markInterested();

        var chainSelector = padDevice.createChainSelector();
        chainSelector.exists().markInterested();
        chainSelector.activeChainIndex().markInterested();
        slotChainSelectors[s] = chainSelector;
    }
}

function isDeadClipTrack(korgColumn) {
    return korgColumnToChild(korgColumn) === -1;
}

function setChainOnAllSlots(chainIndex) {
    for (var i = 0; i < NUM_DM_SLOTS; i++) {
        var selector = slotChainSelectors[i];
        if (selector && selector.exists().get()) {
            selector.activeChainIndex().set(chainIndex);
        }
    }
    log("chains -> " + (chainIndex + 1));
}

function onMidi(status, data1, data2) {
    log("MIDI: " + status + ", " + data1 + ", " + data2);

    var msgType = status & 0xF0;
    if (msgType !== 0xB0) {
        return;
    }

    if (data2 > 0) {
        if (data1 === CC_NEXT_TRACK) {
            if (BANK_SIZE === 6) {
                isClipPage2 = !isClipPage2;
                refreshGridLeds();
                log("clip page 2: " + (isClipPage2 ? "ON" : "OFF"));
            } else {
                log("clip page toggle disabled (BANK_SIZE is 3)");
            }
            return;
        }

        if (data1 === CC_CYCLE) {
            isChainLinkedToBank = !isChainLinkedToBank;
            updateCycleLed();
            if (isChainLinkedToBank) {
                setChainOnAllSlots(currentBank);
            }
            log("chain/bank link: " + (isChainLinkedToBank ? "ON" : "OFF"));
            return;
        }

        var knobIndex = CC_KNOBS.indexOf(data1);
        if (knobIndex !== -1) {
            if (pageP0) {
                pageP0.getParameter(knobIndex).set(data2 / 127.0);
            }
            return;
        }

        var faderIndex = CC_FADERS.indexOf(data1);
        if (faderIndex !== -1) {
            if (pageVols) {
                pageVols.getParameter(faderIndex).set(data2 / 127.0);
            }
            return;
        }

        var transIndex = CC_TRANS_BUTTONS.indexOf(data1);
        if (transIndex !== -1) {
            currentBank = transIndex;
            updateTransportLeds();
            refreshGridLeds();
            if (isChainLinkedToBank) {
                setChainOnAllSlots(currentBank);
            }
            log("bank " + (currentBank + 1));
            return;
        }

        if (data1 === CC_MARKER_SET || data1 === CC_MARKER_PREV || data1 === CC_MARKER_NEXT) {
            var baseIndex = getTotalOffset();
            var sceneOffset = 0;
            if (data1 === CC_MARKER_SET) sceneOffset = 0;
            else if (data1 === CC_MARKER_PREV) sceneOffset = 1;
            else if (data1 === CC_MARKER_NEXT) sceneOffset = 2;

            var sceneIndex = baseIndex + sceneOffset;
            if (sceneBank) {
                var scene = sceneBank.getScene(sceneIndex);
                if (scene && scene.exists().get()) {
                    if (isChainLinkedToBank) {
                        setChainOnAllSlots(currentBank);
                    }
                    scene.launch();
                    log("scene " + (sceneIndex + 1));
                } else {
                    log("scene " + (sceneIndex + 1) + " does not exist");
                }
            }
            return;
        }

        handleButton(data1, data2);
    } else {
        handleButton(data1, data2);
    }
}

function getClipInfoFromCC(cc) {
    var korgColumn = -1;
    var clipIndex = -1;
    var totalOffset = getTotalOffset();

    korgColumn = CC_S_BUTTONS.indexOf(cc);
    if (korgColumn !== -1) {
        clipIndex = 0 + totalOffset;
    }

    if (korgColumn === -1) {
        korgColumn = CC_M_BUTTONS.indexOf(cc);
        if (korgColumn !== -1) {
            clipIndex = 1 + totalOffset;
        }
    }

    if (korgColumn === -1) {
        korgColumn = CC_R_BUTTONS.indexOf(cc);
        if (korgColumn !== -1) {
            clipIndex = 2 + totalOffset;
        }
    }

    if (korgColumn === -1 || clipIndex === -1) {
        return null;
    }

    var childIndex = korgColumnToChild(korgColumn);
    if (childIndex === -1) {
        return null;
    }

    if (childTrackSlots[childIndex] && childTrackSlots[childIndex][clipIndex]) {
        return {
            korgColumn: korgColumn,
            childIndex: childIndex,
            clipIndex: clipIndex,
            clip: childTrackSlots[childIndex][clipIndex]
        };
    }
    return null;
}

function handleButton(cc, value) {
    var info = getClipInfoFromCC(cc);
    if (!info) {
        return;
    }

    var childIndex = info.childIndex;
    var clipIndex = info.clipIndex;
    var clip = info.clip;
    var isDown = value > 0;

    if (isDown) {
        if (clip.exists().get()) {
            if (clip.isPlaying().get()) {
                buttonStates[cc] = { released: false, handled: false };
                host.scheduleTask(function () {
                    checkLongPress(cc);
                }, LONG_PRESS_DELAY);
            } else {
                if (isChainLinkedToBank) {
                    setChainOnAllSlots(currentBank);
                }
                clip.launch();
                log("launch child " + (childIndex + 1) + " clip " + (clipIndex + 1));
            }
        } else {
            log("empty slot child " + (childIndex + 1) + " clip " + (clipIndex + 1));
        }
    } else if (buttonStates[cc]) {
        buttonStates[cc].released = true;
        if (!buttonStates[cc].handled && clip.exists().get()) {
            if (isChainLinkedToBank) {
                setChainOnAllSlots(currentBank);
            }
            clip.launch();
            log("re-trigger child " + (childIndex + 1) + " clip " + (clipIndex + 1));
        }
        delete buttonStates[cc];
    }
}

function checkLongPress(cc) {
    if (buttonStates[cc] && !buttonStates[cc].released) {
        var info = getClipInfoFromCC(cc);
        if (info && info.clip.exists().get()) {
            childTrackBank.getItemAt(info.childIndex).stop();
            log("stop child " + (info.childIndex + 1));
        }
        buttonStates[cc].handled = true;
    }
}

function updateLed(childIndex, clipIndex, isPlaying) {
    var korgColumn = childToKorgColumn(childIndex);
    if (korgColumn === -1) {
        return;
    }

    var totalOffset = getTotalOffset();
    if (clipIndex < totalOffset || clipIndex >= totalOffset + 3) {
        return;
    }

    var visibleIndex = clipIndex - totalOffset;
    var cc = -1;
    if (visibleIndex === 0) cc = CC_S_BUTTONS[korgColumn];
    else if (visibleIndex === 1) cc = CC_M_BUTTONS[korgColumn];
    else if (visibleIndex === 2) cc = CC_R_BUTTONS[korgColumn];

    if (cc !== -1) {
        midiOut.sendMidi(0xB0, cc, isPlaying ? 127 : 0);
    }
}

function refreshGridLeds() {
    var totalOffset = getTotalOffset();

    for (var i = 0; i < NUM_CHILD_TRACKS; i++) {
        for (var j = 0; j < 3; j++) {
            var clipIndex = j + totalOffset;
            var clip = childTrackSlots[i] ? childTrackSlots[i][clipIndex] : null;
            if (clip) {
                updateLed(i, clipIndex, clip.isPlaying().get());
            }
        }
    }

    for (var k = 0; k < NUM_KORG_COLUMNS; k++) {
        if (!isDeadClipTrack(k)) {
            continue;
        }
        midiOut.sendMidi(0xB0, CC_S_BUTTONS[k], 0);
        midiOut.sendMidi(0xB0, CC_M_BUTTONS[k], 0);
        midiOut.sendMidi(0xB0, CC_R_BUTTONS[k], 0);
    }
}

function updateCycleLed() {
    midiOut.sendMidi(0xB0, CC_CYCLE, isChainLinkedToBank ? 127 : 0);
}

function updateTransportLeds() {
    for (var i = 0; i < CC_TRANS_BUTTONS.length; i++) {
        midiOut.sendMidi(0xB0, CC_TRANS_BUTTONS[i], (i === currentBank) ? 127 : 0);
    }
}

function turnOffAllLeds() {
    for (var i = 0; i < NUM_KORG_COLUMNS; i++) {
        midiOut.sendMidi(0xB0, CC_S_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_M_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_R_BUTTONS[i], 0);
    }
    for (var t = 0; t < CC_TRANS_BUTTONS.length; t++) {
        midiOut.sendMidi(0xB0, CC_TRANS_BUTTONS[t], 0);
    }
    midiOut.sendMidi(0xB0, CC_CYCLE, 0);
    log("all LEDs off");
}

function exit() {
    turnOffAllLeds();
    status("exited");
}
