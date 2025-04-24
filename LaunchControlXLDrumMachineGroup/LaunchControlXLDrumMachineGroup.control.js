loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// --- Controller Definition ---
host.defineController(
    "Novation",
    "LaunchControlXL Drum Machine Group",
    "0.1",
    "3d8c9a1f-e4b2-4a7b-8c1d-9e5f6a7b8c9d", // Unique GUID for this script
    "Zsolt"
);
host.defineMidiPorts(1, 1);


// --- Constants ---
const TARGET_MIDI_CHANNEL = 5; // 0-indexed for MIDI Channel 6 (User Mode 6)
const DEBUG = false; // Set to false to disable verbose console logging
const TARGET_TEMPLATE_INDEX = 5; // User Mode 6 (Templates 0-7 are User)

/**
 * --- IMPORTANT ---
 * MIDI CC/Note Definitions (PLACEHOLDERS)
 * These values might differ depending on your Launch Control XL Editor configuration
 * for User Mode 6. Please verify and adjust these constants to match your setup.
 * These placeholders are based on common defaults or Factory Template 1.
 */
const CC = {
    // Knobs (Assumed CCs - Verify!)
    KNOB_T1: 13, KNOB_T2: 14, KNOB_T3: 15, KNOB_T4: 16, KNOB_T5: 17, KNOB_T6: 18, KNOB_T7: 19, KNOB_T8: 20,
    KNOB_M1: 29, KNOB_M2: 30, KNOB_M3: 31, KNOB_M4: 32, KNOB_M5: 33, KNOB_M6: 34, KNOB_M7: 35, KNOB_M8: 36,
    KNOB_B1: 49, KNOB_B2: 50, KNOB_B3: 51, KNOB_B4: 52, KNOB_B5: 53, KNOB_B6: 54, KNOB_B7: 55, KNOB_B8: 56,
    // Sliders (Assumed CCs - Verify!)
    SLIDER1: 77, SLIDER2: 78, SLIDER3: 79, SLIDER4: 80, SLIDER5: 81, SLIDER6: 82, SLIDER7: 83, SLIDER8: 84,
    // Add CCs for Select buttons
    SEND_SELECT_1: 104,
    SEND_SELECT_2: 105,
    TRACK_SELECT_1: 106,
    TRACK_SELECT_2: 107,
};

const NOTE = { // Assuming buttons send Notes - Updated based on logs!
    // Buttons (Top Row - Drum Mutes / Solos)
    BTN_T1: 41, BTN_T2: 42, BTN_T3: 43, BTN_T4: 44, BTN_T5: 57, BTN_T6: 58, BTN_T7: 59, BTN_T8: 60,
    // Buttons (Bottom Row - Page Select 1-8)
    BTN_B1: 73, BTN_B2: 74, BTN_B3: 75, BTN_B4: 76, BTN_B5: 89, BTN_B6: 90, BTN_B7: 91, BTN_B8: 92,
    // Side Buttons (Device, Mute, Solo, Record Arm)
    BTN_MUTE: 106,
    BTN_SOLO: 107,
    BTN_REC_ARM: 108,
    // Other Buttons (Device, Track/Send Selects mapped to Page 11)
    DEVICE_BTN: 105, // Note: This is different from BTN_DEVICE if that existed
    // BTN_UP/DOWN/LEFT/RIGHT potentially map to Track/Send Select CCs? Not used directly by Note.
};

// Map Utility Buttons to Page 11 Parameters
const UTILITY_BUTTON_MAP = {
    // SWAPPED LED Indices for Track/Send
    SEND1: { cc: CC.SEND_SELECT_1, paramIndex: 0, ledIndex: 44 }, // Send Select 1 -> Param 0 -> UP Arrow LED
    SEND2: { cc: CC.SEND_SELECT_2, paramIndex: 1, ledIndex: 45 }, // Send Select 2 -> Param 1 -> DOWN Arrow LED
    TRACK1: { cc: CC.TRACK_SELECT_1, paramIndex: 2, ledIndex: 46 }, // Track Select 1 -> Param 2 -> LEFT Arrow LED
    TRACK2: { cc: CC.TRACK_SELECT_2, paramIndex: 3, ledIndex: 47 }, // Track Select 2 -> Param 3 -> RIGHT Arrow LED
    DEVICE: { note: NOTE.DEVICE_BTN, paramIndex: 4, ledIndex: 40 }, // Device -> Param 4 -> Device LED
};

// --- Mode Constants ---
const MODE_MUTE = 'MUTE';
const MODE_SOLO = 'SOLO';
const MODE_TRACK = 'TRACK';   // Now targets bottom row
const MODE_PAGE = 'PAGE';     // Top row is now exclusively for page selection

// --- Globals ---
let midiIn;
let midiOut;
let fixedTrack;
let trackBank;
let cursorDevice;
let drumPadBank;
let remoteControlsPage0;  // Top Knobs - FIXED page 0
let remoteControlsPage9;  // Sliders - FIXED page 9
let remoteControlsPage10; // Utility Buttons - FIXED page 10
let remoteControlsPageSelect; // Bottom Knobs - FOLLOWS SELECTION (pages 1-8)
let currentSelectedPage = 1; // Default to page 1 (index 1)
const PAGE_SELECT_OFFSET = 1; // Buttons select pages 1-8
let currentBottomRowMode = MODE_MUTE; // Mode for bottom row buttons (Mute/Solo/Track)
let currentFixedTrackIndex = 0; // Index of the track the bank is scrolled to (0-7)

// NEW: Track bank for middle knob control
let middleKnobTrackBank;
let middleKnobDevices = [];
let middleKnobControls = [];

// Track handling
let childTrackBank; // Bank of child tracks for the fixed track
let childTrackDevices = []; // Cursor devices for each child track
let childTrackControls = []; // Remote control pages for each child track's device

// Helper to get the MIDI note for a button index (0-7) and row ('T' or 'B')
function getNoteForButtonIndex(row, index) {
    if (index < 0 || index > 7) return -1; // Invalid index

    if (row === 'T') { // Top Row (Mutes)
        if (index < 4) return NOTE.BTN_T1 + index;       // Notes 41-44
        else return NOTE.BTN_T5 + (index - 4); // Notes 57-60
    } else if (row === 'B') { // Bottom Row (Page Select)
        if (index < 4) return NOTE.BTN_B1 + index;       // Notes 73-76
        else return NOTE.BTN_B5 + (index - 4); // Notes 89-92
    }
    return -1; // Invalid row
}

// NEW Helper to get the Sysex Index for a button LED
// Top Row Buttons = 0x18 - 0x1F (24-31)
// Bottom Row Buttons = 0x20 - 0x27 (32-39)
function getSysexIndexForButton(row, index) {
    if (index < 0 || index > 7) return -1; // Invalid index

    if (row === 'T') {
        return 0x18 + index; // 24 + index
    } else if (row === 'B') {
        return 0x20 + index; // 32 + index
    }
    return -1; // Invalid row
}

// NEW Helper to get the Sysex Index for a knob LED
// Top Knobs    = 0x00 - 0x07 (0-7)
// Middle Knobs = 0x08 - 0x0F (8-15)
// Bottom Knobs = 0x10 - 0x17 (16-23)
function getSysexIndexForKnob(row, index) {
    if (index < 0 || index > 7) return -1; // Invalid index

    if (row === 'T') {
        return 0x00 + index; // 0 + index
    } else if (row === 'M') {
        return 0x08 + index; // 8 + index
    } else if (row === 'B') {
        return 0x10 + index; // 16 + index
    }
    return -1; // Invalid row
}

// NEW Helper for Side Button Sysex Indices (Mute=1, Solo=2, RecArm=3 in this group)
// Reference: 0x28 - 0x2B (40-43) : Buttons Device, Mute, Solo, Record Arm
function getSysexIndexForSideButton(buttonType) {
    switch(buttonType) {
        case MODE_MUTE: return 41;
        case MODE_SOLO: return 42;
        case 'REC_ARM': return 43; // Identifier for RecArm button LED
        default: return -1;
    }
}


// Helper for Utility Button LEDs (Device, Arrows)
function getSysexIndexForUtilityButton(buttonId) {
    const mapping = UTILITY_BUTTON_MAP[buttonId];
    return mapping ? mapping.ledIndex : -1;
}

// --- Initialization ---
function init() {
    host.println("LCXL Drum Machine Group initializing...");

    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);

    // Set the MIDI callbacks
    midiIn.setMidiCallback(onMidi);
    // midiIn.setSysexCallback(onSysex); // Enable if/when Sysex is needed

    // --- Create Bank and Fixed Track Window ---
    trackBank = host.createTrackBank(
        8, // Number of tracks
        0, // Number of sends
        0, // Number of scenes
        false // Should not follow cursor track
    );
    fixedTrack = trackBank.getItemAt(0);
    fixedTrack.name().markInterested();
    trackBank.scrollPosition().markInterested(); // Need to know the scroll position

    // NEW: Create separate track bank for middle knob control
    middleKnobTrackBank = host.createTrackBank(8, 0, 0, false);
    
    // Initialize device and control objects for each track
    for (let i = 0; i < 8; i++) {
        const track = middleKnobTrackBank.getItemAt(i);
        track.name().markInterested();
        const device = track.createCursorDevice("MiddleKnobDevice" + i);
        device.name().markInterested();
        const controls = device.createCursorRemoteControlsPage("MiddleKnobControls" + i, 8, null);
        controls.selectedPageIndex().markInterested();
        // Force to page 0
        controls.selectedPageIndex().set(0);
        
        middleKnobDevices[i] = device;
        middleKnobControls[i] = controls;

        // Add observers for parameter existence
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            controls.getParameter(paramIndex).exists().addValueObserver((exists) => {
                host.println(`Middle Knob Track ${i + 1} Param ${paramIndex} Exists: ${exists}`);
                updateMiddleKnobLeds();
            });
        }
    }

    // Create child track bank for the fixed track
    childTrackBank = fixedTrack.createTrackBank(8, 0, 0, false);
    
    // Initialize device and control objects for each child track
    for (let i = 0; i < 8; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        childTrack.name().markInterested();
        
        // Create a device bank and set instrument matcher
        const deviceBank = childTrack.createDeviceBank(1);
        const instrumentMatcher = host.createInstrumentMatcher();
        deviceBank.setDeviceMatcher(instrumentMatcher);
        const device = deviceBank.getDevice(0);
        device.name().markInterested();
        device.exists().markInterested();
        
        const controls = device.createCursorRemoteControlsPage("ChildTrackControls" + i, 8, null);
        controls.selectedPageIndex().markInterested();
        // Force to page 0
        controls.selectedPageIndex().set(0);
        
        childTrackDevices[i] = device;
        childTrackControls[i] = controls;

        // Add observers for parameter existence
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            controls.getParameter(paramIndex).exists().addValueObserver((exists) => {
                host.println(`Child Track ${i} Param ${paramIndex} Exists: ${exists}`);
                updateMiddleKnobLeds();
            });
        }

        // Observer for track existence
        childTrack.exists().markInterested();
        childTrack.exists().addValueObserver((exists) => {
            host.println(`Child Track ${i} Exists: ${exists}`);
            updateMiddleKnobLeds();
        });

        // Observer for device existence
        device.exists().addValueObserver((exists) => {
            host.println(`Child Track ${i} First Device Exists: ${exists}`);
            updateMiddleKnobLeds();
        });
    }

    // --- Create Device and Control Objects ---
    // Create a device bank for the fixed track, looking only at the first device slot.
    const deviceBank = fixedTrack.createDeviceBank(1);
    // Create an instrument matcher using the correct method
    const instrumentMatcher = host.createInstrumentMatcher();
    deviceBank.setDeviceMatcher(instrumentMatcher);
    // Get the device at index 0 within this bank.
    cursorDevice = deviceBank.getDevice(0);
    cursorDevice.exists().markInterested(); // Monitor if the first device exists
    cursorDevice.name().markInterested(); // Log device name

    // Mark group expansion state as interested
    fixedTrack.isGroup().markInterested();
    fixedTrack.isGroupExpanded().markInterested();

    // Drum Pad Bank (for Top Buttons - Mutes)
    drumPadBank = cursorDevice.createDrumPadBank(8);
    drumPadBank.exists().markInterested(); // Know if we actually have pads

    // Fixed Remote Controls Page 0 (Top Knobs)
    remoteControlsPage0 = cursorDevice.createCursorRemoteControlsPage("FixedPage0", 8, null); // Named for clarity
    remoteControlsPage0.selectedPageIndex().markInterested();
    remoteControlsPage0.selectedPageIndex().set(0); // Fix to page index 0

    // Fixed Remote Controls Page 9 (Sliders)
    remoteControlsPage9 = cursorDevice.createCursorRemoteControlsPage("FixedPage9_Sliders", 8, null);
    remoteControlsPage9.selectedPageIndex().markInterested();
    remoteControlsPage9.selectedPageIndex().set(9); // Fix to page index 9

    // Fixed Remote Controls Page 10 (Utility Buttons)
    remoteControlsPage10 = cursorDevice.createCursorRemoteControlsPage("FixedPage10_Utility", 8, null);
    remoteControlsPage10.selectedPageIndex().markInterested();
    remoteControlsPage10.selectedPageIndex().set(10); // Fix to page index 10

    // Selectable Remote Controls Page (Bottom Knobs / Page Select Buttons)
    // This is the 'main' unnamed page object that we change the index of.
    remoteControlsPageSelect = cursorDevice.createCursorRemoteControlsPage(8);
    remoteControlsPageSelect.selectedPageIndex().markInterested();
    remoteControlsPageSelect.pageNames().markInterested(); // Good for debugging
    // Set initial selected page (must be >= PAGE_SELECT_OFFSET)
    remoteControlsPageSelect.selectedPageIndex().set(currentSelectedPage);

    // --- Observers ---

    // Track Name Observer (Now reflects the name of the track at the window's index 0)
    fixedTrack.name().addValueObserver((name) => {
        const trackName = name || "[Empty Slot]";
        host.println(`Fixed Track (${currentFixedTrackIndex + 1}): ${trackName}`);
        // Keep notification simple or add track index?
        // host.showPopupNotification(`Controlling Track: ${trackName}`);
    });

    // Scroll Position Observer (Tracks the fixed track index)
    trackBank.scrollPosition().addValueObserver(newIndex => {
        currentFixedTrackIndex = newIndex;
        host.println(`Track Bank scrolled to index: ${newIndex}`);
        // Update TOP row LEDs if in TRACK select mode
        if (currentBottomRowMode === MODE_TRACK) {
            updateBottomRow_Mode();
        }
        // Update middle knob LEDs since child tracks may have changed
        updateMiddleKnobLeds();
        host.showPopupNotification(`Fixed Track: ${newIndex + 1}`);
    });

    // Device Existence Observer (for the first device slot)
    cursorDevice.exists().addValueObserver((exists) => {
        host.println("First Device on Fixed Track Exists: " + exists);
        // Re-initialize LEDs and parameters if the first device appears/disappears
        // TODO: Consider re-fetching parameters or clearing state if device disappears?
        updateAllLeds(); // Update LEDs based on new existence status
    });

    // Device Name Observer
    cursorDevice.name().addValueObserver((name) => {
        host.println("Device on Fixed Track: " + (name || "[No Device]"));
        // Re-initialize LEDs if device changes (drum pad bank AND parameters might appear/disappear)
        updateAllLeds();
    });

    // Group track observers
    fixedTrack.isGroup().addValueObserver((isGroup) => {
        host.println(`Fixed Track Is Group: ${isGroup}`);
        updateUtilityButtonLeds(); // Update device button LED
    });

    fixedTrack.isGroupExpanded().addValueObserver((isExpanded) => {
        host.println(`Fixed Track Is Expanded: ${isExpanded}`);
        updateUtilityButtonLeds(); // Update device button LED
    });

    // Drum Pad Bank Existence Observer
    drumPadBank.exists().addValueObserver((exists) => {
        host.println("Drum Pad Bank Exists: " + exists);
        // Update the BOTTOM row (Mute/Solo)
        updateBottomRow_Mode();
    });

    // Drum Pad Mute & Solo Observers (for BOTTOM row LED feedback)
    for (let i = 0; i < 8; i++) {
        let drumPad = drumPadBank.getItemAt(i);
        drumPad.exists().addValueObserver((exists) => {
             host.println(`Drum Pad ${i} Exists: ${exists}`);
             // Update the BOTTOM row
             updateBottomRow_Mode();
        });
        drumPad.mute().addValueObserver((isMuted) => {
            host.println(`Drum Pad ${i} Muted: ${isMuted}`);
            // Only update if bottom row is in Mute mode
            if (currentBottomRowMode === MODE_MUTE) {
                 updateBottomRow_Mode();
            }
        });
        drumPad.solo().addValueObserver((isSoloed) => {
            host.println(`Drum Pad ${i} Solo: ${isSoloed}`);
            // Only update if bottom row is in Solo mode
             if (currentBottomRowMode === MODE_SOLO) {
                updateBottomRow_Mode();
            }
        });
    }

    // --- Knob Parameter Existence Observers ---
    for (let i = 0; i < 8; i++) {
        // Top Knobs (Page 0)
        remoteControlsPage0.getParameter(i).exists().addValueObserver((exists) => {
            host.println(`Top Knob Param ${i} Exists (Page 0): ${exists}`);
            updateTopKnobLeds(); // Update all top knob LEDs
        });
        // Middle Knobs (Page 11)
        remoteControlsPageSelect.getParameter(i).exists().addValueObserver((exists) => {
            host.println(`Bottom Knob Param ${i} Exists (Page ${currentSelectedPage}): ${exists}`);
            updateBottomKnobLeds(); // Update all bottom knob LEDs
        });
    }

    // Observer for Selected Page Index (needs to update TOP row LEDs now)
    remoteControlsPageSelect.selectedPageIndex().addValueObserver((pageIndex) => {
        currentSelectedPage = pageIndex;
        host.println("Selected Remote Page Index Changed To: " + pageIndex);
        // Always update page select LEDs (top row) when page changes
        updateTopRow_PageSelect();
        // Update bottom knob LEDs (still tied to selected page)
        updateBottomKnobLeds();
        // Update middle knob LEDs since they depend on page selection
        updateMiddleKnobLeds();
    });

    // Observers to keep fixed pages fixed (error checking)
    remoteControlsPage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) {
            host.println(`WARN: Fixed Page 0 index (${index}) changed. Forcing back.`);
            remoteControlsPage0.selectedPageIndex().set(0);
        }
    });
    remoteControlsPage9.selectedPageIndex().addValueObserver((index) => {
        if (index !== 9) {
            host.println(`WARN: Fixed Page 9 (Sliders) index (${index}) changed. Forcing back.`);
            remoteControlsPage9.selectedPageIndex().set(9);
        }
    });
    remoteControlsPage10.selectedPageIndex().addValueObserver((index) => {
        if (index !== 10) {
            host.println(`WARN: Fixed Page 10 (Utility) index (${index}) changed. Forcing back.`);
            remoteControlsPage10.selectedPageIndex().set(10);
        }
    });

    // --- Utility Button Parameter Observers (NOW Page 10) ---
    for (const buttonId in UTILITY_BUTTON_MAP) {
        const mapping = UTILITY_BUTTON_MAP[buttonId];
        if (remoteControlsPage10) { // Check Page 10
            const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
            // Remove the .get() call causing the error
            // if (DEBUG) host.println(`Init: Utility Param ${mapping.paramIndex} (${buttonId}) on Page 10 Exists: ${parameter.exists().get()}`);

            parameter.value().addValueObserver(value => {
                host.println(`Utility Button Param ${mapping.paramIndex} (${buttonId}) Value Changed: ${value}`);
                updateUtilityButtonLeds();
            });
            parameter.exists().addValueObserver(exists => {
                 host.println(`Utility Button Param ${mapping.paramIndex} (${buttonId}) Exists on Page 10: ${exists}`);
                 updateUtilityButtonLeds();
             });
        } else {
             host.println(`WARN: remoteControlsPage10 not initialized for utility observers.`);
        }
    }

    // --- Initial state setup ---
    // Send initial MIDI messages to LCXL (set initial LED states)
    updateAllLeds(); // Call a function to set initial LED states

    host.println("LCXL Drum Machine Group initialized successfully with API objects and All Observers.");
}

// --- MIDI Callback ---
function onMidi(status, data1, data2) {
    const msgType = status & 0xF0; // Mask out channel nibble to get message type
    const channel = status & 0x0F; // Get channel nibble (0-15)

    // Filter messages based on the target MIDI channel
    if (channel !== TARGET_MIDI_CHANNEL) {
        return; // Ignore messages not on our channel
    }

    // Log the filtered MIDI message if debugging is enabled
    if (DEBUG) {
        host.println(`MIDI Ch ${channel + 1}: Type=0x${msgType.toString(16)}, Data1=${data1} (0x${data1.toString(16)}), Data2=${data2}`);
    }

    // Route MIDI message to appropriate handler
    if (msgType === 0xB0) { // Control Change (Knobs, Sliders)
        handleCC(data1, data2);
    } else if (msgType === 0x90 && data2 > 0) { // Note On (Button pressed with velocity > 0)
        handleNoteOn(data1, data2); // Pass velocity too, might be useful
    } else if ((msgType === 0x80) || (msgType === 0x90 && data2 === 0)) { // Note Off (or Note On with velocity 0)
        handleNoteOff(data1);
    }
}

// --- MIDI Handlers ---
function handleCC(cc, value) {
    // Check for Utility Button CCs (only react on press: value > 0)
    if (value > 0) {
        for (const buttonId in UTILITY_BUTTON_MAP) {
            const mapping = UTILITY_BUTTON_MAP[buttonId];
            if (mapping.cc === cc) {
                host.println(`-> Utility Button CC: ${buttonId} (CC ${cc}) -> Target Page 10`);
                if (remoteControlsPage10) {
                    const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
                     if (parameter.exists().get()) {
                        host.println(`     -> Param ${mapping.paramIndex} exists on Page 10. Toggling value.`);
                        const currentValue = parameter.value().get();
                        parameter.value().set(currentValue === 0 ? 127 : 0, 128);
                     } else {
                         host.println(`     -> Param ${mapping.paramIndex} does NOT exist on Page 10.`);
                     }
                } else {
                    host.println(`     -> remoteControlsPage10 object is NOT available.`);
                }
                return; // Consume CC
            }
        }
    }

    const paramIndex = findParameterIndex(cc);
    if (paramIndex === -1) {
        host.println(`  -> Unmapped CC ${cc} received, value ${value}`);
        return;
    }

    // Top Knobs (FIXED Page 0)
    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) {
        host.println(`  -> Top Knob ${paramIndex + 1} (CC ${cc}) -> Page 0, Param ${paramIndex}`);
        remoteControlsPage0.getParameter(paramIndex).set(value, 128);
    }
    // Middle Knobs (Now controls child track's page 0 based on page selection)
    else if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M8) {
        // Map currentSelectedPage (1-8) to child track index (0-7)
        const childTrackIndex = currentSelectedPage - PAGE_SELECT_OFFSET;
        if (childTrackIndex >= 0 && childTrackIndex < 8) {
            host.println(`  -> Middle Knob ${paramIndex + 1} (CC ${cc}) -> Child Track ${childTrackIndex}, Page 0, Param ${paramIndex}`);
            const controls = childTrackControls[childTrackIndex];
            if (controls) {
                controls.getParameter(paramIndex).set(value, 128);
            }
        }
    }
    // Bottom Knobs (FOLLOWS Selected Page 1-8)
    else if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B8) {
        host.println(`  -> Bottom Knob ${paramIndex + 1} (CC ${cc}) -> Page ${currentSelectedPage}, Param ${paramIndex}`);
        remoteControlsPageSelect.getParameter(paramIndex).set(value, 128);
    }
    // Sliders (FIXED Page 9)
    else if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) {
        host.println(`  -> Slider ${paramIndex + 1} (CC ${cc}) -> Page 9, Param ${paramIndex}`);
        remoteControlsPage9.getParameter(paramIndex).set(value, 128);
    } else {
        // This case should ideally not be reached due to findParameterIndex check
        host.println(`  -> CC ${cc} wasn't mapped to a known control row.`);
    }
}

function handleNoteOn(note, velocity) {
    // Mode Buttons (Mute, Solo, Rec Arm)
    if (note === NOTE.BTN_MUTE) {
        if (currentBottomRowMode !== MODE_MUTE) {
             host.println("-> Bottom Row Mode changed to MUTE");
             currentBottomRowMode = MODE_MUTE;
             updateModeButtonLeds(); // Update Mute/Solo/RecArm indicators
             updateBottomRow_Mode(); // Update bottom row LEDs for the new mode
        }
        return; // Consume the event
    }
    if (note === NOTE.BTN_SOLO) {
        if (currentBottomRowMode !== MODE_SOLO) {
            host.println("-> Bottom Row Mode changed to SOLO");
            currentBottomRowMode = MODE_SOLO;
            updateModeButtonLeds(); // Update Mute/Solo/RecArm indicators
            updateBottomRow_Mode(); // Update bottom row LEDs for the new mode
        }
         return; // Consume the event
    }
     if (note === NOTE.BTN_REC_ARM) {
        // Now toggles bottom row to Track mode
        if (currentBottomRowMode !== MODE_TRACK) {
            host.println("-> Bottom Row Mode changed to TRACK");
            currentBottomRowMode = MODE_TRACK;
        } else {
            host.println("-> Bottom Row Mode changed to MUTE (from TRACK)");
            currentBottomRowMode = MODE_MUTE;
        }
        updateModeButtonLeds(); // Update RecArm indicator
        updateBottomRow_Mode(); // Update bottom row LEDs for the new mode
        return; // Consume the event
    }

    // Check for Utility Device Button Note
    if (note === NOTE.DEVICE_BTN) {
        host.println(`-> Device Button pressed - Toggle Group Expansion`);
        if (fixedTrack.isGroup().get()) {
            fixedTrack.isGroupExpanded().toggle();
        }
        return; // Consume Note
    }

    // Ensure API objects are ready for other buttons
     if (!drumPadBank || !remoteControlsPageSelect) {
        host.println("WARN: API objects not ready in handleNoteOn for regular buttons");
        return;
    }

    const buttonIndex = findButtonIndex(note);
     if (buttonIndex === -1) {
        // Only log if it wasn't a mode button we already handled
        if (note !== NOTE.BTN_MUTE && note !== NOTE.BTN_SOLO && note !== NOTE.BTN_REC_ARM) {
            host.println(`  -> Unmapped Note ${note} ON received, velocity ${velocity}`);
        }
        return; // Note doesn't match any known buttons
    }

    // Top Buttons (Page Select ONLY)
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T8) {
        host.println(`  -> Top Button ${buttonIndex + 1} (Note ${note}) - Page Select`);
            const targetPage = buttonIndex + PAGE_SELECT_OFFSET;
            host.println(`     -> Selecting Page ${targetPage}`);
        remoteControlsPageSelect.selectedPageIndex().set(targetPage);
            // Observer updates LEDs
        return; // Consume event
    }
    // Bottom Buttons (Mute / Solo / Track)
    else if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B8) {
        host.println(`  -> Bottom Button ${buttonIndex + 1} (Note ${note}) in mode ${currentBottomRowMode}`);
        switch(currentBottomRowMode) {
            case MODE_MUTE:
            case MODE_SOLO:
        if (drumPadBank.exists().get()) {
            const drumPad = drumPadBank.getItemAt(buttonIndex);
            if (drumPad.exists().get()) {
                        if (currentBottomRowMode === MODE_MUTE) {
                        host.println(`     -> Toggling Mute ${buttonIndex}`);
                        drumPad.mute().toggle();
                        } else {
                         host.println(`     -> Toggling Solo ${buttonIndex}`);
                        drumPad.solo().toggle();
                        }
                    }
                }
                break;
            case MODE_TRACK:
                host.println(`     -> Selecting Fixed Track Index ${buttonIndex}`);
                trackBank.scrollPosition().set(buttonIndex);
                break;
        }
        return; // Consume event
    }
}

function handleNoteOff(note) {
    // Currently not needed for momentary buttons, but we could add logic here if required.
    // if (DEBUG) host.println(`  -> Note ${note} OFF received`);
}

// --- Helper function to find the 0-7 index from a CC/Note ---
function findParameterIndex(cc) {
    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) return cc - CC.KNOB_T1;
    if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M8) return cc - CC.KNOB_M1;
    if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B8) return cc - CC.KNOB_B1;
    if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) return cc - CC.SLIDER1;
    return -1; // Not found
}

function findButtonIndex(note) {
    // Returns index 0-7 relative to the start of the row the note belongs to
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T4) return note - NOTE.BTN_T1; // Range 41-44
    if (note >= NOTE.BTN_T5 && note <= NOTE.BTN_T8) return (note - NOTE.BTN_T5) + 4; // Range 57-60 mapped to index 4-7

    if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B4) return note - NOTE.BTN_B1; // Range 73-76
    if (note >= NOTE.BTN_B5 && note <= NOTE.BTN_B8) return (note - NOTE.BTN_B5) + 4; // Range 89-92 mapped to index 4-7

    return -1; // Not found
}

// --- Sysex Callback (Placeholder) ---
// function onSysex(data) {
//    if (DEBUG) host.println("Sysex received: " + data);
//    // TODO: Handle Sysex if needed (e.g., template change confirmation)
// }

// --- Flush Callback ---
function flush() {
    // This function is called periodically.
    // Could potentially be used for LED updates if observers cause issues, but observers are preferred.
}

// --- Exit Callback ---
function exit() {
    host.println("LCXL Drum Machine Group exiting...");

    // Turn off all LEDs using Sysex
    for (let i = 0; i < 8; i++) {
        sendLedUpdate('T', i, LED_COLOR.OFF); // Top Buttons
        sendLedUpdate('B', i, LED_COLOR.OFF); // Bottom Buttons
        sendLedUpdateKnob('T', i, LED_COLOR.OFF); // Top Knobs
        sendLedUpdateKnob('M', i, LED_COLOR.OFF); // Middle Knobs
        sendLedUpdateKnob('B', i, LED_COLOR.OFF); // Bottom Knobs
    }
    // Turn off Mode buttons
    sendLedUpdateSideButton(MODE_MUTE, LED_COLOR.OFF);
    sendLedUpdateSideButton(MODE_SOLO, LED_COLOR.OFF);
    sendLedUpdateSideButton('REC_ARM', LED_COLOR.OFF);
    // Turn off Utility buttons
    for (const buttonId in UTILITY_BUTTON_MAP) {
         sendLedUpdateUtilityButton(buttonId, LED_COLOR.OFF);
    }

    host.println("LCXL script finished cleanup.");
}

// --- Helper Functions ---
/**
 * Sends a MIDI message to the defined output port.
 * Automatically adds the TARGET_MIDI_CHANNEL to the status byte if it's a channel message.
 * @param {number} status - MIDI status byte (e.g., 0x90 for Note On, 0xB0 for CC). Channel is ignored.
 * @param {number} data1 - MIDI data byte 1.
 * @param {number} data2 - MIDI data byte 2.
 */
function sendMidi(status, data1, data2) {
    if (!midiOut) return;

    const msgType = status & 0xF0;
    // Add channel only for channel messages (0x80 to 0xE0)
    if (msgType >= 0x80 && msgType <= 0xE0) {
        status = msgType | TARGET_MIDI_CHANNEL;
    }

    midiOut.sendMidi(status, data1, data2);
    // Optional: Log sent MIDI for debugging
    // if (DEBUG) host.println(`  MIDI Sent: Status=0x${status.toString(16)}, Data1=${data1}, Data2=${data2}`);
}

// --- LED Update Functions ---

// Renamed to reflect it now only handles page selection
function updateTopRow_PageSelect() {
    host.println("Updating Top Row (Page Select) LEDs...");
        // Page Select Mode - Amber Dim/Full
        for (let i = 0; i < 8; i++) {
            const targetPage = i + PAGE_SELECT_OFFSET;
            const isSelected = (currentSelectedPage === targetPage);
            const color = isSelected ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
            sendLedUpdate('T', i, color);
        }
}

// Renamed to reflect it now handles all bottom row modes
function updateBottomRow_Mode() {
    host.println(`Updating Bottom Row (Mode: ${currentBottomRowMode}) LEDs...`);

    for (let i = 0; i < 8; i++) {
        let color = LED_COLOR.OFF;
        
                switch(currentBottomRowMode) {
                    case MODE_MUTE:
                if (drumPadBank && drumPadBank.exists().get()) {
                    const drumPad = drumPadBank.getItemAt(i);
                    if (drumPad.exists().get()) {
                        const isMuted = drumPad.mute().get();
                        color = isMuted ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
                    }
                }
                        break;
                    case MODE_SOLO:
                if (drumPadBank && drumPadBank.exists().get()) {
                    const drumPad = drumPadBank.getItemAt(i);
                    if (drumPad.exists().get()) {
                        const isSoloed = drumPad.solo().get();
                        color = isSoloed ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
                }
            }
                break;
            case MODE_TRACK:
                const isSelectedTrack = (i === currentFixedTrackIndex);
                color = isSelectedTrack ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
                break;
        }
        
        sendLedUpdate('B', i, color);
    }
}

// --- NEW Knob LED Update Functions ---

function updateTopKnobLeds() { // Top KNOBS (Page 0)
    host.println("Updating Top Knob LEDs...");
    if (!remoteControlsPage0) return;
    for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPage0.getParameter(i).exists().get();
        // Use Red Full for brighter red
        const color = paramExists ? LED_COLOR.RED_FULL : LED_COLOR.OFF;
        // Send update via Sysex using KNOB helper
        sendLedUpdateKnob('T', i, color);
    }
}

function updateMiddleKnobLeds() {
    host.println("Updating Middle Knob LEDs...");
    const childTrackIndex = currentSelectedPage - PAGE_SELECT_OFFSET;
    
    for (let i = 0; i < 8; i++) {
        let color = LED_COLOR.OFF;
        if (childTrackIndex >= 0 && childTrackIndex < 8) {
            const childTrack = childTrackBank.getItemAt(childTrackIndex);
            const controls = childTrackControls[childTrackIndex];
            // Only light up if child track exists and has parameters
            if (childTrack && childTrack.exists().get() && 
                controls && controls.getParameter(i).exists().get()) {
                color = LED_COLOR.YELLOW_FULL;
            }
        }
        sendLedUpdateKnob('M', i, color);
    }
}

function updateBottomKnobLeds() { // Bottom KNOBS (Selected Page 1-8)
    host.println("Updating Bottom Knob LEDs...");
    if (!remoteControlsPageSelect) return;
     for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPageSelect.getParameter(i).exists().get();
        // Use AMBER_FULL (bright amber)
        const color = paramExists ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
         // Send update via Sysex using KNOB helper
        sendLedUpdateKnob('B', i, color);
    }
}

function updateAllLeds() {
    host.println("Updating All LEDs...");
    // Buttons
    updateTopRow_PageSelect();  // Top row (Page Select only)
    updateBottomRow_Mode();     // Bottom row (Mute/Solo/Track)
    updateModeButtonLeds();     // Mute/Solo/RecArm side buttons
    updateUtilityButtonLeds();  // Device, Track/Send Select buttons
    // Knobs
    updateTopKnobLeds();
    updateMiddleKnobLeds();
    updateBottomKnobLeds();
}

// LED color constants based on lcxl-reference.md
const LED_COLOR = {
    OFF: 0x0C,         // 12
    RED_LOW: 0x0D,     // 13
    RED_FULL: 0x0F,    // 15
    AMBER_LOW: 0x1D,   // 29 - Use as Dim Yellow/Amber
    AMBER_FULL: 0x3F,  // 63
    YELLOW_FULL: 0x2F, // 47 - Calculated: Full Red (3) + Med Green (2) + 12
    GREEN_LOW: 0x1C,   // 28
    GREEN_FULL: 0x3C,  // 60
    // Add flashing versions if needed (e.g., RED_FLASH: 0x0B)
    // Custom Colors removed as YELLOW_FULL corrected
};

// Renamed for clarity, handles BUTTON LEDs
function sendLedUpdate(row, index, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForButton(row, index); // Use Button helper
    if (sysexIndex === -1) {
        host.println(`WARN: Could not get Button Sysex index for row ${row}, index ${index}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// NEW function for Side Button LEDs (Mute, Solo, RecArm, Device)
function sendLedUpdateSideButton(buttonType, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForSideButton(buttonType); // Use Side Button helper
     if (sysexIndex === -1) {
        host.println(`WARN: Could not get Side Button Sysex index for type ${buttonType}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// Handles KNOB LEDs
function sendLedUpdateKnob(row, index, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForKnob(row, index); // Use Knob helper
     if (sysexIndex === -1) {
        host.println(`WARN: Could not get Knob Sysex index for row ${row}, index ${index}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// Generic function to send the actual Sysex command
function sendSysexLedCommand(sysexLedIndex, colorVelocity) {
     // Construct the Sysex message as an array of bytes
    const sysexBytes = [
        0xF0, 0x00, 0x20, 0x29, // Novation Header
        0x02, 0x11,             // Product ID (LCXL) & Command Type? (From Ref)
        0x78,                   // Set LED command
        TARGET_TEMPLATE_INDEX,  // Template (0-15)
        sysexLedIndex,          // Hardware Index of the LED (button or knob)
        colorVelocity,          // The color/brightness byte
        0xF7                    // End of Sysex
    ];
    // Convert byte array to a hex string for sendSysex
    const hexString = sysexBytes.map(byte => byte.toString(16).padStart(2, '0')).join('');

    if (DEBUG) host.println(`  -> Sending Sysex LED: Template=${TARGET_TEMPLATE_INDEX}, Index=${sysexLedIndex} (0x${sysexLedIndex.toString(16)}), Color=${colorVelocity} (0x${colorVelocity.toString(16)}), Hex=${hexString}`);

    midiOut.sendSysex(hexString);
}

// Update mode button LEDs function
function updateModeButtonLeds() {
    host.println(`Updating Mode Button LEDs, Mode: ${currentBottomRowMode}`);
    // Mute Button
    const muteColor = (currentBottomRowMode === MODE_MUTE) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    sendLedUpdateSideButton(MODE_MUTE, muteColor);
    // Solo Button
    const soloColor = (currentBottomRowMode === MODE_SOLO) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    sendLedUpdateSideButton(MODE_SOLO, soloColor);
    // RecArm Button (Now indicates Track Select mode)
    const recArmColor = (currentBottomRowMode === MODE_TRACK) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    sendLedUpdateSideButton('REC_ARM', recArmColor);
}

// NEW LED function for Utility Buttons (Device, Arrows)
function updateUtilityButtonLeds() {
    host.println("Updating Utility Button LEDs...");
    if (!remoteControlsPage10) return; // Check Page 10

    for (const buttonId in UTILITY_BUTTON_MAP) {
        const mapping = UTILITY_BUTTON_MAP[buttonId];
        let color = LED_COLOR.OFF;

        // Special handling for Device button - now indicates group expansion
        if (buttonId === 'DEVICE') {
            if (fixedTrack.isGroup().get()) {
                // Red Full when expanded, Red Low when collapsed
                color = fixedTrack.isGroupExpanded().get() ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
            }
        } else {
            // Original handling for other utility buttons
            const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
            const paramExists = parameter.exists().get();
            if (paramExists) {
                const value = parameter.value().get();
                color = value > 0 ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
            }
        }

        sendLedUpdateUtilityButton(buttonId, color);
    }
}

// NEW function for Utility Button LEDs
function sendLedUpdateUtilityButton(buttonId, colorVelocity) {
     if (!midiOut) return;
    const sysexIndex = getSysexIndexForUtilityButton(buttonId);
     if (sysexIndex === -1) {
        host.println(`WARN: Could not get Utility Button Sysex index for ID ${buttonId}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

function initializeRemoteControlObservers() {
    // Initialize observers for Fixed Remote Controls Page 11 (Middle Knobs)
    for (var i = 0; i < 8; i++) {
        var param = remoteControlsPageSelect.getRemoteControls().getRemoteControlInSlot(i);
        if (param) {
            param.exists().markInterested();
            param.value().markInterested();
            param.name().markInterested();
        }
    }

    // Initialize observers for Fixed Remote Controls Page 10 (Utility Buttons)
    for (var i = 0; i < 8; i++) {
        var param = remoteControlsPage10.getRemoteControls().getRemoteControlInSlot(i);
        if (param) {
            param.exists().markInterested();
            param.value().markInterested();
            param.name().markInterested();
        }
    }

    // Initialize observers for Selectable Remote Controls Page (Bottom Knobs)
    for (var i = 0; i < 8; i++) {
        var param = remoteControlsPageSelect.getRemoteControls().getRemoteControlInSlot(i);
        if (param) {
            param.exists().markInterested();
            param.value().markInterested();
            param.name().markInterested();
        }
    }
}