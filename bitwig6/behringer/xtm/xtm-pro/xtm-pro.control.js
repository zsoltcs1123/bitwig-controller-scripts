loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Pro",
    "1.0",
    "a1b2c3d4-e5f6-7890-1234-56789abcdef5",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const LED_GLOBAL_CHANNEL = 0;
const DEBUG = true;

const PINNED_TRACK_INDEX = 0;

const CC = {
    ENCODER_1: 16, ENCODER_2: 17, ENCODER_3: 18, ENCODER_4: 19,
    ENCODER_5: 20, ENCODER_6: 21, ENCODER_7: 22, ENCODER_8: 23,
    LED_RING_1: 48, LED_RING_2: 49, LED_RING_3: 50, LED_RING_4: 51,
    LED_RING_5: 52, LED_RING_6: 53, LED_RING_7: 54, LED_RING_8: 55,
};

const NOTE = {
    ENCODER_PUSH_1: 32, ENCODER_PUSH_2: 33, ENCODER_PUSH_3: 34, ENCODER_PUSH_4: 35,
    ENCODER_PUSH_5: 36, ENCODER_PUSH_6: 37, ENCODER_PUSH_7: 38, ENCODER_PUSH_8: 39,
    
    BUTTON_UPPER_1: 89, BUTTON_UPPER_2: 90, BUTTON_UPPER_3: 40, BUTTON_UPPER_4: 41,
    BUTTON_UPPER_5: 42, BUTTON_UPPER_6: 43, BUTTON_UPPER_7: 44, BUTTON_UPPER_8: 45,
    
    BUTTON_LOWER_1: 87, BUTTON_LOWER_2: 88, BUTTON_LOWER_3: 91, BUTTON_LOWER_4: 92,
    BUTTON_LOWER_5: 86, BUTTON_LOWER_6: 93, BUTTON_LOWER_7: 94, BUTTON_LOWER_8: 95,
    
    LAYER_A: 84,
    LAYER_B: 85,
    
    LED_BUTTON_UPPER_1: 89, LED_BUTTON_UPPER_2: 90, LED_BUTTON_UPPER_3: 40, LED_BUTTON_UPPER_4: 41,
    LED_BUTTON_UPPER_5: 42, LED_BUTTON_UPPER_6: 43, LED_BUTTON_UPPER_7: 44, LED_BUTTON_UPPER_8: 45,
    LED_BUTTON_LOWER_1: 87, LED_BUTTON_LOWER_2: 88, LED_BUTTON_LOWER_3: 91, LED_BUTTON_LOWER_4: 92,
    LED_BUTTON_LOWER_5: 86, LED_BUTTON_LOWER_6: 93, LED_BUTTON_LOWER_7: 94, LED_BUTTON_LOWER_8: 95,
    LED_LAYER_A: 84,
    LED_LAYER_B: 85,
};

const LED_RING_BEHAVIOR = {
    SINGLE: 0,
    PAN: 1,
    FAN: 2,
    SPREAD: 3,
    TRIM: 4
};

const LED_STATE = {
    OFF: 0,
    ON: 127,
    BLINKING: 1,
    ON_ALT: 64
};

const LOWER_BUTTON_MODE = {
    NONE: 'NONE',
    LAYER_A: 'LAYER_A',
    LAYER_B: 'LAYER_B'
};

let midiIn, midiOut;
let lowerButtonMode = LOWER_BUTTON_MODE.NONE;
let selectedChildIndex = 0;

let trackBank;
let pinnedTrack;
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    initializeLEDRings();
    
    setLayerLED('A', LED_STATE.OFF);
    setLayerLED('B', LED_STATE.OFF);
    
    initializeButtonLEDs();
    
    if (DEBUG) {
        host.println("=== X-Touch Mini Pro initialized ===");
        host.println(`Pinned to track index: ${PINNED_TRACK_INDEX}`);
        host.println(`Lower button mode: ${lowerButtonMode}`);
        host.println(`Selected child index: ${selectedChildIndex}`);
        host.println("===================================");
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (command === 0xE0 && channel === FADER_MIDI_CHANNEL) {
        handleFaderPitchBend(data1, data2);
        return;
    }
    
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (DEBUG) {
        const commandName = command === 0xB0 ? 'CC' : command === 0x90 ? 'NoteOn' : command === 0x80 ? 'NoteOff' : 'Unknown';
        host.println(`MIDI: ${commandName} Status=0x${status.toString(16)} Data1=${data1} Data2=${data2} Channel=${channel + 1}`);
    }
    
    if (command === 0xB0) {
        handleControlChange(data1, data2);
    } else if (command === 0x90 || command === 0x80) {
        const isNoteOn = (command === 0x90) && (data2 > 0);
        handleNote(data1, isNoteOn, data2);
    }
}

function handleControlChange(cc, value) {
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
    if (note >= NOTE.ENCODER_PUSH_1 && note <= NOTE.ENCODER_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_PUSH_1;
        handleEncoderPush(encoderIndex, isPressed);
        return;
    }
    
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed);
        return;
    }
    
    const lowerButtons = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                         NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    const lowerIndex = lowerButtons.indexOf(note);
    if (lowerIndex !== -1) {
        handleLowerButton(lowerIndex, isPressed);
        return;
    }
    
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
    let increment = 0;

    if (value >= 1 && value <= 63) {
        increment = 0.03;
    } else if (value >= 65 && value <= 127) {
        increment = -0.03;
    } else {
        return;
    }
    
    if (DEBUG) {
        host.println(`Encoder ${encoderIndex + 1} turned: ${increment > 0 ? 'CW' : 'CCW'}`);
    }
}

function handleEncoderPush(encoderIndex, isPressed) {
    if (DEBUG && isPressed) {
        host.println(`Encoder ${encoderIndex + 1} pushed`);
    }
}

function handleUpperButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!isPressed) return;
}

function handleLowerButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!isPressed) return;
}

function handleFaderPitchBend(lsb, msb) {
    const pitchBendValue = (msb << 7) | lsb;
    const normalizedValue = pitchBendValue / 16383.0;
    
    if (DEBUG) {
        host.println(`Fader moved: raw=${pitchBendValue}, normalized=${normalizedValue.toFixed(4)}`);
    }
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!isPressed) return;
    
    if (layer === 'A') {
        if (lowerButtonMode === LOWER_BUTTON_MODE.LAYER_A) {
            lowerButtonMode = LOWER_BUTTON_MODE.NONE;
            setLayerLED('A', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A toggled OFF -> mode: ${lowerButtonMode}`);
            }
        } else {
            lowerButtonMode = LOWER_BUTTON_MODE.LAYER_A;
            setLayerLED('A', LED_STATE.ON);
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A toggled ON -> mode: ${lowerButtonMode}`);
            }
        }
    } else if (layer === 'B') {
        if (lowerButtonMode === LOWER_BUTTON_MODE.LAYER_B) {
            lowerButtonMode = LOWER_BUTTON_MODE.NONE;
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer B toggled OFF -> mode: ${lowerButtonMode}`);
            }
        } else {
            lowerButtonMode = LOWER_BUTTON_MODE.LAYER_B;
            setLayerLED('B', LED_STATE.ON);
            setLayerLED('A', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer B toggled ON -> mode: ${lowerButtonMode}`);
            }
        }
    }
}

function setupTracks() {
    if (DEBUG) {
        host.println("Setting up track management...");
    }
    
    try {
        trackBank = host.createTrackBank(8, 0, 0, false);
        pinnedTrack = trackBank.getTrack(PINNED_TRACK_INDEX);
        
        pinnedTrack.exists().markInterested();
        pinnedTrack.name().markInterested();
        pinnedTrack.isGroup().markInterested();
        
        pinnedTrack.exists().addValueObserver(function(exists) {
            pinnedTrackExists = exists;
            if (DEBUG) {
                host.println(`Pinned track exists: ${exists}`);
            }
        });
        
        pinnedTrack.name().addValueObserver(function(name) {
            if (DEBUG) {
                host.println(`Pinned track name: ${name}`);
            }
        });
        
        pinnedTrack.isGroup().addValueObserver(function(isGroup) {
            pinnedTrackIsGroup = isGroup;
            if (DEBUG) {
                host.println(`Pinned track is group: ${isGroup}`);
            }
        });
        
        host.scheduleTask(logTrackStatus, null, 100);
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupTracks: ${error}`);
        }
    }
}

function initializeLEDRings() {
    for (let i = 0; i < 8; i++) {
        setLEDRingValue(i, 32);
    }
}

function initializeButtonLEDs() {
    for (let i = 0; i < 8; i++) {
        setUpperButtonLED(i, LED_STATE.OFF);
        setLowerButtonLED(i, LED_STATE.OFF);
    }
}

function setLEDRingValue(encoderIndex, value) {
    const ccNumbers = [CC.LED_RING_1, CC.LED_RING_2, CC.LED_RING_3, CC.LED_RING_4,
                       CC.LED_RING_5, CC.LED_RING_6, CC.LED_RING_7, CC.LED_RING_8];
    const cc = ccNumbers[encoderIndex];
    
    midiOut.sendMidi(0xB0 + LED_GLOBAL_CHANNEL, cc, value);
}

function updateEncoderLEDRing(encoderIndex, parameterValue) {
    let position;
    if (parameterValue <= 0.0) {
        position = 0;
    } else if (parameterValue >= 1.0) {
        position = 11;
    } else {
        position = Math.floor(parameterValue * 10) + 1;
    }
    
    const ledValue = position + 32;
    setLEDRingValue(encoderIndex, ledValue);
}

function setLayerLED(layer, state) {
    const note = (layer === 'A') ? NOTE.LAYER_A : NOTE.LAYER_B;
    const velocity = state;
    
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
}

function setUpperButtonLED(buttonIndex, state) {
    const upperButtonNotes = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                             NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    
    if (buttonIndex >= 0 && buttonIndex < upperButtonNotes.length) {
        const note = upperButtonNotes[buttonIndex];
        const velocity = state;
        
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function setLowerButtonLED(buttonIndex, state) {
    const lowerButtonNotes = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                             NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    
    if (buttonIndex >= 0 && buttonIndex < lowerButtonNotes.length) {
        const note = lowerButtonNotes[buttonIndex];
        const velocity = state;
        
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function logTrackStatus() {
    if (DEBUG) {
        host.println("=== Track Status Summary ===");
        host.println(`Pinned track exists: ${pinnedTrackExists}`);
        host.println(`Pinned track is group: ${pinnedTrackIsGroup}`);
        host.println(`Selected child index: ${selectedChildIndex}`);
        host.println(`Lower button mode: ${lowerButtonMode}`);
        host.println("===========================");
    }
}

function flush() {
}

function exit() {
    if (DEBUG) {
        host.println("X-Touch Mini Pro exited");
    }
}

