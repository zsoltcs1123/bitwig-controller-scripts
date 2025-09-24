loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Dual 6 MC Mode",
    "1.0",
    "b1c2d3e4-f5a6-7890-1234-56789abcdef1",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

// MIDI Channel Configuration (MC Mode)
const INPUT_MIDI_CHANNEL = 0;   // Channel 1 (0-based indexing) - MC Mode controls
const FADER_MIDI_CHANNEL = 8;   // Channel 9 (0-based indexing) - Fader uses pitch bend
const OUTPUT_MIDI_CHANNEL = 0;  // Channel 1 (0-based indexing) - for ALL LED feedback in MC Mode
const LED_GLOBAL_CHANNEL = 0;   // Channel 1 (0-based indexing) - MC Mode uses Channel 1 for LED control
const DEBUG = true;

// Track Pinning Configuration
const PINNED_GROUP_TRACK_INDEX = 0; // Which group track to pin to (0-based)

// ALTERNATIVE CONFIGURATIONS FOR MULTIPLE CONTROLLERS:
// Controller 1: INPUT=0, FADER=8, OUTPUT=0 (default)
// Controller 2: INPUT=1, FADER=9, OUTPUT=1 (change above values to 1,9,1)
// Controller 3: INPUT=2, FADER=10, OUTPUT=2 (change above values to 2,10,2)

// MIDI CC Numbers (MC Mode)
const CC = {
    // Encoders Turn (CC16-CC23)
    ENCODER_1: 16, ENCODER_2: 17, ENCODER_3: 18, ENCODER_4: 19,
    ENCODER_5: 20, ENCODER_6: 21, ENCODER_7: 22, ENCODER_8: 23,
    // LED Ring Control - MC Mode uses Mackie Control Universal standard (CC48-55)
    LED_RING_1: 48, LED_RING_2: 49, LED_RING_3: 50, LED_RING_4: 51,
    LED_RING_5: 52, LED_RING_6: 53, LED_RING_7: 54, LED_RING_8: 55,
};


// MIDI Note Numbers (MC Mode)
const NOTE = {
    // Encoder Push (Notes 32-39)
    ENCODER_PUSH_1: 32, ENCODER_PUSH_2: 33, ENCODER_PUSH_3: 34, ENCODER_PUSH_4: 35,
    ENCODER_PUSH_5: 36, ENCODER_PUSH_6: 37, ENCODER_PUSH_7: 38, ENCODER_PUSH_8: 39,
    
    // Upper Row Buttons (mixed pattern from logs)
    BUTTON_UPPER_1: 89, BUTTON_UPPER_2: 90, BUTTON_UPPER_3: 40, BUTTON_UPPER_4: 41,
    BUTTON_UPPER_5: 42, BUTTON_UPPER_6: 43, BUTTON_UPPER_7: 44, BUTTON_UPPER_8: 45,
    
    // Lower Row Buttons (mixed pattern from logs)  
    BUTTON_LOWER_1: 87, BUTTON_LOWER_2: 88, BUTTON_LOWER_3: 91, BUTTON_LOWER_4: 92,
    BUTTON_LOWER_5: 86, BUTTON_LOWER_6: 93, BUTTON_LOWER_7: 94, BUTTON_LOWER_8: 95,
    
    // Layer Switch Buttons (THE MISSING PIECES!)
    LAYER_A: 84,
    LAYER_B: 85,
    
    // LED Control Notes (same as input notes)
    LED_BUTTON_UPPER_1: 89, LED_BUTTON_UPPER_2: 90, LED_BUTTON_UPPER_3: 40, LED_BUTTON_UPPER_4: 41,
    LED_BUTTON_UPPER_5: 42, LED_BUTTON_UPPER_6: 43, LED_BUTTON_UPPER_7: 44, LED_BUTTON_UPPER_8: 45,
    LED_BUTTON_LOWER_1: 87, LED_BUTTON_LOWER_2: 88, LED_BUTTON_LOWER_3: 91, LED_BUTTON_LOWER_4: 92,
    LED_BUTTON_LOWER_5: 86, LED_BUTTON_LOWER_6: 93, LED_BUTTON_LOWER_7: 94, LED_BUTTON_LOWER_8: 95,
    LED_LAYER_A: 84,
    LED_LAYER_B: 85,
};

// LED Ring Behavior Constants
const LED_RING_BEHAVIOR = {
    SINGLE: 0,
    PAN: 1,
    FAN: 2,
    SPREAD: 3,
    TRIM: 4
};

// LED States (MC Mode specific - from working C# code)
const LED_STATE = {
    OFF: 0,         // Velocity 0 for OFF
    ON: 127,        // Velocity 127 (0x7f) for steady ON (from C# code)
    BLINKING: 1,    // Velocity 1 for blinking (from C# code)
    ON_ALT: 64      // Alternative velocity to test
};

// Layer Management
const LAYER = {
    A: 'A',
    B: 'B'
};

// Global Variables
let midiIn, midiOut;
let currentLayer = LAYER.A; // Track current layer (Layer A only for now)

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
    
    // Initialize LED rings to Single mode
    initializeLEDRings();
    
    // Initialize layer buttons - set Layer A as active by default
    setLayerLED('A', LED_STATE.ON);
    setLayerLED('B', LED_STATE.OFF);
    
    if (DEBUG) {
        host.println("X-Touch Mini Dual (MC Mode) initialized - Layer A functionality enabled");
        host.println(`Current layer: ${currentLayer}`);
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    // Handle fader pitch bend on channel 8
    if (command === 0xE0 && channel === FADER_MIDI_CHANNEL) { // Pitch Bend
        handleFaderPitchBend(data1, data2);
        return;
    }
    
    // Only process other messages from the input channel
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (DEBUG) {
        const commandName = command === 0xB0 ? 'CC' : command === 0x90 ? 'NoteOn' : command === 0x80 ? 'NoteOff' : 'Unknown';
        host.println(`MIDI: ${commandName} Status=0x${status.toString(16)} Data1=${data1} Data2=${data2} Channel=${channel + 1}`);
    }
    
    if (command === 0xB0) { // Control Change
        if (DEBUG) {
            host.println(`Processing CC${data1} with value ${data2}`);
        }
        handleControlChange(data1, data2);
    } else if (command === 0x90 || (command === 0x80)) { // Note On/Off
        const isNoteOn = (command === 0x90) && (data2 > 0);
        if (DEBUG) {
            host.println(`Processing Note ${data1} ${isNoteOn ? 'ON' : 'OFF'} with velocity ${data2}`);
        }
        handleNote(data1, isNoteOn, data2);
    }
}

function handleControlChange(cc, value) {
    // Handle Encoders (CC16-CC23) - Layer A functionality only
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        const encoderIndex = cc - CC.ENCODER_1;
        handleEncoderTurn(encoderIndex, value, LAYER.A);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled CC: ${cc} Value: ${value}`);
    }
}

function handleNote(note, isPressed, velocity) {
    // Handle Encoder Pushes (Notes 32-39) - Layer A functionality only
    if (note >= NOTE.ENCODER_PUSH_1 && note <= NOTE.ENCODER_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_PUSH_1;
        handleEncoderPush(encoderIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Upper Row Buttons (non-sequential notes) - Layer A functionality only
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Lower Row Buttons (non-sequential notes) - Layer A functionality only
    const lowerButtons = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                         NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    const lowerIndex = lowerButtons.indexOf(note);
    if (lowerIndex !== -1) {
        handleLowerButton(lowerIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Layer Buttons (available in MC Mode but not implementing layer switching yet)
    if (note === NOTE.LAYER_A) {
        handleLayerButton('A', isPressed);
        return;
    }
    if (note === NOTE.LAYER_B) {
        handleLayerButton('B', isPressed);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled Note: ${note} Pressed: ${isPressed} Velocity: ${velocity}`);
    }
}

function handleEncoderTurn(encoderIndex, value, layer) {
    // MC Mode encoders send relative values:
    // 1-63 = clockwise (increment)
    // 65-127 = counter-clockwise (decrement)
    // 64 = center/no change

    // Determine direction - use simple fixed increment
    let increment = 0;

    if (value >= 1 && value <= 63) {
        // Clockwise rotation - positive increment
        increment = 0.03; // Fixed 3% increment
    } else if (value >= 65 && value <= 127) {
        // Counter-clockwise rotation - negative increment
        increment = -0.03; // Fixed 3% decrement
    } else {
        return; // No change for value 64 or 0
    }
    
    // Encoders 1-4 (index 0-3) control Child Track 0 Primary Device Page 0
    if (encoderIndex >= 0 && encoderIndex <= 3) {
        if (childTrack0PrimaryDevicePage0) {
            const param = childTrack0PrimaryDevicePage0.getParameter(encoderIndex);
            try {
                // Use inc() method for relative control
                param.inc(increment);
                
                // Update LED ring to show current parameter value
                updateEncoderLEDRing(encoderIndex, param.get());
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error incrementing Child Track 0 Primary Device Parameter ${encoderIndex}: ${error}`);
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
                // Use inc() method for relative control
                param.inc(increment);
                
                // Update LED ring to show current parameter value
                updateEncoderLEDRing(encoderIndex, param.get());
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error incrementing Child Track 1 Primary Device Parameter ${paramIndex}: ${error}`);
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

function handleFaderPitchBend(lsb, msb) {
    // Convert 14-bit pitch bend to 0-127 range
    const value = Math.floor(((msb << 7) | lsb) / 128);
    
    if (DEBUG) {
        host.println(`Layer ${currentLayer} - Fader moved: ${value}`);
    }
    
    // Just log for now - no functionality
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button press (not release) for toggle behavior
    if (!isPressed) {
        return;
    }
    
    // Toggle layer logic: mutually exclusive toggles
    if (layer === 'A') {
        if (currentLayer === LAYER.A) {
            // Layer A is active, turn it off (no active layer)
            currentLayer = null;
            setLayerLED('A', LED_STATE.OFF);
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A deactivated - no active layer`);
            }
        } else {
            // Activate Layer A, deactivate Layer B
            currentLayer = LAYER.A;
            setLayerLED('A', LED_STATE.ON);
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A activated`);
            }
        }
    } else if (layer === 'B') {
        if (currentLayer === LAYER.B) {
            // Layer B is active, turn it off (no active layer)
            currentLayer = null;
            setLayerLED('A', LED_STATE.OFF);
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer B deactivated - no active layer`);
            }
        } else {
            // Activate Layer B, deactivate Layer A
            currentLayer = LAYER.B;
            setLayerLED('A', LED_STATE.OFF);
            setLayerLED('B', LED_STATE.ON);
            if (DEBUG) {
                host.println(`Layer B activated`);
            }
        }
    }
}

// LED Control Functions (Mackie Control Universal standard)
function setLEDRingValue(encoderIndex, value) {
    // Mackie Control uses CC48-55 for LED rings with specific value ranges:
    // 0 = All LEDs Off
    // 1-11 = Single LED Mode (positions 1-11)
    // 17-27 = Trim Mode, 33-43 = Fan Mode, 49-59 = Spread Mode
    
    const ccNumbers = [CC.LED_RING_1, CC.LED_RING_2, CC.LED_RING_3, CC.LED_RING_4,
                       CC.LED_RING_5, CC.LED_RING_6, CC.LED_RING_7, CC.LED_RING_8];
    const cc = ccNumbers[encoderIndex];
    
    midiOut.sendMidi(0xB0 + LED_GLOBAL_CHANNEL, cc, value);
}

function updateEncoderLEDRing(encoderIndex, parameterValue) {
    // Convert parameter value (0.0-1.0) to X-Touch Mini LED ring value
    // Using Single LED Mode (based on working C# code)
    let position;
    if (parameterValue <= 0.0) {
        position = 0; // All LEDs off
    } else if (parameterValue >= 1.0) {
        position = 11; // Rightmost LED on (max single LED position)
    } else {
        // Map 0.0-1.0 to LED positions 1-11
        position = Math.floor(parameterValue * 10) + 1;
    }
    
    // Single LED Mode: just use the position value (0-11)
    const ledValue = position;
    
    // Send LED ring value using X-Touch Mini Mackie Control protocol
    setLEDRingValue(encoderIndex, ledValue);
}

function updateParameterLEDFeedback(pageName, parameterIndex, parameterValue) {
    // Map parameter changes to encoder LED rings
    // Encoders 1-4 (0-3) = Child Track 0 Primary Device Page 0
    // Encoders 5-8 (4-7) = Child Track 1 Primary Device Page 0
    
    if (pageName === "Child0PrimaryPage0" && parameterIndex >= 0 && parameterIndex <= 3) {
        // Child Track 0, Parameters 0-3 map to Encoders 1-4 (indices 0-3)
        updateEncoderLEDRing(parameterIndex, parameterValue);
    } else if (pageName === "Child1PrimaryPage0" && parameterIndex >= 0 && parameterIndex <= 3) {
        // Child Track 1, Parameters 0-3 map to Encoders 5-8 (indices 4-7)  
        const encoderIndex = parameterIndex + 4;
        updateEncoderLEDRing(encoderIndex, parameterValue);
    }
    // Note: We're only handling Page 0 parameters for now since that's what the encoders control
}

function initializeLEDRings() {
    // Initialize all encoder LED rings using Mackie Control protocol
    for (let i = 0; i < 8; i++) {
        // Turn off all LEDs (value 0)
        setLEDRingValue(i, 0);
    }
}

// Test functions removed - keeping code lean

function setButtonLED(buttonIndex, state) {
    const note = buttonIndex; // 0-15 maps directly to LED notes in MC Mode
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

function setLayerLED(layer, state) {
    const note = (layer === 'A') ? NOTE.LAYER_A : NOTE.LAYER_B;
    const velocity = state; // 0=off, 127=on, 1=blinking (from C# code)
    
    // Always use Note On (0x90) - velocity determines the LED state in MC Mode
    // This matches the C# implementation: SetButtonLedStateImpl always uses 0x90
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
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
                    updateParameterLEDFeedback(pageInfo.name, i, value);
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
        host.println("X-Touch Mini Dual (MC Mode) exited");
    }
}
