loadAPI(18);

host.defineController(
    "Novation", 
    "Launch Control XL Sub Mixer", 
    "1.0.0", 
    "a7347ae5-d5b7-4f11-b34f-4d5c48c7e2e5", 
    "Your Name"
);

host.defineMidiPorts(1, 1);

const MIDI_NOTES = {
    BOTTOM_BUTTONS: {
        ROW1: [0x29, 0x2A, 0x2B, 0x2C, 0x39, 0x3A, 0x3B, 0x3C]
    },
    FADERS: [0x4D, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54]  // Corrected fader CC numbers
};


function init() {
    println("Launch Control XL Sub Mixer initialization starting...");
    
    // Get MIDI in/out ports
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    // Set up MIDI callbacks - only respond to channel 6
    midiIn.setMidiCallback(onMidi);
    midiIn.createNoteInput("Launch Control XL", "?6????");
    
    // Create cursor track and device
    cursorTrack = host.createCursorTrack("MIXER", "Mixer", 0, 0, true);
    cursorDevice = cursorTrack.createCursorDevice();
    
    // Create drum pad bank
    drumPadBank = cursorDevice.createDrumPadBank(8);
    
    // Mark drum pad properties as interested
    for (let i = 0; i < 8; i++) {
        const pad = drumPadBank.getItemAt(i);
        pad.exists().markInterested();
        pad.mute().markInterested();
    }
    
    // Add observer for drum pad mutes to update LEDs
    for (let i = 0; i < 8; i++) {
        const pad = drumPadBank.getItemAt(i);
        pad.mute().addValueObserver(function(isMuted) {
            updatePadLED(i, isMuted);
        });
    }
    
    println("Launch Control XL Sub Mixer initialized!");
}

function onMidi(status, data1, data2) {
    // Handle Note On messages on channel 6 (0x95 = Note On channel 6)
    if (status === 0x95) {
        handleNoteOn(data1, data2);
    }
    // Handle CC messages on channel 6 (0xB5 = CC channel 6)
    else if (status === 0xB5) {
        handleCC(data1, data2);
    }
}

function handleNoteOn(note, velocity) {
    // Handle Bottom Row 1 buttons for drum pad mutes
    const padIndex = MIDI_NOTES.BOTTOM_BUTTONS.ROW1.indexOf(note);
    if (padIndex !== -1) {
        const pad = drumPadBank.getItemAt(padIndex);
        if (pad.exists().get()) {
            // Toggle mute state
            pad.mute().toggle();
        }
    }
}

function handleCC(cc, value) {
    // Handle faders for drum pad volumes
    const faderIndex = MIDI_NOTES.FADERS.indexOf(cc);
    if (faderIndex !== -1) {
        const pad = drumPadBank.getItemAt(faderIndex);
        if (pad.exists().get()) {
            // Scale the value for better range control
            // Using spread parameter of 0 for direct mapping
            pad.volume().set(value / 127, 0);
        }
    }
}

function updatePadLED(padIndex, isMuted) {
    const note = MIDI_NOTES.BOTTOM_BUTTONS.ROW1[padIndex];
    // Light up LED if muted
    midiOut.sendMidi(0x95, note, isMuted ? 127 : 0);
}

function flush() {
}

function exit() {
    println("Launch Control XL Sub Mixer exited!");
}