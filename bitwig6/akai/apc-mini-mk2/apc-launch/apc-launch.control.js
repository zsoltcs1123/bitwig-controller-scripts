loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Akai",
    "APC Launch",
    "0.1",
    "a3b4c5d6-e7f8-9012-abcd-ef3456789abc",
    "Zsolt"
);

host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["APC mini mk2"], ["APC mini mk2"]);

const DEBUG = true;

const PINNED_TRACK_INDEX = 0;
const NUM_TRACKS = 8;
const NUM_SONGS = 8;
const ROWS_PER_SONG = 8;
const TOTAL_CLIPS = NUM_SONGS * ROWS_PER_SONG;

var NOTE_TRACK_BUTTONS = [0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B];
var NOTE_SCENE_BUTTONS = [0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77];
var NOTE_SHIFT = 0x7A;

var DAW_COLOR_MAP = [
    { r: 0.33, g: 0.33, b: 0.33, vel: 1   },
    { r: 0.48, g: 0.48, b: 0.48, vel: 2   },
    { r: 0.50, g: 0.50, b: 0.50, vel: 1   },
    { r: 0.79, g: 0.79, b: 0.79, vel: 119 },
    { r: 0.53, g: 0.54, b: 0.67, vel: 103 },
    { r: 0.64, g: 0.47, b: 0.26, vel: 83  },
    { r: 0.78, g: 0.62, b: 0.44, vel: 10  },
    { r: 0.34, g: 0.38, b: 0.78, vel: 41  },
    { r: 0.52, g: 0.54, b: 0.88, vel: 115 },
    { r: 0.58, g: 0.29, b: 0.80, vel: 48  },
    { r: 0.85, g: 0.22, b: 0.44, vel: 57  },
    { r: 0.85, g: 0.18, b: 0.14, vel: 5   },
    { r: 1.00, g: 0.34, b: 0.02, vel: 60  },
    { r: 0.85, g: 0.62, b: 0.06, vel: 9   },
    { r: 0.26, g: 0.82, b: 0.73, vel: 32  },
    { r: 0.45, g: 0.60, b: 0.08, vel: 17  },
    { r: 0.00, g: 0.62, b: 0.28, vel: 25  },
    { r: 0.27, g: 0.78, b: 1.00, vel: 37  },
    { r: 0.74, g: 0.46, b: 0.94, vel: 48  },
    { r: 0.88, g: 0.40, b: 0.57, vel: 56  },
    { r: 0.93, g: 0.38, b: 0.34, vel: 4   },
    { r: 1.00, g: 0.51, b: 0.24, vel: 84  },
    { r: 0.89, g: 0.72, b: 0.31, vel: 8   },
    { r: 0.63, g: 0.75, b: 0.30, vel: 16  },
    { r: 0.00, g: 0.65, b: 0.58, vel: 29  },
    { r: 0.24, g: 0.73, b: 0.38, vel: 25  },
    { r: 0.00, g: 0.60, b: 0.85, vel: 37  },
];

var CH_SOLID_100 = 0x96;
var CH_SOLID_25 = 0x91;
var CH_PULSE = 0x97;

let midiIn, midiOut;
let trackBank;
let pinnedTrack;
let childTrackBank;
let sceneBank;
let clipSlots = [];
let clipColors = [];
let currentBank = 0;
let activeSceneRow = -1;
let isInstrumentMode = false;
let childTrackChainSelectors = [];
let activeChainIndex = -1;
let selectedChildTrack = 0;
let isBankChainLocked = false;

var CC_FADER_9 = 0x38;
var LONG_PRESS_DELAY = 400;
var trackBtnPressTime = {};
var trackBtnPressHandled = {};

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    setupTracks();

    host.scheduleTask(function () {
        logTrackStatus();
        updateTrackButtonLeds();
        updateSceneButtonLeds();
        refreshGridLeds();
    }, 200);

    log("apc-launch: Initialized!");
}

function setupTracks() {
    trackBank = host.createTrackBank(NUM_TRACKS, 0, TOTAL_CLIPS, false);
    pinnedTrack = trackBank.getItemAt(PINNED_TRACK_INDEX);
    pinnedTrack.exists().markInterested();
    pinnedTrack.name().markInterested();
    pinnedTrack.isGroup().markInterested();

    childTrackBank = pinnedTrack.createTrackBank(NUM_TRACKS, 0, TOTAL_CLIPS, false);
    sceneBank = childTrackBank.sceneBank();

    for (let i = 0; i < NUM_TRACKS; i++) {
        const track = childTrackBank.getItemAt(i);
        track.exists().markInterested();
        track.name().markInterested();

        clipSlots[i] = [];
        clipColors[i] = [];
        const clipLauncher = track.clipLauncherSlotBank();
        for (let j = 0; j < TOTAL_CLIPS; j++) {
            const slot = clipLauncher.getItemAt(j);
            slot.exists().markInterested();
            slot.hasContent().markInterested();
            slot.isPlaying().markInterested();
            slot.isPlaybackQueued().markInterested();
            slot.isStopQueued().markInterested();
            slot.color().markInterested();
            clipSlots[i][j] = slot;
            clipColors[i][j] = 0;

            (function (ti, ci) {
                slot.color().addValueObserver(function (r, g, b) {
                    clipColors[ti][ci] = findClosestVelocity(r, g, b);
                    updatePadLed(ti, ci);
                });
                slot.hasContent().addValueObserver(function () {
                    updatePadLed(ti, ci);
                });
                slot.isPlaying().addValueObserver(function () {
                    updatePadLed(ti, ci);
                });
                slot.isPlaybackQueued().addValueObserver(function () {
                    updatePadLed(ti, ci);
                });
                slot.isStopQueued().addValueObserver(function () {
                    updatePadLed(ti, ci);
                });
            })(i, j);
        }
    }

    for (let i = 0; i < NUM_TRACKS; i++) {
        const childDevice = childTrackBank.getItemAt(i).createDeviceBank(1).getDevice(0);
        const chainSelector = childDevice.createChainSelector();
        chainSelector.exists().markInterested();
        chainSelector.activeChainIndex().markInterested();
        childTrackChainSelectors[i] = chainSelector;
    }

    for (let i = 0; i < TOTAL_CLIPS; i++) {
        sceneBank.getScene(i).exists().markInterested();
    }

    pinnedTrack.exists().addValueObserver(function (exists) {
        log("Pinned track exists: " + exists);
    });
    pinnedTrack.name().addValueObserver(function (name) {
        log("Pinned track name: " + name);
    });
    pinnedTrack.isGroup().addValueObserver(function (isGroup) {
        log("Pinned track is group: " + isGroup);
    });
}

function getGridOffset() {
    return currentBank * ROWS_PER_SONG;
}

function padToGridPos(padNote) {
    var col = padNote % 8;
    var row = 7 - Math.floor(padNote / 8);
    return { col: col, row: row };
}

function gridPosToPad(col, row) {
    return (7 - row) * 8 + col;
}

function findClosestVelocity(r, g, b) {
    var bestVel = 3;
    var bestDist = Infinity;
    for (var i = 0; i < DAW_COLOR_MAP.length; i++) {
        var c = DAW_COLOR_MAP[i];
        var dr = r - c.r;
        var dg = g - c.g;
        var db = b - c.b;
        var dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) {
            bestDist = dist;
            bestVel = c.vel;
        }
    }
    return bestVel;
}

function updatePadLed(trackIndex, clipIndex) {
    var offset = getGridOffset();
    var gridRow = clipIndex - offset;
    if (gridRow < 0 || gridRow >= ROWS_PER_SONG) return;

    var padNote = gridPosToPad(trackIndex, gridRow);
    var slot = clipSlots[trackIndex][clipIndex];

    if (!slot.hasContent().get()) {
        midiOut.sendMidi(0x90, padNote, 0);
        return;
    }

    var velocity = clipColors[trackIndex][clipIndex];
    if (velocity === 0) velocity = 3;

    if (slot.isPlaybackQueued().get() || slot.isStopQueued().get()) {
        midiOut.sendMidi(CH_PULSE, padNote, velocity);
    } else if (slot.isPlaying().get()) {
        midiOut.sendMidi(CH_SOLID_100, padNote, velocity);
    } else {
        midiOut.sendMidi(CH_SOLID_25, padNote, velocity);
    }
}

function refreshGridLeds() {
    var offset = getGridOffset();
    for (var col = 0; col < NUM_TRACKS; col++) {
        for (var row = 0; row < ROWS_PER_SONG; row++) {
            updatePadLed(col, row + offset);
        }
    }
}

function syncChainToBank() {
    if (!isBankChainLocked) return;
    activeChainIndex = currentBank;
    for (var i = 0; i < NUM_TRACKS; i++) {
        var selector = childTrackChainSelectors[i];
        if (selector && selector.exists().get()) {
            selector.activeChainIndex().set(currentBank);
        }
    }
    if (isInstrumentMode) updateSceneButtonLeds();
    log("Lock: chains synced to bank " + (currentBank + 1));
}

function handlePadPress(padNote) {
    var pos = padToGridPos(padNote);
    var clipRow = pos.row + getGridOffset();
    var trackIndex = pos.col;

    var slot = clipSlots[trackIndex][clipRow];
    if (!slot) return;

    if (!slot.hasContent().get()) {
        log("Pad [" + pos.col + "," + pos.row + "] -> empty slot (track " + (trackIndex + 1) + ", clip " + (clipRow + 1) + ")");
        return;
    }

    if (slot.isPlaying().get()) {
        childTrackBank.getItemAt(trackIndex).stop();
        log("Pad [" + pos.col + "," + pos.row + "] -> STOP track " + (trackIndex + 1));
    } else {
        syncChainToBank();
        slot.launch();
        log("Pad [" + pos.col + "," + pos.row + "] -> LAUNCH track " + (trackIndex + 1) + ", clip " + (clipRow + 1));
    }
}

function handleSceneButton(index) {
    if (isInstrumentMode) {
        setChain(index);
    } else {
        var sceneIndex = index + getGridOffset();
        var scene = sceneBank.getScene(sceneIndex);
        if (scene && scene.exists().get()) {
            syncChainToBank();
            scene.launch();
            activeSceneRow = index;
            updateSceneButtonLeds();
            log("Scene button " + (index + 1) + " -> launch scene " + (sceneIndex + 1));
        }
    }
}

function setChain(chainIndex) {
    activeChainIndex = chainIndex;
    if (selectedChildTrack !== -1) {
        var selector = childTrackChainSelectors[selectedChildTrack];
        if (selector && selector.exists().get()) {
            selector.activeChainIndex().set(chainIndex);
        }
        log("Chain " + (chainIndex + 1) + " on track " + (selectedChildTrack + 1));
    } else {
        for (var i = 0; i < NUM_TRACKS; i++) {
            var selector = childTrackChainSelectors[i];
            if (selector && selector.exists().get()) {
                selector.activeChainIndex().set(chainIndex);
            }
        }
        log("Chain " + (chainIndex + 1) + " on ALL tracks");
    }
    updateSceneButtonLeds();
}

function toggleInstrumentMode() {
    isInstrumentMode = !isInstrumentMode;
    if (isInstrumentMode) {
        for (var i = 0; i < NUM_TRACKS; i++) {
            var selector = childTrackChainSelectors[i];
            if (selector && selector.exists().get()) {
                activeChainIndex = selector.activeChainIndex().get();
                break;
            }
        }
    }
    updateTrackButtonLeds();
    updateSceneButtonLeds();
    log("Instrument mode: " + (isInstrumentMode ? "ON (chain " + (activeChainIndex + 1) + ")" : "OFF"));
}

function updateSceneButtonLeds() {
    if (isInstrumentMode) {
        for (var i = 0; i < NOTE_SCENE_BUTTONS.length; i++) {
            var value = (i === activeChainIndex) ? 0x02 : 0x00;
            midiOut.sendMidi(0x90, NOTE_SCENE_BUTTONS[i], value);
        }
    } else {
        for (var i = 0; i < NOTE_SCENE_BUTTONS.length; i++) {
            var value = (i === activeSceneRow) ? 0x01 : 0x00;
            midiOut.sendMidi(0x90, NOTE_SCENE_BUTTONS[i], value);
        }
    }
}

function updateTrackButtonLeds() {
    if (isInstrumentMode) {
        for (let i = 0; i < NOTE_TRACK_BUTTONS.length; i++) {
            var value = (i === selectedChildTrack) ? 0x02 : 0x00;
            midiOut.sendMidi(0x90, NOTE_TRACK_BUTTONS[i], value);
        }
    } else {
        for (let i = 0; i < NOTE_TRACK_BUTTONS.length; i++) {
            var value = (i === currentBank) ? 0x01 : 0x00;
            midiOut.sendMidi(0x90, NOTE_TRACK_BUTTONS[i], value);
        }
    }
}

function handleTrackButtonDown(index) {
    if (isInstrumentMode) {
        if (index === selectedChildTrack) {
            trackBtnPressTime[index] = Date.now();
            trackBtnPressHandled[index] = false;
            host.scheduleTask(function () {
                if (!trackBtnPressHandled[index] && trackBtnPressTime[index]) {
                    selectedChildTrack = -1;
                    trackBtnPressHandled[index] = true;
                    updateTrackButtonLeds();
                    updateSceneButtonLeds();
                    log("Child track selection cleared (all tracks)");
                }
            }, LONG_PRESS_DELAY);
        } else {
            selectedChildTrack = index;
            var selector = childTrackChainSelectors[index];
            if (selector && selector.exists().get()) {
                activeChainIndex = selector.activeChainIndex().get();
            }
            updateTrackButtonLeds();
            updateSceneButtonLeds();
            log("Selected child track " + (index + 1));
        }
    } else {
        currentBank = index;
        activeSceneRow = -1;
        updateTrackButtonLeds();
        updateSceneButtonLeds();
        refreshGridLeds();
        log("Switched to song bank " + (currentBank + 1) + " (offset=" + getGridOffset() + ")");
    }
}

function handleTrackButtonUp(index) {
    if (isInstrumentMode && trackBtnPressTime[index]) {
        if (!trackBtnPressHandled[index]) {
            trackBtnPressHandled[index] = true;
        }
        delete trackBtnPressTime[index];
        delete trackBtnPressHandled[index];
    }
}

function onMidi(status, data1, data2) {
    var msgType = status & 0xF0;
    var isNoteOn = (msgType === 0x90 && data2 > 0);
    var isNoteOff = (msgType === 0x80 || (msgType === 0x90 && data2 === 0));

    var trackBtnIndex = NOTE_TRACK_BUTTONS.indexOf(data1);
    if (trackBtnIndex !== -1) {
        if (isNoteOn) handleTrackButtonDown(trackBtnIndex);
        else if (isNoteOff) handleTrackButtonUp(trackBtnIndex);
        return;
    }

    if (isNoteOn) {
        if (data1 === NOTE_SHIFT) {
            toggleInstrumentMode();
            return;
        }

        var sceneBtnIndex = NOTE_SCENE_BUTTONS.indexOf(data1);
        if (sceneBtnIndex !== -1) {
            handleSceneButton(sceneBtnIndex);
            return;
        }

        if (data1 >= 0x00 && data1 <= 0x3F) {
            handlePadPress(data1);
            return;
        }
    }

    if ((status & 0xF0) === 0xB0 && data1 === CC_FADER_9) {
        var wasLocked = isBankChainLocked;
        isBankChainLocked = data2 >= 64;
        if (isBankChainLocked !== wasLocked) {
            log("Bank-Chain lock: " + (isBankChainLocked ? "ON" : "OFF"));
        }
        return;
    }

    if (DEBUG) {
        log("MIDI IN: status=" + status + " data1=" + data1 + " data2=" + data2);
    }
}

function logTrackStatus() {
    log("=== apc-launch Track Status ===");
    log("Pinned track: " + pinnedTrack.name().get() +
        " | exists=" + pinnedTrack.exists().get() +
        " | group=" + pinnedTrack.isGroup().get());

    for (let i = 0; i < NUM_TRACKS; i++) {
        const track = childTrackBank.getItemAt(i);
        if (track.exists().get()) {
            log("  Child " + (i + 1) + ": " + track.name().get());
        }
    }
    log("Current bank: " + (currentBank + 1));
    log("================================");
}

function flush() {}

function exit() {
    for (var i = 0; i < 64; i++) {
        midiOut.sendMidi(0x90, i, 0);
    }
    for (let i = 0; i < NOTE_TRACK_BUTTONS.length; i++) {
        midiOut.sendMidi(0x90, NOTE_TRACK_BUTTONS[i], 0x00);
    }
    for (let i = 0; i < NOTE_SCENE_BUTTONS.length; i++) {
        midiOut.sendMidi(0x90, NOTE_SCENE_BUTTONS[i], 0x00);
    }
    log("apc-launch: Exited.");
}

function log(msg) {
    if (DEBUG) host.println(msg);
}
