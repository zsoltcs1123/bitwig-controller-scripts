loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Child",
    "1.0",
    "a1b2c3d4-e5f6-7890-1234-56789abcdef7",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const OUTPUT_MIDI_CHANNEL = 0;
const DEBUG = true;

// The index of the track in the track bank we want to pin to
// Defaulting to 0 (first track) - change this if your group track is elsewhere
const PINNED_TRACK_INDEX = 0;

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
    
    LAYER_A: 84,
    LAYER_B: 85,
};

const LED_STATE = {
    OFF: 0,
    ON: 127
};

const ENCODER_MODE = {
    PERF: 'perf',
    A: 'a',
    B: 'b'
};

let midiIn, midiOut;
let selectedChildIndex = 0;
let currentEncoderMode = ENCODER_MODE.PERF;

let trackBank;
let pinnedTrack;
let childTrackBank;
let childTrackRCs = []; // Store RC pages for each track: { perf, a, b, buttons, device }

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    // Initialize LEDs
    updateLowerButtonLEDs();
    updateUpperButtonLEDs();
    updateLayerLEDs();
    initializeLEDRings();
    
    if (DEBUG) {
        host.println("=== X-Touch Mini Child initialized ===");
        host.scheduleTask(reportDebugStatus, null, 2000); // Check status after 2 seconds
    }
}

function setupTracks() {
    // createTrackBank(numTracks, numSends, numScenes, hasMainTrack)
    trackBank = host.createTrackBank(8, 0, 0, false);
    pinnedTrack = trackBank.getTrack(PINNED_TRACK_INDEX);
    pinnedTrack.exists().markInterested();
    pinnedTrack.name().markInterested();
    pinnedTrack.isGroup().markInterested();

    // Create child track bank from the pinned track
    // Needs scenes to support clip launcher slots if we ever need them, 
    // and to ensure structure matches expectation.
    childTrackBank = pinnedTrack.createTrackBank(8, 0, 8, false);
    
    for (let i = 0; i < 8; i++) {
        const track = childTrackBank.getTrack(i);
        track.exists().markInterested();
        track.name().markInterested();

        const deviceBank = track.createDeviceBank(1);
        const device = deviceBank.getDevice(0);
        device.exists().markInterested();
        device.name().markInterested();
        
        const rcs = {
            perf: device.createCursorRemoteControlsPage("Perf", 8, "perf"),
            a: device.createCursorRemoteControlsPage("A", 8, "a"),
            b: device.createCursorRemoteControlsPage("B", 8, "b"),
            buttons: device.createCursorRemoteControlsPage("Buttons", 8, "buttons"),
            device: device,
            track: track
        };

        // Mark interested and add observers for all parameters in all pages
        setupRCObservers(rcs, i);
        
        childTrackRCs[i] = rcs;
    }

    // Add observer for track selection change
    pinnedTrack.isGroup().addValueObserver((isGroup) => {
        if (DEBUG) host.println("Pinned track is group: " + isGroup);
        updateLowerButtonLEDs();
        updateUpperButtonLEDs();
        updateLEDRings();
    });
}

function reportDebugStatus() {
    if (!DEBUG) return;
    
    host.println(`--- Debug Status for Pinned Track ${PINNED_TRACK_INDEX + 1} ---`);
    host.println(`Pinned Track Exists: ${pinnedTrack.exists().get()}`);
    host.println(`Pinned Track Name: ${pinnedTrack.name().get()}`);
    host.println(`Pinned Track Is Group: ${pinnedTrack.isGroup().get()}`);

    host.println(`--- Debug Status for Child ${selectedChildIndex + 1} ---`);
    const rcs = childTrackRCs[selectedChildIndex];
    if (!rcs) {
        host.println("No RC structure found!");
        return;
    }

    host.println(`Track Exists: ${rcs.track.exists().get()} Name: ${rcs.track.name().get()}`);
    host.println(`Device Exists: ${rcs.device.exists().get()} Name: ${rcs.device.name().get()}`);
    
    const pages = ['perf', 'a', 'b', 'buttons'];
    pages.forEach(p => {
        const page = rcs[p];
        let assignedCount = 0;
        for(let i=0; i<8; i++) {
            if (page.getParameter(i).exists().get()) assignedCount++;
        }
        host.println(`Page '${p}': ${assignedCount}/8 params active`);
        if (assignedCount > 0) {
             host.println(`  First active param: ${page.getParameter(0).name().get()} = ${page.getParameter(0).value().get()}`);
        }
    });
    host.println("----------------------------------------");
}

function setupRCObservers(rcs, trackIndex) {
    const pages = ['perf', 'a', 'b'];
    pages.forEach(pageKey => {
        const page = rcs[pageKey];
        for (let j = 0; j < 8; j++) {
            const param = page.getParameter(j);
            param.exists().markInterested();
            param.value().markInterested();
            param.name().markInterested(); // Added this to fix the crash
            param.value().addValueObserver((value) => {
                if (selectedChildIndex === trackIndex && currentEncoderMode === pageKey) {
                    updateLEDRing(j, value);
                }
            });
        }
    });

    // Setup observers for 'buttons' page separately for LED feedback
    const buttonsPage = rcs.buttons;
    for (let j = 0; j < 8; j++) {
        const param = buttonsPage.getParameter(j);
        param.exists().markInterested();
        param.value().markInterested();
        param.name().markInterested(); // Added this just in case
        param.value().addValueObserver((value) => {
            if (selectedChildIndex === trackIndex) {
                updateUpperButtonLED(j, value);
            }
        });
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (command === 0xB0) {
        handleCC(data1, data2);
    } else if (command === 0x90 || command === 0x80) {
        const isPressed = (command === 0x90) && (data2 > 0);
        handleNote(data1, isPressed);
    }
}

function handleCC(cc, value) {
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        const encoderIndex = cc - CC.ENCODER_1;
        handleEncoderTurn(encoderIndex, value);
        return;
    }
    if (DEBUG) host.println(`CC: ${cc} Value: ${value}`);
}

function handleEncoderTurn(index, value) {
    const increment = (value >= 1 && value <= 63) ? 0.03 : -0.03;
    
    const rcs = childTrackRCs[selectedChildIndex];
    if (!rcs) return;

    const page = rcs[currentEncoderMode];
    if (!page) return;

    const param = page.getParameter(index);
    if (param && param.exists().get()) {
        param.inc(increment);
    }
}

function handleNote(note, isPressed) {
    if (!isPressed) return;

    const lowerButtons = [
        NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
        NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8
    ];
    
    const lowerIndex = lowerButtons.indexOf(note);
    if (lowerIndex !== -1) {
        selectChildTrack(lowerIndex);
        return;
    }

    const upperButtons = [
        NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
        NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8
    ];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex);
        return;
    }

    if (note === NOTE.LAYER_A) {
        toggleLayer('A');
        return;
    }
    if (note === NOTE.LAYER_B) {
        toggleLayer('B');
        return;
    }

    if (DEBUG) host.println(`Note: ${note} Pressed: ${isPressed}`);
}

function handleUpperButton(index) {
    const rcs = childTrackRCs[selectedChildIndex];
    if (!rcs) return;

    const param = rcs.buttons.getParameter(index);
    if (param && param.exists().get()) {
        const currentValue = param.value().get();
        const newValue = currentValue > 0.5 ? 0 : 1;
        param.set(newValue);
    }
}

function toggleLayer(layer) {
    if (layer === 'A') {
        currentEncoderMode = (currentEncoderMode === ENCODER_MODE.A) ? ENCODER_MODE.PERF : ENCODER_MODE.A;
    } else if (layer === 'B') {
        currentEncoderMode = (currentEncoderMode === ENCODER_MODE.B) ? ENCODER_MODE.PERF : ENCODER_MODE.B;
    }

    if (DEBUG) host.println("Encoder Mode: " + currentEncoderMode);
    
    updateLayerLEDs();
    updateLEDRings();
}

function selectChildTrack(index) {
    if (index === selectedChildIndex) return;
    
    selectedChildIndex = index;
    if (DEBUG) {
        host.println("Selected child track: " + (index + 1));
        host.scheduleTask(reportDebugStatus, null, 100);
    }
    
    updateLowerButtonLEDs();
    updateUpperButtonLEDs();
    updateLEDRings();
}

function updateLowerButtonLEDs() {
    const lowerButtons = [
        NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
        NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8
    ];

    for (let i = 0; i < 8; i++) {
        const state = (i === selectedChildIndex) ? LED_STATE.ON : LED_STATE.OFF;
        setButtonLED(lowerButtons[i], state);
    }
}

function updateUpperButtonLEDs() {
    const rcs = childTrackRCs[selectedChildIndex];
    if (!rcs) return;

    for (let i = 0; i < 8; i++) {
        const param = rcs.buttons.getParameter(i);
        const value = (param && param.exists().get()) ? param.value().get() : 0;
        updateUpperButtonLED(i, value);
    }
}

function updateUpperButtonLED(index, value) {
    const upperButtons = [
        NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
        NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8
    ];
    const state = (value > 0.5) ? LED_STATE.ON : LED_STATE.OFF;
    setButtonLED(upperButtons[index], state);
}

function updateLayerLEDs() {
    setButtonLED(NOTE.LAYER_A, currentEncoderMode === ENCODER_MODE.A ? LED_STATE.ON : LED_STATE.OFF);
    setButtonLED(NOTE.LAYER_B, currentEncoderMode === ENCODER_MODE.B ? LED_STATE.ON : LED_STATE.OFF);
}

function initializeLEDRings() {
    for (let i = 0; i < 8; i++) {
        setLEDRingValue(i, 32); // Default center/off look
    }
}

function updateLEDRings() {
    const rcs = childTrackRCs[selectedChildIndex];
    if (!rcs) return;

    const page = rcs[currentEncoderMode];
    for (let i = 0; i < 8; i++) {
        const param = page.getParameter(i);
        if (param && param.exists().get()) {
            updateLEDRing(i, param.value().get());
        } else {
            setLEDRingValue(i, 0); // No parameter
        }
    }
}

function updateLEDRing(index, value) {
    let position = Math.floor(value * 11);
    if (position > 11) position = 11;
    const ledValue = position + 32;
    setLEDRingValue(index, ledValue);
}

function setLEDRingValue(index, value) {
    const cc = CC.LED_RING_1 + index;
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, cc, value);
}

function setButtonLED(note, state) {
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, state);
}

function flush() {}

function exit() {
    if (DEBUG) host.println("X-Touch Mini Child exited");
}