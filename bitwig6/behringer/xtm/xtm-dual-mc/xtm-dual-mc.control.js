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
let layerAActive = false;  // Controls Child Track 0 Remote Page 1
let layerBActive = false;  // Controls Child Track 1 Remote Page 1

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
let groupTrackFaderPage;

// Primary Device Controls for Child Tracks
let childTrack0PrimaryDevice, childTrack1PrimaryDevice;
let childTrack0PrimaryDevicePage0, childTrack0PrimaryDevicePage1;
let childTrack1PrimaryDevicePage0, childTrack1PrimaryDevicePage1;

// Instrument Selector Controls
// Upper buttons 1-4 select instruments on Child Track 0 (chains 0-3)
// Upper buttons 5-8 select instruments on Child Track 1 (chains 0-3)
let childTrack0ChainSelector, childTrack1ChainSelector;

// Clip Launcher Controls
// Lower buttons 1-4 launch clips on Child Track 0 (slots 0-3)
// Lower buttons 5-8 launch clips on Child Track 1 (slots 0-3)
let childTrack0ClipLauncherSlotBank, childTrack1ClipLauncherSlotBank;

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
    
    // Initialize layer buttons - both off by default (normal operation)
    setLayerLED('A', LED_STATE.OFF);
    setLayerLED('B', LED_STATE.OFF);
    
    // Initialize instrument button LEDs (will be updated by observers)
    initializeInstrumentButtonLEDs();
    
    // Initialize clip launcher button LEDs (will be updated by observers)
    initializeClipButtonLEDs();
    
    if (DEBUG) {
        host.println("X-Touch Mini Dual (MC Mode) initialized - Independent layer system enabled");
        host.println(`Layer A: ${layerAActive ? 'ON' : 'OFF'} (Child Track 0 Remote Page 1), Layer B: ${layerBActive ? 'ON' : 'OFF'} (Child Track 1 Remote Page 1)`);
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
    // Handle Encoders (CC16-CC23)
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
    // Handle Encoder Pushes (Notes 32-39)
    if (note >= NOTE.ENCODER_PUSH_1 && note <= NOTE.ENCODER_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_PUSH_1;
        handleEncoderPush(encoderIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Upper Row Buttons (non-sequential notes)
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed, LAYER.A);
        return;
    }
    
    // Handle Lower Row Buttons (non-sequential notes)
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
    
    // Encoders 1-4 (index 0-3) always control Child Track 0 Primary Device Page 0
    if (encoderIndex >= 0 && encoderIndex <= 3) {
        if (childTrack0PrimaryDevicePage0) {
            const param = childTrack0PrimaryDevicePage0.getParameter(encoderIndex);
            try {
                // Use inc() method for relative control
                param.inc(increment);
                
                // Update LED ring to show current parameter value
                updateEncoderLEDRing(encoderIndex, param.get());
                
                if (DEBUG && Math.random() < 0.1) { // Only log occasionally to avoid spam
                    host.println(`🔵 ENCODER ${encoderIndex + 1} - Page 0 Parameter: ${param.name().get()} = ${param.get()}`);
                }
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
    // Encoder push functionality can be implemented here if needed in the future
}

function handleUpperButton(buttonIndex, isPressed, layer) {
    if (DEBUG) {
        host.println(`Layer ${layer} - Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button presses, not releases
    if (!isPressed) {
        return;
    }
    
    // Upper buttons 1-4 (index 0-3)
    if (buttonIndex >= 0 && buttonIndex <= 3) {
        if (layerAActive) {
            // Layer A active: buttons control Child Track 0 Remote Page 1 parameters (encoders still control Page 0)
            // Access Device Page 1 (mutes) directly - no page switching needed
            if (childTrack0PrimaryDevicePage1 && childTrack0PrimaryDevicePage1.getParameter(buttonIndex).exists().get()) {
                const param = childTrack0PrimaryDevicePage1.getParameter(buttonIndex);
                // Toggle mute parameter
                const currentValue = param.value().get();
                const newValue = currentValue > 0 ? 0 : 127;
                param.value().set(newValue, 128);
                if (DEBUG) {
                    host.println(`🔴 Layer A - Toggled upper button ${buttonIndex + 1}: ${param.name().get()} = ${newValue}`);
                }
            } else {
                if (DEBUG) {
                    host.println(`❌ Child Track 0 Page 1 Parameter ${buttonIndex} (Layer A) not available`);
                }
            }
        } else {
            // Normal operation: instrument chain selection on Child Track 0
            const chainIndex = buttonIndex; // Direct mapping: button 1 -> chain 0, button 2 -> chain 1, etc.
            
            if (canSelectInstrumentOnChildTrack0()) {
                selectInstrumentOnChildTrack0(chainIndex);
                // LED update will be triggered by the chain selector observer
        } else {
    if (DEBUG) {
                    host.println(`Upper button ${buttonIndex + 1} pressed but child track 0 instrument selector not available`);
                }
            }
        }
        return;
    }
    
    // Upper buttons 5-8 (index 4-7)
    if (buttonIndex >= 4 && buttonIndex <= 7) {
        const paramIndex = buttonIndex - 4; // Convert to 0-3 range
        if (layerBActive) {
            // Layer B active: buttons control Child Track 1 Remote Page 1 parameters (encoders still control Page 0)
            // Access Device Page 1 (mutes) directly - no page switching needed
            if (childTrack1PrimaryDevicePage1 && childTrack1PrimaryDevicePage1.getParameter(paramIndex).exists().get()) {
                const param = childTrack1PrimaryDevicePage1.getParameter(paramIndex);
                // Toggle mute parameter
                const currentValue = param.value().get();
                const newValue = currentValue > 0 ? 0 : 127;
                param.value().set(newValue, 128);
                if (DEBUG) {
                    host.println(`🔴 Layer B - Toggled upper button ${buttonIndex + 1}: ${param.name().get()} = ${newValue}`);
                }
            } else {
                if (DEBUG) {
                    host.println(`❌ Child Track 1 Page 1 Parameter ${paramIndex} (Layer B) not available`);
                }
            }
    } else {
            // Normal operation: instrument chain selection on Child Track 1
            const chainIndex = buttonIndex - 4; // Map to 0-3 range: button 5 -> chain 0, button 6 -> chain 1, etc.
            
            if (canSelectInstrumentOnChildTrack1()) {
                selectInstrumentOnChildTrack1(chainIndex);
                // LED update will be triggered by the chain selector observer
            } else {
                if (DEBUG) {
                    host.println(`Upper button ${buttonIndex + 1} pressed but child track 1 instrument selector not available`);
                }
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
    
    // Only handle button presses, not releases
    if (!isPressed) {
        return;
    }
    
    // Lower buttons 1-4 (index 0-3)
    if (buttonIndex >= 0 && buttonIndex <= 3) {
        if (layerAActive) {
            // Layer A active: buttons control Child Track 0 Remote Page 1 parameters 4-7 (second row of mutes)
            if (childTrack0PrimaryDevicePage1 && childTrack0PrimaryDevicePage1.getParameter(buttonIndex + 4).exists().get()) {
                const param = childTrack0PrimaryDevicePage1.getParameter(buttonIndex + 4); // Parameters 4-7
                // Toggle mute parameter
                const currentValue = param.value().get();
                const newValue = currentValue > 0 ? 0 : 127;
                param.value().set(newValue, 128);
                if (DEBUG) {
                    host.println(`🔴 Layer A - Toggled lower button ${buttonIndex + 1}: ${param.name().get()} = ${newValue}`);
                }
            } else {
                if (DEBUG) {
                    host.println(`❌ Child Track 0 Page 1 Parameter ${buttonIndex + 4} (Layer A lower button) not available`);
                }
            }
        } else {
            // Normal operation: launch clips on Child Track 0
            const slotIndex = buttonIndex; // Direct mapping: button 1 -> slot 0, button 2 -> slot 1, etc.
            
            if (childTrack0ClipLauncherSlotBank && childTrack0 && childTrack0.exists().get()) {
                // Launch individual clip slot (not scene)
                const clipSlot = childTrack0ClipLauncherSlotBank.getItemAt(slotIndex);
                if (clipSlot) {
                    if (DEBUG) {
                        host.println(`Launching clip slot ${slotIndex} on Child Track 0`);
                    }
                    clipSlot.launch();
                } else {
                    if (DEBUG) {
                        host.println(`❌ Child Track 0 clip slot ${slotIndex} does not exist`);
                    }
                }
            } else {
    if (DEBUG) {
                    host.println(`❌ Lower button ${buttonIndex + 1} pressed but Child Track 0 clip launcher not available (track exists: ${childTrack0 ? childTrack0.exists().get() : 'no track'}, launcher: ${childTrack0ClipLauncherSlotBank ? 'yes' : 'no'})`);
                }
            }
        }
        return;
    }
    
    // Lower buttons 5-8 (index 4-7)
    if (buttonIndex >= 4 && buttonIndex <= 7) {
        const paramIndex = buttonIndex - 4; // Convert to 0-3 range
        if (layerBActive) {
            // Layer B active: buttons control Child Track 1 Remote Page 1 parameters 4-7 (second row of mutes)
            if (childTrack1PrimaryDevicePage1 && childTrack1PrimaryDevicePage1.getParameter(paramIndex + 4).exists().get()) {
                const param = childTrack1PrimaryDevicePage1.getParameter(paramIndex + 4); // Parameters 4-7
                // Toggle mute parameter
                const currentValue = param.value().get();
                const newValue = currentValue > 0 ? 0 : 127;
                param.value().set(newValue, 128);
                if (DEBUG) {
                    host.println(`🔴 Layer B - Toggled lower button ${buttonIndex + 1}: ${param.name().get()} = ${newValue}`);
                }
            } else {
                if (DEBUG) {
                    host.println(`❌ Child Track 1 Page 1 Parameter ${paramIndex + 4} (Layer B lower button) not available`);
                }
            }
        } else {
            // Normal operation: launch clips on Child Track 1
            const slotIndex = buttonIndex - 4; // Map to 0-3 range: button 5 -> slot 0, button 6 -> slot 1, etc.
            
            if (childTrack1ClipLauncherSlotBank) {
                // Launch individual clip slot (not scene)
                const clipSlot = childTrack1ClipLauncherSlotBank.getItemAt(slotIndex);
                if (clipSlot) {
                    if (DEBUG) {
                        host.println(`Launching clip slot ${slotIndex} on Child Track 1`);
                    }
                    clipSlot.launch();
                } else {
                    if (DEBUG) {
                        host.println(`❌ Child Track 1 clip slot ${slotIndex} does not exist`);
                    }
                }
    } else {
                if (DEBUG) {
                    host.println(`❌ Lower button ${buttonIndex + 1} pressed but Child Track 1 clip launcher not available (launcher: ${childTrack1ClipLauncherSlotBank ? 'yes' : 'no'})`);
                }
            }
        }
        return;
    }
    
    if (DEBUG) {
        host.println(`Lower button ${buttonIndex + 1} - no functionality mapped`);
    }
}

function handleFaderPitchBend(lsb, msb) {
    // Convert 14-bit pitch bend to full 14-bit range (0-16383)
    const pitchBendValue = (msb << 7) | lsb;
    
    // Convert 14-bit (0-16383) to normalized 0.0-1.0 range
    const normalizedValue = pitchBendValue / 16383.0;
    
    if (DEBUG) {
        host.println(`Fader moved: raw=${pitchBendValue} (LSB=${lsb}, MSB=${msb}), normalized=${normalizedValue.toFixed(4)}`);
    }
    
    // Control group track fader page parameter 0
    if (groupTrackFaderPage) {
        const param = groupTrackFaderPage.getParameter(0);
        if (param && param.exists().get()) {
            // Set parameter with normalized value (no resolution parameter for smoother control)
            param.set(normalizedValue);
            
            if (DEBUG) {
                host.println(`Fader -> Group track fader page parameter 0: ${normalizedValue.toFixed(4)}`);
            }
        } else {
            if (DEBUG) {
                host.println(`Fader moved but group track fader page parameter 0 not available`);
            }
        }
    } else {
        if (DEBUG) {
            host.println(`Fader moved but group track fader page not available`);
        }
    }
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button press (not release) for toggle behavior
    if (!isPressed) {
        return;
    }
    
    // Independent toggle logic: both layers can be active simultaneously
    if (layer === 'A') {
        // Toggle Layer A (controls Child Track 0 Remote Page 1)
        layerAActive = !layerAActive;
        setLayerLED('A', layerAActive ? LED_STATE.ON : LED_STATE.OFF);
        
        // Update LED feedback for upper buttons 1-4
        updateLayerAButtonLEDs();
        
        if (DEBUG) {
            host.println(`Layer A ${layerAActive ? 'activated' : 'deactivated'} - Child Track 0 Remote Page 1 control`);
        }
    } else if (layer === 'B') {
        // Toggle Layer B (controls Child Track 1 Remote Page 1)
        layerBActive = !layerBActive;
        setLayerLED('B', layerBActive ? LED_STATE.ON : LED_STATE.OFF);
        
        // Update LED feedback for upper buttons 5-8
        updateLayerBButtonLEDs();
        
        if (DEBUG) {
            host.println(`Layer B ${layerBActive ? 'activated' : 'deactivated'} - Child Track 1 Remote Page 1 control`);
        }
    }
}

// LED Control Functions (Mackie Control Universal standard)
function setLEDRingValue(encoderIndex, value) {
    // Mackie Control uses CC48-55 for LED rings with specific value ranges:
    // 0 = All LEDs Off
    // 1-11 = Single LED Mode (positions 1-11)
    // 17-27 = Trim Mode, 33-43 = Fan Mode (positions 1-11), 49-59 = Spread Mode
    // We're using Fan Mode: 32 + position (0-11)
    
    const ccNumbers = [CC.LED_RING_1, CC.LED_RING_2, CC.LED_RING_3, CC.LED_RING_4,
                       CC.LED_RING_5, CC.LED_RING_6, CC.LED_RING_7, CC.LED_RING_8];
    const cc = ccNumbers[encoderIndex];
    
    midiOut.sendMidi(0xB0 + LED_GLOBAL_CHANNEL, cc, value);
}

function updateEncoderLEDRing(encoderIndex, parameterValue) {
    // Convert parameter value (0.0-1.0) to X-Touch Mini LED ring value
    // Using Fan Mode (based on working C# code: KnobRingStyle.Fan => value + 32)
    let position;
    if (parameterValue <= 0.0) {
        position = 0; // All LEDs off
    } else if (parameterValue >= 1.0) {
        position = 11; // Maximum position
    } else {
        // Map 0.0-1.0 to LED positions 1-11
        position = Math.floor(parameterValue * 10) + 1;
    }
    
    // Fan Mode: add 32 to the position (C# code: KnobRingStyle.Fan => value + 32)
    const ledValue = position + 32;
    
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

function updateMuteParameterLEDFeedback(pageName, parameterIndex, parameterValue) {
    // Update button LEDs for mute parameters when in layer mode
    // Child0PrimaryPage1 (mutes) parameters 0-3 map to upper buttons 1-4, parameters 4-7 map to lower buttons 1-4 when Layer A is active
    // Child1PrimaryPage1 (mutes) parameters 0-3 map to upper buttons 5-8, parameters 4-7 map to lower buttons 5-8 when Layer B is active
    
    if (pageName === "Child0PrimaryPage1" && layerAActive) {
        if (parameterIndex >= 0 && parameterIndex <= 3) {
            // Layer A is active - update upper buttons 1-4 (parameters 0-3)
            const buttonIndex = parameterIndex; // Direct mapping: param 0 -> button 0, etc.
            const ledState = parameterValue > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setInstrumentButtonLED(buttonIndex, ledState);
            
            if (DEBUG) {
                host.println(`🔴 Layer A - Updated upper button ${buttonIndex + 1} LED: ${ledState} (mute value: ${parameterValue})`);
            }
        } else if (parameterIndex >= 4 && parameterIndex <= 7) {
            // Layer A is active - update lower buttons 1-4 (parameters 4-7)
            const buttonIndex = parameterIndex - 4; // Map param 4-7 to button 0-3
            const ledState = parameterValue > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setClipButtonLED(buttonIndex, ledState); // Lower buttons use clip button LED function
            
            if (DEBUG) {
                host.println(`🔴 Layer A - Updated lower button ${buttonIndex + 1} LED: ${ledState} (mute value: ${parameterValue})`);
            }
        }
    } else if (pageName === "Child1PrimaryPage1" && layerBActive) {
        if (parameterIndex >= 0 && parameterIndex <= 3) {
            // Layer B is active - update upper buttons 5-8 (parameters 0-3)
            const buttonIndex = parameterIndex + 4; // Map to buttons 4-7: param 0 -> button 4, etc.
            const ledState = parameterValue > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setInstrumentButtonLED(buttonIndex, ledState);
            
            if (DEBUG) {
                host.println(`🔴 Layer B - Updated upper button ${buttonIndex + 1} LED: ${ledState} (mute value: ${parameterValue})`);
            }
        } else if (parameterIndex >= 4 && parameterIndex <= 7) {
            // Layer B is active - update lower buttons 5-8 (parameters 4-7)
            const buttonIndex = parameterIndex; // Map param 4-7 to button 4-7
            const ledState = parameterValue > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setClipButtonLED(buttonIndex, ledState); // Lower buttons use clip button LED function
            
            if (DEBUG) {
                host.println(`🔴 Layer B - Updated lower button ${buttonIndex + 1} LED: ${ledState} (mute value: ${parameterValue})`);
            }
        }
    }
}

function updateLayerAButtonLEDs() {
    // Update upper buttons 1-4 and lower buttons 1-4 LEDs based on Layer A state
    if (layerAActive && childTrack0PrimaryDevicePage1) {
        // Layer A is active - show mute parameter states
        // Upper buttons 1-4: parameters 0-3
        for (let i = 0; i < 4; i++) {
            const param = childTrack0PrimaryDevicePage1.getParameter(i);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setInstrumentButtonLED(i, ledState);
            } else {
                setInstrumentButtonLED(i, LED_STATE.OFF);
            }
        }
        // Lower buttons 1-4: parameters 4-7
        for (let i = 0; i < 4; i++) {
            const param = childTrack0PrimaryDevicePage1.getParameter(i + 4);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setClipButtonLED(i, ledState);
            } else {
                setClipButtonLED(i, LED_STATE.OFF);
            }
        }
        if (DEBUG) {
            host.println("🔴 Layer A - Switched to mute parameter LED feedback (upper + lower buttons 1-4)");
        }
    } else {
        // Layer A is not active - show instrument selector states (upper) and clip launcher states (lower)
        if (childTrack0ChainSelector && childTrack0ChainSelector.exists().get()) {
            const activeIndex = childTrack0ChainSelector.activeChainIndex().get();
            const chainCount = childTrack0ChainSelector.chainCount().get();
            updateChildTrack0InstrumentLEDs(activeIndex, chainCount);
        } else {
            // No chain selector - turn off upper LEDs
            for (let i = 0; i < 4; i++) {
                setInstrumentButtonLED(i, LED_STATE.OFF);
            }
        }
        // Lower buttons return to clip launcher LED control - manually refresh states
        refreshChildTrack0ClipLauncherLEDs();
        if (DEBUG) {
            host.println("🔴 Layer A - Switched to instrument selector + clip launcher LED feedback");
        }
    }
}

function updateLayerBButtonLEDs() {
    // Update upper buttons 5-8 and lower buttons 5-8 LEDs based on Layer B state
    if (layerBActive && childTrack1PrimaryDevicePage1) {
        // Layer B is active - show mute parameter states
        // Upper buttons 5-8: parameters 0-3
        for (let i = 0; i < 4; i++) {
            const param = childTrack1PrimaryDevicePage1.getParameter(i);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setInstrumentButtonLED(i + 4, ledState); // Map to buttons 4-7
            } else {
                setInstrumentButtonLED(i + 4, LED_STATE.OFF);
            }
        }
        // Lower buttons 5-8: parameters 4-7
        for (let i = 0; i < 4; i++) {
            const param = childTrack1PrimaryDevicePage1.getParameter(i + 4);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setClipButtonLED(i + 4, ledState); // Map to buttons 4-7
            } else {
                setClipButtonLED(i + 4, LED_STATE.OFF);
            }
        }
        if (DEBUG) {
            host.println("🔴 Layer B - Switched to mute parameter LED feedback (upper + lower buttons 5-8)");
        }
    } else {
        // Layer B is not active - show instrument selector states (upper) and clip launcher states (lower)
        if (childTrack1ChainSelector && childTrack1ChainSelector.exists().get()) {
            const activeIndex = childTrack1ChainSelector.activeChainIndex().get();
            const chainCount = childTrack1ChainSelector.chainCount().get();
            updateChildTrack1InstrumentLEDs(activeIndex, chainCount);
        } else {
            // No chain selector - turn off upper LEDs
            for (let i = 4; i < 8; i++) {
                setInstrumentButtonLED(i, LED_STATE.OFF);
            }
        }
        // Lower buttons return to clip launcher LED control - manually refresh states
        refreshChildTrack1ClipLauncherLEDs();
        if (DEBUG) {
            host.println("🔴 Layer B - Switched to instrument selector + clip launcher LED feedback");
        }
    }
}

function refreshChildTrack0ClipLauncherLEDs() {
    // Manually refresh clip launcher LED states for lower buttons 1-4
    if (childTrack0ClipLauncherSlotBank) {
        for (let i = 0; i < 4; i++) {
            const slot = childTrack0ClipLauncherSlotBank.getItemAt(i);
            if (slot) {
                const buttonIndex = i; // Direct mapping: slot 0 -> button 0, etc.
                if (slot.isPlaying().get()) {
                    setClipButtonLED(buttonIndex, LED_STATE.ON);
                } else if (slot.hasContent().get()) {
                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                } else {
                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                }
            } else {
                setClipButtonLED(i, LED_STATE.OFF);
            }
        }
    } else {
        // No clip launcher - turn off LEDs
        for (let i = 0; i < 4; i++) {
            setClipButtonLED(i, LED_STATE.OFF);
        }
    }
}

function refreshChildTrack1ClipLauncherLEDs() {
    // Manually refresh clip launcher LED states for lower buttons 5-8
    if (childTrack1ClipLauncherSlotBank) {
        for (let i = 0; i < 4; i++) {
            const slot = childTrack1ClipLauncherSlotBank.getItemAt(i);
            if (slot) {
                const buttonIndex = i + 4; // Map to buttons 4-7: slot 0 -> button 4, etc.
                if (slot.isPlaying().get()) {
                    setClipButtonLED(buttonIndex, LED_STATE.ON);
                } else if (slot.hasContent().get()) {
                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                } else {
                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                }
            } else {
                setClipButtonLED(i + 4, LED_STATE.OFF);
            }
        }
    } else {
        // No clip launcher - turn off LEDs
        for (let i = 4; i < 8; i++) {
            setClipButtonLED(i, LED_STATE.OFF);
        }
    }
}

function initializeLEDRings() {
    // Initialize all encoder LED rings using Mackie Control protocol
    // Using Fan mode like the C# code Reset function
    for (let i = 0; i < 8; i++) {
        // Fan mode with position 0 (all LEDs off): 32 + 0 = 32
        setLEDRingValue(i, 32);
    }
}

function initializeInstrumentButtonLEDs() {
    // Initialize all instrument button LEDs to off
    // They will be updated by the chain selector observers once tracks are available
    for (let i = 0; i < 8; i++) {
        setInstrumentButtonLED(i, LED_STATE.OFF);
    }
}

function initializeClipButtonLEDs() {
    // Initialize all clip launcher button LEDs to off
    // They will be updated by the clip launcher observers once tracks are available
    for (let i = 0; i < 8; i++) {
        setClipButtonLED(i, LED_STATE.OFF);
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

// Instrument Button LED Functions
function setInstrumentButtonLED(buttonIndex, state) {
    // Map button index to the correct MIDI note
    const upperButtonNotes = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                             NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    
    if (buttonIndex >= 0 && buttonIndex < upperButtonNotes.length) {
        const note = upperButtonNotes[buttonIndex];
        const velocity = state; // 0=off, 127=on, 1=blinking
        
        // Always use Note On (0x90) with velocity for LED state
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function updateChildTrack0InstrumentLEDs(activeChainIndex, chainCount) {
    // Update LEDs for buttons 1-4 (Child Track 0)
    for (let i = 0; i < 4; i++) {
        if (i < chainCount && i === activeChainIndex) {
            // This chain is active - turn LED on
            setInstrumentButtonLED(i, LED_STATE.ON);
        } else {
            // This chain is inactive or doesn't exist - turn LED off
            setInstrumentButtonLED(i, LED_STATE.OFF);
        }
    }
}

function updateChildTrack1InstrumentLEDs(activeChainIndex, chainCount) {
    // Update LEDs for buttons 5-8 (Child Track 1)
    for (let i = 4; i < 8; i++) {
        const chainIndex = i - 4; // Convert to 0-3 range for Child Track 1
        if (chainIndex < chainCount && chainIndex === activeChainIndex) {
            // This chain is active - turn LED on
            setInstrumentButtonLED(i, LED_STATE.ON);
        } else {
            // This chain is inactive or doesn't exist - turn LED off
            setInstrumentButtonLED(i, LED_STATE.OFF);
        }
    }
}

// Clip Launcher Button LED Functions
function setClipButtonLED(buttonIndex, state) {
    // Map button index to the correct MIDI note (lower row buttons)
    const lowerButtonNotes = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                             NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    
    if (buttonIndex >= 0 && buttonIndex < lowerButtonNotes.length) {
        const note = lowerButtonNotes[buttonIndex];
        const velocity = state; // 0=off, 127=on, 1=blinking
        
        if (DEBUG) {
            host.println(`🔵 setClipButtonLED: Button ${buttonIndex + 1}, Note ${note}, Velocity ${velocity}, Channel ${OUTPUT_MIDI_CHANNEL + 1}`);
        }
        
        // Always use Note On (0x90) with velocity for LED state
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

// LED update functions removed - now using proper observers for real-time feedback

function setupTracks() {
    if (DEBUG) {
        host.println("Setting up track management...");
    }
    
    try {
        // Create main track bank and get the pinned group track
        trackBank = host.createTrackBank(8, 0, 0, false);
        pinnedGroupTrack = trackBank.getTrack(PINNED_GROUP_TRACK_INDEX);
        
        // Mark all tracks as interested for clip launcher access (must be done during init)
        for (let i = 0; i < 8; i++) {
            const track = trackBank.getTrack(i);
            if (track) {
                track.exists().markInterested();
            }
        }
        
        // Create child track bank from the group track
        childTrackBank = pinnedGroupTrack.createTrackBank(8, 0, 4, false); // Enable 4 scenes for clip launching
        childTrack0 = childTrackBank.getTrack(0);
        childTrack1 = childTrackBank.getTrack(1);
        
        // Create device banks for accessing primary devices
        childTrack0DeviceBank = childTrack0.createDeviceBank(8);
        childTrack1DeviceBank = childTrack1.createDeviceBank(8);
        
        if (DEBUG) {
            host.println("Track banks and device banks created");
        }
        
        
        // Set up observers for tracks
        setupTrackObservers();
        
        // Setup Remote Control Pages
        setupRemoteControlPages();
        
        // Setup Clip Launcher Slot Banks
        setupClipLauncherSlotBanks();
        
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
        host.println("Setting up remote control pages...");
    }
        
        // Setup Group Track Remote Control Page 4 (for fader) using pinned group track
        if (pinnedGroupTrack) {
            groupTrackRemotePage4 = pinnedGroupTrack.createCursorRemoteControlsPage("GroupPage4", 8, null);
            groupTrackRemotePage4.selectedPageIndex().set(4);
            
            // Setup Group Track Fader Page using filter expression
            groupTrackFaderPage = pinnedGroupTrack.createCursorRemoteControlsPage("GroupFaderPage", 8, "fader");
            
            if (DEBUG) {
                host.println("Created Group Track Remote Control Page 4 (using pinned group track)");
                host.println("Created Group Track Fader Page with 'fader' filter");
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
            
            // Setup parameter observers for group track fader page
            if (groupTrackFaderPage) {
                const faderParam = groupTrackFaderPage.getParameter(0);
                faderParam.exists().markInterested();
                faderParam.name().markInterested();
                faderParam.value().markInterested();
                
                faderParam.exists().addValueObserver(function(exists) {
                    if (DEBUG && exists) {
                        host.println(`Group Fader Page Parameter 0 exists: ${faderParam.name().get()}`);
                    }
                });
                faderParam.value().addValueObserver(function(value) {
                    if (DEBUG) {
                        host.println(`Group Fader Page Parameter 0 value: ${value}`);
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
        
        // Create separate remote control pages - one locked to Page 0, one with filter for 'mutes' tag
        childTrack0PrimaryDevicePage0 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage0", 8, null);
        childTrack0PrimaryDevicePage0.selectedPageIndex().set(0); // Encoders use Page 0 (parameters)
        
        // Create a separate page object for Layer A using filter expression for 'mutes' tag
        childTrack0PrimaryDevicePage1 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage1", 8, "mutes");
        
        childTrack0PrimaryDevicePage2 = null;
        
        childTrack1PrimaryDevicePage0 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage0", 8, null);
        childTrack1PrimaryDevicePage0.selectedPageIndex().set(0); // Encoders use Page 0 (parameters)
        
        // Create a separate page object for Layer B using filter expression for 'mutes' tag
        childTrack1PrimaryDevicePage1 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage1", 8, "mutes");
        
        childTrack1PrimaryDevicePage2 = null;
        
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
        { page: childTrack1PrimaryDevicePage0, name: "Child1PrimaryPage0" },
        { page: childTrack1PrimaryDevicePage1, name: "Child1PrimaryPage1" }
    ].filter(p => p.page !== null); // Filter out null pages
    
    pages.forEach(pageInfo => {
        if (pageInfo.page) {
            for (let i = 0; i < 8; i++) { // Back to 8 parameters per page
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
                    
                    // Update LED feedback for mute parameters when in layer mode
                    updateMuteParameterLEDFeedback(pageInfo.name, i, value);
                });
            }
        }
    });
}

function setupClipLauncherSlotBanks() {
    if (DEBUG) {
        host.println("Setting up clip launcher slot banks...");
    }
    
    try {
        
        // Use Child Track 0 (already exists from group track)
        if (childTrack0) {
            try {
                const clipSlots0 = childTrack0.clipLauncherSlotBank();
                if (clipSlots0) {
                    childTrack0ClipLauncherSlotBank = clipSlots0;
                    if (DEBUG) {
                        host.println("🎯 Adding LED observers for Child Track 0 clips...");
                    }
                    // Mark clip slot properties as interested and add observers for LED feedback
                    for (let i = 0; i < 4; i++) {
                        const slot = clipSlots0.getItemAt(i);
                        if (slot) {
                            slot.hasContent().markInterested();
                            slot.isPlaying().markInterested();
                            
                            // Add observers for LED feedback
                            const buttonIndex = i; // Direct mapping: slot 0 -> button 0, etc.
    
    if (DEBUG) {
                                host.println(`📋 Adding isPlaying observer for Child Track 0 Slot ${i} -> Button ${buttonIndex + 1}`);
                            }
                            
                            slot.isPlaying().addValueObserver((isPlaying) => {
                                if (DEBUG) {
                                    host.println(`🔥 Child Track 0 Slot ${i} isPlaying changed: ${isPlaying}`);
                                }
                                if (isPlaying) {
                                    setClipButtonLED(buttonIndex, LED_STATE.ON);
                                    if (DEBUG) {
                                        host.println(`Setting button ${buttonIndex + 1} LED ON`);
                                    }
                                } else if (slot.hasContent().get()) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                    if (DEBUG) {
                                        host.println(`Setting button ${buttonIndex + 1} LED OFF (has content but not playing)`);
                                    }
                                } else {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                    if (DEBUG) {
                                        host.println(`Setting button ${buttonIndex + 1} LED OFF (no content)`);
                                    }
                                }
                            });
                            
                            slot.hasContent().addValueObserver((hasContent) => {
                                if (!hasContent) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                } else if (!slot.isPlaying().get()) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                }
                            });
                        }
                    }
                } else {
                    if (DEBUG) {
                        host.println("❌ Child Track 0 has no clip launcher slot bank");
                    }
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Child Track 0 error: ${error}`);
                }
            }
        }
        
        // Use Child Track 1 (already exists from group track)
        if (childTrack1) {
            try {
                const clipSlots1 = childTrack1.clipLauncherSlotBank();
                if (clipSlots1) {
                    childTrack1ClipLauncherSlotBank = clipSlots1;
                    if (DEBUG) {
                        host.println("🎯 Adding LED observers for Child Track 1 clips...");
                    }
                    // Mark clip slot properties as interested and add observers for LED feedback
                    for (let i = 0; i < 4; i++) {
                        const slot = clipSlots1.getItemAt(i);
                        if (slot) {
                            slot.hasContent().markInterested();
                            slot.isPlaying().markInterested();
                            
                            // Add observers for LED feedback
                            const buttonIndex = i + 4; // Map to buttons 4-7: slot 0 -> button 4, etc.
                            
                            slot.isPlaying().addValueObserver((isPlaying) => {
                                if (isPlaying) {
                                    setClipButtonLED(buttonIndex, LED_STATE.ON);
                                } else if (slot.hasContent().get()) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                } else {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                }
                            });
                            
                            slot.hasContent().addValueObserver((hasContent) => {
                                if (!hasContent) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                } else if (!slot.isPlaying().get()) {
                                    setClipButtonLED(buttonIndex, LED_STATE.OFF);
                                }
                            });
                        }
                    }
    } else {
                    if (DEBUG) {
                        host.println("❌ Child Track 1 has no clip launcher slot bank");
                    }
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Child Track 1 error: ${error}`);
                }
            }
        }
        
        if (DEBUG) {
            host.println(`Clip launcher setup complete: Track 0=${childTrack0ClipLauncherSlotBank ? 'OK' : 'FAILED'}, Track 1=${childTrack1ClipLauncherSlotBank ? 'OK' : 'FAILED'}`);
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`FATAL ERROR in setupClipLauncherSlotBanks: ${error}`);
        }
    }
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
                // Update instrument button LEDs for Child Track 0 (only if Layer A is not active)
                if (!layerAActive) {
                    const chainCount = childTrack0ChainSelector.chainCount().get();
                    updateChildTrack0InstrumentLEDs(index, chainCount);
                }
            });
            
            childTrack0ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 0 chain count: ${count}`);
                }
                // Update instrument button LEDs when chain count changes (only if Layer A is not active)
                if (!layerAActive) {
                    const activeIndex = childTrack0ChainSelector.activeChainIndex().get();
                    updateChildTrack0InstrumentLEDs(activeIndex, count);
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
                // Update instrument button LEDs for Child Track 1 (only if Layer B is not active)
                if (!layerBActive) {
                    const chainCount = childTrack1ChainSelector.chainCount().get();
                    updateChildTrack1InstrumentLEDs(index, chainCount);
                }
            });
            
            childTrack1ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 1 chain count: ${count}`);
                }
                // Update instrument button LEDs when chain count changes (only if Layer B is not active)
                if (!layerBActive) {
                    const activeIndex = childTrack1ChainSelector.activeChainIndex().get();
                    updateChildTrack1InstrumentLEDs(activeIndex, count);
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
