loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Dual 6",
    "0.1",
    "b1c2d3e4-f5a6-7890-1234-56789abcdef0",
    "Zsolt"
);
host.defineMidiPorts(1, 1);

// MIDI Channel Configuration (Standard Mode)
const INPUT_MIDI_CHANNEL = 10;  // Channel 11 (0-based indexing)
const OUTPUT_MIDI_CHANNEL = 11; // Channel 12 (0-based indexing) - Global Channel for LED feedback
const DEBUG = true;

// Track Pinning Configuration
const PINNED_GROUP_TRACK_INDEX = 0; // Which group track to pin to (0-based)

// MIDI CC Numbers (Standard Mode - based on reference)
const CC = {
    // Layer A - Encoders Turn (CC1-CC8)
    ENCODER_A_1: 1, ENCODER_A_2: 2, ENCODER_A_3: 3, ENCODER_A_4: 4,
    ENCODER_A_5: 5, ENCODER_A_6: 6, ENCODER_A_7: 7, ENCODER_A_8: 8,
    // Layer A - Fader
    FADER_A: 9,
    
    // Layer B - Encoders Turn (CC11-CC18)
    ENCODER_B_1: 11, ENCODER_B_2: 12, ENCODER_B_3: 13, ENCODER_B_4: 14,
    ENCODER_B_5: 15, ENCODER_B_6: 16, ENCODER_B_7: 17, ENCODER_B_8: 18,
    // Layer B - Fader
    FADER_B: 10,
    // LED Ring Behavior Control (CC1-CC8 on output channel)
    LED_RING_BEHAVIOR_1: 1, LED_RING_BEHAVIOR_2: 2, LED_RING_BEHAVIOR_3: 3, LED_RING_BEHAVIOR_4: 4,
    LED_RING_BEHAVIOR_5: 5, LED_RING_BEHAVIOR_6: 6, LED_RING_BEHAVIOR_7: 7, LED_RING_BEHAVIOR_8: 8,
    // LED Ring Value Control (CC9-CC16 on output channel)
    LED_RING_VALUE_1: 9, LED_RING_VALUE_2: 10, LED_RING_VALUE_3: 11, LED_RING_VALUE_4: 12,
    LED_RING_VALUE_5: 13, LED_RING_VALUE_6: 14, LED_RING_VALUE_7: 15, LED_RING_VALUE_8: 16,
};

// MIDI Note Numbers (Standard Mode - based on actual X-Touch Editor configuration)
const NOTE = {
    // Layer A - Encoder Push (Notes 0-7)
    ENCODER_A_PUSH_1: 0, ENCODER_A_PUSH_2: 1, ENCODER_A_PUSH_3: 2, ENCODER_A_PUSH_4: 3,
    ENCODER_A_PUSH_5: 4, ENCODER_A_PUSH_6: 5, ENCODER_A_PUSH_7: 6, ENCODER_A_PUSH_8: 7,
    
    // Layer A - Upper Row Buttons (Notes 8-15)
    BUTTON_A_UPPER_1: 8, BUTTON_A_UPPER_2: 9, BUTTON_A_UPPER_3: 10, BUTTON_A_UPPER_4: 11,
    BUTTON_A_UPPER_5: 12, BUTTON_A_UPPER_6: 13, BUTTON_A_UPPER_7: 14, BUTTON_A_UPPER_8: 15,
    
    // Layer A - Lower Row Buttons (Notes 16-23)
    BUTTON_A_LOWER_1: 16, BUTTON_A_LOWER_2: 17, BUTTON_A_LOWER_3: 18, BUTTON_A_LOWER_4: 19,
    BUTTON_A_LOWER_5: 20, BUTTON_A_LOWER_6: 21, BUTTON_A_LOWER_7: 22, BUTTON_A_LOWER_8: 23,
    
    // Layer B - Encoder Push (Notes 24-31)
    ENCODER_B_PUSH_1: 24, ENCODER_B_PUSH_2: 25, ENCODER_B_PUSH_3: 26, ENCODER_B_PUSH_4: 27,
    ENCODER_B_PUSH_5: 28, ENCODER_B_PUSH_6: 29, ENCODER_B_PUSH_7: 30, ENCODER_B_PUSH_8: 31,
    
    // Layer B - Upper Row Buttons (Notes 48-55)
    BUTTON_B_UPPER_1: 48, BUTTON_B_UPPER_2: 49, BUTTON_B_UPPER_3: 50, BUTTON_B_UPPER_4: 51,
    BUTTON_B_UPPER_5: 52, BUTTON_B_UPPER_6: 53, BUTTON_B_UPPER_7: 54, BUTTON_B_UPPER_8: 55,
    
    // Layer B - Lower Row Buttons (Notes 56-63)
    BUTTON_B_LOWER_1: 56, BUTTON_B_LOWER_2: 57, BUTTON_B_LOWER_3: 58, BUTTON_B_LOWER_4: 59,
    BUTTON_B_LOWER_5: 60, BUTTON_B_LOWER_6: 61, BUTTON_B_LOWER_7: 62, BUTTON_B_LOWER_8: 63,
    
    // LED Control Notes (match physical button layout)
    LED_BUTTON_UPPER_1: 8, LED_BUTTON_UPPER_2: 9, LED_BUTTON_UPPER_3: 10, LED_BUTTON_UPPER_4: 11,
    LED_BUTTON_UPPER_5: 12, LED_BUTTON_UPPER_6: 13, LED_BUTTON_UPPER_7: 14, LED_BUTTON_UPPER_8: 15,
    LED_BUTTON_LOWER_1: 16, LED_BUTTON_LOWER_2: 17, LED_BUTTON_LOWER_3: 18, LED_BUTTON_LOWER_4: 19,
    LED_BUTTON_LOWER_5: 20, LED_BUTTON_LOWER_6: 21, LED_BUTTON_LOWER_7: 22, LED_BUTTON_LOWER_8: 23,
};


// LED Ring Behavior Constants
const LED_RING_BEHAVIOR = {
    SINGLE: 0,
    PAN: 1,
    FAN: 2,
    SPREAD: 3,
    TRIM: 4
};

// LED States
const LED_STATE = {
    OFF: 0,
    ON: 1,
    BLINKING: 2
};

// Layer Management
const LAYER = {
    A: 'A',
    B: 'B'
};

// Global Variables
let midiIn, midiOut;
let currentLayer = LAYER.A; // Track current layer

// Track Management - Track Bank + Device Bank approach
let trackBank;
let pinnedGroupTrack;
let childTrackBank;
let childTrack0;
let childTrack1;
let childTrack0DeviceBank;
let childTrack1DeviceBank;

// Remote Control Pages
let groupTrackRemotePage4;

// Primary Device Controls for Child Tracks
let childTrack0PrimaryDevice, childTrack1PrimaryDevice;
let childTrack0PrimaryDevicePage0, childTrack0PrimaryDevicePage1, childTrack0PrimaryDevicePage2;
let childTrack1PrimaryDevicePage0, childTrack1PrimaryDevicePage1, childTrack1PrimaryDevicePage2;

// Instrument Selector Controls
// Upper buttons 1-4 select instruments on Child Track 0 (chains 0-3)
// Upper buttons 5-8 select instruments on Child Track 1 (chains 0-3)
let childTrack0ChainSelector, childTrack1ChainSelector;

function init() {
    // Initialize MIDI
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    // Set up MIDI input callback
    midiIn.setMidiCallback(onMidi);
    
    // Initialize Track Management
    setupTracks();
    
    if (DEBUG) {
        host.println("X-Touch Mini Dual (Standard Mode) initialized - Layer A/B support enabled");
        host.println(`Current layer: ${currentLayer}`);
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    // Only process messages from the input channel
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (DEBUG) {
        host.println(`MIDI: Status=0x${status.toString(16)} Data1=${data1} Data2=${data2} Channel=${channel + 1}`);
    }
    
    if (command === 0xB0) { // Control Change
        handleControlChange(data1, data2);
    } else if (command === 0x90 || (command === 0x80)) { // Note On/Off
        const isNoteOn = (command === 0x90) && (data2 > 0);
        handleNote(data1, isNoteOn, data2);
    }
}

function handleControlChange(cc, value) {
    // Handle Layer A Encoders (CC1-CC8)
    if (cc >= CC.ENCODER_A_1 && cc <= CC.ENCODER_A_8) {
        const encoderIndex = cc - CC.ENCODER_A_1;
        currentLayer = LAYER.A;
        handleEncoderTurn(encoderIndex, value, LAYER.A);
        return;
    }
    
    // Handle Layer B Encoders (CC11-CC18)
    if (cc >= CC.ENCODER_B_1 && cc <= CC.ENCODER_B_8) {
        const encoderIndex = cc - CC.ENCODER_B_1;
        currentLayer = LAYER.B;
        handleEncoderTurn(encoderIndex, value, LAYER.B);
        return;
    }
    
    // Handle Fader (CC9) - same for both layers
    if (cc === CC.FADER_A) {
        // Note: Fader uses same CC9 on both layers - can't distinguish layers from fader alone
        handleFader(value, currentLayer);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled CC: ${cc} Value: ${value}`);
    }
}

function handleNote(note, isPressed, velocity) {
    // Handle Layer A Encoder Pushes (Notes 0-7)
    if (note >= NOTE.ENCODER_A_PUSH_1 && note <= NOTE.ENCODER_A_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_A_PUSH_1;
        currentLayer = LAYER.A;
        handleEncoderPush(encoderIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Layer A Upper Row Buttons (Notes 8-15)
    if (note >= NOTE.BUTTON_A_UPPER_1 && note <= NOTE.BUTTON_A_UPPER_8) {
        const buttonIndex = note - NOTE.BUTTON_A_UPPER_1;
        currentLayer = LAYER.A;
        handleUpperButton(buttonIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Layer A Lower Row Buttons (Notes 16-23)
    if (note >= NOTE.BUTTON_A_LOWER_1 && note <= NOTE.BUTTON_A_LOWER_8) {
        const buttonIndex = note - NOTE.BUTTON_A_LOWER_1;
        currentLayer = LAYER.A;
        handleLowerButton(buttonIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Layer B Encoder Pushes (Notes 24-31)
    if (note >= NOTE.ENCODER_B_PUSH_1 && note <= NOTE.ENCODER_B_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_B_PUSH_1;
        currentLayer = LAYER.B;
        handleEncoderPush(encoderIndex, isPressed, LAYER.B);
        return;
    }
    
    // Handle Layer B Upper Row Buttons (Notes 32-39)
    if (note >= NOTE.BUTTON_B_UPPER_1 && note <= NOTE.BUTTON_B_UPPER_8) {
        const buttonIndex = note - NOTE.BUTTON_B_UPPER_1;
        currentLayer = LAYER.B;
        handleUpperButton(buttonIndex, isPressed, LAYER.B);
        return;
    }
    
    // Handle Layer B Lower Row Buttons (Notes 40-47)
    if (note >= NOTE.BUTTON_B_LOWER_1 && note <= NOTE.BUTTON_B_LOWER_8) {
        const buttonIndex = note - NOTE.BUTTON_B_LOWER_1;
        currentLayer = LAYER.B;
        handleLowerButton(buttonIndex, isPressed, LAYER.B);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled Note: ${note} Pressed: ${isPressed} Velocity: ${velocity}`);
    }
}

function handleEncoderTurn(encoderIndex, value, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Encoder ${encoderIndex + 1} turned: ${value}`);
    }
    
    // Encoders are layer-independent - same functionality in both layers
    
    // Encoders 1-4 (index 0-3) control Child Track 0 Primary Device Page 0
    if (encoderIndex >= 0 && encoderIndex <= 3) {
        if (childTrack0PrimaryDevicePage0) {
            const param = childTrack0PrimaryDevicePage0.getParameter(encoderIndex);
            try {
                // Convert MIDI value (0-127) to parameter value (0.0-1.0)
                const paramValue = value / 127.0;
                param.set(paramValue);
                
                // Update LED ring
                // updateEncoderLEDRing(encoderIndex, paramValue);
                
                if (DEBUG) {
                    host.println(`Set Child Track 0 Primary Device Page 0 Parameter ${encoderIndex} to ${paramValue.toFixed(3)}`);
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error setting Child Track 0 Primary Device Parameter ${encoderIndex}: ${error}`);
                }
            }
        } else {
            if (DEBUG) {
                host.println(`Child Track 0 primary device page not available for encoder ${encoderIndex + 1}`);
            }
        }
    }
    
    // Encoders 5-8 (index 4-7) control Child Track 1 Primary Device Page 0
    else if (encoderIndex >= 4 && encoderIndex <= 7) {
        if (childTrack1PrimaryDevicePage0) {
            const paramIndex = encoderIndex - 4; // Convert to 0-3 range
            const param = childTrack1PrimaryDevicePage0.getParameter(paramIndex);
            try {
                // Convert MIDI value (0-127) to parameter value (0.0-1.0)
                const paramValue = value / 127.0;
                param.set(paramValue);
                
                // Update LED ring
                // updateEncoderLEDRing(encoderIndex, paramValue);
                
                if (DEBUG) {
                    host.println(`Set Child Track 1 Primary Device Page 0 Parameter ${paramIndex} to ${paramValue.toFixed(3)}`);
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error setting Child Track 1 Primary Device Parameter ${paramIndex}: ${error}`);
                }
            }
        } else {
            if (DEBUG) {
                host.println(`Child Track 1 primary device page not available for encoder ${encoderIndex + 1}`);
            }
        }
    }
}

function handleEncoderPush(encoderIndex, isPressed, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Encoder ${encoderIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Just log for now - no functionality
}

function handleUpperButton(buttonIndex, isPressed, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button presses, not releases
    if (!isPressed) {
        return;
    }
    
    // Upper buttons 1-4 (index 0-3) control Child Track 0 instrument selection
    if (buttonIndex >= 0 && buttonIndex <= 3) {
        const chainIndex = buttonIndex; // Direct mapping: button 1 -> chain 0, button 2 -> chain 1, etc.
        
        if (canSelectInstrumentOnChildTrack0()) {
            selectInstrumentOnChildTrack0(chainIndex);
        } else {
            if (DEBUG) {
                host.println(`Upper button ${buttonIndex + 1} pressed but child track 0 instrument selector not available`);
            }
        }
        return;
    }
    
    // Upper buttons 5-8 (index 4-7) control Child Track 1 instrument selection
    if (buttonIndex >= 4 && buttonIndex <= 7) {
        const chainIndex = buttonIndex - 4; // Map to 0-3 range: button 5 -> chain 0, button 6 -> chain 1, etc.
        
        if (canSelectInstrumentOnChildTrack1()) {
            selectInstrumentOnChildTrack1(chainIndex);
        } else {
            if (DEBUG) {
                host.println(`Upper button ${buttonIndex + 1} pressed but child track 1 instrument selector not available`);
            }
        }
        return;
    }
    
    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} - no functionality mapped`);
    }
}

function handleLowerButton(buttonIndex, isPressed, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Just log for now - no functionality
}

function handleFader(value, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Fader moved: ${value}`);
    }
    
    // Just log for now - no functionality
}

// LED Control Functions
function setLEDRingBehavior(encoderIndex, behavior) {
    const cc = CC.LED_RING_BEHAVIOR_1 + encoderIndex;
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, cc, behavior);
}

function setLEDRingValue(encoderIndex, value) {
    const cc = CC.LED_RING_VALUE_1 + encoderIndex;
    // Map 0-127 to LED positions (0-13)
    // 0 = off, 1-13 = LED positions
    let ledValue;
    if (value === 0) {
        ledValue = 0; // Turn off completely
    } else {
        ledValue = Math.floor((value / 127.0) * 12) + 1; // Map 1-127 to 1-13
    }
    
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, cc, Math.min(ledValue, 13));
    
    if (DEBUG) {
        host.println(`LED Ring ${encoderIndex + 1}: MIDI value ${value} -> LED position ${ledValue}`);
    }
}

function setButtonLED(buttonIndex, state) {
    const note = buttonIndex; // 0-15 maps directly to LED notes
    const velocity = state; // 0=off, 1=on, 2=blinking
    
    if (DEBUG && state !== LED_STATE.OFF) {
        host.println(`Setting Button ${buttonIndex + 1} LED to state ${state} (Note ${note} on Channel ${OUTPUT_MIDI_CHANNEL + 1})`);
    }
    
    if (state === LED_STATE.OFF) {
        midiOut.sendMidi(0x80 + OUTPUT_MIDI_CHANNEL, note, 0); // Note Off
    } else {
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity); // Note On
    }
}

// LED update functions removed - Bitwig handles this automatically!

function setupTracks() {
        if (DEBUG) {
            host.println("=== Setting up Track Management (Track Bank + Device Bank Approach) ===");
        }
    
    try {
        // Create main track bank and get the pinned group track
        trackBank = host.createTrackBank(8, 0, 0, false);
        pinnedGroupTrack = trackBank.getTrack(PINNED_GROUP_TRACK_INDEX);
        
        // Create child track bank from the group track
        childTrackBank = pinnedGroupTrack.createTrackBank(8, 0, 0, false);
        childTrack0 = childTrackBank.getTrack(0);
        childTrack1 = childTrackBank.getTrack(1);
        
        // Create device banks for accessing primary devices
        childTrack0DeviceBank = childTrack0.createDeviceBank(8);
        childTrack1DeviceBank = childTrack1.createDeviceBank(8);
        
        if (DEBUG) {
            host.println("Created track banks and device banks (no cursor tracks)");
        }
        
        if (DEBUG) {
            host.println("=== Setup Complete - Controller Ready ===");
        }
        
        if (DEBUG) {
            host.println("Track bank and device bank setup complete");
        }
        
        
        // Set up observers for tracks
        setupTrackObservers();
        
        // Setup Remote Control Pages
        setupRemoteControlPages();
        
        if (DEBUG) {
            host.println("Track management setup complete");
        }
        
        // Log final track status after a brief delay to allow observers to initialize
        host.scheduleTask(logTrackStatus, null, 100);
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupTracks: ${error}`);
        }
    }
}

function setupTrackObservers() {
    try {
        if (DEBUG) {
            host.println("Setting up track observers...");
        }
        
        // Set up observers for pinned group track
        pinnedGroupTrack.exists().addValueObserver(function(exists) {
            pinnedTrackExists = exists;
            if (DEBUG) {
                host.println(`Pinned group track exists: ${exists}`);
            }
        });
        
        pinnedGroupTrack.name().addValueObserver(function(name) {
            if (DEBUG) {
                host.println(`Pinned group track name: ${name}`);
            }
        });
        
        pinnedGroupTrack.isGroup().addValueObserver(function(isGroup) {
            pinnedTrackIsGroup = isGroup;
            if (DEBUG) {
                host.println(`Pinned group track is group: ${isGroup}`);
            }
        });
        
        // Set up observers for child tracks
        childTrack0.exists().addValueObserver(function(exists) {
            childTrack0Exists = exists;
            if (DEBUG) {
                host.println(`Child Track 0 exists: ${exists}`);
            }
        });
        
        childTrack0.name().addValueObserver(function(name) {
            if (DEBUG) {
                host.println(`Child Track 0 name: ${name}`);
            }
        });
        
        childTrack1.exists().addValueObserver(function(exists) {
            childTrack1Exists = exists;
            if (DEBUG) {
                host.println(`Child Track 1 exists: ${exists}`);
            }
        });
        
        childTrack1.name().addValueObserver(function(name) {
            if (DEBUG) {
                host.println(`Child Track 1 name: ${name}`);
            }
        });
        
        if (DEBUG) {
            host.println("Track observers setup complete");
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupTrackObservers: ${error}`);
        }
    }
}

function setupRemoteControlPages() {
    try {
        if (DEBUG) {
            host.println("=== Setting up Remote Control Pages ===");
        }
        
        // Setup Group Track Remote Control Page 4 (for fader) using pinned group track
        if (pinnedGroupTrack) {
            groupTrackRemotePage4 = pinnedGroupTrack.createCursorRemoteControlsPage("GroupPage4", 8, null);
            groupTrackRemotePage4.selectedPageIndex().set(4);
            
            if (DEBUG) {
                host.println("Created Group Track Remote Control Page 4 (using pinned group track)");
            }
            
            // Setup parameter observers for group track page 4
            for (let i = 0; i < 8; i++) {
                const param = groupTrackRemotePage4.getParameter(i);
                param.exists().markInterested();
                param.name().markInterested();
                param.value().markInterested();
                
                param.exists().addValueObserver(function(exists) {
                    if (DEBUG && exists) {
                        host.println(`Group Page 4 Parameter ${i} exists: ${param.name().get()}`);
                    }
                });
                param.value().addValueObserver(function(value) {
                    if (DEBUG) {
                        host.println(`Group Page 4 Parameter ${i} value: ${value}`);
                    }
                });
            }
        }
        
        // Setup Child Track Remote Control Pages (immediate setup like LCXL)
        setupChildTrackRemotePages();
        
        if (DEBUG) {
            host.println("Remote Control Pages setup complete");
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupRemoteControlPages: ${error}`);
        }
    }
}

function setupChildTrackRemotePages() {
    if (!childTrack0 || !childTrack1) {
        if (DEBUG) {
            host.println("Skipping child track remote pages - child tracks not available");
        }
        return;
    }
    
    try {
        if (DEBUG) {
            host.println("Setting up primary devices using pre-created device banks...");
        }
        
        // Use the device banks we created during track setup
        const childTrack0Device = childTrack0DeviceBank.getDevice(0); // Get first device (primary)
        const childTrack1Device = childTrack1DeviceBank.getDevice(0); // Get first device (primary)
        
        // Create remote control pages on the devices
        childTrack0PrimaryDevicePage0 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage0", 8, null);
        childTrack0PrimaryDevicePage0.selectedPageIndex().set(0);
        
        childTrack0PrimaryDevicePage1 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage1", 8, null);
        childTrack0PrimaryDevicePage1.selectedPageIndex().set(1);
        
        childTrack0PrimaryDevicePage2 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage2", 8, null);
        childTrack0PrimaryDevicePage2.selectedPageIndex().set(2);
        
        childTrack1PrimaryDevicePage0 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage0", 8, null);
        childTrack1PrimaryDevicePage0.selectedPageIndex().set(0);
        
        childTrack1PrimaryDevicePage1 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage1", 8, null);
        childTrack1PrimaryDevicePage1.selectedPageIndex().set(1);
        
        childTrack1PrimaryDevicePage2 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage2", 8, null);
        childTrack1PrimaryDevicePage2.selectedPageIndex().set(2);
        
        // Store device references for later use
        childTrack0PrimaryDevice = childTrack0Device;
        childTrack1PrimaryDevice = childTrack1Device;
        
        // Setup Instrument Selector Controls
        childTrack0ChainSelector = childTrack0PrimaryDevice.createChainSelector();
        childTrack1ChainSelector = childTrack1PrimaryDevice.createChainSelector();
        
        if (DEBUG) {
            host.println("Created chain selectors for both child tracks");
        }
        
        // Setup parameter observers for all child track device pages
        setupChildTrackParameterObservers();
        
        if (DEBUG) {
            host.println("Child track device remote control pages setup complete");
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupChildTrackRemotePages: ${error}`);
        }
    }
}

function setupChildTrackParameterObservers() {
    // Setup Chain Selector Observers
    setupChainSelectorObservers();
    
    const pages = [
        { page: childTrack0PrimaryDevicePage0, name: "Child0PrimaryPage0" },
        { page: childTrack0PrimaryDevicePage1, name: "Child0PrimaryPage1" },
        { page: childTrack0PrimaryDevicePage2, name: "Child0PrimaryPage2" },
        { page: childTrack1PrimaryDevicePage0, name: "Child1PrimaryPage0" },
        { page: childTrack1PrimaryDevicePage1, name: "Child1PrimaryPage1" },
        { page: childTrack1PrimaryDevicePage2, name: "Child1PrimaryPage2" }
    ];
    
    pages.forEach(pageInfo => {
        if (pageInfo.page) {
            for (let i = 0; i < 8; i++) {
                const param = pageInfo.page.getParameter(i);
                param.exists().markInterested();
                param.name().markInterested();
                param.value().markInterested();
                
                param.exists().addValueObserver(function(exists) {
                    if (DEBUG && exists) {
                        host.println(`${pageInfo.name} Parameter ${i} exists: ${param.name().get()}`);
                    }
                    
                    // LED rings will be handled automatically by Bitwig
                });
                param.value().addValueObserver(function(value) {
                    if (DEBUG) {
                        host.println(`${pageInfo.name} Parameter ${i} value: ${value}`);
                    }
                    
                    // Update LED rings for encoder-controlled parameters
                    // updateParameterLEDFeedback(pageInfo.name, i, value);
                });
            }
        }
    });
}

function setupChainSelectorObservers() {
    try {
        if (DEBUG) {
            host.println("Setting up chain selector observers...");
        }
        
        // Child Track 0 Chain Selector Observers
        if (childTrack0ChainSelector) {
            childTrack0ChainSelector.exists().markInterested();
            childTrack0ChainSelector.activeChainIndex().markInterested();
            childTrack0ChainSelector.chainCount().markInterested();
            
            childTrack0ChainSelector.exists().addValueObserver(function(exists) {
                if (DEBUG) {
                    host.println(`Child Track 0 chain selector exists: ${exists}`);
                }
            });
            
            childTrack0ChainSelector.activeChainIndex().addValueObserver(function(index) {
                if (DEBUG) {
                    host.println(`Child Track 0 active chain index: ${index}`);
                }
            });
            
            childTrack0ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 0 chain count: ${count}`);
                }
            });
        }
        
        // Child Track 1 Chain Selector Observers
        if (childTrack1ChainSelector) {
            childTrack1ChainSelector.exists().markInterested();
            childTrack1ChainSelector.activeChainIndex().markInterested();
            childTrack1ChainSelector.chainCount().markInterested();
            
            childTrack1ChainSelector.exists().addValueObserver(function(exists) {
                if (DEBUG) {
                    host.println(`Child Track 1 chain selector exists: ${exists}`);
                }
            });
            
            childTrack1ChainSelector.activeChainIndex().addValueObserver(function(index) {
                if (DEBUG) {
                    host.println(`Child Track 1 active chain index: ${index}`);
                }
            });
            
            childTrack1ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 1 chain count: ${count}`);
                }
            });
        }
        
        if (DEBUG) {
            host.println("Chain selector observers setup complete");
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupChainSelectorObservers: ${error}`);
        }
    }
}

// Instrument Selector Helper Functions
function canSelectInstrumentOnChildTrack0() {
    return childTrack0ChainSelector && 
           childTrack0ChainSelector.exists().get() && 
           isChildTrack0Available();
}

function canSelectInstrumentOnChildTrack1() {
    return childTrack1ChainSelector && 
           childTrack1ChainSelector.exists().get() && 
           isChildTrack1Available();
}

function selectInstrumentOnChildTrack0(chainIndex) {
    if (!canSelectInstrumentOnChildTrack0()) {
        if (DEBUG) {
            host.println(`Cannot select instrument on child track 0 - chain selector not available`);
        }
        return false;
    }
    
    const chainCount = childTrack0ChainSelector.chainCount().get();
    if (chainIndex >= chainCount) {
        if (DEBUG) {
            host.println(`Cannot select instrument chain ${chainIndex} on child track 0 - only ${chainCount} chains available`);
        }
        return false;
    }
    
    childTrack0ChainSelector.activeChainIndex().set(chainIndex);
    
    if (DEBUG) {
        host.println(`Selected instrument chain ${chainIndex} on child track 0`);
    }
    
    return true;
}

function selectInstrumentOnChildTrack1(chainIndex) {
    if (!canSelectInstrumentOnChildTrack1()) {
        if (DEBUG) {
            host.println(`Cannot select instrument on child track 1 - chain selector not available`);
        }
        return false;
    }
    
    const chainCount = childTrack1ChainSelector.chainCount().get();
    if (chainIndex >= chainCount) {
        if (DEBUG) {
            host.println(`Cannot select instrument chain ${chainIndex} on child track 1 - only ${chainCount} chains available`);
        }
        return false;
    }
    
    childTrack1ChainSelector.activeChainIndex().set(chainIndex);
    
    if (DEBUG) {
        host.println(`Selected instrument chain ${chainIndex} on child track 1`);
    }
    
    return true;
}


// Track state variables (updated by observers)
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;
let childTrack0Exists = false;
let childTrack1Exists = false;

// Helper functions for track validation
function isValidGroupTrackSetup() {
    return pinnedGroupTrack && 
           pinnedTrackExists && 
           pinnedTrackIsGroup &&
           childTrackBank &&
           childTrack0 && 
           childTrack1;
}

function isChildTrack0Available() {
    return isValidGroupTrackSetup() && childTrack0Exists;
}

function isChildTrack1Available() {
    return isValidGroupTrackSetup() && childTrack1Exists;
}

function areBothChildTracksAvailable() {
    return isChildTrack0Available() && isChildTrack1Available();
}


function logTrackStatus() {
    if (DEBUG) {
        host.println("=== Track Status Summary ===");
        host.println(`Pinned track exists: ${pinnedTrackExists}`);
        host.println(`Pinned track is group: ${pinnedTrackIsGroup}`);
        host.println(`Child Track 0 exists: ${childTrack0Exists}`);
        host.println(`Child Track 1 exists: ${childTrack1Exists}`);
        host.println(`Child Track 0 available: ${isChildTrack0Available()}`);
        host.println(`Child Track 1 available: ${isChildTrack1Available()}`);
        host.println(`Both child tracks available: ${areBothChildTracksAvailable()}`);
        host.println(`Group remote page 4: ${groupTrackRemotePage4 ? 'created' : 'not created'}`);
        host.println(`Child primary device pages: ${childTrack0PrimaryDevicePage0 ? 'created' : 'not created'}`);
        host.println("========================");
    }
}

function flush() {
    // Update LED feedback based on current state
    // This is called regularly by Bitwig
}

function exit() {
    if (DEBUG) {
        host.println("X-Touch Mini Dual (Standard Mode) exited");
    }
}