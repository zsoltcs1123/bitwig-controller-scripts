loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);
host.defineController(
    "Korg",
    "ZSAudio Maschine NANO",
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
const TARGET_TRACK_NAME = "NANO";
const CURSOR_ID = "maschine-nano";
const CURSOR_NAME = "Maschine NANO";
const FADERS_TAG = "faders";
const VOLS_TAG = "vols";

const NUM_KORG_COLUMNS = 8;
const NUM_CHILD_TRACKS = 8;
const BANK_SIZE = 6; // 3 or 6
const NUM_CLIPS = 5 * BANK_SIZE;
const LONG_PRESS_DELAY = 500;

let midiIn, midiOut;
let detectBank = null;
let cursorTrack = null;
let found = false;
let selectedIndex = -1;
let pageFaders = null;
let pageVols = null;
let childTrackBank = null;
let sceneBank = null;
let childTrackSlots = [];
let childTrackChainSelectors = [];

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
    setupTrackControls(cursorTrack);
    setupChildTracks(cursorTrack);

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

function findTrackIndex(name) {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function resolveTargetTrack(forceLog) {
    var idx = findTrackIndex(TARGET_TRACK_NAME);
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

function setupTrackControls(track) {
    pageFaders = track.createCursorRemoteControlsPage("nano-faders", 8, FADERS_TAG);
    pageVols = track.createCursorRemoteControlsPage("nano-vols", 8, VOLS_TAG);

    for (var i = 0; i < 8; i++) {
        pageFaders.getParameter(i).markInterested();
        pageFaders.getParameter(i).setIndication(true);
        pageVols.getParameter(i).markInterested();
        pageVols.getParameter(i).setIndication(true);
    }
    autoSelectPageWhenAvailable(pageFaders);
    autoSelectPageWhenAvailable(pageVols);
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

            (function (trackIndex, clipIndex) {
                clip.isPlaying().addValueObserver(function (isPlaying) {
                    updateLed(trackIndex, clipIndex, isPlaying);
                });
            })(i, j);
        }

        var deviceBank = track.createDeviceBank(1);
        var instrumentMatcher = host.createInstrumentMatcher();
        deviceBank.setDeviceMatcher(instrumentMatcher);
        var instrumentDevice = deviceBank.getDevice(0);
        instrumentDevice.exists().markInterested();
        instrumentDevice.name().markInterested();

        var chainSelector = instrumentDevice.createChainSelector();
        chainSelector.exists().markInterested();
        chainSelector.activeChainIndex().markInterested();
        childTrackChainSelectors[i] = chainSelector;
    }
}

function setChainOnAllChildTracks(chainIndex) {
    for (var i = 0; i < NUM_CHILD_TRACKS; i++) {
        var selector = childTrackChainSelectors[i];
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
                setChainOnAllChildTracks(currentBank);
            }
            log("chain/bank link: " + (isChainLinkedToBank ? "ON" : "OFF"));
            return;
        }

        var knobIndex = CC_KNOBS.indexOf(data1);
        if (knobIndex !== -1) {
            if (pageVols) {
                pageVols.getParameter(knobIndex).set(data2 / 127.0);
            }
            return;
        }

        var faderIndex = CC_FADERS.indexOf(data1);
        if (faderIndex !== -1) {
            if (pageFaders) {
                pageFaders.getParameter(faderIndex).set(data2 / 127.0);
            }
            return;
        }

        var transIndex = CC_TRANS_BUTTONS.indexOf(data1);
        if (transIndex !== -1) {
            currentBank = transIndex;
            updateTransportLeds();
            refreshGridLeds();
            if (isChainLinkedToBank) {
                setChainOnAllChildTracks(currentBank);
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
                        setChainOnAllChildTracks(currentBank);
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
    var trackIndex = -1;
    var clipIndex = -1;
    var totalOffset = getTotalOffset();

    trackIndex = CC_S_BUTTONS.indexOf(cc);
    if (trackIndex !== -1) {
        clipIndex = totalOffset;
    }

    if (trackIndex === -1) {
        trackIndex = CC_M_BUTTONS.indexOf(cc);
        if (trackIndex !== -1) {
            clipIndex = 1 + totalOffset;
        }
    }

    if (trackIndex === -1) {
        trackIndex = CC_R_BUTTONS.indexOf(cc);
        if (trackIndex !== -1) {
            clipIndex = 2 + totalOffset;
        }
    }

    if (trackIndex === -1 || clipIndex === -1) {
        return null;
    }

    if (childTrackSlots[trackIndex] && childTrackSlots[trackIndex][clipIndex]) {
        return {
            trackIndex: trackIndex,
            clipIndex: clipIndex,
            clip: childTrackSlots[trackIndex][clipIndex]
        };
    }
    return null;
}

function handleButton(cc, value) {
    var info = getClipInfoFromCC(cc);
    if (!info) {
        return;
    }

    var trackIndex = info.trackIndex;
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
                    setChainOnAllChildTracks(currentBank);
                }
                clip.launch();
                log("launch track " + (trackIndex + 1) + " clip " + (clipIndex + 1));
            }
        } else {
            log("empty slot track " + (trackIndex + 1) + " clip " + (clipIndex + 1));
        }
    } else if (buttonStates[cc]) {
        buttonStates[cc].released = true;
        if (!buttonStates[cc].handled && clip.exists().get()) {
            if (isChainLinkedToBank) {
                setChainOnAllChildTracks(currentBank);
            }
            clip.launch();
            log("re-trigger track " + (trackIndex + 1) + " clip " + (clipIndex + 1));
        }
        delete buttonStates[cc];
    }
}

function checkLongPress(cc) {
    if (buttonStates[cc] && !buttonStates[cc].released) {
        var info = getClipInfoFromCC(cc);
        if (info && info.clip.exists().get()) {
            childTrackBank.getItemAt(info.trackIndex).stop();
            log("stop track " + (info.trackIndex + 1));
        }
        buttonStates[cc].handled = true;
    }
}

function updateLed(trackIndex, clipIndex, isPlaying) {
    var totalOffset = getTotalOffset();
    if (clipIndex < totalOffset || clipIndex >= totalOffset + 3) {
        return;
    }

    var visibleIndex = clipIndex - totalOffset;
    var cc = -1;
    if (visibleIndex === 0) {
        cc = CC_S_BUTTONS[trackIndex];
    } else if (visibleIndex === 1) {
        cc = CC_M_BUTTONS[trackIndex];
    } else if (visibleIndex === 2) {
        cc = CC_R_BUTTONS[trackIndex];
    }

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
