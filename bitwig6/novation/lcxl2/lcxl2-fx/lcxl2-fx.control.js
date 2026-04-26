loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "Launch Control XL 2 FX",
    "0.1",
    "b2c3d4e5-f6a7-8901-bcde-f23456789123",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

const USER_CHANNEL = 5; // User 6 (0-indexed)

// MIDI CC Mappings for last 3 columns (6, 7, 8)
const CONTROL = {
    FADERS: [82, 83, 84],
    KNOBS_TOP: [18, 19, 20],
    KNOBS_MID: [34, 35, 36],
    KNOBS_BOT: [54, 55, 56],
    PERF_KNOBS: [13, 14, 15, 16, 17], // Top row knobs 1-5
    PERF_KNOBS_MID: [29, 30, 31, 32, 33], // Middle row knobs 1-5
    PERF_KNOBS_BOT: [49, 50, 51, 52, 53], // Bottom row knobs 1-5
    PERF_FADERS: [77, 78, 79, 80, 81] // First 5 faders
};

// Button CCs for Chain Selection
const CHAIN_BUTTONS = [
    // FX Track 1 (Green) - Cols 1-2
    { trackIndex: 0, chainIndex: 0, cc: 41 }, // Top 1
    { trackIndex: 0, chainIndex: 1, cc: 42 }, // Top 2
    { trackIndex: 0, chainIndex: 2, cc: 73 }, // Bot 1
    { trackIndex: 0, chainIndex: 3, cc: 74 }, // Bot 2
    
    // FX Track 2 (Orange) - Cols 3-4
    { trackIndex: 1, chainIndex: 0, cc: 43 }, // Top 3
    { trackIndex: 1, chainIndex: 1, cc: 44 }, // Top 4
    { trackIndex: 1, chainIndex: 2, cc: 75 }, // Bot 3
    { trackIndex: 1, chainIndex: 3, cc: 76 }, // Bot 4
    
    // FX Track 3 (Amber) - Cols 5-6
    { trackIndex: 2, chainIndex: 0, cc: 57 }, // Top 5
    { trackIndex: 2, chainIndex: 1, cc: 58 }, // Top 6
    { trackIndex: 2, chainIndex: 2, cc: 89 }, // Bot 5
    { trackIndex: 2, chainIndex: 3, cc: 90 }, // Bot 6

    // Last FX Track (Red) - Cols 7-8
    { trackIndex: 3, chainIndex: 0, cc: 59 }, // Top 7
    { trackIndex: 3, chainIndex: 1, cc: 60 }, // Top 8
    { trackIndex: 3, chainIndex: 2, cc: 91 }, // Bot 7
    { trackIndex: 3, chainIndex: 3, cc: 92 }, // Bot 8
];

// LED Colors (Novation LCXL)
const LED = {
    OFF: 12,
    RED_LOW: 13,
    RED_HIGH: 15,
    GREEN_LOW: 28,
    GREEN_HIGH: 60,
    ORANGE_LOW: 30,  // Red 2, Green 1
    ORANGE_HIGH: 47, // Red 3, Green 2
    AMBER_LOW: 29,   // Red 1, Green 1
    AMBER_HIGH: 63   // Red 3, Green 3
};

const REDO_BUTTON_CC = 0x6B; // Solo button
const REDO_BUTTON_NOTE = 0x2A; // Solo LED
const UNDO_BUTTON_CC = 0x6C; // Rec Arm button
const UNDO_BUTTON_NOTE = 0x2B; // Rec Arm LED

let midiOut;
let application;
let effectTrackBank;
let fx1PerfPage;
let fx2PerfPage;
let fx3PerfPage;
let lastFXTrackBank;
let lastFXPerfPage;
let projectFadersPage;

// Chain Selection
let fxChainSelectors = []; // Array of ChainSelector
let activeChainIndices = [0, 0, 0, 0]; // [trackIndex] -> current active chain index
let chainCounts = [0, 0, 0, 0];        // [trackIndex] -> number of chains

function init() {
    host.getMidiInPort(0).setMidiCallback(onMidi);
    midiOut = host.getMidiOutPort(0);
    application = host.createApplication();

    const rootTrackGroup = host.getProject().getRootTrackGroup();

    effectTrackBank = rootTrackGroup.createEffectTrackBank(3, 3, 0);

    for (let i = 0; i < 3; i++) {
        const track = effectTrackBank.getItemAt(i);
        track.exists().markInterested();
        track.name().markInterested();
        
        for (let s = 0; s < 3; s++) {
            track.getSend(s).markInterested();
        }

        // Setup Chain Selector (assume first device is the selector)
        const deviceBank = track.createDeviceBank(1);
        const device = deviceBank.getDevice(0);
        
        // Use ChainSelector to control active chain
        const chainSelector = device.createChainSelector();
        fxChainSelectors[i] = chainSelector;
        
        chainSelector.exists().markInterested();
        chainSelector.chainCount().markInterested();
        chainSelector.activeChainIndex().markInterested();

        // Observers
        chainSelector.activeChainIndex().addValueObserver(function(index) {
            activeChainIndices[i] = index;
        });

        chainSelector.chainCount().addValueObserver(function(count) {
            chainCounts[i] = count;
        });
    }

    // Setup 'perf' page for FX Track 1
    const fx1 = effectTrackBank.getItemAt(0);
    fx1PerfPage = fx1.createCursorRemoteControlsPage("fx1_perf", 5, "perf");
    for (let i = 0; i < 5; i++) fx1PerfPage.getParameter(i).markInterested();

    // Setup 'perf' page for FX Track 2
    const fx2 = effectTrackBank.getItemAt(1);
    fx2PerfPage = fx2.createCursorRemoteControlsPage("fx2_perf", 5, "perf");
    for (let i = 0; i < 5; i++) fx2PerfPage.getParameter(i).markInterested();

    // Setup 'perf' page for FX Track 3
    const fx3 = effectTrackBank.getItemAt(2);
    fx3PerfPage = fx3.createCursorRemoteControlsPage("fx3_perf", 5, "perf");
    for (let i = 0; i < 5; i++) fx3PerfPage.getParameter(i).markInterested();

    // Setup for the ABSOLUTE LAST FX track
    // We create a bank of 1 track and scroll it to the end
    lastFXTrackBank = rootTrackGroup.createEffectTrackBank(1, 0, 0);
    
    // Keep it scrolled to the last track by observing the count
    lastFXTrackBank.channelCount().addValueObserver(function(count) {
        lastFXTrackBank.scrollPosition().set(count - 1);
    });

    const lastFX = lastFXTrackBank.getItemAt(0);
    lastFX.name().markInterested();
    
    // Access the first device on the Last FX Track
    const lastFXDeviceBank = lastFX.createDeviceBank(1);
    const lastFXDevice = lastFXDeviceBank.getDevice(0);
    lastFXDevice.exists().markInterested();
    
    // Setup Perf Page on the DEVICE
    lastFXPerfPage = lastFXDevice.createCursorRemoteControlsPage("last_fx_device_perf", 5, "perf");
    for (let i = 0; i < 5; i++) lastFXPerfPage.getParameter(i).markInterested();

    // Setup Chain Selector for the Last FX Device
    const lastFXChainSelector = lastFXDevice.createChainSelector();
    fxChainSelectors[3] = lastFXChainSelector; // Index 3 for Last FX
    
    lastFXChainSelector.exists().markInterested();
    lastFXChainSelector.chainCount().markInterested();
    lastFXChainSelector.activeChainIndex().markInterested();

    lastFXChainSelector.activeChainIndex().addValueObserver(function(index) {
        activeChainIndices[3] = index;
    });

    lastFXChainSelector.chainCount().addValueObserver(function(count) {
        chainCounts[3] = count;
    });

    projectFadersPage = rootTrackGroup.createCursorRemoteControlsPage("project_faders", 3, "faders");
    for (let i = 0; i < 3; i++) projectFadersPage.getParameter(i).markInterested();

    host.println("LCXL2-FX - Initialized!");
    host.println("Controlling first 3 Effect Tracks via LCXL2 Channels 6, 7, 8");
    host.println("Top row knobs 1-5 mapped to FX1 'perf' page");
    host.println("Middle row knobs 1-5 mapped to FX2 'perf' page");
    host.println("Bottom row knobs 1-5 mapped to FX3 'perf' page");
    host.println("Faders 1-5 mapped to the LAST FX track's DEVICE 'perf' page");
    host.println("Faders 6-8 mapped to project-level macro page 'faders'");
    host.println("Bottom buttons control FX Chain selection (Green/Orange/Amber/Red)");
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const msgType = status & 0xF0;

    if (channel !== USER_CHANNEL) return;

    if (msgType === 0xB0) { // CC
        handleCC(data1, data2);
    } else if (msgType === 0x90 || msgType === 0x80) { // Note On / Note Off
        // Treat Note messages as buttons
        const value = (msgType === 0x90) ? data2 : 0;
        handleCC(data1, value);
    }
}

function handleCC(cc, value) {
    const val = value / 127.0;

    if (cc === REDO_BUTTON_CC && value > 0) {
        application.redo();
        return;
    }

    if (cc === UNDO_BUTTON_CC && value > 0) {
        application.undo();
        return;
    }

    // Check Chain Selection Buttons (Bottom 16)
    if (value > 0) {
        for (let i = 0; i < CHAIN_BUTTONS.length; i++) {
            const btn = CHAIN_BUTTONS[i];
            if (cc === btn.cc) {
                host.println(`Button Pressed: Track ${btn.trackIndex} Chain ${btn.chainIndex} (Note/CC ${cc})`);
                
                // Set Active Chain Index
                const selector = fxChainSelectors[btn.trackIndex];
                if (selector && selector.exists().get()) {
                    selector.activeChainIndex().set(btn.chainIndex);
                }
                return;
            }
        }
    }

    // Check 'perf' knobs for FX1 (Top row 1-5)
    for (let i = 0; i < 5; i++) {
        if (cc === CONTROL.PERF_KNOBS[i]) {
            fx1PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' knobs for FX2 (Middle row 1-5)
    for (let i = 0; i < 5; i++) {
        if (cc === CONTROL.PERF_KNOBS_MID[i]) {
            fx2PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' knobs for FX3 (Bottom row 1-5)
    for (let i = 0; i < 5; i++) {
        if (cc === CONTROL.PERF_KNOBS_BOT[i]) {
            fx3PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' faders for the LAST FX track (Faders 1-5)
    for (let i = 0; i < 5; i++) {
        if (cc === CONTROL.PERF_FADERS[i]) {
            lastFXPerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check last 3 faders (Project macro page 'faders')
    for (let i = 0; i < 3; i++) {
        if (cc === CONTROL.FADERS[i]) {
            projectFadersPage.getParameter(i).set(val);
            return;
        }
    }

    // Check knobs for Sends 1, 2, 3 (Columns 6-8)
    for (let i = 0; i < 3; i++) {
        const track = effectTrackBank.getItemAt(i);
        
        if (cc === CONTROL.KNOBS_TOP[i]) {
            track.getSend(0).set(val);
            return;
        }
        if (cc === CONTROL.KNOBS_MID[i]) {
            track.getSend(1).set(val);
            return;
        }
        if (cc === CONTROL.KNOBS_BOT[i]) {
            track.getSend(2).set(val);
            return;
        }
    }
}

function flush() {
    midiOut.sendMidi(0x90 + USER_CHANNEL, REDO_BUTTON_NOTE, 127);
    midiOut.sendMidi(0x90 + USER_CHANNEL, UNDO_BUTTON_NOTE, 127);

    // Update LEDs for Chain Selection
    for (let i = 0; i < CHAIN_BUTTONS.length; i++) {
        const btn = CHAIN_BUTTONS[i];
        const selector = fxChainSelectors[btn.trackIndex];
        
        let color = LED.OFF;
        
        if (selector && selector.exists().get()) {
            const currentIndex = activeChainIndices[btn.trackIndex];
            const count = chainCounts[btn.trackIndex];
            
            // Check if this button represents an existing chain
            if (btn.chainIndex < count) {
                const isActive = (btn.chainIndex === currentIndex);
                
                // Determine Color Scheme
                if (btn.trackIndex === 0) { // FX1: Green
                    color = isActive ? LED.GREEN_HIGH : LED.GREEN_LOW;
                } else if (btn.trackIndex === 1) { // FX2: Orange
                    color = isActive ? LED.ORANGE_HIGH : LED.ORANGE_LOW;
                } else if (btn.trackIndex === 2) { // FX3: Amber
                    color = isActive ? LED.AMBER_HIGH : LED.AMBER_LOW;
                } else if (btn.trackIndex === 3) { // Last FX: Red
                    color = isActive ? LED.RED_HIGH : LED.RED_LOW;
                }
            }
        }
        
        // Use Note On (0x90) because the buttons are configured as Notes
        midiOut.sendMidi(0x90 + USER_CHANNEL, btn.cc, color);
    }
}

function exit() {
    host.println("LCXL2-FX - Exiting...");
}