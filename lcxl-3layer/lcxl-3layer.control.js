loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// --- Controller Definition ---
host.defineController(
    "Novation",
    "LaunchControlXL 3Layer",
    "0.1.0",
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "Zsolt"
);
host.defineMidiPorts(1, 1);

// --- Constants ---
const DEBUG = true;
const TARGET_MIDI_CHANNEL = 5; // MIDI Channel 6 (User Mode 6)
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
    // Directional Buttons (Send Select & Track Select)
    SEND_SELECT_1: 104,   // Up button
    SEND_SELECT_2: 105,   // Down button  
    TRACK_SELECT_1: 106,  // Left button
    TRACK_SELECT_2: 107,  // Right button
};

const NOTE = {
    REC_ARM: 108,
    // Top Row Buttons
    BTN_T1: 41, BTN_T2: 42, BTN_T3: 43, BTN_T4: 44, 
    BTN_T5: 57, BTN_T6: 58, BTN_T7: 59, BTN_T8: 60,
    // Bottom Row Buttons
    BTN_B1: 73, BTN_B2: 74, BTN_B3: 75, BTN_B4: 76, 
    BTN_B5: 89, BTN_B6: 90, BTN_B7: 91, BTN_B8: 92,
};

const LED_COLOR = {
    OFF: 0x0C,
    RED_LOW: 0x0D,
    RED_FULL: 0x0F,
    AMBER_LOW: 0x1D,
    AMBER_FULL: 0x3F,
    YELLOW_LOW: 0x1E,
    YELLOW_FULL: 0x3E,
    GREEN_LOW: 0x1C,
    GREEN_FULL: 0x3C,
};

// --- Globals ---
let midiIn, midiOut;
let trackBank, currentTrack, childTrackBank;
let currentTrackIndex = DEFAULT_TRACK_INDEX;
let allGroupTrackBanks = [];
let allGroupRemoteControls = [];
let track3RemoteControlsPage2;
let isTrackSelectionMode = false;

// Group track navigation
let childTrackBanks = [];
let track1s = [];
let track1RemoteControlsPages = [];
let track1RemoteControlsPages1 = [];
let track2s = [];
let track2RemoteControlsPages = [];
let track2RemoteControlsPages1 = [];
let track3s = [];
let track3RemoteControlsPages = [];

// Main group track remote controls (page index 1) for directional buttons
let mainGroupRemoteControlsPages = [];

// Button debounce
let lastButtonPress = {};
const BUTTON_DEBOUNCE_MS = 100;

// --- Initialization ---
function init() {
    host.println("=================================");
    host.println("LCXL 3-Layer Controller Starting");
    host.println("=================================");
    host.println("Welcome to Launch Control XL 3-Layer!");
    host.println("Script loaded successfully and ready to use.");
    host.println("=================================");

    // Initialize MIDI
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    // Setup main track bank
    trackBank = host.createTrackBank(8, 0, 0, false);
    
    // Setup all group navigation during initialization
    setupAllGroupNavigation();
    
    // Initialize current track variables
    currentTrackIndex = DEFAULT_TRACK_INDEX;
    currentTrack = trackBank.getItemAt(DEFAULT_TRACK_INDEX);
    childTrackBank = allGroupTrackBanks[DEFAULT_TRACK_INDEX];
    if (allGroupRemoteControls[DEFAULT_TRACK_INDEX] && allGroupRemoteControls[DEFAULT_TRACK_INDEX].track3Page2) {
        track3RemoteControlsPage2 = allGroupRemoteControls[DEFAULT_TRACK_INDEX].track3Page2;
    }
    
    // Setup observers
    setupObservers();

    host.println("LCXL 3-Layer initialized successfully.");
}

// --- Setup Functions ---
function setupAllGroupNavigation() {
    host.println("✓ Setting up group navigation for all tracks...");
    
    // Create child track banks for all 8 tracks during initialization
    for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
        const track = trackBank.getItemAt(trackIndex);
        
        // Create child track bank for this track
        const childTrackBank = track.createTrackBank(9, 0, 0, false);
        childTrackBanks[trackIndex] = childTrackBank;
        allGroupTrackBanks[trackIndex] = childTrackBank;
        
        // Get Track 1 inside the group (index 0)
        const track1 = childTrackBank.getItemAt(0);
        track1s[trackIndex] = track1;
        
        // Get Track 2 inside the group (index 1)
        const track2 = childTrackBank.getItemAt(1);
        track2s[trackIndex] = track2;
        
        // Get Track 3 inside the group (index 2)
        const track3 = childTrackBank.getItemAt(2);
        track3s[trackIndex] = track3;
        
        // Mark tracks as interested
        track1.exists().markInterested();
        track1.name().markInterested();
        track2.exists().markInterested();
        track2.name().markInterested();
        track3.exists().markInterested();
        track3.name().markInterested();
        
        // Create cursor devices that follow the primary device on each track
        // This automatically updates when instrument selectors change instruments
        const track1PrimaryDevice = track1.createCursorDevice("Primary");
        const track2PrimaryDevice = track2.createCursorDevice("Primary");
        const track3PrimaryDevice = track3.createCursorDevice("Primary");
        
        // Create remote controls pages on the cursor devices (not directly on tracks)
        // These will automatically update when the primary device changes
        const track1RemoteControlsPage = track1PrimaryDevice.createCursorRemoteControlsPage("BottomKnobs_" + trackIndex, 8, null);
        track1RemoteControlsPage.selectedPageIndex().set(0);
        track1RemoteControlsPages[trackIndex] = track1RemoteControlsPage;
        
        const track1RemoteControlsPage1 = track1PrimaryDevice.createCursorRemoteControlsPage("BottomButtons_" + trackIndex, 8, null);
        track1RemoteControlsPage1.selectedPageIndex().set(1);
        track1RemoteControlsPages1[trackIndex] = track1RemoteControlsPage1;
        
        const track2RemoteControlsPage = track2PrimaryDevice.createCursorRemoteControlsPage("MiddleKnobs_" + trackIndex, 8, null);
        track2RemoteControlsPage.selectedPageIndex().set(0);
        track2RemoteControlsPages[trackIndex] = track2RemoteControlsPage;
        
        const track2RemoteControlsPage1 = track2PrimaryDevice.createCursorRemoteControlsPage("TopButtons_" + trackIndex, 8, null);
        track2RemoteControlsPage1.selectedPageIndex().set(1);
        track2RemoteControlsPages1[trackIndex] = track2RemoteControlsPage1;
        
        const track3RemoteControlsPage = track3PrimaryDevice.createCursorRemoteControlsPage("TopKnobs_" + trackIndex, 8, null);
        track3RemoteControlsPage.selectedPageIndex().set(0);
        track3RemoteControlsPages[trackIndex] = track3RemoteControlsPage;
        
        const track3RemoteControlsPage2 = track3PrimaryDevice.createCursorRemoteControlsPage("Faders_" + trackIndex, 8, null);
        track3RemoteControlsPage2.selectedPageIndex().set(2);
        if (!allGroupRemoteControls[trackIndex]) {
            allGroupRemoteControls[trackIndex] = {};
        }
        allGroupRemoteControls[trackIndex].track3Page2 = track3RemoteControlsPage2;
        
        // Create remote control page for the main group track itself (page index 1)
        // This is for the directional buttons (Up, Down, Left, Right)
        const mainGroupRemoteControlsPage = track.createCursorRemoteControlsPage("MainGroup_" + trackIndex, 8, null);
        mainGroupRemoteControlsPage.selectedPageIndex().set(1);
        mainGroupRemoteControlsPages[trackIndex] = mainGroupRemoteControlsPage;
        
        // Keep main group page fixed at index 1
        mainGroupRemoteControlsPage.selectedPageIndex().addValueObserver((index) => {
            if (index !== 1) mainGroupRemoteControlsPage.selectedPageIndex().set(1);
        });
        
        // Setup parameter observers
        setupParameterObservers(trackIndex, track1RemoteControlsPage, track1RemoteControlsPage1, track2RemoteControlsPage, track2RemoteControlsPage1, track3RemoteControlsPage, track3RemoteControlsPage2, mainGroupRemoteControlsPage);
        
        // Keep pages fixed at their respective indices
        track1RemoteControlsPage.selectedPageIndex().addValueObserver((index) => {
            if (index !== 0) track1RemoteControlsPage.selectedPageIndex().set(0);
        });
        track1RemoteControlsPage1.selectedPageIndex().addValueObserver((index) => {
            if (index !== 1) track1RemoteControlsPage1.selectedPageIndex().set(1);
        });
        track2RemoteControlsPage.selectedPageIndex().addValueObserver((index) => {
            if (index !== 0) track2RemoteControlsPage.selectedPageIndex().set(0);
        });
        track2RemoteControlsPage1.selectedPageIndex().addValueObserver((index) => {
            if (index !== 1) track2RemoteControlsPage1.selectedPageIndex().set(1);
        });
        track3RemoteControlsPage.selectedPageIndex().addValueObserver((index) => {
            if (index !== 0) track3RemoteControlsPage.selectedPageIndex().set(0);
        });
        track3RemoteControlsPage2.selectedPageIndex().addValueObserver((index) => {
            if (index !== 2) track3RemoteControlsPage2.selectedPageIndex().set(2);
        });
    }
    
    host.println("✓ Group navigation setup complete for all tracks");
}

function setupParameterObservers(trackIndex, track1RemoteControlsPage, track1RemoteControlsPage1, track2RemoteControlsPage, track2RemoteControlsPage1, track3RemoteControlsPage, track3RemoteControlsPage2, mainGroupRemoteControlsPage) {
    // Setup parameter observers for each parameter page
    // With CursorDevice, these observers will automatically work with new devices
    for (let i = 0; i < 8; i++) {
        // Track 1 page 0 parameters (bottom knobs)
        const param1 = track1RemoteControlsPage.getParameter(i);
        param1.exists().markInterested();
        param1.value().markInterested();
        param1.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateBottomRowKnobLeds();
            }
        });
        param1.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateBottomRowKnobLeds();
            }
        });
        
        // Track 1 page 1 parameters (bottom buttons)
        const param1_1 = track1RemoteControlsPage1.getParameter(i);
        param1_1.exists().markInterested();
        param1_1.value().markInterested();
        param1_1.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateBottomRowLeds();
            }
        });
        param1_1.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateBottomRowLeds();
            }
        });
        
        // Track 2 page 0 parameters (middle knobs)
        const param2 = track2RemoteControlsPage.getParameter(i);
        param2.exists().markInterested();
        param2.value().markInterested();
        param2.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateMiddleRowKnobLeds();
            }
        });
        param2.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateMiddleRowKnobLeds();
            }
        });
        
        // Track 2 page 1 parameters (top buttons)
        const param2_1 = track2RemoteControlsPage1.getParameter(i);
        param2_1.exists().markInterested();
        param2_1.value().markInterested();
        param2_1.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateTopRowButtonLeds();
            }
        });
        param2_1.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateTopRowButtonLeds();
            }
        });
        
        // Track 3 page 0 parameters (top knobs)
        const param3 = track3RemoteControlsPage.getParameter(i);
        param3.exists().markInterested();
        param3.value().markInterested();
        param3.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateTopRowKnobLeds();
            }
        });
        param3.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateTopRowKnobLeds();
            }
        });
        
        // Track 3 page 2 parameters (faders)
        const param3_2 = track3RemoteControlsPage2.getParameter(i);
        param3_2.exists().markInterested();
        param3_2.value().markInterested();
        // Note: Faders don't have LEDs, so no visual feedback needed
    }
    
    // Setup observers for the first 4 parameters on the main group track (page index 1)
    // These are for the directional buttons (Up, Down, Left, Right)
    for (let i = 0; i < 4; i++) {
        const mainGroupParam = mainGroupRemoteControlsPage.getParameter(i);
        mainGroupParam.exists().markInterested();
        mainGroupParam.value().markInterested();
        mainGroupParam.exists().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateDirectionalButtonLeds();
            }
        });
        mainGroupParam.value().addValueObserver(() => {
            if (trackIndex === currentTrackIndex) {
                updateDirectionalButtonLeds();
            }
        });
    }
}

function setupObservers() {
    // Track observers
    for (let i = 0; i < 8; i++) {
        const track = trackBank.getItemAt(i);
        track.name().markInterested();
        track.exists().markInterested();
        track.exists().addValueObserver(() => updateAllLeds());
    }
    
    // Initial LED update
    updateAllLeds();
    
    host.println("✓ Observers setup complete");
}

// --- Track Selection Functions ---
function toggleTrackSelectMode() {
    isTrackSelectionMode = !isTrackSelectionMode;
    host.println(`Track select mode: ${isTrackSelectionMode ? 'ON' : 'OFF'}`);
    updateAllLeds();
}

function selectTrack(index) {
    if (index >= 0 && index < 8) {
        currentTrackIndex = index;
        currentTrack = trackBank.getItemAt(index);
        childTrackBank = allGroupTrackBanks[index];
        if (allGroupRemoteControls[index] && allGroupRemoteControls[index].track3Page2) {
            track3RemoteControlsPage2 = allGroupRemoteControls[index].track3Page2;
        }
        
        // Update LEDs immediately to show feedback for track selection
        updateAllLeds();
        
        if (DEBUG) {
            host.println(`Selected track ${index + 1}: ${currentTrack.name().get()}`);
        }
    }
}

function findKnobIndex(cc, knobArray) {
    for (let i = 0; i < knobArray.length; i++) {
        if (cc === knobArray[i]) {
            return i;
        }
    }
    return -1;
}

function findButtonIndex(note, buttonArray) {
    for (let i = 0; i < buttonArray.length; i++) {
        if (note === buttonArray[i]) {
            return i;
        }
    }
    return -1;
}

function getSysexIndexForKnob(row, index) {
    if (index < 0 || index > 7) return -1;
    const offsets = { 'T': 0x00, 'M': 0x08, 'B': 0x10 };
    return offsets[row] !== undefined ? offsets[row] + index : -1;
}

// --- LED Functions ---
function updateAllLeds() {
    updateRecArmLed();
    updateTopRowKnobLeds();
    updateTopRowButtonLeds();
    updateMiddleRowKnobLeds();
    updateBottomRowKnobLeds();
    updateBottomRowLeds();
    updateDirectionalButtonLeds();
}

function updateDirectionalButtonLeds() {
    const directionalButtonLedIndices = [44, 45, 46, 47]; // SysEx indices for Up, Down, Left, Right
    const mainGroupRemoteControlsPage = mainGroupRemoteControlsPages[currentTrackIndex];
    
    if (!mainGroupRemoteControlsPage) {
        // Turn off all directional button LEDs if no remote controls page
        for (const ledIndex of directionalButtonLedIndices) {
            sendSysexLedCommand(ledIndex, LED_COLOR.OFF);
        }
        return;
    }
    
    for (let i = 0; i < 4; i++) {
        const param = mainGroupRemoteControlsPage.getParameter(i);
        let color = LED_COLOR.OFF;
        
        if (param.exists().get()) {
            const value = param.value().get();
            // Show parameter state: full brightness when active, low brightness when inactive
            color = (value > 0) ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
        }
        
        sendSysexLedCommand(directionalButtonLedIndices[i], color);
    }
}

function updateRecArmLed() {
    const recArmColor = isTrackSelectionMode ? LED_COLOR.YELLOW_FULL : LED_COLOR.OFF;
    sendSysexLedCommand(43, recArmColor);
}

function updateTopRowKnobLeds() {
    const track3 = track3s[currentTrackIndex];
    const track3RemoteControlsPage = track3RemoteControlsPages[currentTrackIndex];
    
    if (!track3RemoteControlsPage || !track3 || !track3.exists().get()) {
        for (let i = 0; i < 8; i++) {
            sendLedUpdateKnob('T', i, LED_COLOR.OFF);
        }
        return;
    }
    
    for (let i = 0; i < 8; i++) {
        const param = track3RemoteControlsPage.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.GREEN_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('T', i, color);
    }
}

function updateMiddleRowKnobLeds() {
    const track2 = track2s[currentTrackIndex];
    const track2RemoteControlsPage = track2RemoteControlsPages[currentTrackIndex];
    
    if (!track2RemoteControlsPage || !track2 || !track2.exists().get()) {
        for (let i = 0; i < 8; i++) {
            sendLedUpdateKnob('M', i, LED_COLOR.OFF);
        }
        return;
    }
    
    for (let i = 0; i < 8; i++) {
        const param = track2RemoteControlsPage.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('M', i, color);
    }
}

function updateBottomRowKnobLeds() {
    const track1 = track1s[currentTrackIndex];
    const track1RemoteControlsPage = track1RemoteControlsPages[currentTrackIndex];
    
    if (!track1RemoteControlsPage || !track1 || !track1.exists().get()) {
        for (let i = 0; i < 8; i++) {
            sendLedUpdateKnob('B', i, LED_COLOR.OFF);
        }
        return;
    }
    
    for (let i = 0; i < 8; i++) {
        const param = track1RemoteControlsPage.getParameter(i);
        let color = LED_COLOR.OFF;
        
        if (param.exists().get()) {
            color = (i === 7) ? LED_COLOR.YELLOW_FULL : LED_COLOR.RED_FULL;
        }
        
        sendLedUpdateKnob('B', i, color);
    }
}

function updateTopRowButtonLeds() {
    const topButtons = [
        NOTE.BTN_T1, NOTE.BTN_T2, NOTE.BTN_T3, NOTE.BTN_T4, 
        NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8
    ];
    
    for (let i = 0; i < topButtons.length; i++) {
        let color = LED_COLOR.OFF;
        
        if (!isTrackSelectionMode) {
            const track2 = track2s[currentTrackIndex];
            const track2RemoteControlsPage1 = track2RemoteControlsPages1[currentTrackIndex];
            
            if (track2RemoteControlsPage1 && track2 && track2.exists().get()) {
                const param = track2RemoteControlsPage1.getParameter(i);
                if (param.exists().get()) {
                    const value = param.value().get();
                    color = (value > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
                }
            }
        }
        
        sendLedUpdate(topButtons[i], color);
    }
}

function updateBottomRowLeds() {
    const bottomButtons = [
        NOTE.BTN_B1, NOTE.BTN_B2, NOTE.BTN_B3, NOTE.BTN_B4, 
        NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8
    ];
    
    for (let i = 0; i < bottomButtons.length; i++) {
        let color = LED_COLOR.OFF;
        
        if (isTrackSelectionMode) {
            const track = trackBank.getItemAt(i);
            if (track.exists().get()) {
                color = (i === currentTrackIndex) ? LED_COLOR.YELLOW_FULL : LED_COLOR.YELLOW_LOW;
            }
        } else {
            const track1 = track1s[currentTrackIndex];
            const track1RemoteControlsPage1 = track1RemoteControlsPages1[currentTrackIndex];
            
            if (track1RemoteControlsPage1 && track1 && track1.exists().get()) {
                const param = track1RemoteControlsPage1.getParameter(i);
                if (param.exists().get()) {
                    const value = param.value().get();
                    color = (value > 0) ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
                }
            }
        }
        
        sendLedUpdate(bottomButtons[i], color);
    }
}

function sendLedUpdate(note, colorVelocity) {
    if (!midiOut) return;
    midiOut.sendMidi(0x90 | TARGET_MIDI_CHANNEL, note, colorVelocity);
}

function sendLedUpdateKnob(row, index, colorVelocity) {
    const sysexIndex = getSysexIndexForKnob(row, index);
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
    midiOut.sendSysex(hexString);
}

// --- MIDI Callback ---
function onMidi(status, data1, data2) {
    const msgType = status & 0xF0;
    const channel = status & 0x0F;

    if (channel !== TARGET_MIDI_CHANNEL) return;

    if (msgType === 0x90 && data2 > 0) {
        handleNoteOn(data1, data2);
    } else if (msgType === 0xB0) {
        handleCC(data1, data2);
    }
}

// --- MIDI Handlers ---
function handleNoteOn(note, velocity) {
    if (note === NOTE.REC_ARM) {
        toggleTrackSelectMode();
        return;
    }
    
    // Handle top row buttons
    const topButtons = [
        NOTE.BTN_T1, NOTE.BTN_T2, NOTE.BTN_T3, NOTE.BTN_T4, 
        NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8
    ];
    const topButtonIndex = findButtonIndex(note, topButtons);
    if (topButtonIndex !== -1) {
        if (!isTrackSelectionMode) {
            handleTopButtonParameterToggle(topButtonIndex);
        }
        return;
    }
    
    // Handle bottom row buttons
    const bottomButtons = [
        NOTE.BTN_B1, NOTE.BTN_B2, NOTE.BTN_B3, NOTE.BTN_B4, 
        NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8
    ];
    const buttonIndex = findButtonIndex(note, bottomButtons);
    if (buttonIndex !== -1) {
        if (isTrackSelectionMode) {
            selectTrack(buttonIndex);
        } else {
            handleBottomButtonParameterToggle(buttonIndex);
        }
        return;
    }
}

function handleCC(cc, value) {
    // Handle top row knobs
    const topKnobs = [
        CC.KNOB_T1, CC.KNOB_T2, CC.KNOB_T3, CC.KNOB_T4,
        CC.KNOB_T5, CC.KNOB_T6, CC.KNOB_T7, CC.KNOB_T8
    ];
    const topKnobIndex = findKnobIndex(cc, topKnobs);
    if (topKnobIndex !== -1) {
        handleTopKnobChange(topKnobIndex, value);
        return;
    }
    
    // Handle middle row knobs
    const middleKnobs = [
        CC.KNOB_M1, CC.KNOB_M2, CC.KNOB_M3, CC.KNOB_M4,
        CC.KNOB_M5, CC.KNOB_M6, CC.KNOB_M7, CC.KNOB_M8
    ];
    const middleKnobIndex = findKnobIndex(cc, middleKnobs);
    if (middleKnobIndex !== -1) {
        handleMiddleKnobChange(middleKnobIndex, value);
        return;
    }
    
    // Handle bottom row knobs
    const bottomKnobs = [
        CC.KNOB_B1, CC.KNOB_B2, CC.KNOB_B3, CC.KNOB_B4,
        CC.KNOB_B5, CC.KNOB_B6, CC.KNOB_B7, CC.KNOB_B8
    ];
    const bottomKnobIndex = findKnobIndex(cc, bottomKnobs);
    if (bottomKnobIndex !== -1) {
        handleBottomKnobChange(bottomKnobIndex, value);
        return;
    }
    
    // Handle faders
    if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) {
        const sliderIndex = cc - CC.SLIDER1;
        const track3Page2 = allGroupRemoteControls[currentTrackIndex]?.track3Page2;
        if (track3Page2) {
            const parameter = track3Page2.getParameter(sliderIndex);
            if (parameter?.exists().get()) {
                parameter.set(value, 128);
                if (DEBUG) host.println(`Set Track3 Page 2 parameter ${sliderIndex} to ${value}`);
            }
        }
        return;
    }
    
    // Handle directional buttons (Send Select & Track Select) - Main group track parameters
    const directionalCCs = [CC.SEND_SELECT_1, CC.SEND_SELECT_2, CC.TRACK_SELECT_1, CC.TRACK_SELECT_2];
    const directionalCCIndex = directionalCCs.indexOf(cc);
    if (directionalCCIndex !== -1 && value > 0) { // Only handle button press (value > 0)
        handleDirectionalButtonToggle(directionalCCIndex);
        return;
    }
}

function handleTopKnobChange(knobIndex, value) {
    const track3 = track3s[currentTrackIndex];
    const track3RemoteControlsPage = track3RemoteControlsPages[currentTrackIndex];
    
    if (!track3RemoteControlsPage || !track3 || !track3.exists().get()) {
        return;
    }
    
    const parameter = track3RemoteControlsPage.getParameter(knobIndex);
    if (parameter.exists().get()) {
        parameter.set(value, 128);
        
        if (DEBUG) {
            host.println(`Top knob ${knobIndex + 1} -> track3 parameter: ${value}`);
        }
    }
}

function handleMiddleKnobChange(knobIndex, value) {
    const track2 = track2s[currentTrackIndex];
    const track2RemoteControlsPage = track2RemoteControlsPages[currentTrackIndex];
    
    if (!track2RemoteControlsPage || !track2 || !track2.exists().get()) {
        return;
    }
    
    const parameter = track2RemoteControlsPage.getParameter(knobIndex);
    if (parameter.exists().get()) {
        parameter.set(value, 128);
        
        if (DEBUG) {
            host.println(`Middle knob ${knobIndex + 1} -> track2 parameter: ${value}`);
        }
    }
}

function handleBottomKnobChange(knobIndex, value) {
    const track1 = track1s[currentTrackIndex];
    const track1RemoteControlsPage = track1RemoteControlsPages[currentTrackIndex];
    
    if (!track1RemoteControlsPage || !track1 || !track1.exists().get()) {
        return;
    }
    
    const parameter = track1RemoteControlsPage.getParameter(knobIndex);
    if (parameter.exists().get()) {
        parameter.set(value, 128);
        
        if (DEBUG) {
            host.println(`Bottom knob ${knobIndex + 1} -> track1 parameter: ${value}`);
        }
    }
}

function handleButtonParameterToggle(buttonIndex, remoteControlsPage, trackType) {
    const now = Date.now();
    const buttonKey = `${trackType}_${buttonIndex}`;
    
    if (lastButtonPress[buttonKey] && (now - lastButtonPress[buttonKey]) < BUTTON_DEBOUNCE_MS) {
        if (DEBUG) {
            host.println(`${trackType} button ${buttonIndex + 1} -> Debounced (too fast)`);
        }
        return;
    }
    lastButtonPress[buttonKey] = now;
    
    const parameter = remoteControlsPage.getParameter(buttonIndex);
    if (parameter.exists().get()) {
        const currentValue = parameter.value().get();
        const newValue = currentValue > 0 ? 0 : 127;
        parameter.value().set(newValue, 128);
        
        if (DEBUG) {
            host.println(`${trackType} button ${buttonIndex + 1} -> parameter page 1: ${currentValue} -> ${newValue}`);
        }
    } else {
        if (DEBUG) {
            host.println(`${trackType} button ${buttonIndex + 1} -> Parameter ${buttonIndex} does not exist`);
        }
    }
}

function handleTopButtonParameterToggle(buttonIndex) {
    const track2 = track2s[currentTrackIndex];
    const track2RemoteControlsPage1 = track2RemoteControlsPages1[currentTrackIndex];
    
    if (!track2RemoteControlsPage1 || !track2 || !track2.exists().get()) {
        if (DEBUG) {
            host.println(`Top button ${buttonIndex + 1} -> No group navigation setup`);
        }
        return;
    }
    
    handleButtonParameterToggle(buttonIndex, track2RemoteControlsPage1, "Top");
}

function handleBottomButtonParameterToggle(buttonIndex) {
    const track1 = track1s[currentTrackIndex];
    const track1RemoteControlsPage1 = track1RemoteControlsPages1[currentTrackIndex];
    
    if (!track1RemoteControlsPage1 || !track1 || !track1.exists().get()) {
        if (DEBUG) {
            host.println(`Bottom button ${buttonIndex + 1} -> No group navigation setup`);
        }
        return;
    }
    
    handleButtonParameterToggle(buttonIndex, track1RemoteControlsPage1, "Bottom");
}

function handleDirectionalButtonToggle(buttonIndex) {
    const mainGroupRemoteControlsPage = mainGroupRemoteControlsPages[currentTrackIndex];
    
    if (!mainGroupRemoteControlsPage) {
        if (DEBUG) {
            host.println(`Directional button ${buttonIndex + 1} -> No main group remote controls page`);
        }
        return;
    }
    
    const now = Date.now();
    const buttonKey = `directional_${buttonIndex}`;
    
    if (lastButtonPress[buttonKey] && (now - lastButtonPress[buttonKey]) < BUTTON_DEBOUNCE_MS) {
        if (DEBUG) {
            host.println(`Directional button ${buttonIndex + 1} -> Debounced (too fast)`);
        }
        return;
    }
    lastButtonPress[buttonKey] = now;
    
    const parameter = mainGroupRemoteControlsPage.getParameter(buttonIndex);
    if (parameter.exists().get()) {
        const currentValue = parameter.value().get();
        const newValue = currentValue > 0 ? 0 : 127;
        parameter.value().set(newValue, 128);
        
        const buttonNames = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        if (DEBUG) {
            host.println(`Directional button ${buttonNames[buttonIndex]} -> Main group parameter ${buttonIndex}: ${currentValue} -> ${newValue}`);
        }
    } else {
        if (DEBUG) {
            host.println(`Directional button ${buttonIndex + 1} -> Parameter ${buttonIndex} does not exist`);
        }
    }
}

// --- Callbacks ---
function flush() {
    // Called periodically - observers now handle LED updates automatically
}

function exit() {
    host.println("==========================================");
    host.println("LCXL 3-Layer Controller Shutting Down...");
    host.println("==========================================");
    
    // Turn off all LEDs
    sendSysexLedCommand(43, LED_COLOR.OFF); // REC ARM LED
    
    // Turn off all knob LEDs
    const rows = ['T', 'M', 'B'];
    for (const row of rows) {
        for (let i = 0; i < 8; i++) {
            sendLedUpdateKnob(row, i, LED_COLOR.OFF);
        }
    }
    
    // Turn off all button LEDs
    const allButtons = [
        NOTE.BTN_T1, NOTE.BTN_T2, NOTE.BTN_T3, NOTE.BTN_T4, 
        NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8,
        NOTE.BTN_B1, NOTE.BTN_B2, NOTE.BTN_B3, NOTE.BTN_B4, 
        NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8
    ];
    
    for (const button of allButtons) {
        sendLedUpdate(button, LED_COLOR.OFF);
    }
    
    // Turn off directional button LEDs using SysEx
    const directionalButtonLedIndices = [44, 45, 46, 47]; // Up, Down, Left, Right
    for (const ledIndex of directionalButtonLedIndices) {
        sendSysexLedCommand(ledIndex, LED_COLOR.OFF);
    }
    
    host.println("✓ LEDs turned off");
    host.println("✓ Controller shut down successfully");
    host.println("Thank you for using LCXL 3-Layer!");
} 