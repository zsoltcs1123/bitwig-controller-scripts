loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Nested 1",
    "1.0",
    "a1b2c3d4-e5f6-7890-1234-56789abcdef1",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const DEBUG = true;
const MAX_DEPTH = 3;
const TARGET_TRACK_NAME = "TRACK 1/1";
const NUM_CHILDREN = 8;
const CHILD_PERF_TAG = "c-perf";
const CHILD_PERF_COUNT = 8;

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

let midiIn, midiOut;
let selectedChildIndex = 0;
let activeLayer = 'N_PAGE';

var candidates = [];
var parentCandidate = null;
var activeCandidate = null;

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    setupCandidates();

    host.scheduleTask(function() {
        resolveActiveCandidate();
        if (DEBUG) reportDebugStatus();
    }, 200);

    if (DEBUG) {
        host.println("=== X-Touch Mini Nested initialized ===");
    }
}

function setupCandidates() {
    var tracks = [];

    var bank0 = host.createTrackBank(1, 0, 0, false);
    tracks[0] = bank0.getItemAt(0);

    for (var d = 1; d < MAX_DEPTH; d++) {
        var parent = tracks[d - 1];
        var childBank = parent.createTrackBank(1, 0, 0, false);
        tracks[d] = childBank.getItemAt(0);
    }

    for (var d = 0; d < MAX_DEPTH; d++) {
        candidates[d] = createCandidateForTrack(tracks[d], "d" + d);
    }

    var parentTrack = tracks[0].createParentTrack(0, 0);
    parentCandidate = createCandidateForTrack(parentTrack, "parent");

    for (var d = 0; d < MAX_DEPTH; d++) {
        observeCandidate(candidates[d]);
    }
    observeCandidate(parentCandidate);
}

function createCandidateForTrack(track, id) {
    track.exists().markInterested();
    track.name().markInterested();

    var devBank = track.createDeviceBank(1);
    var device = devBank.getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();

    var prefix = id + "-";

    var pagePerform = device.createCursorRemoteControlsPage(prefix + "n-perform", 8, "n-perform");
    setupPageObservers(pagePerform, prefix + "perform");

    var pageVols = device.createCursorRemoteControlsPage(prefix + "n-vols", 8, "n-vols");
    setupPageObservers(pageVols, prefix + "vols");

    var pageMutes = device.createCursorRemoteControlsPage(prefix + "n-mutes", 8, "n-mutes");
    setupPageObservers(pageMutes, prefix + "mutes");

    var pageAllVols = device.createCursorRemoteControlsPage(prefix + "n-all-vols", 8, "n-all-vols");
    setupPageObservers(pageAllVols, prefix + "all-vols");

    var childBank = track.createTrackBank(NUM_CHILDREN, 0, 0, false);
    var childPerfPages = [];
    for (var c = 0; c < NUM_CHILDREN; c++) {
        var ct = childBank.getItemAt(c);
        ct.exists().markInterested();
        ct.name().markInterested();
        var ctDevBank = ct.createDeviceBank(1);
        var ctDevice = ctDevBank.getDevice(0);
        ctDevice.exists().markInterested();
        ctDevice.name().markInterested();
        var cpPage = ctDevice.createCursorRemoteControlsPage(
            prefix + "child" + c + "-cperf", CHILD_PERF_COUNT, CHILD_PERF_TAG
        );
        setupPageObservers(cpPage, prefix + "cperf" + c, CHILD_PERF_COUNT);
        childPerfPages[c] = cpPage;
    }

    return {
        track: track,
        device: device,
        pagePerform: pagePerform,
        pageVols: pageVols,
        pageMutes: pageMutes,
        pageAllVols: pageAllVols,
        childPerfPages: childPerfPages,
        id: id,
        prefix: prefix
    };
}

function observeCandidate(c) {
    c.track.exists().addValueObserver(function () { resolveActiveCandidate(); });
    c.track.name().addValueObserver(function () { resolveActiveCandidate(); });
}

function resolveActiveCandidate() {
    var match = null;
    for (var d = 0; d < MAX_DEPTH; d++) {
        var c = candidates[d];
        if (c.track.exists().get() && c.track.name().get() === TARGET_TRACK_NAME) {
            match = c;
            break;
        }
    }
    if (!match && parentCandidate.track.exists().get() &&
        parentCandidate.track.name().get() === TARGET_TRACK_NAME) {
        match = parentCandidate;
    }
    if (match !== activeCandidate) {
        activeCandidate = match;
        if (DEBUG) {
            var name = activeCandidate ? activeCandidate.track.name().get() : "NONE";
            var id = activeCandidate ? activeCandidate.id : "NONE";
            host.println("Active candidate changed to " + id + " (" + name + ")");
        }
        updateLEDs();
    }
}

function setupPageObservers(page, id, count) {
    if (!count) count = 8;
    for (var j = 0; j < count; j++) {
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
    return activeCandidate;
}

function onParamValueChanged(id, paramIndex, value) {
    var a = active();
    if (!a) return;
    if (id === a.prefix + "mutes") {
        updateUpperButtonLED(paramIndex, value);
        return;
    }
    for (var i = 0; i < 8; i++) {
        var resolved = resolveEncoder(i);
        if (!resolved) continue;
        var matchId = resolveEncoderPageId(i);
        if (matchId === id && resolved.paramIndex === paramIndex) {
            updateLEDRing(i, value);
        }
    }
}

function resolveEncoderPageId(index) {
    var a = active();
    if (!a) return null;
    if (activeLayer === 'PERFORM') return a.prefix + "perform";
    if (activeLayer === 'VOLS') return a.prefix + "vols";
    return a.prefix + "cperf" + selectedChildIndex;
}

function reportDebugStatus() {
    if (!DEBUG) return;
    host.println("--- Status Report ---");
    for (var d = 0; d < MAX_DEPTH; d++) {
        var c = candidates[d];
        host.println(
            "  " + c.id + ": exists=" + c.track.exists().get() +
            " name=" + c.track.name().get() +
            " device=" + c.device.name().get()
        );
    }
    var pc = parentCandidate;
    host.println(
        "  " + pc.id + ": exists=" + pc.track.exists().get() +
        " name=" + pc.track.name().get() +
        " device=" + pc.device.name().get()
    );
    var id = activeCandidate ? activeCandidate.id : "NONE";
    host.println("Active candidate: " + id);
    host.println("Active layer: " + activeLayer + " Selected page: " + (selectedChildIndex + 1));
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
        var resolved = resolveEncoder(index);
        if (resolved) {
            var param = resolved.page.getParameter(resolved.paramIndex);
            if (param && param.exists().get()) {
                param.inc(increment);
            }
        }
        return;
    }
}

function resolveEncoder(index) {
    var a = active();
    if (!a) return null;
    if (activeLayer === 'PERFORM') return { page: a.pagePerform, paramIndex: index };
    if (activeLayer === 'VOLS') return { page: a.pageVols, paramIndex: index };
    var cpPage = a.childPerfPages[selectedChildIndex];
    if (!cpPage) return null;
    return { page: cpPage, paramIndex: index };
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

function handleNote(note, isPressed) {
    if (!isPressed) return;

    var lowerIndex = LOWER_BUTTON_NOTES.indexOf(note);
    if (lowerIndex !== -1) {
        selectedChildIndex = lowerIndex;
        activeLayer = 'N_PAGE';
        updateLEDs();
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
        activeLayer = (activeLayer === 'PERFORM') ? 'N_PAGE' : 'PERFORM';
        updateLEDs();
        return;
    }

    if (note === NOTE.BUTTON_B) {
        activeLayer = (activeLayer === 'VOLS') ? 'N_PAGE' : 'VOLS';
        updateLEDs();
        return;
    }

    var encoderPushIndex = [
        NOTE.ENCODER_PUSH_1, NOTE.ENCODER_PUSH_2, NOTE.ENCODER_PUSH_3, NOTE.ENCODER_PUSH_4,
        NOTE.ENCODER_PUSH_5, NOTE.ENCODER_PUSH_6, NOTE.ENCODER_PUSH_7, NOTE.ENCODER_PUSH_8
    ].indexOf(note);

    if (encoderPushIndex !== -1) {
        var resolved = resolveEncoder(encoderPushIndex);
        if (resolved) {
            var param = resolved.page.getParameter(resolved.paramIndex);
            if (param && param.exists().get()) {
                param.reset();
            }
        }
    }
}

function updateLEDs() {
    for (var i = 0; i < 8; i++) {
        var state = (activeLayer === 'N_PAGE' && selectedChildIndex === i) ? LED_STATE.ON : LED_STATE.OFF;
        setButtonLED(LOWER_BUTTON_NOTES[i], state);
    }

    setButtonLED(NOTE.BUTTON_A, (activeLayer === 'PERFORM') ? LED_STATE.ON : LED_STATE.OFF);
    setButtonLED(NOTE.BUTTON_B, (activeLayer === 'VOLS') ? LED_STATE.ON : LED_STATE.OFF);

    for (var i = 0; i < 8; i++) {
        var resolved = resolveEncoder(i);
        if (resolved) {
            var param = resolved.page.getParameter(resolved.paramIndex);
            if (param && param.exists().get()) {
                updateLEDRing(i, param.value().get());
            } else {
                setLEDRingValue(i, 0);
            }
        } else {
            setLEDRingValue(i, 0);
        }
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
    if (DEBUG) host.println("X-Touch Mini Nested exited");
}
