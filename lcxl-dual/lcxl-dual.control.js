loadAPI(24);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "LaunchControlXL Dual",
    "0.1",
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "Zsolt"
);
host.defineMidiPorts(1, 1);

const TARGET_MIDI_CHANNEL = 5; // MIDI Channel 6 (User Mode 6)
const DEBUG = true;
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
    // Faders
    SLIDER1: 77, SLIDER2: 78, SLIDER3: 79, SLIDER4: 80,
    SLIDER5: 81, SLIDER6: 82, SLIDER7: 83, SLIDER8: 84,
    // Send Select Buttons (for instrument selector)
    SEND_SELECT_1: 104, // Up button
    SEND_SELECT_2: 105, // Down button
    // Track Select Buttons (MUTE/SOLO)
    TRACK_SELECT_1: 106, // Left button (MUTE)
    TRACK_SELECT_2: 107, // Right button (SOLO)
};

const NOTE = {
    // Top Row Buttons
    BTN_T1: 41, BTN_T2: 42, BTN_T3: 43, BTN_T4: 44,
    BTN_T5: 57, BTN_T6: 58, BTN_T7: 59, BTN_T8: 60,
    // Bottom Row Buttons
    BTN_B1: 73, BTN_B2: 74, BTN_B3: 75, BTN_B4: 76,
    BTN_B5: 89, BTN_B6: 90, BTN_B7: 91, BTN_B8: 92,
    // Control Buttons
    MUTE: 106, // 6A
    SOLO: 107, // 6B
    REC_ARM: 108, // 6C
    DEVICE: 105, // 69
};

const LED_COLOR = {
    OFF: 0x0C,
    RED_LOW: 0x0D,
    RED_FULL: 0x0F,
    AMBER_LOW: 0x1D,
    AMBER_MED: 0x2E,
    AMBER_FULL: 0x3F,
    GREEN_LOW: 0x1C,
    GREEN_MED: 0x2C,
    GREEN_FULL: 0x3C,
};

// Globals
let midiIn, midiOut;
let trackBank, currentTrack, childTrackBank;
let currentTrackIndex = DEFAULT_TRACK_INDEX;
let currentTrackRemoteControls, currentTrackRemotePage1;
let isGroupTrack = false;

// Child track 1 controls
let childTrack1, childTrack1RemotePage0, childTrack1RemotePage1;
let childTrack1PrimaryDevice, childTrack1PrimaryDevicePage0, childTrack1PrimaryDevicePage1;

// Child track 2 controls
let childTrack2, childTrack2RemotePage0, childTrack2RemotePage1;
let childTrack2PrimaryDevice, childTrack2PrimaryDevicePage0, childTrack2PrimaryDevicePage1;

// Instrument selector controls
let childTrack1ChainSelector, childTrack1LayerBank;
let childTrack2ChainSelector, childTrack2LayerBank;
let isInstrumentSelectorMode1 = false;
let isInstrumentSelectorMode2 = false;

function init() {
    if (DEBUG) host.println("LaunchControlXL Dual - Initializing...");
    
    // Initialize MIDI
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);
    
    // Setup track bank
    trackBank = host.createTrackBank(8, 0, 0, false);
    currentTrack = trackBank.getItemAt(currentTrackIndex);
    
    // Setup current track remote controls (top row knobs -> page 0)
    currentTrackRemoteControls = currentTrack.createCursorRemoteControlsPage("TopKnobs", 8, null);
    currentTrackRemoteControls.selectedPageIndex().set(0);
    
    // Setup current track remote controls page 1 (MUTE/SOLO buttons)
    currentTrackRemotePage1 = currentTrack.createCursorRemoteControlsPage("MuteSolo", 8, null);
    currentTrackRemotePage1.selectedPageIndex().set(1);
    
    // Setup child track bank to detect if this is a group track
    childTrackBank = currentTrack.createTrackBank(9, 0, 0, false);
    
    // Setup child track 1 controls
    childTrack1 = childTrackBank.getItemAt(0);
    // Track-level remote controls (middle row knobs page 0, faders page 1)
    childTrack1RemotePage0 = childTrack1.createCursorRemoteControlsPage("Child1Page0", 8, null);
    childTrack1RemotePage0.selectedPageIndex().set(0);
    childTrack1RemotePage1 = childTrack1.createCursorRemoteControlsPage("Child1Page1", 8, null);
    childTrack1RemotePage1.selectedPageIndex().set(1);
    // Primary device remote controls (bottom row knobs page 0, buttons page 1)
    childTrack1PrimaryDevice = childTrack1.createCursorDevice("Primary");
    childTrack1PrimaryDevicePage0 = childTrack1PrimaryDevice.createCursorRemoteControlsPage("Child1PrimaryPage0", 8, null);
    childTrack1PrimaryDevicePage0.selectedPageIndex().set(0);
    childTrack1PrimaryDevicePage1 = childTrack1PrimaryDevice.createCursorRemoteControlsPage("Child1PrimaryPage1", 8, null);
    childTrack1PrimaryDevicePage1.selectedPageIndex().set(1);
    
    // Setup child track 2 controls
    childTrack2 = childTrackBank.getItemAt(1);
    // Track-level remote controls (middle row knobs page 0, faders page 1)
    childTrack2RemotePage0 = childTrack2.createCursorRemoteControlsPage("Child2Page0", 8, null);
    childTrack2RemotePage0.selectedPageIndex().set(0);
    childTrack2RemotePage1 = childTrack2.createCursorRemoteControlsPage("Child2Page1", 8, null);
    childTrack2RemotePage1.selectedPageIndex().set(1);
    // Primary device remote controls (bottom row knobs page 0, buttons page 1)
    childTrack2PrimaryDevice = childTrack2.createCursorDevice("Primary");
    childTrack2PrimaryDevicePage0 = childTrack2PrimaryDevice.createCursorRemoteControlsPage("Child2PrimaryPage0", 8, null);
    childTrack2PrimaryDevicePage0.selectedPageIndex().set(0);
    childTrack2PrimaryDevicePage1 = childTrack2PrimaryDevice.createCursorRemoteControlsPage("Child2PrimaryPage1", 8, null);
    childTrack2PrimaryDevicePage1.selectedPageIndex().set(1);
    
    // Setup instrument selector controls
    // Child track 1 instrument selector
    childTrack1ChainSelector = childTrack1PrimaryDevice.createChainSelector();
    childTrack1LayerBank = childTrack1PrimaryDevice.createLayerBank(8);
    
    // Child track 2 instrument selector
    childTrack2ChainSelector = childTrack2PrimaryDevice.createChainSelector();
    childTrack2LayerBank = childTrack2PrimaryDevice.createLayerBank(8);
    
    // Setup observers
    setupObservers();
    
    // Initialize all LEDs
    if (DEBUG) host.println("LaunchControlXL Dual - Initializing LEDs...");
    
    // Debug child track states during initialization
    if (DEBUG) {
        host.println(`Init: isGroupTrack = ${isGroupTrack}`);
        host.println(`Init: childTrack1.exists() = ${childTrack1.exists().get()}`);
        host.println(`Init: childTrack2.exists() = ${childTrack2.exists().get()}`);
        
        // Check if child track 2 parameters exist
        for (let i = 0; i < 4; i++) {
            const param = childTrack2RemotePage0.getParameter(i);
            host.println(`Init: childTrack2RemotePage0.getParameter(${i}).exists() = ${param.exists().get()}`);
        }
    }
    
    // Force initial LED state updates
    updateGroupTrackStatus(); // This will trigger all LED updates
    
    // Also explicitly call all LED update functions to ensure proper initialization
    updateTopKnobLeds();
    updateMuteSoloRecArmDeviceLeds();
    updateChildTrack1MiddleKnobLeds();
    updateChildTrack1BottomKnobLeds();
    updateChildTrack1ButtonLeds();
    updateChildTrack2MiddleKnobLeds();
    updateChildTrack2BottomKnobLeds();
    updateChildTrack2ButtonLeds();
    
    // Add a delayed initialization to ensure all tracks are ready
    host.scheduleTask(() => {
        if (DEBUG) host.println("LaunchControlXL Dual - Delayed LED initialization...");
        updateGroupTrackStatus();
        updateTopKnobLeds();
        updateMuteSoloRecArmDeviceLeds();
        updateChildTrack1MiddleKnobLeds();
        updateChildTrack1BottomKnobLeds();
        updateChildTrack1ButtonLeds();
        updateChildTrack2MiddleKnobLeds();
        updateChildTrack2BottomKnobLeds();
        updateChildTrack2ButtonLeds();
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
        if (DEBUG) host.println("LaunchControlXL Dual - Delayed LED initialization complete");
    }, 100); // 100ms delay
    
    if (DEBUG) host.println("LaunchControlXL Dual - Initialized successfully!");
}

function setupObservers() {
    // Track observers
    currentTrack.name().markInterested();
    currentTrack.exists().markInterested();
    
    // Child track observers for group detection
    const child1 = childTrackBank.getItemAt(0);
    const child2 = childTrackBank.getItemAt(1);
    
    child1.exists().markInterested();
    child2.exists().markInterested();
    child1.name().markInterested();
    child2.name().markInterested();
    
    // Observer to detect group track status
    child1.exists().addValueObserver((exists) => {
        updateGroupTrackStatus();
    });
    child2.exists().addValueObserver((exists) => {
        updateGroupTrackStatus();
    });
    
    // Remote controls observers
    for (let i = 0; i < 8; i++) {
        const param = currentTrackRemoteControls.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateTopKnobLeds());
        param.value().addValueObserver(() => updateTopKnobLeds());
    }
    
    // Keep page fixed at 0
    currentTrackRemoteControls.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) currentTrackRemoteControls.selectedPageIndex().set(0);
    });
    
    // Group track page 1 observers (MUTE/SOLO/REC ARM/DEVICE buttons)
    const muteParam = currentTrackRemotePage1.getParameter(0);
    const soloParam = currentTrackRemotePage1.getParameter(1);
    const recArmParam = currentTrackRemotePage1.getParameter(2);
    const deviceParam = currentTrackRemotePage1.getParameter(3);
    
    muteParam.exists().markInterested();
    muteParam.value().markInterested();
    soloParam.exists().markInterested();
    soloParam.value().markInterested();
    recArmParam.exists().markInterested();
    recArmParam.value().markInterested();
    deviceParam.exists().markInterested();
    deviceParam.value().markInterested();
    
    muteParam.exists().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    muteParam.value().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    soloParam.exists().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    soloParam.value().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    recArmParam.exists().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    recArmParam.value().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    deviceParam.exists().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    deviceParam.value().addValueObserver(() => updateMuteSoloRecArmDeviceLeds());
    
    // Keep page 1 fixed at 1
    currentTrackRemotePage1.selectedPageIndex().addValueObserver((index) => {
        if (index !== 1) currentTrackRemotePage1.selectedPageIndex().set(1);
    });
    
    // Child track 1 observers (for group tracks)
    childTrack1.exists().markInterested();
    childTrack1.name().markInterested();
    
    // Child track 1 page 0 parameters (middle row knobs first 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack1RemotePage0.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack1MiddleKnobLeds());
        param.value().addValueObserver(() => updateChildTrack1MiddleKnobLeds());
    }
    
    // Child track 1 page 1 parameters (faders first 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack1RemotePage1.getParameter(i);
        param.exists().markInterested();
        // Faders don't have LEDs, so no LED observer needed
    }
    
    // Child track 1 primary device page 0 parameters (bottom row knobs first 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack1PrimaryDevicePage0.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack1BottomKnobLeds());
        param.value().addValueObserver(() => updateChildTrack1BottomKnobLeds());
    }
    
    // Child track 1 primary device page 1 parameters (buttons - 8 total: 4 top + 4 bottom)
    for (let i = 0; i < 8; i++) {
        const param = childTrack1PrimaryDevicePage1.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack1ButtonLeds());
        param.value().addValueObserver(() => updateChildTrack1ButtonLeds());
    }
    
    // Child track 2 observers (for group tracks)
    childTrack2.exists().markInterested();
    childTrack2.name().markInterested();
    
    // Child track 2 page 0 parameters (middle row knobs last 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack2RemotePage0.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack2MiddleKnobLeds());
        param.value().addValueObserver(() => updateChildTrack2MiddleKnobLeds());
    }
    
    // Child track 2 page 1 parameters (faders last 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack2RemotePage1.getParameter(i);
        param.exists().markInterested();
        // Faders don't have LEDs, so no LED observer needed
    }
    
    // Child track 2 primary device page 0 parameters (bottom row knobs last 4)
    for (let i = 0; i < 4; i++) {
        const param = childTrack2PrimaryDevicePage0.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack2BottomKnobLeds());
        param.value().addValueObserver(() => updateChildTrack2BottomKnobLeds());
    }
    
    // Child track 2 primary device page 1 parameters (buttons - 8 total: 4 top + 4 bottom)
    for (let i = 0; i < 8; i++) {
        const param = childTrack2PrimaryDevicePage1.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested();
        param.exists().addValueObserver(() => updateChildTrack2ButtonLeds());
        param.value().addValueObserver(() => updateChildTrack2ButtonLeds());
    }
    
    // Keep child track 1 pages fixed
    childTrack1RemotePage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) childTrack1RemotePage0.selectedPageIndex().set(0);
    });
    childTrack1RemotePage1.selectedPageIndex().addValueObserver((index) => {
        if (index !== 1) childTrack1RemotePage1.selectedPageIndex().set(1);
    });
    childTrack1PrimaryDevicePage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) childTrack1PrimaryDevicePage0.selectedPageIndex().set(0);
    });
    childTrack1PrimaryDevicePage1.selectedPageIndex().addValueObserver((index) => {
        if (index !== 1) childTrack1PrimaryDevicePage1.selectedPageIndex().set(1);
    });
    
    // Keep child track 2 pages fixed
    childTrack2RemotePage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) childTrack2RemotePage0.selectedPageIndex().set(0);
    });
    childTrack2RemotePage1.selectedPageIndex().addValueObserver((index) => {
        if (index !== 1) childTrack2RemotePage1.selectedPageIndex().set(1);
    });
    childTrack2PrimaryDevicePage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) childTrack2PrimaryDevicePage0.selectedPageIndex().set(0);
    });
    childTrack2PrimaryDevicePage1.selectedPageIndex().addValueObserver((index) => {
        if (index !== 1) childTrack2PrimaryDevicePage1.selectedPageIndex().set(1);
    });
    
    // Setup instrument selector observers
    // Child track 1 instrument selector observers
    childTrack1ChainSelector.exists().markInterested();
    childTrack1ChainSelector.activeChainIndex().markInterested();
    childTrack1ChainSelector.chainCount().markInterested();
    
    childTrack1ChainSelector.exists().addValueObserver((exists) => {
        if (DEBUG) host.println(`Child track 1 chain selector exists: ${exists}`);
        updateInstrumentSelectorLeds();
    });
    
    childTrack1ChainSelector.activeChainIndex().addValueObserver((index) => {
        if (DEBUG) host.println(`Child track 1 active chain index: ${index}`);
        updateInstrumentSelectorLeds();
    });
    
    childTrack1ChainSelector.chainCount().addValueObserver((count) => {
        if (DEBUG) host.println(`Child track 1 chain count: ${count}`);
        updateInstrumentSelectorLeds();
    });
    
    // Child track 2 instrument selector observers
    childTrack2ChainSelector.exists().markInterested();
    childTrack2ChainSelector.activeChainIndex().markInterested();
    childTrack2ChainSelector.chainCount().markInterested();
    
    childTrack2ChainSelector.exists().addValueObserver((exists) => {
        if (DEBUG) host.println(`Child track 2 chain selector exists: ${exists}`);
        updateInstrumentSelectorLeds();
    });
    
    childTrack2ChainSelector.activeChainIndex().addValueObserver((index) => {
        if (DEBUG) host.println(`Child track 2 active chain index: ${index}`);
        updateInstrumentSelectorLeds();
    });
    
    childTrack2ChainSelector.chainCount().addValueObserver((count) => {
        if (DEBUG) host.println(`Child track 2 chain count: ${count}`);
        updateInstrumentSelectorLeds();
    });
    
    // Setup layer bank observers for instrument selector
    for (let i = 0; i < 8; i++) {
        const layer1 = childTrack1LayerBank.getItemAt(i);
        layer1.exists().markInterested();
        layer1.name().markInterested();
        layer1.exists().addValueObserver(() => updateInstrumentSelectorLeds());
        
        const layer2 = childTrack2LayerBank.getItemAt(i);
        layer2.exists().markInterested();
        layer2.name().markInterested();
        layer2.exists().addValueObserver(() => updateInstrumentSelectorLeds());
    }
}

function updateGroupTrackStatus() {
    const child1 = childTrackBank.getItemAt(0);
    const child2 = childTrackBank.getItemAt(1);
    
    const newIsGroupTrack = child1.exists().get();
    
    if (newIsGroupTrack !== isGroupTrack) {
        isGroupTrack = newIsGroupTrack;
        if (DEBUG) {
            host.println(`Track "${currentTrack.name().get()}" is ${isGroupTrack ? 'GROUP' : 'REGULAR'} track`);
            if (isGroupTrack) {
                host.println(`  Child 1: ${child1.name().get()} (exists: ${child1.exists().get()})`);
                host.println(`  Child 2: ${child2.name().get()} (exists: ${child2.exists().get()})`);
            }
        }
        updateTopKnobLeds();
        updateMuteSoloRecArmDeviceLeds();
        updateChildTrack1MiddleKnobLeds();
        updateChildTrack1BottomKnobLeds();
        updateChildTrack1ButtonLeds();
        updateChildTrack2MiddleKnobLeds();
        updateChildTrack2BottomKnobLeds();
        updateChildTrack2ButtonLeds();
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
    }
}

// Instrument selector mode functions
function enterInstrumentSelectorMode1() {
    if (isGroupTrack && childTrack1ChainSelector.exists().get()) {
        isInstrumentSelectorMode1 = true;
        
        if (DEBUG) {
            host.println(`Entering instrument selector mode 1 - chains: ${childTrack1ChainSelector.chainCount().get()}`);
        }
        
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
        return true;
    }
    return false;
}

function enterInstrumentSelectorMode2() {
    if (isGroupTrack && childTrack2ChainSelector.exists().get()) {
        isInstrumentSelectorMode2 = true;
        
        if (DEBUG) {
            host.println(`Entering instrument selector mode 2 - chains: ${childTrack2ChainSelector.chainCount().get()}`);
        }
        
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
        return true;
    }
    return false;
}

function exitInstrumentSelectorMode1() {
    if (isInstrumentSelectorMode1) {
        isInstrumentSelectorMode1 = false;
        
        if (DEBUG) {
            host.println("Exiting instrument selector mode 1");
        }
        
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
        return true;
    }
    return false;
}

function exitInstrumentSelectorMode2() {
    if (isInstrumentSelectorMode2) {
        isInstrumentSelectorMode2 = false;
        
        if (DEBUG) {
            host.println("Exiting instrument selector mode 2");
        }
        
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
        return true;
    }
    return false;
}

function exitAllInstrumentSelectorModes() {
    const wasInMode = isInstrumentSelectorMode1 || isInstrumentSelectorMode2;
    isInstrumentSelectorMode1 = false;
    isInstrumentSelectorMode2 = false;
    
    if (wasInMode) {
        if (DEBUG) {
            host.println("Exiting all instrument selector modes");
        }
        updateInstrumentSelectorLeds();
        updateSendSelectLeds();
    }
    
    return wasInMode;
}

function isInAnyInstrumentSelectorMode() {
    return isInstrumentSelectorMode1 || isInstrumentSelectorMode2;
}

function selectInstrument(trackIndex, chainIndex) {
    if (trackIndex === 1 && isInstrumentSelectorMode1) {
        // Child track 1 instrument selection
        if (childTrack1ChainSelector.exists().get()) {
            const chainCount = childTrack1ChainSelector.chainCount().get();
            
            if (chainIndex < chainCount) {
                childTrack1ChainSelector.activeChainIndex().set(chainIndex);
                
                if (DEBUG) {
                    host.println(`Selected instrument chain ${chainIndex} on child track 1`);
                }
                
                return true;
            }
        }
    } else if (trackIndex === 2 && isInstrumentSelectorMode2) {
        // Child track 2 instrument selection
        if (childTrack2ChainSelector.exists().get()) {
            const chainCount = childTrack2ChainSelector.chainCount().get();
            
            if (chainIndex < chainCount) {
                childTrack2ChainSelector.activeChainIndex().set(chainIndex);
                
                if (DEBUG) {
                    host.println(`Selected instrument chain ${chainIndex} on child track 2`);
                }
                
                return true;
            }
        }
    }
    
    return false;
}

function updateChildTrack1ButtonLeds() {
    // If in instrument selector mode, delegate to instrument selector LED updates
    if (isInAnyInstrumentSelectorMode()) {
        updateInstrumentSelectorLeds();
        return;
    }
    
    updateChildTrack1ButtonLedsNormal();
}

function updateChildTrack1ButtonLedsNormal() {
    if (!isGroupTrack || !childTrack1.exists().get()) {
        // Turn off LEDs for first 4 top row buttons
        for (let i = 0; i < 4; i++) {
            sendButtonLedUpdate(NOTE.BTN_T1 + i, LED_COLOR.OFF);
        }
        // Turn off LEDs for first 4 bottom row buttons
        for (let i = 0; i < 4; i++) {
            sendButtonLedUpdate(NOTE.BTN_B1 + i, LED_COLOR.OFF);
        }
        return;
    }
    
    // Update first 4 top row buttons (parameters 0-3)
    for (let i = 0; i < 4; i++) {
        const param = childTrack1PrimaryDevicePage1.getParameter(i);
        let color = LED_COLOR.OFF;
        if (param.exists().get()) {
            const value = param.value().get();
            color = (value > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
        }
        sendButtonLedUpdate(NOTE.BTN_T1 + i, color);
    }
    
    // Update first 4 bottom row buttons (parameters 4-7)
    for (let i = 0; i < 4; i++) {
        const param = childTrack1PrimaryDevicePage1.getParameter(i + 4);
        let color = LED_COLOR.OFF;
        if (param.exists().get()) {
            const value = param.value().get();
            color = (value > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
        }
        sendButtonLedUpdate(NOTE.BTN_B1 + i, color);
    }
}

function updateChildTrack2MiddleKnobLeds() {
    if (DEBUG) {
        host.println(`updateChildTrack2MiddleKnobLeds: Setting knobs 5-8 middle to GREEN - isGroupTrack=${isGroupTrack}, childTrack2.exists=${childTrack2.exists().get()}`);
    }
    
    if (!isGroupTrack || !childTrack2.exists().get()) {
        if (DEBUG) {
            host.println("Child2 middle: Turning OFF LEDs - not group track or child2 doesn't exist");
        }
        // Turn off LEDs for last 4 middle row knobs
        for (let i = 4; i < 8; i++) {
            sendKnobLedUpdate(8 + i, LED_COLOR.OFF); // Middle row indices 12-15
        }
        return;
    }
    
    for (let i = 0; i < 4; i++) {
        const param = childTrack2RemotePage0.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.GREEN_FULL : LED_COLOR.OFF;
        const ledIndex = 8 + i + 4;
        if (DEBUG) {
            host.println(`Child2 middle knob ${i}: param.exists=${param.exists().get()}, color=${color.toString(16)}, ledIndex=${ledIndex}`);
        }
        sendKnobLedUpdate(ledIndex, color); // Middle row indices 12-15
    }
}

function updateChildTrack2BottomKnobLeds() {
    if (DEBUG) {
        host.println(`updateChildTrack2BottomKnobLeds: Setting knobs 5-8 bottom to GREEN_MED - isGroupTrack=${isGroupTrack}, childTrack2.exists=${childTrack2.exists().get()}`);
    }
    
    if (!isGroupTrack || !childTrack2.exists().get()) {
        if (DEBUG) {
            host.println("Child2 bottom: Turning OFF LEDs - not group track or child2 doesn't exist");
        }
        // Turn off LEDs for last 4 bottom row knobs
        for (let i = 4; i < 8; i++) {
            sendKnobLedUpdate(16 + i, LED_COLOR.OFF); // Bottom row indices 20-23
        }
        return;
    }
    
    for (let i = 0; i < 4; i++) {
        const param = childTrack2PrimaryDevicePage0.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.GREEN_MED : LED_COLOR.OFF;
        const ledIndex = 16 + i + 4;
        if (DEBUG) {
            host.println(`Child2 bottom knob ${i}: param.exists=${param.exists().get()}, color=${color.toString(16)}, ledIndex=${ledIndex}`);
        }
        sendKnobLedUpdate(ledIndex, color); // Bottom row indices 20-23
    }
}

function updateChildTrack2ButtonLeds() {
    // If in instrument selector mode, delegate to instrument selector LED updates
    if (isInAnyInstrumentSelectorMode()) {
        updateInstrumentSelectorLeds();
        return;
    }
    
    updateChildTrack2ButtonLedsNormal();
}

function updateChildTrack2ButtonLedsNormal() {
    if (!isGroupTrack || !childTrack2.exists().get()) {
        // Turn off LEDs for last 4 top row buttons
        const topButtons = [NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8];
        for (let i = 0; i < 4; i++) {
            sendButtonLedUpdate(topButtons[i], LED_COLOR.OFF);
        }
        // Turn off LEDs for last 4 bottom row buttons
        const bottomButtons = [NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8];
        for (let i = 0; i < 4; i++) {
            sendButtonLedUpdate(bottomButtons[i], LED_COLOR.OFF);
        }
        return;
    }
    
    // Update last 4 top row buttons (parameters 0-3)
    const topButtons = [NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8];
    for (let i = 0; i < 4; i++) {
        const param = childTrack2PrimaryDevicePage1.getParameter(i);
        let color = LED_COLOR.OFF;
        if (param.exists().get()) {
            const value = param.value().get();
            color = (value > 0) ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
        }
        sendButtonLedUpdate(topButtons[i], color);
    }
    
    // Update last 4 bottom row buttons (parameters 4-7)
    const bottomButtons = [NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8];
    for (let i = 0; i < 4; i++) {
        const param = childTrack2PrimaryDevicePage1.getParameter(i + 4);
        let color = LED_COLOR.OFF;
        if (param.exists().get()) {
            const value = param.value().get();
            color = (value > 0) ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
        }
        sendButtonLedUpdate(bottomButtons[i], color);
    }
}

function sendButtonLedUpdate(note, colorVelocity) {
    if (DEBUG && (note === NOTE.MUTE || note === NOTE.SOLO)) {
        host.println(`sendButtonLedUpdate: note=${note}, color=${colorVelocity.toString(16)}, sending MIDI note on channel ${TARGET_MIDI_CHANNEL}`);
    }
    if (!midiOut) return;
    midiOut.sendMidi(0x90 | TARGET_MIDI_CHANNEL, note, colorVelocity);
}

function updateChildTrack1MiddleKnobLeds() {
    if (DEBUG) {
        host.println("updateChildTrack1MiddleKnobLeds: Setting knobs 1-4 middle to AMBER");
    }
    if (!isGroupTrack || !childTrack1.exists().get()) {
        // Turn off LEDs for first 4 middle row knobs
        for (let i = 0; i < 4; i++) {
            sendKnobLedUpdate(8 + i, LED_COLOR.OFF); // Middle row indices 8-11
        }
        return;
    }
    
    for (let i = 0; i < 4; i++) {
        const param = childTrack1RemotePage0.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        sendKnobLedUpdate(8 + i, color); // Middle row indices 8-11
    }
}

function updateChildTrack1BottomKnobLeds() {
    if (DEBUG) {
        host.println("updateChildTrack1BottomKnobLeds: Setting knobs 1-4 bottom to AMBER_MED");
    }
    if (!isGroupTrack || !childTrack1.exists().get()) {
        // Turn off LEDs for first 4 bottom row knobs
        for (let i = 0; i < 4; i++) {
            sendKnobLedUpdate(16 + i, LED_COLOR.OFF); // Bottom row indices 16-19
        }
        return;
    }
    
    for (let i = 0; i < 4; i++) {
        const param = childTrack1PrimaryDevicePage0.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.AMBER_MED : LED_COLOR.OFF;
        sendKnobLedUpdate(16 + i, color); // Bottom row indices 16-19
    }
}

function updateTopKnobLeds() {
    if (DEBUG) {
        host.println("updateTopKnobLeds: Setting all 8 top knobs to RED");
    }
    for (let i = 0; i < 8; i++) {
        const param = currentTrackRemoteControls.getParameter(i);
        const color = param.exists().get() ? LED_COLOR.RED_FULL : LED_COLOR.OFF;
        sendKnobLedUpdate(i, color);
    }
}

function updateMuteSoloRecArmDeviceLeds() {
    if (DEBUG) {
        host.println("updateMuteSoloRecArmDeviceLeds: Updating MUTE/SOLO/REC ARM/DEVICE button LEDs");
    }
    
    // Update MUTE button LED
    const muteParam = currentTrackRemotePage1.getParameter(0);
    let muteColor = LED_COLOR.OFF;
    if (muteParam.exists().get()) {
        const muteValue = muteParam.value().get();
        muteColor = (muteValue > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        if (DEBUG) {
            host.println(`MUTE LED: param.exists=${muteParam.exists().get()}, value=${muteValue}, color=${muteColor.toString(16)}, note=${NOTE.MUTE}`);
        }
    } else {
        if (DEBUG) {
            host.println(`MUTE LED: parameter doesn't exist, turning OFF`);
        }
    }
    sendButtonLedUpdate(NOTE.MUTE, muteColor);
    
    // Update SOLO button LED
    const soloParam = currentTrackRemotePage1.getParameter(1);
    let soloColor = LED_COLOR.OFF;
    if (soloParam.exists().get()) {
        const soloValue = soloParam.value().get();
        soloColor = (soloValue > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        if (DEBUG) {
            host.println(`SOLO LED: param.exists=${soloParam.exists().get()}, value=${soloValue}, color=${soloColor.toString(16)}, note=${NOTE.SOLO}`);
        }
    } else {
        if (DEBUG) {
            host.println(`SOLO LED: parameter doesn't exist, turning OFF`);
        }
    }
    sendButtonLedUpdate(NOTE.SOLO, soloColor);
    
    // Update REC ARM button LED
    const recArmParam = currentTrackRemotePage1.getParameter(2);
    let recArmColor = LED_COLOR.OFF;
    if (recArmParam.exists().get()) {
        const recArmValue = recArmParam.value().get();
        recArmColor = (recArmValue > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        if (DEBUG) {
            host.println(`REC ARM LED: param.exists=${recArmParam.exists().get()}, value=${recArmValue}, color=${recArmColor.toString(16)}, note=${NOTE.REC_ARM}`);
        }
    } else {
        if (DEBUG) {
            host.println(`REC ARM LED: parameter doesn't exist, turning OFF`);
        }
    }
    sendButtonLedUpdate(NOTE.REC_ARM, recArmColor);
    
    // Update DEVICE button LED
    const deviceParam = currentTrackRemotePage1.getParameter(3);
    let deviceColor = LED_COLOR.OFF;
    if (deviceParam.exists().get()) {
        const deviceValue = deviceParam.value().get();
        deviceColor = (deviceValue > 0) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        if (DEBUG) {
            host.println(`DEVICE LED: param.exists=${deviceParam.exists().get()}, value=${deviceValue}, color=${deviceColor.toString(16)}, note=${NOTE.DEVICE}`);
        }
    } else {
        if (DEBUG) {
            host.println(`DEVICE LED: parameter doesn't exist, turning OFF`);
        }
    }
    sendButtonLedUpdate(NOTE.DEVICE, deviceColor);
}

function updateSendSelectLeds() {
    if (DEBUG) {
        host.println("updateSendSelectLeds: Updating SEND_SELECT button LEDs");
    }
    
    // Update SEND_SELECT_1 LED (Up button - sysex index 44)
    let sendSelect1Color = LED_COLOR.OFF;
    if (isInstrumentSelectorMode1) {
        sendSelect1Color = LED_COLOR.AMBER_FULL;
        if (DEBUG) {
            host.println(`SEND_SELECT_1 LED: instrument selector mode 1 active, color=${sendSelect1Color.toString(16)}`);
        }
    }
    sendSysexLedCommand(44, sendSelect1Color);
    
    // Update SEND_SELECT_2 LED (Down button - sysex index 45)
    let sendSelect2Color = LED_COLOR.OFF;
    if (isInstrumentSelectorMode2) {
        sendSelect2Color = LED_COLOR.AMBER_FULL;
        if (DEBUG) {
            host.println(`SEND_SELECT_2 LED: instrument selector mode 2 active, color=${sendSelect2Color.toString(16)}`);
        }
    }
    sendSysexLedCommand(45, sendSelect2Color);
}

function sendKnobLedUpdate(knobIndex, colorVelocity) {
    const sysexIndex = knobIndex;
    if (DEBUG) {
        host.println(`sendKnobLedUpdate: knobIndex=${knobIndex}, sysexIndex=${sysexIndex}, color=${colorVelocity.toString(16)}`);
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

function sendSysexLedCommand(sysexLedIndex, colorVelocity) {
    const templateIndex = 5; // User template 6
    midiOut.sendSysex("F0 00 20 29 02 11 78 " + 
        templateIndex.toString(16).padStart(2, '0') + " " +
        sysexLedIndex.toString(16).padStart(2, '0') + " " +
        colorVelocity.toString(16).padStart(2, '0') + " F7");
}

function updateInstrumentSelectorLeds() {
    if (isInstrumentSelectorMode1) {
        updateInstrumentSelectorMode1Leds();
    } else {
        updateChildTrack1ButtonLedsNormal();
    }
    
    if (isInstrumentSelectorMode2) {
        updateInstrumentSelectorMode2Leds();
    } else {
        updateChildTrack2ButtonLedsNormal();
    }
}

function updateInstrumentSelectorMode1Leds() {
    if (!isInstrumentSelectorMode1 || !childTrack1ChainSelector.exists().get()) {
        return;
    }
    
    const chainCount = childTrack1ChainSelector.chainCount().get();
    const activeChainIndex = childTrack1ChainSelector.activeChainIndex().get();
    
    // Update first 4 top row buttons for child track 1 instrument selector
    for (let i = 0; i < 4; i++) {
        const note = [NOTE.BTN_T1, NOTE.BTN_T2, NOTE.BTN_T3, NOTE.BTN_T4][i];
        
        let color = LED_COLOR.OFF;
        
        if (i < chainCount) {
            // Chain exists
            if (i === activeChainIndex) {
                color = LED_COLOR.RED_FULL; // Active chain
            } else {
                color = LED_COLOR.RED_LOW; // Available chain
            }
        }
        
        sendButtonLedUpdate(note, color);
    }
    
    // Update first 4 bottom row buttons for child track 1 instrument selector
    for (let i = 0; i < 4; i++) {
        const note = [NOTE.BTN_B1, NOTE.BTN_B2, NOTE.BTN_B3, NOTE.BTN_B4][i];
        
        let color = LED_COLOR.OFF;
        
        const chainIndex = i + 4; // Bottom row represents chains 4-7
        if (chainIndex < chainCount) {
            // Chain exists
            if (chainIndex === activeChainIndex) {
                color = LED_COLOR.RED_FULL; // Active chain
            } else {
                color = LED_COLOR.RED_LOW; // Available chain
            }
        }
        
        sendButtonLedUpdate(note, color);
    }
    

    
    if (DEBUG) {
        host.println(`Updated instrument selector mode 1 LEDs - chains: ${chainCount}, active: ${activeChainIndex}`);
    }
}

function updateInstrumentSelectorMode2Leds() {
    if (!isInstrumentSelectorMode2 || !childTrack2ChainSelector.exists().get()) {
        return;
    }
    
    const chainCount = childTrack2ChainSelector.chainCount().get();
    const activeChainIndex = childTrack2ChainSelector.activeChainIndex().get();
    
    // Update last 4 top row buttons for child track 2 instrument selector
    const track2TopButtons = [NOTE.BTN_T5, NOTE.BTN_T6, NOTE.BTN_T7, NOTE.BTN_T8];
    for (let i = 0; i < 4; i++) {
        const note = track2TopButtons[i];
        
        let color = LED_COLOR.OFF;
        
        if (i < chainCount) {
            // Chain exists
            if (i === activeChainIndex) {
                color = LED_COLOR.RED_FULL; // Active chain
            } else {
                color = LED_COLOR.RED_LOW; // Available chain
            }
        }
        
        sendButtonLedUpdate(note, color);
    }
    
    // Update last 4 bottom row buttons for child track 2 instrument selector
    const track2BottomButtons = [NOTE.BTN_B5, NOTE.BTN_B6, NOTE.BTN_B7, NOTE.BTN_B8];
    for (let i = 0; i < 4; i++) {
        const note = track2BottomButtons[i];
        
        let color = LED_COLOR.OFF;
        
        const chainIndex = i + 4; // Bottom row represents chains 4-7
        if (chainIndex < chainCount) {
            // Chain exists
            if (chainIndex === activeChainIndex) {
                color = LED_COLOR.RED_FULL; // Active chain
            } else {
                color = LED_COLOR.RED_LOW; // Available chain
            }
        }
        
        sendButtonLedUpdate(note, color);
    }
    

    
    if (DEBUG) {
        host.println(`Updated instrument selector mode 2 LEDs - chains: ${chainCount}, active: ${activeChainIndex}`);
    }
}

function onMidi(status, data1, data2) {
    if (DEBUG) {
        host.println("MIDI: " + status + " " + data1 + " " + data2);
    }
    
    const msgType = status & 0xF0;
    const channel = status & 0x0F;
    
    if (channel !== TARGET_MIDI_CHANNEL) return;
    
    // Handle Note On messages (buttons)
    if (msgType === 0x90 && data2 > 0) {
        handleNoteOn(data1, data2);
    }
    // Handle CC messages (knobs and faders)
    else if (msgType === 0xB0) {
        handleCC(data1, data2);
    }
}

function handleNoteOn(note, velocity) {
    // Handle instrument selector mode button presses
    if (isInstrumentSelectorMode1) {
        // Only handle child track 1 buttons (first 4 top + first 4 bottom)
        if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T4) {
            const chainIndex = note - NOTE.BTN_T1;
            selectInstrument(1, chainIndex);
            return;
        }
        
        if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B4) {
            const chainIndex = (note - NOTE.BTN_B1) + 4;
            selectInstrument(1, chainIndex);
            return;
        }
        
        // Fall through to handle MUTE/SOLO buttons even in instrument selector mode
    }
    
    if (isInstrumentSelectorMode2) {
        // Only handle child track 2 buttons (last 4 top + last 4 bottom)
        if (note >= NOTE.BTN_T5 && note <= NOTE.BTN_T8) {
            const chainIndex = note - NOTE.BTN_T5;
            selectInstrument(2, chainIndex);
            return;
        }
        
        if (note >= NOTE.BTN_B5 && note <= NOTE.BTN_B8) {
            const chainIndex = (note - NOTE.BTN_B5) + 4;
            selectInstrument(2, chainIndex);
            return;
        }
        
        // Fall through to handle MUTE/SOLO buttons even in instrument selector mode
    }
    
    // Handle first 4 top row buttons (child track 1 primary device page 1 parameters 0-3)
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T4 && isGroupTrack) {
        const buttonIndex = note - NOTE.BTN_T1;
        const param = childTrack1PrimaryDevicePage1.getParameter(buttonIndex);
        
        if (param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Top button ${buttonIndex + 1} -> child track 1 primary device page 1 parameter ${buttonIndex}: ${currentValue} -> ${newValue}`);
            }
        }
        return;
    }
    
    // Handle first 4 bottom row buttons (child track 1 primary device page 1 parameters 4-7)
    if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B4 && isGroupTrack) {
        const buttonIndex = note - NOTE.BTN_B1;
        const paramIndex = buttonIndex + 4; // Parameters 4-7
        const param = childTrack1PrimaryDevicePage1.getParameter(paramIndex);
        
        if (param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Bottom button ${buttonIndex + 1} -> child track 1 primary device page 1 parameter ${paramIndex}: ${currentValue} -> ${newValue}`);
            }
        }
        return;
    }
    
    // Handle last 4 top row buttons (child track 2 primary device page 1 parameters 0-3)
    if (note >= NOTE.BTN_T5 && note <= NOTE.BTN_T8 && isGroupTrack) {
        const buttonIndex = note - NOTE.BTN_T5;
        const param = childTrack2PrimaryDevicePage1.getParameter(buttonIndex);
        
        if (param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Top button ${buttonIndex + 5} -> child track 2 primary device page 1 parameter ${buttonIndex}: ${currentValue} -> ${newValue}`);
            }
        }
        return;
    }
    
    // Handle last 4 bottom row buttons (child track 2 primary device page 1 parameters 4-7)
    if (note >= NOTE.BTN_B5 && note <= NOTE.BTN_B8 && isGroupTrack) {
        const buttonIndex = note - NOTE.BTN_B5;
        const paramIndex = buttonIndex + 4; // Parameters 4-7
        const param = childTrack2PrimaryDevicePage1.getParameter(paramIndex);
        
        if (param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Bottom button ${buttonIndex + 5} -> child track 2 primary device page 1 parameter ${paramIndex}: ${currentValue} -> ${newValue}`);
            }
        }
        return;
    }
    
    // Handle MUTE button
    if (note === NOTE.MUTE) {
        if (DEBUG) {
            host.println(`MUTE button pressed - note=${note}, NOTE.MUTE=${NOTE.MUTE}`);
        }
        const muteParam = currentTrackRemotePage1.getParameter(0);
        if (muteParam.exists().get()) {
            const currentValue = muteParam.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            muteParam.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`MUTE button -> group track page 1 parameter 0: ${currentValue} -> ${newValue}`);
            }
        } else {
            if (DEBUG) {
                host.println(`MUTE button pressed but parameter doesn't exist`);
            }
        }
        return;
    }
    
    // Handle SOLO button
    if (note === NOTE.SOLO) {
        if (DEBUG) {
            host.println(`SOLO button pressed - note=${note}, NOTE.SOLO=${NOTE.SOLO}`);
        }
        const soloParam = currentTrackRemotePage1.getParameter(1);
        if (soloParam.exists().get()) {
            const currentValue = soloParam.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            soloParam.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`SOLO button -> group track page 1 parameter 1: ${currentValue} -> ${newValue}`);
            }
        } else {
            if (DEBUG) {
                host.println(`SOLO button pressed but parameter doesn't exist`);
            }
        }
        return;
    }
    
    // Handle REC ARM button
    if (note === NOTE.REC_ARM) {
        if (DEBUG) {
            host.println(`REC ARM button pressed - note=${note}, NOTE.REC_ARM=${NOTE.REC_ARM}`);
        }
        const recArmParam = currentTrackRemotePage1.getParameter(2);
        if (recArmParam.exists().get()) {
            const currentValue = recArmParam.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            recArmParam.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`REC ARM button -> group track page 1 parameter 2: ${currentValue} -> ${newValue}`);
            }
        } else {
            if (DEBUG) {
                host.println(`REC ARM button pressed but parameter doesn't exist`);
            }
        }
        return;
    }
    
    // Handle DEVICE button
    if (note === NOTE.DEVICE) {
        if (DEBUG) {
            host.println(`DEVICE button pressed - note=${note}, NOTE.DEVICE=${NOTE.DEVICE}`);
        }
        const deviceParam = currentTrackRemotePage1.getParameter(3);
        if (deviceParam.exists().get()) {
            const currentValue = deviceParam.value().get();
            const newValue = currentValue > 0 ? 0 : 127;
            deviceParam.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`DEVICE button -> group track page 1 parameter 3: ${currentValue} -> ${newValue}`);
            }
        } else {
            if (DEBUG) {
                host.println(`DEVICE button pressed but parameter doesn't exist`);
            }
        }
        return;
    }
}

function handleCC(cc, value) {
    // Handle send select buttons (CC messages with value > 0 for button press)
    if (cc === CC.SEND_SELECT_1 && value > 0) {
        if (isInstrumentSelectorMode1) {
            // Exit instrument selector mode 1
            exitInstrumentSelectorMode1();
        } else {
            // Try to enter instrument selector mode 1
            if (!enterInstrumentSelectorMode1()) {
                if (DEBUG) {
                    host.println("Cannot enter instrument selector mode 1 - no instrument selector on child track 1");
                }
            }
        }
        return;
    }
    
    if (cc === CC.SEND_SELECT_2 && value > 0) {
        if (isInstrumentSelectorMode2) {
            // Exit instrument selector mode 2
            exitInstrumentSelectorMode2();
        } else {
            // Try to enter instrument selector mode 2
            if (!enterInstrumentSelectorMode2()) {
                if (DEBUG) {
                    host.println("Cannot enter instrument selector mode 2 - no instrument selector on child track 2");
                }
            }
        }
        return;
    }
    
    // Handle top row knobs (always active)
    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) {
        const knobIndex = cc - CC.KNOB_T1;
        const param = currentTrackRemoteControls.getParameter(knobIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Top knob ${knobIndex + 1} -> current track page 0 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle middle row knobs (first 4 for child track 1 in group tracks)
    if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M4 && isGroupTrack) {
        const knobIndex = cc - CC.KNOB_M1;
        const param = childTrack1RemotePage0.getParameter(knobIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Middle knob ${knobIndex + 1} -> child track 1 page 0 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle faders (first 4 for child track 1 in group tracks)
    if (cc >= CC.SLIDER1 && cc <= CC.SLIDER4 && isGroupTrack) {
        const faderIndex = cc - CC.SLIDER1;
        const param = childTrack1RemotePage1.getParameter(faderIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Fader ${faderIndex + 1} -> child track 1 page 1 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle bottom row knobs (first 4 for child track 1 primary device in group tracks)
    if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B4 && isGroupTrack) {
        const knobIndex = cc - CC.KNOB_B1;
        const param = childTrack1PrimaryDevicePage0.getParameter(knobIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Bottom knob ${knobIndex + 1} -> child track 1 primary device page 0 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle middle row knobs (last 4 for child track 2 in group tracks)
    if (cc >= CC.KNOB_M5 && cc <= CC.KNOB_M8 && isGroupTrack) {
        const knobIndex = cc - CC.KNOB_M5;
        const param = childTrack2RemotePage0.getParameter(knobIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Middle knob ${knobIndex + 5} -> child track 2 page 0 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle faders (last 4 for child track 2 in group tracks)
    if (cc >= CC.SLIDER5 && cc <= CC.SLIDER8 && isGroupTrack) {
        const faderIndex = cc - CC.SLIDER5;
        const param = childTrack2RemotePage1.getParameter(faderIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Fader ${faderIndex + 5} -> child track 2 page 1 parameter: ${value}`);
            }
        }
        return;
    }
    
    // Handle bottom row knobs (last 4 for child track 2 primary device in group tracks)
    if (cc >= CC.KNOB_B5 && cc <= CC.KNOB_B8 && isGroupTrack) {
        const knobIndex = cc - CC.KNOB_B5;
        const param = childTrack2PrimaryDevicePage0.getParameter(knobIndex);
        
        if (param.exists().get()) {
            param.set(value, 128);
            if (DEBUG) {
                host.println(`Bottom knob ${knobIndex + 5} -> child track 2 primary device page 0 parameter: ${value}`);
            }
        }
        return;
    }
}

function flush() {
    // Called periodically to update LEDs
}

function exit() {
    if (DEBUG) host.println("LaunchControlXL Dual - Exiting...");
} 