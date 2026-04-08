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

const INPUT_MIDI_CHANNEL = 0; // Channel 1 (0-based)
const FADER_MIDI_CHANNEL = 8; // Channel 9 (0-based)
const OUTPUT_MIDI_CHANNEL = 0;
const DEBUG = true;

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

const LED_STATE = {
    OFF: 0,
    ON: 127
};

const UPPER_BUTTON_NOTES = [
    NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
    NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8
];

const LOWER_BUTTON_NOTES = [
    NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
    NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8
];

let midiIn, midiOut;
let selectedChildIndex = 0; // 0-7, selected via bottom row
let activeLayer = 'N_PAGE'; // 'N_PAGE', 'PERFORM' (A), 'VOLS' (B)

let targetTrack;
let primaryDevice;

let pageN = []; // n1-n8 on primary device
let pageNPerform; // n-perform on primary device
let pageNVols; // n-vols on primary device
let pageNMutes; // n-mutes on primary device
let pageNAllVols; // n-all-vols on primary device

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    if (DEBUG) {
        host.println("=== X-Touch Mini Nested initialized ===");
        host.scheduleTask(reportDebugStatus, null, 2000);
    }
}

function setupTracks() {
    // First track within the first track
    const mainTrackBank = host.createTrackBank(1, 0, 0, false);
    const firstTrack = mainTrackBank.getTrack(0);
    firstTrack.exists().markInterested();
    firstTrack.isGroup().markInterested();
    firstTrack.name().markInterested();

    const nestedTrackBank = firstTrack.createTrackBank(1, 0, 0, false);
    targetTrack = nestedTrackBank.getTrack(0);
    targetTrack.exists().markInterested();
    targetTrack.name().markInterested();

    const deviceBank = targetTrack.createDeviceBank(1);
    primaryDevice = deviceBank.getDevice(0);
    primaryDevice.exists().markInterested();
    primaryDevice.name().markInterested();

    // Setup pages on the primary device
    for (let i = 0; i < 8; i++) {
        const tagName = "n" + (i + 1);
        pageN[i] = primaryDevice.createCursorRemoteControlsPage(tagName, 8, tagName);
        setupPageObservers(pageN[i], 'n' + i);
    }

    pageNPerform = primaryDevice.createCursorRemoteControlsPage("n-perform", 8, "n-perform");
    setupPageObservers(pageNPerform, 'perform');

    pageNVols = primaryDevice.createCursorRemoteControlsPage("n-vols", 8, "n-vols");
    setupPageObservers(pageNVols, 'vols');

    pageNMutes = primaryDevice.createCursorRemoteControlsPage("n-mutes", 8, "n-mutes");
    setupPageObservers(pageNMutes, 'mutes');

    pageNAllVols = primaryDevice.createCursorRemoteControlsPage("n-all-vols", 8, "n-all-vols");
    setupPageObservers(pageNAllVols, 'all-vols');
}

function setupPageObservers(page, id) {
    for (let j = 0; j < 8; j++) {
        const param = page.getParameter(j);
        param.exists().markInterested();
        param.value().markInterested();
        param.name().markInterested();
        param.value().addValueObserver((value) => {
            onParamValueChanged(id, j, value);
        });
    }
}

function getActivePageId() {
    if (activeLayer === 'PERFORM') return 'perform';
    if (activeLayer === 'VOLS') return 'vols';
    return 'n' + selectedChildIndex;
}

function onParamValueChanged(id, paramIndex, value) {
    // Encoders
    if (id === getActivePageId()) {
        updateLEDRing(paramIndex, value);
    }
    
    // Top Row Buttons (n-mutes)
    if (id === 'mutes') {
        updateUpperButtonLED(paramIndex, value);
    }
}

function reportDebugStatus() {
    if (!DEBUG) return;
    
    host.println("--- Status Report ---");
    host.println(`Target Track Exists: ${targetTrack.exists().get()} Name: ${targetTrack.name().get()}`);
    host.println(`Active Layer: ${activeLayer} Selected Child: ${selectedChildIndex + 1}`);
    host.println(`Active Page ID: ${getActivePageId()}`);
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (channel === INPUT_MIDI_CHANNEL) {
        if (command === 0xB0) {
            handleCC(data1, data2);
        } else if (command === 0x90 || command === 0x80) {
            const isPressed = (command === 0x90) && (data2 > 0);
            handleNote(data1, isPressed);
        }
    } else if (channel === FADER_MIDI_CHANNEL && command === 0xE0) {
        // Pitch Bend (Fader)
        const value = (data2 << 7) | data1;
        handleFader(value);
    }
}

function getActiveEncoderPage() {
    if (activeLayer === 'PERFORM') return pageNPerform;
    if (activeLayer === 'VOLS') return pageNVols;
    return pageN[selectedChildIndex];
}

function handleCC(cc, value) {
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        const index = cc - CC.ENCODER_1;
        const increment = (value >= 1 && value <= 63) ? 0.05 : -0.05;
        
        const page = getActiveEncoderPage();
        const param = page.getParameter(index);
        if (param && param.exists().get()) {
            param.inc(increment);
        }
        return;
    }
}

function handleFader(value) {
    const normalizedValue = value / 16383;
    const param = pageNAllVols.getParameter(0);
    if (param && param.exists().get()) {
        param.set(normalizedValue);
    }
}

function handleNote(note, isPressed) {
    if (!isPressed) return;

    // Bottom Row: Select Child / N-Page
    const lowerIndex = LOWER_BUTTON_NOTES.indexOf(note);
    if (lowerIndex !== -1) {
        selectedChildIndex = lowerIndex;
        activeLayer = 'N_PAGE';
        updateLEDs();
        return;
    }

    // Top Row: n-mutes
    const upperIndex = UPPER_BUTTON_NOTES.indexOf(note);
    if (upperIndex !== -1) {
        const param = pageNMutes.getParameter(upperIndex);
        if (param && param.exists().get()) {
            const newValue = param.value().get() > 0.5 ? 0 : 1;
            param.set(newValue);
        }
        return;
    }

    // Button A: Toggle Perform
    if (note === NOTE.BUTTON_A) {
        if (activeLayer === 'PERFORM') {
            activeLayer = 'N_PAGE';
        } else {
            activeLayer = 'PERFORM';
        }
        updateLEDs();
        return;
    }

    // Button B: Toggle Vols
    if (note === NOTE.BUTTON_B) {
        if (activeLayer === 'VOLS') {
            activeLayer = 'N_PAGE';
        } else {
            activeLayer = 'VOLS';
        }
        updateLEDs();
        return;
    }

    // Encoder Push: Reset
    const encoderPushIndex = [
        NOTE.ENCODER_PUSH_1, NOTE.ENCODER_PUSH_2, NOTE.ENCODER_PUSH_3, NOTE.ENCODER_PUSH_4,
        NOTE.ENCODER_PUSH_5, NOTE.ENCODER_PUSH_6, NOTE.ENCODER_PUSH_7, NOTE.ENCODER_PUSH_8
    ].indexOf(note);
    
    if (encoderPushIndex !== -1) {
        const page = getActiveEncoderPage();
        const param = page.getParameter(encoderPushIndex);
        if (param && param.exists().get()) {
            param.reset();
        }
    }
}

function updateLEDs() {
    for (let i = 0; i < 8; i++) {
        const state = (activeLayer === 'N_PAGE' && selectedChildIndex === i) ? LED_STATE.ON : LED_STATE.OFF;
        setButtonLED(LOWER_BUTTON_NOTES[i], state);
    }
    
    setButtonLED(NOTE.BUTTON_A, (activeLayer === 'PERFORM') ? LED_STATE.ON : LED_STATE.OFF);
    setButtonLED(NOTE.BUTTON_B, (activeLayer === 'VOLS') ? LED_STATE.ON : LED_STATE.OFF);
    
    // Update Encoder Rings for current page
    const page = getActiveEncoderPage();
    for (let i = 0; i < 8; i++) {
        const param = page.getParameter(i);
        if (param && param.exists().get()) {
            updateLEDRing(i, param.value().get());
        } else {
            setLEDRingValue(i, 0);
        }
    }
}

function updateUpperButtonLED(index, value) {
    const state = (value > 0.5) ? LED_STATE.ON : LED_STATE.OFF;
    setButtonLED(UPPER_BUTTON_NOTES[index], state);
}

function updateLEDRing(index, value) {
    let position = Math.floor(value * 11);
    if (position > 11) position = 11;
    const ledValue = position + 32; // Center-filled mode or similar
    setLEDRingValue(index, ledValue);
}

function setLEDRingValue(index, value) {
    const cc = CC.LED_RING_1 + index;
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, cc, value);
}

function setButtonLED(note, state) {
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, state);
}

function flush() {
    // Optional: Refresh any state if needed
}

function exit() {
    if (DEBUG) host.println("X-Touch Mini Nested exited");
}