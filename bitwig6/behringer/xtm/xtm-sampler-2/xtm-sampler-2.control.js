loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Sampler 2",
    "1.0",
    "c3d4e5f6-a7b8-9012-3456-789abcdef003",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const DEBUG = false;
const FLAT_BANK_SIZE = 256;

const TARGET_TRACK_A = "Track 2/4";
const TARGET_TRACK_B = "Track 1/4";

const PAGE_TAGS = ["xtm-1", "xtm-2", "xtm-3", "xtm-4", "xtm-5", "xtm-6", "xtm-7", "xtm-8"];
const PERF_TAG = "xtm-perf";
const VOLS_TAG = "xtm-vols";
const PANS_TAG = "xtm-pans";
const MUTES_TAG = "xtm-mutes";
const ALL_VOLS_TAG = "xtm-all-vols";

const CC = {
    ENCODER_1: 16, ENCODER_2: 17, ENCODER_3: 18, ENCODER_4: 19,
    ENCODER_5: 20, ENCODER_6: 21, ENCODER_7: 22, ENCODER_8: 23,
    LED_RING_1: 48, LED_RING_2: 49, LED_RING_3: 50, LED_RING_4: 51,
    LED_RING_5: 52, LED_RING_6: 53, LED_RING_7: 54, LED_RING_8: 55,
};

const NOTE = {
    ENCODER_PUSH_1: 32, ENCODER_PUSH_2: 33, ENCODER_PUSH_3: 34, ENCODER_PUSH_4: 35,
    ENCODER_PUSH_5: 36, ENCODER_PUSH_6: 37, ENCODER_PUSH_7: 38, ENCODER_PUSH_8: 39,

    BUTTON_UPPER_1: 89, BUTTON_UPPER_2: 90, BUTTON_UPPER_3: 40, BUTTON_UPPER_4: 41,
    BUTTON_UPPER_5: 42, BUTTON_UPPER_6: 43, BUTTON_UPPER_7: 44, BUTTON_UPPER_8: 45,

    BUTTON_LOWER_1: 87, BUTTON_LOWER_2: 88, BUTTON_LOWER_3: 91, BUTTON_LOWER_4: 92,
    BUTTON_LOWER_5: 86, BUTTON_LOWER_6: 93, BUTTON_LOWER_7: 94, BUTTON_LOWER_8: 95,

    BUTTON_A: 84,
    BUTTON_B: 85,
};

const LED_STATE = { OFF: 0, ON: 127 };

const UPPER_BUTTON_NOTES = [
    NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
    NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8
];

const LOWER_BUTTON_NOTES = [
    NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
    NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8
];

const ENCODER_PUSH_NOTES = [
    NOTE.ENCODER_PUSH_1, NOTE.ENCODER_PUSH_2, NOTE.ENCODER_PUSH_3, NOTE.ENCODER_PUSH_4,
    NOTE.ENCODER_PUSH_5, NOTE.ENCODER_PUSH_6, NOTE.ENCODER_PUSH_7, NOTE.ENCODER_PUSH_8
];

let midiIn, midiOut;

// selectedPageIndex: -1 means default (xtm-perf). 0..7 means xtm-1..xtm-8.
// special: -2 = xtm-vols, -3 = xtm-pans (selected via encoder push 2/3).
let selectedPageIndex = -1;
let activeTarget = 'A';

var detectBank = null;
var controlA = null;
var controlB = null;
var cursorTrackA = null;
var cursorTrackB = null;
var foundA = false;
var foundB = false;
var selectedIndexA = -1;
var selectedIndexB = -1;

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    cursorTrackA = host.createCursorTrack("xtm2-A", "XTM2 A", 0, 0, false);
    cursorTrackB = host.createCursorTrack("xtm2-B", "XTM2 B", 0, 0, false);
    controlA = createControl(cursorTrackA, "A");
    controlB = createControl(cursorTrackB, "B");
    cursorTrackA.isPinned().markInterested();
    cursorTrackB.isPinned().markInterested();

    setupDetection();

    host.scheduleTask(function () {
        cursorTrackA.isPinned().set(true);
        cursorTrackB.isPinned().set(true);
        resolveActiveCandidates();
        if (DEBUG) reportDebugStatus();
        updateLEDs();
    }, 200);

    if (DEBUG) {
        host.println("=== X-Touch Mini Sampler 2 initialized ===");
    }
}

function setupDetection() {
    var rootGroup = host.getProject().getRootTrackGroup();
    detectBank = rootGroup.createTrackBank(FLAT_BANK_SIZE, 0, 0, true);
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        t.exists().markInterested();
        t.name().markInterested();
        t.exists().addValueObserver(function () { resolveActiveCandidates(); });
        t.name().addValueObserver(function () { resolveActiveCandidates(); });
    }
}

function createControl(cursorTrack, idPrefix) {
    var devBank = cursorTrack.createDeviceBank(1);
    var device = devBank.getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();

    var prefix = idPrefix + "-";

    var pagePerf = device.createCursorRemoteControlsPage(prefix + PERF_TAG, 8, PERF_TAG);
    setupPageObservers(pagePerf, prefix + PERF_TAG);

    var pageVols = device.createCursorRemoteControlsPage(prefix + VOLS_TAG, 8, VOLS_TAG);
    setupPageObservers(pageVols, prefix + VOLS_TAG);

    var pagePans = device.createCursorRemoteControlsPage(prefix + PANS_TAG, 8, PANS_TAG);
    setupPageObservers(pagePans, prefix + PANS_TAG);

    var pageMutes = device.createCursorRemoteControlsPage(prefix + MUTES_TAG, 8, MUTES_TAG);
    setupPageObservers(pageMutes, prefix + MUTES_TAG);

    var pageAllVols = device.createCursorRemoteControlsPage(prefix + ALL_VOLS_TAG, 8, ALL_VOLS_TAG);
    setupPageObservers(pageAllVols, prefix + ALL_VOLS_TAG);

    var numberedPages = [];
    for (var k = 0; k < 8; k++) {
        var tag = PAGE_TAGS[k];
        var np = device.createCursorRemoteControlsPage(prefix + tag, 8, tag);
        setupPageObservers(np, prefix + tag);
        numberedPages.push(np);
    }

    return {
        device: device,
        pagePerf: pagePerf,
        pageVols: pageVols,
        pagePans: pagePans,
        pageMutes: pageMutes,
        pageAllVols: pageAllVols,
        numberedPages: numberedPages,
        prefix: prefix
    };
}

function findTrackIndex(targetName) {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === targetName.toLowerCase()) return i;
    }
    return -1;
}

function resolveActiveCandidates() {
    var idxA = findTrackIndex(TARGET_TRACK_A);
    var idxB = findTrackIndex(TARGET_TRACK_B);

    if (idxA !== selectedIndexA) {
        selectedIndexA = idxA;
        if (idxA !== -1) cursorTrackA.selectChannel(detectBank.getItemAt(idxA));
    }
    if (idxB !== selectedIndexB) {
        selectedIndexB = idxB;
        if (idxB !== -1) cursorTrackB.selectChannel(detectBank.getItemAt(idxB));
    }

    var newFoundA = idxA !== -1;
    var newFoundB = idxB !== -1;
    if (newFoundA !== foundA || newFoundB !== foundB) {
        foundA = newFoundA;
        foundB = newFoundB;
        if (DEBUG) {
            host.println("Active A: " + (foundA ? ("index " + idxA) : "NONE"));
            host.println("Active B: " + (foundB ? ("index " + idxB) : "NONE"));
        }
        updateLEDs();
    }
}

function setupPageObservers(page, id) {
    for (var j = 0; j < 8; j++) {
        var param = page.getParameter(j);
        param.exists().markInterested();
        param.value().markInterested();
        param.name().markInterested();
        (function (idx) {
            param.value().addValueObserver(function (value) {
                onParamValueChanged(id, idx, value);
            });
        })(j);
    }
}

function active() {
    if (activeTarget === 'A') return foundA ? controlA : null;
    return foundB ? controlB : null;
}

function currentEncoderPage() {
    var a = active();
    if (!a) return null;
    if (selectedPageIndex === -1) return a.pagePerf;
    if (selectedPageIndex === -2) return a.pageVols;
    if (selectedPageIndex === -3) return a.pagePans;
    return a.numberedPages[selectedPageIndex];
}

function currentEncoderPageId() {
    var a = active();
    if (!a) return null;
    if (selectedPageIndex === -1) return a.prefix + PERF_TAG;
    if (selectedPageIndex === -2) return a.prefix + VOLS_TAG;
    if (selectedPageIndex === -3) return a.prefix + PANS_TAG;
    return a.prefix + PAGE_TAGS[selectedPageIndex];
}

function onParamValueChanged(id, paramIndex, value) {
    var a = active();
    if (!a) return;
    if (id === a.prefix + MUTES_TAG) {
        updateUpperButtonLED(paramIndex, value);
        return;
    }
    var curId = currentEncoderPageId();
    if (id === curId) {
        updateLEDRing(paramIndex, value);
    }
}

function reportDebugStatus() {
    if (!DEBUG) return;
    host.println("--- Status Report ---");
    host.println("Target: " + activeTarget + " Page index: " + selectedPageIndex);
    host.println("Active A: " + (foundA ? ("index " + selectedIndexA) : "NONE"));
    host.println("Active B: " + (foundB ? ("index " + selectedIndexB) : "NONE"));
}

function onMidi(status, data1, data2) {
    var channel = status & 0x0F;
    var command = status & 0xF0;

    if (channel === INPUT_MIDI_CHANNEL) {
        if (command === 0xB0) {
            handleCC(data1, data2);
        } else if (command === 0x90 || command === 0x80) {
            var isPressed = (command === 0x90) && (data2 > 0);
            handleNote(data1, isPressed);
        }
    } else if (channel === FADER_MIDI_CHANNEL && command === 0xE0) {
        var value = (data2 << 7) | data1;
        handleFader(value);
    }
}

function handleCC(cc, value) {
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        var index = cc - CC.ENCODER_1;
        var increment = (value >= 1 && value <= 63) ? 0.05 : -0.05;
        var page = currentEncoderPage();
        if (page) {
            var param = page.getParameter(index);
            if (param && param.exists().get()) {
                param.inc(increment);
            }
        }
    }
}

function handleFader(value) {
    var a = active();
    if (!a) return;
    var normalizedValue = value / 16383;
    var param = a.pageAllVols.getParameter(0);
    if (param && param.exists().get()) {
        param.set(normalizedValue);
    }
}

function selectPage(idx) {
    if (selectedPageIndex === idx) {
        selectedPageIndex = -1;
    } else {
        selectedPageIndex = idx;
    }
    updateLEDs();
}

function handleNote(note, isPressed) {
    if (!isPressed) return;

    var lowerIndex = LOWER_BUTTON_NOTES.indexOf(note);
    if (lowerIndex !== -1) {
        selectPage(lowerIndex);
        return;
    }

    var upperIndex = UPPER_BUTTON_NOTES.indexOf(note);
    if (upperIndex !== -1) {
        var a = active();
        if (a) {
            var param = a.pageMutes.getParameter(upperIndex);
            if (param && param.exists().get()) {
                var newValue = param.value().get() > 0.5 ? 0 : 1;
                param.set(newValue);
            }
        }
        return;
    }

    if (note === NOTE.BUTTON_A) {
        activeTarget = 'A';
        updateLEDs();
        return;
    }

    if (note === NOTE.BUTTON_B) {
        activeTarget = 'B';
        updateLEDs();
        return;
    }

    var encoderPushIndex = ENCODER_PUSH_NOTES.indexOf(note);
    if (encoderPushIndex === 0) {
        selectedPageIndex = -1;
        updateLEDs();
    } else if (encoderPushIndex === 1) {
        selectedPageIndex = (selectedPageIndex === -2) ? -1 : -2;
        updateLEDs();
    } else if (encoderPushIndex === 2) {
        selectedPageIndex = (selectedPageIndex === -3) ? -1 : -3;
        updateLEDs();
    }
}

function updateLEDs() {
    for (var i = 0; i < 8; i++) {
        var state = (selectedPageIndex === i) ? LED_STATE.ON : LED_STATE.OFF;
        setButtonLED(LOWER_BUTTON_NOTES[i], state);
    }

    setButtonLED(NOTE.BUTTON_A, (activeTarget === 'A') ? LED_STATE.ON : LED_STATE.OFF);
    setButtonLED(NOTE.BUTTON_B, (activeTarget === 'B') ? LED_STATE.ON : LED_STATE.OFF);

    var page = currentEncoderPage();
    for (var i = 0; i < 8; i++) {
        if (page) {
            var param = page.getParameter(i);
            if (param && param.exists().get()) {
                updateLEDRing(i, param.value().get());
            } else {
                setLEDRingValue(i, 0);
            }
        } else {
            setLEDRingValue(i, 0);
        }
    }

    var a = active();
    if (a) {
        for (var i = 0; i < 8; i++) {
            var mp = a.pageMutes.getParameter(i);
            if (mp && mp.exists().get()) {
                updateUpperButtonLED(i, mp.value().get());
            } else {
                setButtonLED(UPPER_BUTTON_NOTES[i], LED_STATE.OFF);
            }
        }
    } else {
        for (var i = 0; i < 8; i++) setButtonLED(UPPER_BUTTON_NOTES[i], LED_STATE.OFF);
    }
}

function updateUpperButtonLED(index, value) {
    var state = (value > 0.5) ? LED_STATE.ON : LED_STATE.OFF;
    setButtonLED(UPPER_BUTTON_NOTES[index], state);
}

function updateLEDRing(index, value) {
    var position = Math.floor(value * 11);
    if (position > 11) position = 11;
    setLEDRingValue(index, position + 32);
}

function setLEDRingValue(index, value) {
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, CC.LED_RING_1 + index, value);
}

function setButtonLED(note, state) {
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, state);
}

function flush() {}

function exit() {
    if (DEBUG) host.println("X-Touch Mini Sampler 2 exited");
}
