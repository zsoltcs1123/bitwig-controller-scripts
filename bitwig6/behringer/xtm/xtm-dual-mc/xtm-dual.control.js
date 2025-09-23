loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Dual 6 MC Mode - Controller 1",
    "0.1",
    "a1b2c3d4-e5f6-1234-5678-90abcdef1234",
    "Zsolt"
);
host.defineMidiPorts(1, 1);

// MIDI Channel Configuration (MC Mode)
// NOTE: Change these values if you need different channels for multiple controllers
const INPUT_MIDI_CHANNEL = 0;   // Channel 1 (0-based indexing) - MC Mode controls
const FADER_MIDI_CHANNEL = 8;   // Channel 9 (0-based indexing) - Fader uses pitch bend
const OUTPUT_MIDI_CHANNEL = 0;  // Channel 1 (0-based indexing) - for LED feedback
const DEBUG = true;

// ALTERNATIVE CONFIGURATIONS FOR MULTIPLE CONTROLLERS:
// Controller 1: INPUT=0, FADER=8, OUTPUT=0 (default)
// Controller 2: INPUT=1, FADER=9, OUTPUT=1 (change above values to 1,9,1)
// Controller 3: INPUT=2, FADER=10, OUTPUT=2 (change above values to 2,10,2)

// MIDI CC Numbers (MC Mode)
const CC = {
    // Encoders Turn (CC16-CC23)
    ENCODER_1: 16, ENCODER_2: 17, ENCODER_3: 18, ENCODER_4: 19,
    ENCODER_5: 20, ENCODER_6: 21, ENCODER_7: 22, ENCODER_8: 23,
    // LED Ring Control (TBD - will test)
    LED_RING_BEHAVIOR_1: 48, LED_RING_BEHAVIOR_2: 49, LED_RING_BEHAVIOR_3: 50, LED_RING_BEHAVIOR_4: 51,
    LED_RING_BEHAVIOR_5: 52, LED_RING_BEHAVIOR_6: 53, LED_RING_BEHAVIOR_7: 54, LED_RING_BEHAVIOR_8: 55,
    LED_RING_VALUE_1: 48, LED_RING_VALUE_2: 49, LED_RING_VALUE_3: 50, LED_RING_VALUE_4: 51,
    LED_RING_VALUE_5: 52, LED_RING_VALUE_6: 53, LED_RING_VALUE_7: 54, LED_RING_VALUE_8: 55,
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

// LED States (MC Mode specific)
const LED_STATE = {
    OFF: 0,
    ON: 127,        // Try full velocity for steady ON
    BLINKING: 1,    // Low velocity might be blinking
    ON_ALT: 64      // Alternative steady ON value to test
};

// Global Variables
let midiIn, midiOut;

function init() {
    // Initialize MIDI
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    // Set up MIDI input callback
    midiIn.setMidiCallback(onMidi);
    
    if (DEBUG) {
        host.println("X-Touch Mini Dual initialized - minimal setup");
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (DEBUG) {
        host.println(`MIDI: Status=${status.toString(16)} Data1=${data1} Data2=${data2} Channel=${channel}`);
    }
    
    // Handle fader pitch bend on channel 8
    if (command === 0xE0 && channel === FADER_MIDI_CHANNEL) { // Pitch Bend
        handleFaderPitchBend(data1, data2);
        return;
    }
    
    // Only process other messages from the input channel
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (command === 0xB0) { // Control Change
        handleControlChange(data1, data2);
    } else if (command === 0x90 || (command === 0x80)) { // Note On/Off
        const isNoteOn = (command === 0x90) && (data2 > 0);
        handleNote(data1, isNoteOn, data2);
    }
}

function handleControlChange(cc, value) {
    // Handle Encoders (CC16-CC23)
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
    // Handle Encoder Pushes
    if (note >= NOTE.ENCODER_PUSH_1 && note <= NOTE.ENCODER_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_PUSH_1;
        handleEncoderPush(encoderIndex, isPressed);
        return;
    }
    
    // Handle Upper Row Buttons
    if (note >= NOTE.BUTTON_UPPER_1 && note <= NOTE.BUTTON_UPPER_8) {
        const buttonIndex = note - NOTE.BUTTON_UPPER_1;
        handleUpperButton(buttonIndex, isPressed);
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
    
    // Handle Upper Row Buttons (non-sequential notes)
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed);
        return;
    }
    
    // Handle Layer Buttons (THE FEATURE WE WANTED!)
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
    if (DEBUG) {
        host.println(`Encoder ${encoderIndex + 1} turned: ${value}`);
    }
    
    // Test LED ring control - show encoder value on LED ring
    setLEDRingValue(encoderIndex, value);
}

function handleEncoderPush(encoderIndex, isPressed) {
    if (DEBUG) {
        host.println(`Encoder ${encoderIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Just log for now - no functionality
}

function handleUpperButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Test LED control - try different ON states
    if (isPressed) {
        // Try different velocities to find steady ON
        if (buttonIndex < 4) {
            setButtonLED(buttonIndex, LED_STATE.ON);        // Velocity 127
        } else {
            setButtonLED(buttonIndex, LED_STATE.ON_ALT);    // Velocity 64
        }
    } else {
        setButtonLED(buttonIndex, LED_STATE.OFF);
    }
}

function handleLowerButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Test LED control - try steady ON for all lower buttons
    if (isPressed) {
        // Since upper buttons work with velocity 127, try same for lower
        setButtonLED(buttonIndex + 8, LED_STATE.ON);        // Velocity 127
    } else {
        setButtonLED(buttonIndex + 8, LED_STATE.OFF);
    }
}

function handleFaderPitchBend(lsb, msb) {
    // Convert 14-bit pitch bend to 0-127 range
    const value = Math.floor(((msb << 7) | lsb) / 128);
    
    if (DEBUG) {
        host.println(`Fader moved: ${value}`);
    }
    
    // Just log for now - no functionality
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'}`);
    }
    
    // Test LED control for layer buttons
    if (layer === 'A') {
        if (isPressed) {
            setLayerLED('A', LED_STATE.ON);
        } else {
            setLayerLED('A', LED_STATE.OFF);
        }
    } else if (layer === 'B') {
        if (isPressed) {
            setLayerLED('B', LED_STATE.ON);
        } else {
            setLayerLED('B', LED_STATE.OFF);
        }
    }
}

// LED Control Functions
function setLEDRingBehavior(encoderIndex, behavior) {
    const cc = CC.LED_RING_BEHAVIOR_1 + encoderIndex;
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, cc, behavior);
}

function setLEDRingValue(encoderIndex, value) {
    // Let's try the Mackie Control standard LED ring CCs
    // In Mackie Control, LED rings typically use CC48-55 for ring position
    // But let's also try sending a "mode" command first
    
    const ringPositionCC = 48 + encoderIndex;  // CC48-55 for ring position
    const ringModeCC = 32 + encoderIndex;      // CC32-39 for ring mode (common in Mackie)
    
    if (DEBUG) {
        host.println(`Setting LED Ring ${encoderIndex + 1}: Mode CC${ringModeCC}=1, Position CC${ringPositionCC}=${value}`);
    }
    
    // First set ring mode to "single LED" mode (value 1)
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, ringModeCC, 1);
    
    // Then set the position (map 0-127 to 0-11 for 12-position ring)
    const ringPosition = Math.floor((value / 127.0) * 11);
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, ringPositionCC, ringPosition);
}

function setButtonLED(buttonIndex, state) {
    // Map button index to actual note numbers (MC Mode)
    let note;
    
    if (buttonIndex < 8) {
        // Upper buttons (0-7) map to notes in upperButtons array
        const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                             NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
        note = upperButtons[buttonIndex];
    } else {
        // Lower buttons (8-15) map to notes in lowerButtons array
        const lowerButtons = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                             NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
        note = lowerButtons[buttonIndex - 8];
    }
    
    const velocity = state; // 0=off, 1=on, 2=blinking
    
    if (DEBUG) {
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
    const velocity = state; // 0=off, 1=on, 2=blinking
    
    if (DEBUG) {
        host.println(`Setting Layer ${layer} LED to state ${state} (Note ${note} on Channel ${OUTPUT_MIDI_CHANNEL + 1})`);
    }
    
    if (state === LED_STATE.OFF) {
        midiOut.sendMidi(0x80 + OUTPUT_MIDI_CHANNEL, note, 0); // Note Off
    } else {
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity); // Note On
    }
}

function flush() {
    // Update LED feedback based on current state
    // This is called regularly by Bitwig
}

function exit() {
    if (DEBUG) {
        host.println("X-Touch Mini Dual exited");
    }
}
