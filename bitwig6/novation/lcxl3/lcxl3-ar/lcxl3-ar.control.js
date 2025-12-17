loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "Launch Control XL 3 AR",
    "0.1",
    "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

const DEBUG = true;
const PINNED_TRACK_INDEX = 0; // Track 1 (0-indexed)

// MIDI Channels (0-indexed)
const CHANNEL_MODE_1 = 0; // Custom Mode 1 -> params 0,1,2
const CHANNEL_MODE_2 = 1; // Custom Mode 2 -> params 4,5,6

// LCXL3 Custom Mode MIDI CC mappings
const CC = {
    // Encoders Top Row (CC13-CC20)
    ENC_T1: 13, ENC_T2: 14, ENC_T3: 15, ENC_T4: 16,
    ENC_T5: 17, ENC_T6: 18, ENC_T7: 19, ENC_T8: 20,
    
    // Encoders Middle Row (CC21-CC28)
    ENC_M1: 21, ENC_M2: 22, ENC_M3: 23, ENC_M4: 24,
    ENC_M5: 25, ENC_M6: 26, ENC_M7: 27, ENC_M8: 28,
    
    // Encoders Bottom Row (CC29-CC36)
    ENC_B1: 29, ENC_B2: 30, ENC_B3: 31, ENC_B4: 32,
    ENC_B5: 33, ENC_B6: 34, ENC_B7: 35, ENC_B8: 36,
    
    // Faders (CC5-CC12)
    FADER1: 5, FADER2: 6, FADER3: 7, FADER4: 8,
    FADER5: 9, FADER6: 10, FADER7: 11, FADER8: 12,
    
    // Upper Buttons (CC37-CC44)
    BTN_U1: 37, BTN_U2: 38, BTN_U3: 39, BTN_U4: 40,
    BTN_U5: 41, BTN_U6: 42, BTN_U7: 43, BTN_U8: 44,
    
    // Bottom Buttons (CC45-CC52)
    BTN_B1: 45, BTN_B2: 46, BTN_B3: 47, BTN_B4: 48,
    BTN_B5: 49, BTN_B6: 50, BTN_B7: 51, BTN_B8: 52,
};

// Globals
let midiIn, midiOut;

// Track management
let trackBank;
let pinnedTrack;
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;

// Primary device on group track
let primaryDeviceBank;
let primaryDevice;

// Remote control pages '1' to '8' on the primary device
// Each page has 7 parameters:
//   Mode 1 (ch1): params 0,1,2 (top, middle, bottom encoders)
//   Mode 2 (ch2): params 4,5,6 (top, middle, bottom encoders)
//   Param 3 is skipped/reserved
let devicePages = []; // Array of 8 pages

// Chain/Layer management for faders
// Primary device may have chains (e.g., Instrument Selector)
// Each chain's primary device has a 'volumes' page
const NUM_CHAINS = 8;
let layerBank;
let chainLayers = [];           // Array of DeviceLayer objects
let chainDeviceBanks = [];      // Array of DeviceBank for each chain
let chainPrimaryDevices = [];   // Array of primary Device for each chain
let chainVolumesPages = [];     // Array of 'volumes' remote control pages
let hasChains = false;

// Scene launcher for upper buttons (launches clips on child tracks)
const NUM_SCENES = 8;
let childTrackBank;             // Track bank for child tracks in group
let sceneBank;                  // Scene bank from child track bank
let scenes = [];                // Array of Scene objects

// MIDI group track (track 0 inside pinned group) for bottom buttons REC ARM
let midiGroupTrack;             // The MIDI group track (child 0 of pinned group)
let midiChildTrackBank;         // Track bank for child tracks inside MIDI group
let midiChildTracks = [];       // Array of 8 child tracks in MIDI group
let midiChildArms = [];         // Array of arm() SettableBooleanValue for each track

function init() {
    log("LCXL3-AR - Initializing...");
    
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    log("LCXL3-AR - Initialized!");
}

function setupTracks() {
    log("Setting up track management...");
    
    // Create track bank and pin to track
    // Third param is numScenes - need 8 for clip slots
    trackBank = host.createTrackBank(8, 0, NUM_SCENES, false);
    pinnedTrack = trackBank.getItemAt(PINNED_TRACK_INDEX);
    
    // Mark track properties as interested
    pinnedTrack.exists().markInterested();
    pinnedTrack.name().markInterested();
    pinnedTrack.isGroup().markInterested();
    
    // Setup primary device on the pinned track
    primaryDeviceBank = pinnedTrack.createDeviceBank(1);
    primaryDevice = primaryDeviceBank.getDevice(0);
    primaryDevice.exists().markInterested();
    primaryDevice.name().markInterested();
    
    // Create remote control pages '1' to '8' on the primary device
    // Each page has 7 parameters (Mode 1: 0,1,2 and Mode 2: 4,5,6)
    for (let i = 0; i < 8; i++) {
        const pageTag = String(i + 1); // Tags '1' to '8'
        const page = primaryDevice.createCursorRemoteControlsPage("Page" + pageTag, 7, pageTag);
        devicePages[i] = page;
        
        // Mark all 7 parameters as interested
        for (let p = 0; p < 7; p++) {
            const param = page.getParameter(p);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
        }
    }
    
    // Setup chain/layer bank for faders
    // This allows access to chains in devices like Instrument Selector
    setupChainVolumes();
    
    // Setup scene launcher for upper buttons
    setupSceneLauncher();
    
    // Setup MIDI group child tracks for bottom buttons (REC ARM)
    setupMidiGroupTracks();
    
    // Setup observers
    setupObservers();
    
    // Log initial status and initialize LEDs after a short delay
    host.scheduleTask(function() {
        logTrackStatus();
        updateUpperButtonLEDs();
    }, 100);
}

function setupChainVolumes() {
    log("Setting up chain volumes for faders...");
    
    // Create layer bank on primary device to access chains
    layerBank = primaryDevice.createLayerBank(NUM_CHAINS);
    
    for (let i = 0; i < NUM_CHAINS; i++) {
        // Get the layer/chain
        const layer = layerBank.getItemAt(i);
        chainLayers[i] = layer;
        
        layer.exists().markInterested();
        layer.name().markInterested();
        
        // Create device bank on the layer to get its primary device
        const deviceBank = layer.createDeviceBank(1);
        chainDeviceBanks[i] = deviceBank;
        
        const chainDevice = deviceBank.getDevice(0);
        chainPrimaryDevices[i] = chainDevice;
        
        chainDevice.exists().markInterested();
        chainDevice.name().markInterested();
        
        // Create 'volumes' remote control page on the chain's primary device
        // Need 8 parameters for 8 faders
        const volumesPage = chainDevice.createCursorRemoteControlsPage("ChainVolumes" + i, 8, "volumes");
        chainVolumesPages[i] = volumesPage;
        
        // Mark all 8 parameters as interested
        for (let p = 0; p < 8; p++) {
            const param = volumesPage.getParameter(p);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
        }
    }
    
    log("Chain volumes setup complete");
}

function setupSceneLauncher() {
    log("Setting up scene launcher for upper buttons...");
    
    // Create child track bank from the pinned group track
    // This gives us access to child tracks and their scenes
    childTrackBank = pinnedTrack.createTrackBank(8, 0, NUM_SCENES, false);
    
    // Get the scene bank from the child track bank
    sceneBank = childTrackBank.sceneBank();
    
    // Setup each scene
    for (let i = 0; i < NUM_SCENES; i++) {
        const scene = sceneBank.getScene(i);
        scenes[i] = scene;
        
        scene.exists().markInterested();
        scene.name().markInterested();
    }
    
    // Also mark child tracks and their clip slots for LED feedback
    for (let i = 0; i < 8; i++) {
        const track = childTrackBank.getItemAt(i);
        if (track) {
            track.exists().markInterested();
            track.name().markInterested();
            
            const clipSlotBank = track.clipLauncherSlotBank();
            if (clipSlotBank) {
                for (let slotIndex = 0; slotIndex < NUM_SCENES; slotIndex++) {
                    const slot = clipSlotBank.getItemAt(slotIndex);
                    if (slot) {
                        slot.isPlaying().markInterested();
                        slot.hasContent().markInterested();
                    }
                }
            }
        }
    }
    
    log("Scene launcher setup complete");
}

function setupMidiGroupTracks() {
    log("Setting up MIDI group child tracks for REC ARM...");
    
    // The MIDI group is track 0 inside the pinned group
    // childTrackBank was already created in setupSceneLauncher
    midiGroupTrack = childTrackBank.getItemAt(0);
    
    midiGroupTrack.exists().markInterested();
    midiGroupTrack.name().markInterested();
    midiGroupTrack.isGroup().markInterested();
    
    // Create a track bank for child tracks inside the MIDI group
    midiChildTrackBank = midiGroupTrack.createTrackBank(8, 0, 0, false);
    
    // Setup each child track
    for (let i = 0; i < 8; i++) {
        const track = midiChildTrackBank.getItemAt(i);
        midiChildTracks[i] = track;
        
        track.exists().markInterested();
        track.name().markInterested();
        
        // Get the arm property
        const arm = track.arm();
        arm.markInterested();
        midiChildArms[i] = arm;
        
        // Add observer to keep LED in sync with arm state
        const buttonIndex = i;
        arm.addValueObserver(function(isArmed) {
            const cc = CC.BTN_B1 + buttonIndex;
            // LCXL3: 0 = LED ON, 127 = LED OFF (inverted)
            const ledValue = isArmed ? 0 : 127;
            midiOut.sendMidi(0xB0 + CHANNEL_MODE_1, cc, ledValue);
            midiOut.sendMidi(0xB0 + CHANNEL_MODE_2, cc, ledValue);
        });
    }
    
    log("MIDI group tracks setup complete");
}

function setupObservers() {
    pinnedTrack.exists().addValueObserver(function(exists) {
        pinnedTrackExists = exists;
        log(`Pinned track exists: ${exists}`);
    });
    
    pinnedTrack.name().addValueObserver(function(name) {
        log(`Pinned track name: ${name}`);
    });
    
    pinnedTrack.isGroup().addValueObserver(function(isGroup) {
        pinnedTrackIsGroup = isGroup;
        log(`Pinned track is group: ${isGroup}`);
    });
    
    primaryDevice.exists().addValueObserver(function(exists) {
        log(`Primary device exists: ${exists}`);
    });
    
    primaryDevice.name().addValueObserver(function(name) {
        log(`Primary device name: ${name}`);
    });
    
    // Observe chain existence to track if device has chains
    for (let i = 0; i < NUM_CHAINS; i++) {
        const chainIndex = i;
        chainLayers[i].exists().addValueObserver(function(exists) {
            if (exists && !hasChains) {
                hasChains = true;
                log("Primary device has chains");
            }
            if (DEBUG) {
                log(`Chain ${chainIndex} exists: ${exists}`);
            }
        });
    }
    
    // Observe clip playing state on child tracks for LED updates
    setupSceneObservers();
}

function setupSceneObservers() {
    if (!childTrackBank) return;
    
    for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
        const track = childTrackBank.getItemAt(trackIndex);
        if (track) {
            const clipSlotBank = track.clipLauncherSlotBank();
            if (clipSlotBank) {
                for (let slotIndex = 0; slotIndex < NUM_SCENES; slotIndex++) {
                    const slot = clipSlotBank.getItemAt(slotIndex);
                    if (slot) {
                        slot.isPlaying().addValueObserver((isPlaying) => {
                            if (pinnedTrackIsGroup) {
                                updateUpperButtonLEDs();
                            }
                        });
                    }
                }
            }
        }
    }
}

function onMidi(status, data1, data2) {
    const msgType = status & 0xF0;
    const channel = status & 0x0F;
    
    if (msgType === 0xB0) {
        handleCC(channel, data1, data2);
    }
}

function handleCC(channel, cc, value) {
    // Determine parameter offset based on MIDI channel
    // Mode 1 (channel 0): params 0,1,2
    // Mode 2 (channel 1): params 4,5,6
    let paramOffset = 0;
    if (channel === CHANNEL_MODE_1) {
        paramOffset = 0;
    } else if (channel === CHANNEL_MODE_2) {
        paramOffset = 4;
    } else {
        // Ignore other channels
        return;
    }
    
    // Encoders Top Row (CC13-CC20) -> Parameter 0 or 3 on pages 1-8
    if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
        const columnIndex = cc - CC.ENC_T1; // 0-7
        handleEncoderColumn(columnIndex, paramOffset + 0, value, channel);
        return;
    }
    
    // Encoders Middle Row (CC21-CC28) -> Parameter 1 or 4 on pages 1-8
    if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
        const columnIndex = cc - CC.ENC_M1; // 0-7
        handleEncoderColumn(columnIndex, paramOffset + 1, value, channel);
        return;
    }
    
    // Encoders Bottom Row (CC29-CC36) -> Parameter 2 or 5 on pages 1-8
    if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
        const columnIndex = cc - CC.ENC_B1; // 0-7
        handleEncoderColumn(columnIndex, paramOffset + 2, value, channel);
        return;
    }
    
    // Faders -> 'volumes' page param 0 on ALL chain primary devices
    if (cc >= CC.FADER1 && cc <= CC.FADER8) {
        const faderIndex = cc - CC.FADER1;
        handleFader(faderIndex, value);
        return;
    }
    
    // Upper Buttons 1-7 -> Scene launcher, Button 8 -> Stop clips
    if (cc >= CC.BTN_U1 && cc <= CC.BTN_U8) {
        const buttonIndex = cc - CC.BTN_U1;
        if (value > 0) { // Only on press (ON=127)
            if (buttonIndex === 7) {
                // Button 8 (CC44) stops all clips in the group
                handleStopButton(channel);
            } else {
                // Buttons 1-7 launch scenes
                handleUpperButton(buttonIndex, channel);
            }
        }
        return;
    }
    
    // Bottom Buttons -> Toggle REC ARM on MIDI group child tracks
    // In toggle mode, device alternates 127/0 - we toggle on ANY message
    if (cc >= CC.BTN_B1 && cc <= CC.BTN_B8) {
        const buttonIndex = cc - CC.BTN_B1;
        handleBottomButton(buttonIndex);
        return;
    }
}

/**
 * Handle upper button press for scene launching
 * @param {number} buttonIndex - Button index 0-7
 * @param {number} channel - MIDI channel the message came from
 */
function handleUpperButton(buttonIndex, channel) {
    if (!pinnedTrackIsGroup) {
        log(`Upper button ${buttonIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    if (!sceneBank) {
        log(`Upper button ${buttonIndex + 1}: no scene bank available`);
        return;
    }
    
    const scene = scenes[buttonIndex];
    if (!scene) {
        log(`Upper button ${buttonIndex + 1}: no scene at index`);
        return;
    }
    
    // Launch the scene (launches clips on all child tracks at this scene index)
    scene.launch();
    log(`Upper button ${buttonIndex + 1}: launching scene`);
    
    // In momentary mode: immediately update LEDs to show this as the active scene
    // The observers will also update when Bitwig confirms playback
    updateUpperButtonLEDsForLaunch(buttonIndex);
}

/**
 * Handle stop button (button 8) - stops all clips in the group
 * @param {number} channel - MIDI channel the message came from
 */
function handleStopButton(channel) {
    if (!pinnedTrackIsGroup) {
        log(`Stop button: ignored (not a group track)`);
        return;
    }
    
    // Stop clips on the pinned group track (stops all child track clips)
    pinnedTrack.stop();
    log(`Stop button: stopping all clips in group`);
    
    // Turn off all scene LEDs (1-7), keep button 8 off too
    // LCXL3: 127 = LED OFF (inverted)
    for (let i = 0; i < NUM_SCENES; i++) {
        const cc = CC.BTN_U1 + i;
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_1, cc, 127);
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_2, cc, 127);
    }
}

/**
 * Handle bottom button press - toggle REC ARM on MIDI group child tracks
 * @param {number} buttonIndex - Button index 0-7
 */
function handleBottomButton(buttonIndex) {
    if (!pinnedTrackIsGroup) {
        log(`Bottom button ${buttonIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    const track = midiChildTracks[buttonIndex];
    if (!track || !track.exists().get()) {
        log(`Bottom button ${buttonIndex + 1}: no MIDI child track at index`);
        return;
    }
    
    const arm = midiChildArms[buttonIndex];
    if (!arm) {
        log(`Bottom button ${buttonIndex + 1}: no arm control`);
        return;
    }
    
    // Toggle the arm state - observer will update LED
    arm.toggle();
    log(`Bottom button ${buttonIndex + 1}: toggled REC ARM on ${track.name().get()}`);
}

/**
 * Update upper button LEDs based on scene/clip playing state
 * Sends to both MIDI channels so it works regardless of current mode
 */
function updateUpperButtonLEDs() {
    for (let sceneIndex = 0; sceneIndex < NUM_SCENES; sceneIndex++) {
        const cc = CC.BTN_U1 + sceneIndex;
        let anyPlaying = false;
        
        // Check if any clip is playing at this scene index across all child tracks
        if (childTrackBank) {
            for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
                const track = childTrackBank.getItemAt(trackIndex);
                if (track && track.exists().get()) {
                    const clipSlotBank = track.clipLauncherSlotBank();
                    if (clipSlotBank) {
                        const slot = clipSlotBank.getItemAt(sceneIndex);
                        if (slot && slot.isPlaying().get()) {
                            anyPlaying = true;
                            break;
                        }
                    }
                }
            }
        }
        
        // LCXL3: 0 = LED ON, 127 = LED OFF (inverted)
        const ledValue = anyPlaying ? 0 : 127;
        
        // Send on both channels
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_1, cc, ledValue);
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_2, cc, ledValue);
    }
}

/**
 * Update LEDs immediately when a button is pressed (before Bitwig responds)
 * This gives instant visual feedback for mutual exclusion
 * 
 * For MOMENTARY mode buttons: We control LEDs entirely from the script.
 * Send the desired state directly - no toggle behavior from device.
 * 
 * @param {number} pressedIndex - The button that was just pressed
 */
function updateUpperButtonLEDsForLaunch(pressedIndex) {
    for (let i = 0; i < NUM_SCENES; i++) {
        const cc = CC.BTN_U1 + i;
        // LCXL3: 0 = LED ON, 127 = LED OFF (inverted)
        const ledValue = (i === pressedIndex) ? 0 : 127;
        
        // Send on both channels for consistency
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_1, cc, ledValue);
        midiOut.sendMidi(0xB0 + CHANNEL_MODE_2, cc, ledValue);
    }
}

/**
 * Handle fader input - sets the same parameter on ALL chain 'volumes' pages
 * @param {number} faderIndex - Fader index 0-7
 * @param {number} value - MIDI CC value (0-127 absolute)
 */
function handleFader(faderIndex, value) {
    if (!pinnedTrackIsGroup) {
        log(`Fader ${faderIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    const normalizedValue = value / 127.0;
    let setCount = 0;
    
    // Set the parameter on ALL chains that exist
    for (let chainIndex = 0; chainIndex < NUM_CHAINS; chainIndex++) {
        const layer = chainLayers[chainIndex];
        if (!layer || !layer.exists().get()) {
            continue;
        }
        
        const volumesPage = chainVolumesPages[chainIndex];
        if (!volumesPage) {
            continue;
        }
        
        const param = volumesPage.getParameter(faderIndex);
        if (param && param.exists().get()) {
            param.set(normalizedValue);
            setCount++;
        }
    }
    
    if (DEBUG && Math.random() < 0.1) {
        log(`Fader ${faderIndex + 1} -> ${setCount} chains, value=${normalizedValue.toFixed(2)}`);
    }
}

/**
 * Handle encoder input for a specific column and parameter index
 * @param {number} columnIndex - Column index 0-7 (maps to pages '1'-'8')
 * @param {number} paramIndex - Parameter index 0-5 (Mode 1: 0,1,2 / Mode 2: 3,4,5)
 * @param {number} value - MIDI CC value (0-127 absolute)
 * @param {number} channel - MIDI channel for logging
 */
function handleEncoderColumn(columnIndex, paramIndex, value, channel) {
    if (!pinnedTrackIsGroup) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: ignored (not a group track)`);
        return;
    }
    
    const page = devicePages[columnIndex];
    if (!page) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: no page`);
        return;
    }
    
    const param = page.getParameter(paramIndex);
    if (!param || !param.exists().get()) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: param doesn't exist`);
        return;
    }
    
    // Handle as absolute encoder (0-127 -> 0.0-1.0)
    const normalizedValue = value / 127.0;
    param.set(normalizedValue);
    
    if (DEBUG && Math.random() < 0.1) { // Log 10% of the time to reduce spam
        const pageName = String(columnIndex + 1);
        const modeName = channel === CHANNEL_MODE_1 ? 'M1' : 'M2';
        host.println(`[${modeName}] Encoder col ${columnIndex + 1} -> Page '${pageName}' P${paramIndex}: ${param.name().get()} = ${normalizedValue.toFixed(2)}`);
    }
}

function logTrackStatus() {
    log("=== LCXL3-AR Track Status ===");
    log(`Pinned track index: ${PINNED_TRACK_INDEX}`);
    log(`Pinned track exists: ${pinnedTrackExists}`);
    log(`Pinned track is group: ${pinnedTrackIsGroup}`);
    log(`Primary device exists: ${primaryDevice.exists().get()}`);
    if (primaryDevice.exists().get()) {
        log(`Primary device name: ${primaryDevice.name().get()}`);
    }
    
    // Log encoder page status
    log("--- Encoder Pages ---");
    for (let i = 0; i < 8; i++) {
        const page = devicePages[i];
        let paramCount = 0;
        for (let p = 0; p < 7; p++) {
            if (page.getParameter(p).exists().get()) {
                paramCount++;
            }
        }
        if (paramCount > 0) {
            log(`  Page '${i + 1}': ${paramCount}/7 params`);
        }
    }
    
    // Log chain status for faders
    log("--- Chains (for faders) ---");
    let chainCount = 0;
    for (let i = 0; i < NUM_CHAINS; i++) {
        const layer = chainLayers[i];
        if (layer && layer.exists().get()) {
            chainCount++;
            const chainDevice = chainPrimaryDevices[i];
            const deviceName = chainDevice.exists().get() ? chainDevice.name().get() : "no device";
            log(`  Chain ${i}: ${layer.name().get()} -> ${deviceName}`);
        }
    }
    log(`Total chains: ${chainCount}`);
    
    // Log scene/clip status
    log("--- Scenes (upper buttons) ---");
    for (let sceneIndex = 0; sceneIndex < NUM_SCENES; sceneIndex++) {
        let anyPlaying = false;
        let hasAnyContent = false;
        
        if (childTrackBank) {
            for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
                const track = childTrackBank.getItemAt(trackIndex);
                if (track && track.exists().get()) {
                    const clipSlotBank = track.clipLauncherSlotBank();
                    if (clipSlotBank) {
                        const slot = clipSlotBank.getItemAt(sceneIndex);
                        if (slot) {
                            if (slot.hasContent().get()) hasAnyContent = true;
                            if (slot.isPlaying().get()) anyPlaying = true;
                        }
                    }
                }
            }
        }
        
        if (hasAnyContent) {
            const playing = anyPlaying ? " [PLAYING]" : "";
            log(`  Scene ${sceneIndex + 1}: has content${playing}`);
        }
    }
    
    log("=============================");
}

function log(msg) {
    if (DEBUG) host.println(msg);
}

function flush() {
    // Called periodically
}

function exit() {
    log("LCXL3-AR - Exiting...");
}
 