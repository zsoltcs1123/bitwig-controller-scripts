loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// --- Controller Definition ---
host.defineController(
    "Novation",
    "LaunchControlXL SubMixer",
    "0.1",
    "f4a5b6c7-d8e9-4f0a-b1c2-d3e4f5a6b7c8",
    "Zsolt"
);
host.defineMidiPorts(1, 1);

// --- Constants ---
const TARGET_MIDI_CHANNEL = 5; // MIDI Channel 6 (User Mode 6)
const DEBUG = false;
const TARGET_TEMPLATE_INDEX = 5;
const DEFAULT_TRACK_INDEX = 0;

const CC = {
    // Top Row Knobs
    KNOB_T1: 13, KNOB_T2: 14, KNOB_T3: 15, KNOB_T4: 16, 
    KNOB_T5: 17, KNOB_T6: 18, KNOB_T7: 19, KNOB_T8: 20,
    // Middle Row Knobs
    KNOB_M1: 29, KNOB_M2: 30, KNOB_M3: 31, KNOB_M4: 32, 
    KNOB_M5: 33, KNOB_M6: 34, KNOB_M7: 35, KNOB_M8: 36,
    // Bottom Row Knobs
    KNOB_B1: 49, KNOB_B2: 50, KNOB_B3: 51, KNOB_B4: 52, 
    KNOB_B5: 53, KNOB_B6: 54, KNOB_B7: 55, KNOB_B8: 56,
    // Sliders
    SLIDER1: 77, SLIDER2: 78, SLIDER3: 79, SLIDER4: 80, 
    SLIDER5: 81, SLIDER6: 82, SLIDER7: 83, SLIDER8: 84,
};

const NOTE = {
    // Top Row Buttons (Track Selection)
    BTN_T1: 41, BTN_T2: 42, BTN_T3: 43, BTN_T4: 44, 
    BTN_T5: 57, BTN_T6: 58, BTN_T7: 59, BTN_T8: 60,
    // Bottom Row Buttons
    BTN_B1: 73, BTN_B2: 74, BTN_B3: 75, BTN_B4: 76, 
    BTN_B5: 89, BTN_B6: 90, BTN_B7: 91, BTN_B8: 92,
};

const LED_COLOR = {
    OFF: 0x0C,
    RED_FULL: 0x0F,
    AMBER_LOW: 0x1D,
    AMBER_FULL: 0x3F,
    YELLOW_FULL: 0x2F,
    GREEN_LOW: 0x1C,
    GREEN_FULL: 0x3C,
};

// --- Globals ---
let midiIn, midiOut;
let trackBank, currentTrack, childTrackBank, mixerTrack, cursorDevice;
let remoteControlsPage0, mixerTrackPages, remoteControlsPage9;
let currentSelectedChildIndex = 1;
let childTrackControls = [];
let childTrackPage1Controls = [];

// --- Initialization ---
function init() {
    host.println("=================================");
    host.println("LCXL SubMixer Controller Starting");
    host.println("=================================");
    host.println("Welcome to Launch Control XL SubMixer!");
    host.println("Script loaded successfully and ready to use.");
    host.println("=================================");

    // Initialize MIDI
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    // Setup tracks
    trackBank = host.createTrackBank(8, 0, 0, false);
    currentTrack = trackBank.getItemAt(DEFAULT_TRACK_INDEX);
    childTrackBank = currentTrack.createTrackBank(9, 0, 0, false);
    mixerTrack = childTrackBank.getItemAt(0);

    // Setup device
    const mixerDeviceBank = mixerTrack.createDeviceBank(1);
    cursorDevice = mixerDeviceBank.getDevice(0);

    // Setup remote controls
    setupRemoteControls();
    setupChildTrackControls();
    setupObservers();

    // Initial LED update
    updateAllLeds();

    host.println("LCXL SubMixer initialized successfully.");
}

function setupRemoteControls() {
    // Page 0 - Mixer track (Top knobs)
    remoteControlsPage0 = mixerTrack.createCursorRemoteControlsPage("TopKnobs", 8, null);
    remoteControlsPage0.selectedPageIndex().set(0);
    
    // Pages 1-8 - Mixer track (Middle knobs - corresponding to child tracks)
    mixerTrackPages = [];
    for (let i = 1; i <= 8; i++) {
        const page = mixerTrack.createCursorRemoteControlsPage("MiddleKnobs_Page" + i, 8, null);
        page.selectedPageIndex().set(i);
        mixerTrackPages[i] = page;
    }
    
    // Page 9 - Mixer device (Sliders)
    remoteControlsPage9 = cursorDevice.createCursorRemoteControlsPage("Sliders", 8, null);
    remoteControlsPage9.selectedPageIndex().set(9);

    // Mark parameters as interested
    [remoteControlsPage0].forEach(page => {
        for (let i = 0; i < 8; i++) {
            page.getParameter(i).exists().markInterested();
        }
    });
    
    // Mark mixer track pages parameters as interested
    for (let i = 1; i <= 8; i++) {
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            mixerTrackPages[i].getParameter(paramIndex).exists().markInterested();
        }
    }
    
    // Mark page 9 parameters as interested
    for (let i = 0; i < 8; i++) {
        remoteControlsPage9.getParameter(i).exists().markInterested();
    }
}

function setupChildTrackControls() {
    for (let i = 1; i <= 8; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        childTrack.name().markInterested();
        childTrack.exists().markInterested();

        // Page 0 for bottom buttons
        const trackControls = childTrack.createCursorRemoteControlsPage("ChildTrack" + i, 8, null);
        trackControls.selectedPageIndex().set(0);
        childTrackControls[i] = trackControls;

        // Page 1 for bottom knobs
        const trackPage1Controls = childTrack.createCursorRemoteControlsPage("ChildTrackPage1_" + i, 8, null);
        trackPage1Controls.selectedPageIndex().set(1);
        childTrackPage1Controls[i] = trackPage1Controls;

        // Mark parameters as interested and add observers
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            const param0 = trackControls.getParameter(paramIndex);
            const param1 = trackPage1Controls.getParameter(paramIndex);
            
            [param0, param1].forEach(param => {
                param.exists().markInterested();
                param.value().markInterested();
            });
        }
    }
}

function setupObservers() {
    // Track observers
    currentTrack.name().markInterested();
    currentTrack.exists().markInterested();
    mixerTrack.name().markInterested();
    mixerTrack.exists().markInterested();
    cursorDevice.name().markInterested();
    cursorDevice.exists().markInterested();

    // Add change observers for LED updates
    const updateLeds = () => updateAllLeds();
    
    [currentTrack, mixerTrack].forEach(track => {
        track.exists().addValueObserver(updateLeds);
    });

    // Parameter existence observers
    for (let i = 0; i < 8; i++) {
        remoteControlsPage0.getParameter(i).exists().addValueObserver(updateLeds);
    }
    
    // Mixer track pages observers
    for (let pageIndex = 1; pageIndex <= 8; pageIndex++) {
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            mixerTrackPages[pageIndex].getParameter(paramIndex).exists().addValueObserver(updateLeds);
        }
    }

    // Child track observers
    for (let i = 1; i <= 8; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        const trackControls = childTrackControls[i];
        const trackPage1Controls = childTrackPage1Controls[i];
        
        childTrack.exists().addValueObserver(updateLeds);
        
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            trackControls.getParameter(paramIndex).exists().addValueObserver(updateLeds);
            trackControls.getParameter(paramIndex).value().addValueObserver(updateLeds);
            trackPage1Controls.getParameter(paramIndex).exists().addValueObserver(updateLeds);
        }

        // Keep pages fixed
        trackControls.selectedPageIndex().addValueObserver((index) => {
            if (index !== 0) trackControls.selectedPageIndex().set(0);
        });
        trackPage1Controls.selectedPageIndex().addValueObserver((index) => {
            if (index !== 1) trackPage1Controls.selectedPageIndex().set(1);
        });
    }

    // Keep main pages fixed
    remoteControlsPage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) remoteControlsPage0.selectedPageIndex().set(0);
    });
    
    // Keep mixer track pages fixed
    for (let i = 1; i <= 8; i++) {
        const targetPageIndex = i;
        mixerTrackPages[i].selectedPageIndex().addValueObserver((index) => {
            if (index !== targetPageIndex) mixerTrackPages[i].selectedPageIndex().set(targetPageIndex);
        });
    }
    
    remoteControlsPage9.selectedPageIndex().addValueObserver((index) => {
        if (index !== 9) remoteControlsPage9.selectedPageIndex().set(9);
    });
}

// --- Helper Functions ---
function getSysexIndexForKnob(row, index) {
    if (index < 0 || index > 7) return -1;
    const offsets = { 'T': 0x00, 'M': 0x08, 'B': 0x10 };
    return offsets[row] !== undefined ? offsets[row] + index : -1;
}

function getSysexIndexForButton(row, index) {
    if (index < 0 || index > 7) return -1;
    const offsets = { 'T': 0x18, 'B': 0x20 };
    return offsets[row] !== undefined ? offsets[row] + index : -1;
}

function findParameterIndex(cc) {
    const ranges = [
        [CC.KNOB_T1, CC.KNOB_T8], [CC.KNOB_M1, CC.KNOB_M8],
        [CC.KNOB_B1, CC.KNOB_B8], [CC.SLIDER1, CC.SLIDER8]
    ];
    
    for (const [start, end] of ranges) {
        if (cc >= start && cc <= end) return cc - start;
    }
    return -1;
}

function findButtonIndex(note) {
    const ranges = [
        [NOTE.BTN_T1, NOTE.BTN_T4, 0], [NOTE.BTN_T5, NOTE.BTN_T8, 4],
        [NOTE.BTN_B1, NOTE.BTN_B4, 0], [NOTE.BTN_B5, NOTE.BTN_B8, 4]
    ];
    
    for (const [start, end, offset] of ranges) {
        if (note >= start && note <= end) return (note - start) + offset;
    }
    return -1;
}

// --- MIDI Callback ---
function onMidi(status, data1, data2) {
    const msgType = status & 0xF0;
    const channel = status & 0x0F;

    if (channel !== TARGET_MIDI_CHANNEL) return;

    if (DEBUG) {
        host.println(`MIDI Ch ${channel + 1}: Type=0x${msgType.toString(16)}, Data1=${data1}, Data2=${data2}`);
    }

    if (msgType === 0xB0) {
        handleCC(data1, data2);
    } else if (msgType === 0x90 && data2 > 0) {
        handleNoteOn(data1, data2);
    }
}

// --- MIDI Handlers ---
function handleCC(cc, value) {
    const paramIndex = findParameterIndex(cc);
    if (paramIndex === -1) return;

    let parameter = null;

    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) {
        parameter = remoteControlsPage0?.getParameter(paramIndex);
    } else if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M8) {
        parameter = mixerTrackPages[currentSelectedChildIndex]?.getParameter(paramIndex);
    } else if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B8) {
        parameter = childTrackPage1Controls[currentSelectedChildIndex]?.getParameter(paramIndex);
    } else if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) {
        parameter = remoteControlsPage9?.getParameter(paramIndex);
    }

    if (parameter?.exists().get()) {
        parameter.set(value, 128);
        if (DEBUG) host.println(`Set parameter ${paramIndex} to ${value}`);
    }
}

function handleNoteOn(note, velocity) {
    const buttonIndex = findButtonIndex(note);
    if (buttonIndex === -1) return;

    // Top buttons - child track selection
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T8) {
        const targetChildIndex = buttonIndex + 1;
        if (targetChildIndex !== currentSelectedChildIndex) {
            currentSelectedChildIndex = targetChildIndex;
            updateAllLeds();
        }
        return;
    }

    // Bottom buttons - toggle parameters
    if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B8) {
        const parameter = childTrackControls[currentSelectedChildIndex]?.getParameter(buttonIndex);
        if (parameter?.exists().get()) {
            const currentValue = parameter.value().get();
            parameter.value().set(currentValue === 0 ? 127 : 0, 128);
        }
    }
}

// --- LED Functions ---
function updateAllLeds() {
    updateTopKnobLeds();
    updateTrackButtonLeds();
    updateMiddleKnobLeds();
    updateBottomButtonLeds();
    updateBottomKnobLeds();
}

function updateTopKnobLeds() {
    for (let i = 0; i < 8; i++) {
        const exists = remoteControlsPage0?.getParameter(i).exists().get();
        const color = (exists && mixerTrack?.exists().get()) ? LED_COLOR.RED_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('T', i, color);
    }
}

function updateTrackButtonLeds() {
    for (let i = 0; i < 8; i++) {
        const childIndex = i + 1;
        const childTrack = childTrackBank.getItemAt(childIndex);
        let color = LED_COLOR.OFF;
        
        if (childTrack?.exists().get()) {
            color = (childIndex === currentSelectedChildIndex) ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
        }
        
        sendLedUpdateButton('T', i, color);
    }
}

function updateMiddleKnobLeds() {
    const currentMixerPage = mixerTrackPages[currentSelectedChildIndex];
    for (let i = 0; i < 8; i++) {
        const exists = currentMixerPage?.getParameter(i).exists().get();
        const color = (exists && mixerTrack?.exists().get()) ? LED_COLOR.YELLOW_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('M', i, color);
    }
}

function updateBottomButtonLeds() {
    const trackControls = childTrackControls[currentSelectedChildIndex];
    
    for (let i = 0; i < 8; i++) {
        const parameter = trackControls?.getParameter(i);
        let color = LED_COLOR.OFF;
        
        if (parameter?.exists().get()) {
            const value = parameter.value().get();
            color = value > 0 ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
        }
        
        sendLedUpdateButton('B', i, color);
    }
}

function updateBottomKnobLeds() {
    const trackControls = childTrackPage1Controls[currentSelectedChildIndex];
    
    for (let i = 0; i < 8; i++) {
        const exists = trackControls?.getParameter(i).exists().get();
        const color = exists ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('B', i, color);
    }
}

function sendLedUpdateKnob(row, index, colorVelocity) {
    const sysexIndex = getSysexIndexForKnob(row, index);
    if (sysexIndex !== -1) sendSysexLedCommand(sysexIndex, colorVelocity);
}

function sendLedUpdateButton(row, index, colorVelocity) {
    const sysexIndex = getSysexIndexForButton(row, index);
    if (sysexIndex !== -1) sendSysexLedCommand(sysexIndex, colorVelocity);
}

function sendSysexLedCommand(sysexLedIndex, colorVelocity) {
    if (!midiOut) return;
    
    const sysexBytes = [
        0xF0, 0x00, 0x20, 0x29,
        0x02, 0x11,
        0x78,
        TARGET_TEMPLATE_INDEX,
        sysexLedIndex,
        colorVelocity,
        0xF7
    ];
    
    const hexString = sysexBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');

    if (DEBUG) {
        host.println(`LED: Template=${TARGET_TEMPLATE_INDEX}, Index=${sysexLedIndex}, Color=${colorVelocity}`);
    }

    midiOut.sendSysex(hexString);
}

// --- Callbacks ---
function flush() {
    // Called periodically - not needed
}

function exit() {
    host.println("LCXL SubMixer exiting...");
    
    // Turn off all LEDs
    for (let i = 0; i < 8; i++) {
        ['T', 'M', 'B'].forEach(row => sendLedUpdateKnob(row, i, LED_COLOR.OFF));
        ['T', 'B'].forEach(row => sendLedUpdateButton(row, i, LED_COLOR.OFF));
    }
    
    host.println("Thank you for using LCXL SubMixer!");
} 