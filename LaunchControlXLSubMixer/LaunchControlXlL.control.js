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
        ROW1: [0x29, 0x2A, 0x2B, 0x2C, 0x39, 0x3A, 0x3B, 0x3C],
        ROW2: [0x49, 0x4A, 0x4B, 0x4C, 0x59, 0x5A, 0x5B, 0x5C]  // Added ROW2 for page selection
    },
    DEVICE: 0x69,  // Add this line
    BOTTOM_KNOBS: [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38],
    FADERS: [0x4D, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54]  // Added 0x53
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
    
    // Create remote controls page for device parameters
    remoteControls = cursorDevice.createCursorRemoteControlsPage(8);
    
    // Mark remote control parameters as interested
    for (let i = 0; i < 8; i++) {
        const param = remoteControls.getParameter(i);
        param.markInterested();
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
    }
    
    // Create drum pad bank
    drumPadBank = cursorDevice.createDrumPadBank(8);
    
    // Mark drum pad properties as interested
    for (let i = 0; i < 8; i++) {
        const pad = drumPadBank.getItemAt(i);
        pad.exists().markInterested();
        pad.mute().markInterested();
        pad.volume().markInterested();
    }
    
    // Add observer for drum pad mutes to update LEDs
    for (let i = 0; i < 8; i++) {
        const pad = drumPadBank.getItemAt(i);
        pad.mute().addValueObserver(function(isMuted) {
            updatePadLED(i, isMuted);
        });
    }
    
    // Add these lines after creating remoteControls
    remoteControls.pageCount().markInterested();
    remoteControls.selectedPageIndex().markInterested();
    
    // Add observer for page changes to update LEDs and device mode
    remoteControls.selectedPageIndex().addValueObserver(function(index) {
        updatePageLEDs(index);
        // Set device mode true only when on page 0
        isDeviceMode = (index === 0);
    });
    
    // Add initial device mode state
    isDeviceMode = true;
    
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
    // Handle Device button - returns knob control to drum volumes and clears LEDs
    if (note === MIDI_NOTES.DEVICE) {
        clearAllLEDs();
        // Set a flag or state to indicate we're in "device mode"
        isDeviceMode = true;
        // Switch back to page 0
        remoteControls.selectedPageIndex().set(0);
        page = remoteControls.selectedPageIndex().get();
        println("Device button pressed - Returning to Drum Volume Control on page " + page);
        return;
    }

    // Handle Bottom Row 2 buttons for page selection (pages 1-8)
    const row2Index = MIDI_NOTES.BOTTOM_BUTTONS.ROW2.indexOf(note);
    if (row2Index !== -1) {
        isDeviceMode = false;  // Exit device mode when selecting a preset page
        const targetPage = row2Index + 1;
        const pageCount = remoteControls.pageCount().get();
        
        if (targetPage < pageCount) {
            remoteControls.selectedPageIndex().set(targetPage);
            println("Bottom Row 2 Button " + row2Index + " - Switching to Page " + targetPage);
        } else {
            println("Page " + targetPage + " does not exist (max pages: " + pageCount + ")");
        }
        return;
    }

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
    // Handle bottom knobs - these will now always control drum pad volumes
    const knobIndex = MIDI_NOTES.BOTTOM_KNOBS.indexOf(cc);
    if (knobIndex !== -1) {
        const pad = drumPadBank.getItemAt(knobIndex);
        if (pad.exists().get()) {
            let normalizedValue;
            if (value <= 64) {
                normalizedValue = (value / 64) * 0.78;
            } else {
                normalizedValue = 0.78 + ((value - 64) / 63) * (1 - 0.78);
            }
            pad.volume().value().set(normalizedValue);
        }
    }

    // Handle faders - check if we're in device mode or preset pages
    const faderIndex = MIDI_NOTES.FADERS.indexOf(cc);
    if (faderIndex !== -1) {
        if (isDeviceMode) {
            // First switch to page 0
            remoteControls.selectedPageIndex().set(0);
            
            // Schedule the parameter change after a small delay to ensure page switch has occurred
            host.scheduleTask(function() {
                const param = remoteControls.getParameter(faderIndex);
                if (param.exists().get()) {
                    param.set(value, 128);  // Map 0-127 to parameter range
                }
            }, 50);
        } else {
            // Not in device mode, control remote parameters on current page
            const param = remoteControls.getParameter(faderIndex);
            if (param.exists().get()) {
                param.set(value, 128);
                println("Fader " + faderIndex + 
                       " (" + param.name().get() + ")" +
                       " value: " + value);
            }
        }
    }
}

function updatePadLED(padIndex, isMuted) {
    const note = MIDI_NOTES.BOTTOM_BUTTONS.ROW1[padIndex];
    // Light up LED if muted
    midiOut.sendMidi(0x95, note, isMuted ? 127 : 0);
}

function updatePageLEDs(selectedPage) {
    // Turn off all Bottom Row 2 LEDs first
    for (let note of MIDI_NOTES.BOTTOM_BUTTONS.ROW2) {
        midiOut.sendMidi(0x95, note, 0);  // Note On channel 6, velocity 0 = OFF
    }
    
    // If the selected page corresponds to a Bottom Row 2 button (pages 1-8), light it up
    if (selectedPage >= 1 && selectedPage <= 8) {
        const buttonIndex = selectedPage - 1;  // Convert page number to button index (0-7)
        const note = MIDI_NOTES.BOTTOM_BUTTONS.ROW2[buttonIndex];
        midiOut.sendMidi(0x95, note, 127);  // Note On channel 6, velocity 127 = ON
    }
}

function clearAllLEDs() {
    // Clear all bottom row LEDs
    for (let note of MIDI_NOTES.BOTTOM_BUTTONS.ROW1) {
        midiOut.sendMidi(0x95, note, 0);
    }
    for (let note of MIDI_NOTES.BOTTOM_BUTTONS.ROW2) {
        midiOut.sendMidi(0x95, note, 0);
    }
}

function flush() {
}

function exit() {
    println("Launch Control XL Sub Mixer exited!");
}