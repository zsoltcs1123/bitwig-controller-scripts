loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Single 6 MC Mode",
    "1.0",
    "a1b2c3d4-e5f6-7890-1234-56789abcdef2",
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
    
    // Layer Switch Buttons
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

// Layer Management - Mutually Exclusive
const LAYER = {
    A: 'A',
    B: 'B'
};

// Global Variables
let midiIn, midiOut;
let activeLayer = LAYER.A;  // Start with Layer A active (Child Track 0)

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
let groupTrackSend1Page;
let groupTrackSend2Page;

// Primary Device Controls for Child Tracks
let childTrack0PrimaryDevice, childTrack1PrimaryDevice;
let childTrack0PrimaryDevicePage0, childTrack0PrimaryDevicePage1;
let childTrack1PrimaryDevicePage0, childTrack1PrimaryDevicePage1;

// Instrument Selector Controls
let childTrack0ChainSelector, childTrack1ChainSelector;

// Clip Launcher Controls
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
    
    // Initialize layer buttons - Layer A active by default
    setLayerLED('A', LED_STATE.ON);
    setLayerLED('B', LED_STATE.OFF);
    
    // Initialize button LEDs (will be updated by observers)
    initializeButtonLEDs();
    
    if (DEBUG) {
        host.println("X-Touch Mini Single (MC Mode) initialized - Mutually exclusive layer system enabled");
        host.println(`Active Layer: ${activeLayer} (${activeLayer === LAYER.A ? 'Child Track 0' : 'Child Track 1'})`);
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
    // Handle Encoders (CC16-CC23) - All 8 encoders control the active layer's track
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        const encoderIndex = cc - CC.ENCODER_1;
        handleEncoderTurn(encoderIndex, value);
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
        handleEncoderPush(encoderIndex, isPressed);
        return;
    }
    
    // Handle Upper Row Buttons (non-sequential notes)
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed);
        return;
    }
    
    // Handle Lower Row Buttons (non-sequential notes)
    const lowerButtons = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                         NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    const lowerIndex = lowerButtons.indexOf(note);
    if (lowerIndex !== -1) {
        handleLowerButton(lowerIndex, isPressed);
        return;
    }
    
    // Handle Layer Buttons - Mutually exclusive switching
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

function handleEncoderTurn(encoderIndex, value) {
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
    
    // Encoders 1-5 (index 0-4) control the active layer's track Page 0 parameters
    if (encoderIndex >= 0 && encoderIndex <= 4) {
        const currentTrackDevice = (activeLayer === LAYER.A) ? childTrack0PrimaryDevicePage0 : childTrack1PrimaryDevicePage0;
        const trackName = (activeLayer === LAYER.A) ? "Child Track 0" : "Child Track 1";
        
        if (currentTrackDevice) {
            const param = currentTrackDevice.getParameter(encoderIndex);
            try {
                // Use inc() method for relative control
                param.inc(increment);
                
                // Update LED ring to show current parameter value
                updateEncoderLEDRing(encoderIndex, param.get());
                
                if (DEBUG && Math.random() < 0.1) { // Only log occasionally to avoid spam
                    host.println(`🔵 ENCODER ${encoderIndex + 1} - ${trackName} Page 0 Parameter: ${param.name().get()} = ${param.get()}`);
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error incrementing ${trackName} Primary Device Parameter ${encoderIndex}: ${error}`);
                }
            }
        } else {
            if (DEBUG) {
                host.println(`${trackName} primary device page not available for encoder ${encoderIndex + 1}`);
            }
        }
    }
    // Encoders 6-8 (index 5-7) control group track send parameters based on active layer
    else if (encoderIndex >= 5 && encoderIndex <= 7) {
        const paramIndex = encoderIndex - 5; // Convert to 0-2 range for group track parameters
        const currentGroupSendPage = (activeLayer === LAYER.A) ? groupTrackSend1Page : groupTrackSend2Page;
        const sendTag = (activeLayer === LAYER.A) ? "send1" : "send2";
        
        if (currentGroupSendPage) {
            const param = currentGroupSendPage.getParameter(paramIndex);
            try {
                // Use inc() method for relative control
                param.inc(increment);
                
                // Update LED ring to show current parameter value
                updateEncoderLEDRing(encoderIndex, param.get());
                
                if (DEBUG && Math.random() < 0.1) { // Only log occasionally to avoid spam
                    host.println(`🔵 ENCODER ${encoderIndex + 1} - Group Track ${sendTag} Parameter: ${param.name().get()} = ${param.get()}`);
                }
            } catch (error) {
                if (DEBUG) {
                    host.println(`Error incrementing Group Track ${sendTag} Parameter ${paramIndex}: ${error}`);
                }
            }
        } else {
            if (DEBUG) {
                host.println(`Group Track ${sendTag} page not available for encoder ${encoderIndex + 1}`);
            }
        }
    }
}

function handleEncoderPush(encoderIndex, isPressed) {
    // Encoder push functionality can be implemented here if needed in the future
}

function handleUpperButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${activeLayer} - Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button presses, not releases
    if (!isPressed) {
        return;
    }
    
    // Upper buttons 1-4 (index 0-3): Instrument chain selection for active track
    if (buttonIndex >= 0 && buttonIndex <= 3) {
        const chainIndex = buttonIndex; // Direct mapping: button 1 -> chain 0, button 2 -> chain 1, etc.
        
        if (activeLayer === LAYER.A) {
            if (canSelectInstrumentOnChildTrack0()) {
                selectInstrumentOnChildTrack0(chainIndex);
                // LED update will be triggered by the chain selector observer
            } else {
                if (DEBUG) {
                    host.println(`Upper button ${buttonIndex + 1} pressed but child track 0 instrument selector not available`);
                }
            }
        } else {
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
    
    // Upper buttons 5-8 (index 4-7): Clip launcher for active track
    if (buttonIndex >= 4 && buttonIndex <= 7) {
        const slotIndex = buttonIndex - 4; // Map to 0-3 range: button 5 -> slot 0, button 6 -> slot 1, etc.
        
        if (activeLayer === LAYER.A) {
            if (childTrack0ClipLauncherSlotBank && childTrack0 && childTrack0.exists().get()) {
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
                    host.println(`❌ Upper button ${buttonIndex + 1} pressed but Child Track 0 clip launcher not available`);
                }
            }
        } else {
            if (childTrack1ClipLauncherSlotBank) {
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
                    host.println(`❌ Upper button ${buttonIndex + 1} pressed but Child Track 1 clip launcher not available`);
                }
            }
        }
        return;
    }

    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} - no functionality mapped`);
    }
}

function handleLowerButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${activeLayer} - Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Only handle button presses, not releases
    if (!isPressed) {
        return;
    }
    
    // All 8 lower buttons control mute parameters on the active track's Page 1
    const currentTrackDevicePage1 = (activeLayer === LAYER.A) ? childTrack0PrimaryDevicePage1 : childTrack1PrimaryDevicePage1;
    const trackName = (activeLayer === LAYER.A) ? "Child Track 0" : "Child Track 1";
    
    if (currentTrackDevicePage1 && currentTrackDevicePage1.getParameter(buttonIndex).exists().get()) {
        const param = currentTrackDevicePage1.getParameter(buttonIndex);
        // Toggle mute parameter
        const currentValue = param.value().get();
        const newValue = currentValue > 0 ? 0 : 127;
        param.value().set(newValue, 128);
        if (DEBUG) {
            host.println(`🔴 Layer ${activeLayer} - Toggled lower button ${buttonIndex + 1}: ${param.name().get()} = ${newValue}`);
        }
    } else {
        if (DEBUG) {
            host.println(`❌ ${trackName} Page 1 Parameter ${buttonIndex} (mute button) not available`);
        }
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
    
    // Only handle button press (not release) for switching behavior
    if (!isPressed) {
        return;
    }
    
    // Mutually exclusive layer switching
    if (layer !== activeLayer) {
        // Switch to the new layer
        const previousLayer = activeLayer;
        activeLayer = layer;
        
        // Update layer button LEDs
        setLayerLED('A', activeLayer === LAYER.A ? LED_STATE.ON : LED_STATE.OFF);
        setLayerLED('B', activeLayer === LAYER.B ? LED_STATE.ON : LED_STATE.OFF);
        
        // Update all LEDs for the new active layer
        updateAllLEDsForActiveLayer();
        
        if (DEBUG) {
            host.println(`Switched from Layer ${previousLayer} to Layer ${activeLayer} - ${activeLayer === LAYER.A ? 'Child Track 0' : 'Child Track 1'} now active`);
        }
    } else {
        if (DEBUG) {
            host.println(`Layer ${layer} already active - no change`);
        }
    }
}

function updateAllLEDsForActiveLayer() {
    if (DEBUG) {
        host.println(`🔄 Updating all LEDs for active layer ${activeLayer}`);
    }
    
    // Update encoder LED rings
    updateEncoderLEDRingsForActiveLayer();
    
    // Update upper button LEDs (instrument selector + clip launcher)
    updateUpperButtonLEDsForActiveLayer();
    
    // Update lower button LEDs (mutes)
    updateLowerButtonLEDsForActiveLayer();
}

function updateEncoderLEDRingsForActiveLayer() {
    const currentTrackDevice = (activeLayer === LAYER.A) ? childTrack0PrimaryDevicePage0 : childTrack1PrimaryDevicePage0;
    const currentGroupSendPage = (activeLayer === LAYER.A) ? groupTrackSend1Page : groupTrackSend2Page;
    
    // Update encoders 1-5 (child track device parameters)
    if (currentTrackDevice) {
        for (let i = 0; i < 5; i++) {
            const param = currentTrackDevice.getParameter(i);
            if (param && param.exists().get()) {
                updateEncoderLEDRing(i, param.get());
            } else {
                // Parameter doesn't exist - turn off LED ring
                setLEDRingValue(i, 32); // Fan mode with position 0 (all LEDs off)
            }
        }
    } else {
        // No device available - turn off encoders 1-5 LED rings
        for (let i = 0; i < 5; i++) {
            setLEDRingValue(i, 32); // Fan mode with position 0 (all LEDs off)
        }
    }
    
    // Update encoders 6-8 (group track send parameters)
    if (currentGroupSendPage) {
        for (let i = 5; i < 8; i++) {
            const paramIndex = i - 5; // Convert to 0-2 range for group track parameters
            const param = currentGroupSendPage.getParameter(paramIndex);
            if (param && param.exists().get()) {
                updateEncoderLEDRing(i, param.get());
            } else {
                // Parameter doesn't exist - turn off LED ring
                setLEDRingValue(i, 32); // Fan mode with position 0 (all LEDs off)
            }
        }
    } else {
        // No group send page available - turn off encoders 6-8 LED rings
        for (let i = 5; i < 8; i++) {
            setLEDRingValue(i, 32); // Fan mode with position 0 (all LEDs off)
        }
    }
}

function updateUpperButtonLEDsForActiveLayer() {
    // Upper buttons 1-4: Instrument selector
    if (activeLayer === LAYER.A) {
        if (childTrack0ChainSelector && childTrack0ChainSelector.exists().get()) {
            const activeIndex = childTrack0ChainSelector.activeChainIndex().get();
            const chainCount = childTrack0ChainSelector.chainCount().get();
            updateInstrumentSelectorLEDs(activeIndex, chainCount, 0, 4); // Buttons 0-3
        } else {
            // No chain selector - turn off LEDs
            for (let i = 0; i < 4; i++) {
                setUpperButtonLED(i, LED_STATE.OFF);
            }
        }
    } else {
        if (childTrack1ChainSelector && childTrack1ChainSelector.exists().get()) {
            const activeIndex = childTrack1ChainSelector.activeChainIndex().get();
            const chainCount = childTrack1ChainSelector.chainCount().get();
            updateInstrumentSelectorLEDs(activeIndex, chainCount, 0, 4); // Buttons 0-3
        } else {
            // No chain selector - turn off LEDs
            for (let i = 0; i < 4; i++) {
                setUpperButtonLED(i, LED_STATE.OFF);
            }
        }
    }
    
    // Upper buttons 5-8: Clip launcher
    if (activeLayer === LAYER.A) {
        refreshClipLauncherLEDs(childTrack0ClipLauncherSlotBank, 4, 8); // Buttons 4-7
    } else {
        refreshClipLauncherLEDs(childTrack1ClipLauncherSlotBank, 4, 8); // Buttons 4-7
    }
}

function updateLowerButtonLEDsForActiveLayer() {
    // All 8 lower buttons: Mute parameters
    const currentTrackDevicePage1 = (activeLayer === LAYER.A) ? childTrack0PrimaryDevicePage1 : childTrack1PrimaryDevicePage1;
    
    if (currentTrackDevicePage1) {
        for (let i = 0; i < 8; i++) {
            const param = currentTrackDevicePage1.getParameter(i);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setLowerButtonLED(i, ledState);
            } else {
                setLowerButtonLED(i, LED_STATE.OFF);
            }
        }
    } else {
        // No mute page available - turn off all lower button LEDs
        for (let i = 0; i < 8; i++) {
            setLowerButtonLED(i, LED_STATE.OFF);
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
    // Map parameter changes to encoder LED rings for the active layer
    if ((pageName === "Child0PrimaryPage0" && activeLayer === LAYER.A) ||
        (pageName === "Child1PrimaryPage0" && activeLayer === LAYER.B)) {
        // Only update encoders 1-5 for child track device parameters
        if (parameterIndex >= 0 && parameterIndex <= 4) {
            updateEncoderLEDRing(parameterIndex, parameterValue);
        }
    }
    // Map group track send parameter changes to encoders 6-8
    else if ((pageName === "GroupSend1Page" && activeLayer === LAYER.A) ||
             (pageName === "GroupSend2Page" && activeLayer === LAYER.B)) {
        // Map parameters 0-2 to encoders 6-8 (indices 5-7)
        if (parameterIndex >= 0 && parameterIndex <= 2) {
            const encoderIndex = parameterIndex + 5; // Convert to encoder indices 5-7
            updateEncoderLEDRing(encoderIndex, parameterValue);
        }
    }
}

function updateMuteParameterLEDFeedback(pageName, parameterIndex, parameterValue) {
    // Update lower button LEDs for mute parameters on the active layer
    if ((pageName === "Child0PrimaryPage1" && activeLayer === LAYER.A) ||
        (pageName === "Child1PrimaryPage1" && activeLayer === LAYER.B)) {
        if (parameterIndex >= 0 && parameterIndex <= 7) {
            const ledState = parameterValue > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setLowerButtonLED(parameterIndex, ledState);
            
            if (DEBUG) {
                host.println(`🔴 Layer ${activeLayer} - Updated lower button ${parameterIndex + 1} LED: ${ledState} (mute value: ${parameterValue})`);
            }
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

function initializeButtonLEDs() {
    // Initialize all button LEDs to off
    // They will be updated by the observers once tracks are available
    for (let i = 0; i < 8; i++) {
        setUpperButtonLED(i, LED_STATE.OFF);
        setLowerButtonLED(i, LED_STATE.OFF);
    }
}

function setLayerLED(layer, state) {
    const note = (layer === 'A') ? NOTE.LAYER_A : NOTE.LAYER_B;
    const velocity = state; // 0=off, 127=on, 1=blinking (from C# code)
    
    // Always use Note On (0x90) - velocity determines the LED state in MC Mode
    // This matches the C# implementation: SetButtonLedStateImpl always uses 0x90
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
}

// Upper Button LED Functions
function setUpperButtonLED(buttonIndex, state) {
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

function updateInstrumentSelectorLEDs(activeChainIndex, chainCount, startButton, endButton) {
    // Update LEDs for instrument selector buttons
    for (let i = startButton; i < endButton; i++) {
        const chainIndex = i - startButton; // Convert to 0-based chain index
        if (chainIndex < chainCount && chainIndex === activeChainIndex) {
            // This chain is active - turn LED on
            setUpperButtonLED(i, LED_STATE.ON);
        } else {
            // This chain is inactive or doesn't exist - turn LED off
            setUpperButtonLED(i, LED_STATE.OFF);
        }
    }
}

// Lower Button LED Functions
function setLowerButtonLED(buttonIndex, state) {
    // Map button index to the correct MIDI note (lower row buttons)
    const lowerButtonNotes = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                             NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    
    if (buttonIndex >= 0 && buttonIndex < lowerButtonNotes.length) {
        const note = lowerButtonNotes[buttonIndex];
        const velocity = state; // 0=off, 127=on, 1=blinking
        
        if (DEBUG) {
            host.println(`🔵 setLowerButtonLED: Button ${buttonIndex + 1}, Note ${note}, Velocity ${velocity}, Channel ${OUTPUT_MIDI_CHANNEL + 1}`);
        }
        
        // Always use Note On (0x90) with velocity for LED state
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function refreshClipLauncherLEDs(clipLauncherSlotBank, startButton, endButton) {
    // Manually refresh clip launcher LED states for specified button range
    if (clipLauncherSlotBank) {
        for (let i = startButton; i < endButton; i++) {
            const slotIndex = i - startButton; // Convert to 0-based slot index
            const slot = clipLauncherSlotBank.getItemAt(slotIndex);
            if (slot) {
                if (slot.isPlaying().get()) {
                    setUpperButtonLED(i, LED_STATE.ON);
                } else if (slot.hasContent().get()) {
                    setUpperButtonLED(i, LED_STATE.OFF);
                } else {
                    setUpperButtonLED(i, LED_STATE.OFF);
                }
            } else {
                setUpperButtonLED(i, LED_STATE.OFF);
            }
        }
    } else {
        // No clip launcher - turn off LEDs
        for (let i = startButton; i < endButton; i++) {
            setUpperButtonLED(i, LED_STATE.OFF);
        }
    }
}

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
            
            // Setup Group Track Send Pages using filter expressions
            groupTrackSend1Page = pinnedGroupTrack.createCursorRemoteControlsPage("GroupSend1Page", 8, "send1");
            groupTrackSend2Page = pinnedGroupTrack.createCursorRemoteControlsPage("GroupSend2Page", 8, "send2");
            
            if (DEBUG) {
                host.println("Created Group Track Remote Control Page 4 (using pinned group track)");
                host.println("Created Group Track Fader Page with 'fader' filter");
                host.println("Created Group Track Send1 Page with 'send1' filter");
                host.println("Created Group Track Send2 Page with 'send2' filter");
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
            
            // Setup parameter observers for group track send1 page
            if (groupTrackSend1Page) {
                for (let i = 0; i < 3; i++) { // Only need 3 parameters for encoders 6-8
                    const param = groupTrackSend1Page.getParameter(i);
                    param.exists().markInterested();
                    param.name().markInterested();
                    param.value().markInterested();
                    
                    param.exists().addValueObserver(function(exists) {
                        if (DEBUG && exists) {
                            host.println(`Group Send1 Page Parameter ${i} exists: ${param.name().get()}`);
                        }
                    });
                    param.value().addValueObserver(function(value) {
                        if (DEBUG) {
                            host.println(`Group Send1 Page Parameter ${i} value: ${value}`);
                        }
                        // Update LED feedback for send1 parameters
                        updateParameterLEDFeedback("GroupSend1Page", i, value);
                    });
                }
            }
            
            // Setup parameter observers for group track send2 page
            if (groupTrackSend2Page) {
                for (let i = 0; i < 3; i++) { // Only need 3 parameters for encoders 6-8
                    const param = groupTrackSend2Page.getParameter(i);
                    param.exists().markInterested();
                    param.name().markInterested();
                    param.value().markInterested();
                    
                    param.exists().addValueObserver(function(exists) {
                        if (DEBUG && exists) {
                            host.println(`Group Send2 Page Parameter ${i} exists: ${param.name().get()}`);
                        }
                    });
                    param.value().addValueObserver(function(value) {
                        if (DEBUG) {
                            host.println(`Group Send2 Page Parameter ${i} value: ${value}`);
                        }
                        // Update LED feedback for send2 parameters
                        updateParameterLEDFeedback("GroupSend2Page", i, value);
                    });
                }
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
        
        // Create a separate page object for mutes using filter expression for 'mutes' tag
        childTrack0PrimaryDevicePage1 = childTrack0Device.createCursorRemoteControlsPage("Child0DevicePage1", 8, "mutes");
        
        childTrack1PrimaryDevicePage0 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage0", 8, null);
        childTrack1PrimaryDevicePage0.selectedPageIndex().set(0); // Encoders use Page 0 (parameters)
        
        // Create a separate page object for mutes using filter expression for 'mutes' tag
        childTrack1PrimaryDevicePage1 = childTrack1Device.createCursorRemoteControlsPage("Child1DevicePage1", 8, "mutes");
        
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
                });
                param.value().addValueObserver(function(value) {
                    if (DEBUG) {
                        host.println(`${pageInfo.name} Parameter ${i} value: ${value}`);
                    }
                    
                    // Update LED rings for encoder-controlled parameters
                    updateParameterLEDFeedback(pageInfo.name, i, value);
                    
                    // Update LED feedback for mute parameters
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
                            
                            // Add observers for LED feedback - only update if this track is active
                            const buttonIndex = i + 4; // Map to upper buttons 5-8
                            
                            slot.isPlaying().addValueObserver((isPlaying) => {
                                if (activeLayer === LAYER.A) { // Only update if Layer A is active
                                    if (isPlaying) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.ON);
                                    } else if (slot.hasContent().get()) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    } else {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    }
                                }
                            });
                            
                            slot.hasContent().addValueObserver((hasContent) => {
                                if (activeLayer === LAYER.A) { // Only update if Layer A is active
                                    if (!hasContent) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    } else if (!slot.isPlaying().get()) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    }
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
                            
                            // Add observers for LED feedback - only update if this track is active
                            const buttonIndex = i + 4; // Map to upper buttons 5-8
                            
                            slot.isPlaying().addValueObserver((isPlaying) => {
                                if (activeLayer === LAYER.B) { // Only update if Layer B is active
                                    if (isPlaying) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.ON);
                                    } else if (slot.hasContent().get()) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    } else {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    }
                                }
                            });
                            
                            slot.hasContent().addValueObserver((hasContent) => {
                                if (activeLayer === LAYER.B) { // Only update if Layer B is active
                                    if (!hasContent) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    } else if (!slot.isPlaying().get()) {
                                        setUpperButtonLED(buttonIndex, LED_STATE.OFF);
                                    }
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
                // Update instrument button LEDs for Child Track 0 (only if Layer A is active)
                if (activeLayer === LAYER.A) {
                    const chainCount = childTrack0ChainSelector.chainCount().get();
                    updateInstrumentSelectorLEDs(index, chainCount, 0, 4); // Buttons 0-3
                    // Also update mute LEDs when instrument changes
                    updateLowerButtonLEDsForActiveLayer();
                }
            });
            
            childTrack0ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 0 chain count: ${count}`);
                }
                // Update instrument button LEDs when chain count changes (only if Layer A is active)
                if (activeLayer === LAYER.A) {
                    const activeIndex = childTrack0ChainSelector.activeChainIndex().get();
                    updateInstrumentSelectorLEDs(activeIndex, count, 0, 4); // Buttons 0-3
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
                // Update instrument button LEDs for Child Track 1 (only if Layer B is active)
                if (activeLayer === LAYER.B) {
                    const chainCount = childTrack1ChainSelector.chainCount().get();
                    updateInstrumentSelectorLEDs(index, chainCount, 0, 4); // Buttons 0-3
                    // Also update mute LEDs when instrument changes
                    updateLowerButtonLEDsForActiveLayer();
                }
            });
            
            childTrack1ChainSelector.chainCount().addValueObserver(function(count) {
                if (DEBUG) {
                    host.println(`Child Track 1 chain count: ${count}`);
                }
                // Update instrument button LEDs when chain count changes (only if Layer B is active)
                if (activeLayer === LAYER.B) {
                    const activeIndex = childTrack1ChainSelector.activeChainIndex().get();
                    updateInstrumentSelectorLEDs(activeIndex, count, 0, 4); // Buttons 0-3
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
        host.println(`Active Layer: ${activeLayer}`);
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
        host.println("X-Touch Mini Single (MC Mode) exited");
    }
}

