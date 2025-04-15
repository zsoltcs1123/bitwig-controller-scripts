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
const DEBUG = true; // Set to false to disable verbose console logging
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
const MODE_PAGE = 'PAGE';   // Top row default
const MODE_TRACK = 'TRACK'; // Top row alternate (RecArm active)

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
let remoteControlsPage11; // Middle Knobs - FIXED page 11
let remoteControlsSelected; // Bottom Knobs - FOLLOWS SELECTION (pages 1-8)
let currentSelectedPage = 1; // Default to page 1 (index 1)
const PAGE_SELECT_OFFSET = 1; // Buttons select pages 1-8
let currentBottomRowMode = MODE_MUTE; // Mode for BOTTOM row buttons (Mute/Solo)
let currentTopRowMode = MODE_PAGE;    // Mode for TOP row buttons (Page/Track Select)
let currentFixedTrackIndex = 0; // Index of the track the bank is scrolled to (0-7)

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
    if (DEBUG) host.println("LCXL Drum Machine Group initializing...");

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

    // --- Create Device and Control Objects ---
    cursorDevice = fixedTrack.createCursorDevice("LCXL_Device");
    cursorDevice.name().markInterested(); // Log device name

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

    // Fixed Remote Controls Page 11 (Middle Knobs)
    remoteControlsPage11 = cursorDevice.createCursorRemoteControlsPage("FixedPage11_MidKnobs", 8, null);
    remoteControlsPage11.selectedPageIndex().markInterested();
    remoteControlsPage11.selectedPageIndex().set(11); // Fix to page index 11

    // Selectable Remote Controls Page (Bottom Knobs / Page Select Buttons)
    // This is the 'main' unnamed page object that we change the index of.
    remoteControlsSelected = cursorDevice.createCursorRemoteControlsPage(8);
    remoteControlsSelected.selectedPageIndex().markInterested();
    remoteControlsSelected.pageNames().markInterested(); // Good for debugging
    // Set initial selected page (must be >= PAGE_SELECT_OFFSET)
    remoteControlsSelected.selectedPageIndex().set(currentSelectedPage);

    // --- Observers ---

    // Track Name Observer (Now reflects the name of the track at the window's index 0)
    fixedTrack.name().addValueObserver((name) => {
        const trackName = name || "[Empty Slot]";
        if (DEBUG) host.println(`Fixed Track (${currentFixedTrackIndex + 1}): ${trackName}`);
        // Keep notification simple or add track index?
        // host.showPopupNotification(`Controlling Track: ${trackName}`);
    });

    // Scroll Position Observer (Tracks the fixed track index)
    trackBank.scrollPosition().addValueObserver(newIndex => {
        currentFixedTrackIndex = newIndex;
        if (DEBUG) host.println(`Track Bank scrolled to index: ${newIndex}`);
        // Update TOP row LEDs if in TRACK select mode
        if (currentTopRowMode === MODE_TRACK) {
            updateTopRow_Mode();
        }
        host.showPopupNotification(`Fixed Track: ${newIndex + 1}`);
    });

    // Device Name Observer
    cursorDevice.name().addValueObserver((name) => {
        if (DEBUG) host.println("Device on Fixed Track: " + (name || "[No Device]"));
        // Re-initialize LEDs if device changes (drum pad bank AND parameters might appear/disappear)
        updateAllLeds();
    });

    // Drum Pad Bank Existence Observer
    drumPadBank.exists().addValueObserver((exists) => {
        if (DEBUG) host.println("Drum Pad Bank Exists: " + exists);
        // Update the BOTTOM row (Mute/Solo)
        updateBottomRow_MuteSolo();
    });

    // Drum Pad Mute & Solo Observers (for BOTTOM row LED feedback)
    for (let i = 0; i < 8; i++) {
        let drumPad = drumPadBank.getItemAt(i);
        drumPad.exists().addValueObserver((exists) => {
             if (DEBUG) host.println(`Drum Pad ${i} Exists: ${exists}`);
             // Update the BOTTOM row
             updateBottomRow_MuteSolo();
        });
        drumPad.mute().addValueObserver((isMuted) => {
            if (DEBUG) host.println(`Drum Pad ${i} Muted: ${isMuted}`);
            // Only update if bottom row is in Mute mode
            if (currentBottomRowMode === MODE_MUTE) {
                 updateBottomRow_MuteSolo();
            }
        });
        drumPad.solo().addValueObserver((isSoloed) => {
            if (DEBUG) host.println(`Drum Pad ${i} Solo: ${isSoloed}`);
            // Only update if bottom row is in Solo mode
             if (currentBottomRowMode === MODE_SOLO) {
                updateBottomRow_MuteSolo();
            }
        });
    }

    // --- Knob Parameter Existence Observers ---
    for (let i = 0; i < 8; i++) {
        // Top Knobs (Page 0)
        remoteControlsPage0.getParameter(i).exists().addValueObserver((exists) => {
            if (DEBUG) host.println(`Top Knob Param ${i} Exists (Page 0): ${exists}`);
            updateTopKnobLeds(); // Update all top knob LEDs
        });
        // Middle Knobs (Page 11)
        remoteControlsPage11.getParameter(i).exists().addValueObserver((exists) => {
            if (DEBUG) host.println(`Middle Knob Param ${i} Exists (Page 11): ${exists}`);
            updateMiddleKnobLeds(); // Update all middle knob LEDs
        });
        // Bottom Knobs (Selected Page)
        remoteControlsSelected.getParameter(i).exists().addValueObserver((exists) => {
            if (DEBUG) host.println(`Bottom Knob Param ${i} Exists (Page ${currentSelectedPage}): ${exists}`);
            updateBottomKnobLeds(); // Update all bottom knob LEDs
        });
    }

    // Observer for Selected Page Index (needs to update TOP row LEDs now)
    remoteControlsSelected.selectedPageIndex().addValueObserver((pageIndex) => {
        currentSelectedPage = pageIndex;
        if (DEBUG) host.println("Selected Remote Page Index Changed To: " + pageIndex);
        // Update page select LEDs (TOP row) only if in PAGE mode
        if (currentTopRowMode === MODE_PAGE) {
             updateTopRow_Mode();
        }
        // Update bottom knob LEDs (still tied to selected page)
        updateBottomKnobLeds();
    });

    // Observers to keep fixed pages fixed (error checking)
    remoteControlsPage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) {
            if (DEBUG) host.println(`WARN: Fixed Page 0 index (${index}) changed. Forcing back.`);
            remoteControlsPage0.selectedPageIndex().set(0);
        }
    });
    remoteControlsPage9.selectedPageIndex().addValueObserver((index) => {
        if (index !== 9) {
            if (DEBUG) host.println(`WARN: Fixed Page 9 (Sliders) index (${index}) changed. Forcing back.`);
            remoteControlsPage9.selectedPageIndex().set(9);
        }
    });
    remoteControlsPage10.selectedPageIndex().addValueObserver((index) => {
        if (index !== 10) {
            if (DEBUG) host.println(`WARN: Fixed Page 10 (Utility) index (${index}) changed. Forcing back.`);
            remoteControlsPage10.selectedPageIndex().set(10);
        }
    });
    remoteControlsPage11.selectedPageIndex().addValueObserver((index) => {
        if (index !== 11) {
            if (DEBUG) host.println(`WARN: Fixed Page 11 (Mid Knobs) index (${index}) changed. Forcing back.`);
            remoteControlsPage11.selectedPageIndex().set(11);
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
                if (DEBUG) host.println(`Utility Button Param ${mapping.paramIndex} (${buttonId}) Value Changed: ${value}`);
                updateUtilityButtonLeds();
            });
            parameter.exists().addValueObserver(exists => {
                 if (DEBUG) host.println(`Utility Button Param ${mapping.paramIndex} (${buttonId}) Exists on Page 10: ${exists}`);
                 updateUtilityButtonLeds();
             });
        } else {
             if (DEBUG) host.println(`WARN: remoteControlsPage10 not initialized for utility observers.`);
        }
    }

    // --- Initial state setup ---
    // Send initial MIDI messages to LCXL (set initial LED states)
    updateAllLeds(); // Call a function to set initial LED states

    if (DEBUG) host.println("LCXL Drum Machine Group initialized successfully with API objects and All Observers.");
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
                if (DEBUG) host.println(`-> Utility Button CC: ${buttonId} (CC ${cc}) -> Target Page 10`);
                if (remoteControlsPage10) { // Check Page 10
                    const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
                     if (parameter.exists().get()) {
                        if (DEBUG) host.println(`     -> Param ${mapping.paramIndex} exists on Page 10. Toggling value.`);
                        const currentValue = parameter.value().get();
                        parameter.value().set(currentValue === 0 ? 127 : 0, 128);
                     } else {
                         if (DEBUG) host.println(`     -> Param ${mapping.paramIndex} does NOT exist on Page 10.`);
                     }
                } else {
                    if (DEBUG) host.println(`     -> remoteControlsPage10 object is NOT available.`);
                }
                return; // Consume CC
            }
        }
    }

    // Ensure API objects are ready for Knobs/Sliders
    if (!remoteControlsPage0 || !remoteControlsPage9 || !remoteControlsPage11 || !remoteControlsSelected) {
        // Note: remoteControlsPage10 check removed here as it's only for utility buttons
        if (DEBUG) host.println("WARN: API objects not ready in handleCC for Knobs/Sliders");
        return;
    }

    const paramIndex = findParameterIndex(cc); // Find which knob/slider (0-7)
    if (paramIndex === -1) {
        if (DEBUG) host.println(`  -> Unmapped CC ${cc} received, value ${value}`);
        return; // CC doesn't match any known controls
    }

    // Top Knobs (FIXED Page 0)
    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) {
        if (DEBUG) host.println(`  -> Top Knob ${paramIndex + 1} (CC ${cc}) -> Page 0, Param ${paramIndex}`);
        // Ensure page is still correct (should be due to observer, but belt-and-suspenders)
        // remoteControlsPage0.selectedPageIndex().set(0);
        remoteControlsPage0.getParameter(paramIndex).set(value, 128);
    }
    // Middle Knobs (FIXED Page 11)
    else if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M8) {
        if (DEBUG) host.println(`  -> Middle Knob ${paramIndex + 1} (CC ${cc}) -> Page 11, Param ${paramIndex}`);
        // remoteControlsPage11.selectedPageIndex().set(11);
        remoteControlsPage11.getParameter(paramIndex).set(value, 128);
    }
    // Bottom Knobs (FOLLOWS Selected Page 1-8)
    else if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B8) {
        if (DEBUG) host.println(`  -> Bottom Knob ${paramIndex + 1} (CC ${cc}) -> Page ${currentSelectedPage}, Param ${paramIndex}`);
        // No need to set page index here, it's controlled by buttons/observer
        remoteControlsSelected.getParameter(paramIndex).set(value, 128);
    }
    // Sliders (FIXED Page 9)
    else if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) {
        if (DEBUG) host.println(`  -> Slider ${paramIndex + 1} (CC ${cc}) -> Page 9, Param ${paramIndex}`);
        // remoteControlsPage9.selectedPageIndex().set(9);
        remoteControlsPage9.getParameter(paramIndex).set(value, 128);
    } else {
        // This case should ideally not be reached due to findParameterIndex check
        if (DEBUG) host.println(`  -> CC ${cc} wasn't mapped to a known control row.`);
    }
}

function handleNoteOn(note, velocity) {
    // Mode Buttons (Mute, Solo, Rec Arm)
    if (note === NOTE.BTN_MUTE) {
        if (currentBottomRowMode !== MODE_MUTE) {
             if (DEBUG) host.println("-> Bottom Row Mode changed to MUTE");
             currentBottomRowMode = MODE_MUTE;
             updateModeButtonLeds(); // Update Mute/Solo indicators
             updateBottomRow_MuteSolo(); // Update bottom row LEDs for the new mode
        }
        return; // Consume the event
    }
    if (note === NOTE.BTN_SOLO) {
        if (currentBottomRowMode !== MODE_SOLO) {
            if (DEBUG) host.println("-> Bottom Row Mode changed to SOLO");
            currentBottomRowMode = MODE_SOLO;
            updateModeButtonLeds(); // Update Mute/Solo indicators
            updateBottomRow_MuteSolo(); // Update bottom row LEDs for the new mode
        }
         return; // Consume the event
    }
     if (note === NOTE.BTN_REC_ARM) {
        // Toggle Top Row mode between Page and Track
        currentTopRowMode = (currentTopRowMode === MODE_PAGE) ? MODE_TRACK : MODE_PAGE;
        if (DEBUG) host.println(`-> Top Row Mode changed to ${currentTopRowMode}`);
        updateModeButtonLeds(); // Update RecArm indicator
        updateTopRow_Mode(); // Update top row LEDs for the new mode
        return; // Consume the event
    }

    // Check for Utility Device Button Note
    if (note === NOTE.DEVICE_BTN) {
         if (DEBUG) host.println(`-> Utility Button Note: DEVICE (Note ${note}) -> Target Page 10`);
         if (remoteControlsPage10) { // Check Page 10
            const mapping = UTILITY_BUTTON_MAP['DEVICE'];
            const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
            if (parameter.exists().get()) {
                const currentValue = parameter.value().get();
                parameter.value().set(currentValue === 0 ? 127 : 0, 128);
            }
         }
         return; // Consume Note
    }

    // Ensure API objects are ready for other buttons
     if (!drumPadBank || !remoteControlsSelected) {
        if (DEBUG) host.println("WARN: API objects not ready in handleNoteOn for regular buttons");
        return;
    }

    const buttonIndex = findButtonIndex(note); // Find which button (0-7)
     if (buttonIndex === -1) {
        // Only log if it wasn't a mode button we already handled
        if (note !== NOTE.BTN_MUTE && note !== NOTE.BTN_SOLO && note !== NOTE.BTN_REC_ARM) {
            if (DEBUG) host.println(`  -> Unmapped Note ${note} ON received, velocity ${velocity}`);
        }
        return; // Note doesn't match any known buttons
    }

    // Top Buttons (Page Select / Track Select)
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T8) {
        if (DEBUG) host.println(`  -> Top Button ${buttonIndex + 1} (Note ${note}) in mode ${currentTopRowMode}`);
        if (currentTopRowMode === MODE_PAGE) {
            const targetPage = buttonIndex + PAGE_SELECT_OFFSET;
            if (DEBUG) host.println(`     -> Selecting Page ${targetPage}`);
            remoteControlsSelected.selectedPageIndex().set(targetPage);
            // Observer updates LEDs
        } else { // MODE_TRACK
             if (DEBUG) host.println(`     -> Selecting Fixed Track Index ${buttonIndex}`);
             trackBank.scrollPosition().set(buttonIndex);
             // Observer updates LEDs
        }
        return; // Consume event
    }
    // Bottom Buttons (Mute / Solo)
    else if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B8) {
        if (DEBUG) host.println(`  -> Bottom Button ${buttonIndex + 1} (Note ${note}) in mode ${currentBottomRowMode}`);
        if (drumPadBank.exists().get()) {
            const drumPad = drumPadBank.getItemAt(buttonIndex);
            if (drumPad.exists().get()) {
                 switch(currentBottomRowMode) {
                    case MODE_MUTE:
                        if (DEBUG) host.println(`     -> Toggling Mute ${buttonIndex}`);
                        drumPad.mute().toggle();
                        break;
                    case MODE_SOLO:
                         if (DEBUG) host.println(`     -> Toggling Solo ${buttonIndex}`);
                        drumPad.solo().toggle();
                        break;
                }
            }
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
    if (DEBUG) host.println("LCXL Drum Machine Group exiting...");

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

    if (DEBUG) host.println("LCXL script finished cleanup.");
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

// Renamed - Now handles TOP row (Page Select / Track Select)
function updateTopRow_Mode() {
    if (DEBUG) host.println(`Updating Top Row (Mode: ${currentTopRowMode}) LEDs...`);
    if (currentTopRowMode === MODE_PAGE) {
        // Page Select Mode - Amber Dim/Full
        for (let i = 0; i < 8; i++) {
            const targetPage = i + PAGE_SELECT_OFFSET;
            const isSelected = (currentSelectedPage === targetPage);
            const color = isSelected ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
            sendLedUpdate('T', i, color);
        }
    } else { // MODE_TRACK
        // Track Select Mode - Red Dim/Full
        for (let i = 0; i < 8; i++) {
            const isSelectedTrack = (i === currentFixedTrackIndex);
            const color = isSelectedTrack ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
            sendLedUpdate('T', i, color);
        }
    }
}

// Renamed - Now handles BOTTOM row (Mute / Solo)
function updateBottomRow_MuteSolo() {
    if (DEBUG) host.println(`Updating Bottom Row (Mode: ${currentBottomRowMode}) LEDs...`);
    if (!drumPadBank) return;
    const bankExists = drumPadBank.exists().get();

    for (let i = 0; i < 8; i++) {
        let color = LED_COLOR.OFF;
        if (bankExists) {
            const drumPad = drumPadBank.getItemAt(i);
            if (drumPad.exists().get()) {
                switch(currentBottomRowMode) {
                    case MODE_MUTE:
                        const isMuted = drumPad.mute().get();
                        color = isMuted ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
                        break;
                    case MODE_SOLO:
                        const isSoloed = drumPad.solo().get();
                        color = isSoloed ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
                        break;
                }
            }
        }
        sendLedUpdate('B', i, color);
    }
}

// --- NEW Knob LED Update Functions ---

function updateTopKnobLeds() { // Top KNOBS (Page 0)
    if (DEBUG) host.println("Updating Top Knob LEDs...");
    if (!remoteControlsPage0) return;
    for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPage0.getParameter(i).exists().get();
        // Use Red Full for brighter red
        const color = paramExists ? LED_COLOR.RED_FULL : LED_COLOR.OFF;
        // Send update via Sysex using KNOB helper
        sendLedUpdateKnob('T', i, color);
    }
}

function updateMiddleKnobLeds() { // Middle KNOBS (Page 11)
     if (DEBUG) host.println("Updating Middle Knob LEDs...");
    if (!remoteControlsPage11) return;
    for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPage11.getParameter(i).exists().get();
        // Use YELLOW_FULL (darker orange)
        const color = paramExists ? LED_COLOR.YELLOW_FULL : LED_COLOR.OFF;
         // Send update via Sysex using KNOB helper
        sendLedUpdateKnob('M', i, color);
    }
}

function updateBottomKnobLeds() { // Bottom KNOBS (Selected Page 1-8)
    if (DEBUG) host.println("Updating Bottom Knob LEDs...");
    if (!remoteControlsSelected) return;
     for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsSelected.getParameter(i).exists().get();
        // Use AMBER_FULL (bright amber)
        const color = paramExists ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
         // Send update via Sysex using KNOB helper
        sendLedUpdateKnob('B', i, color);
    }
}

function updateAllLeds() {
    if (DEBUG) host.println("Updating All LEDs...");
    // Buttons
    updateTopRow_Mode();        // Top row (Page/Track)
    updateBottomRow_MuteSolo(); // Bottom row (Mute/Solo)
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
        if (DEBUG) host.println(`WARN: Could not get Button Sysex index for row ${row}, index ${index}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// NEW function for Side Button LEDs (Mute, Solo, RecArm, Device)
function sendLedUpdateSideButton(buttonType, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForSideButton(buttonType); // Use Side Button helper
     if (sysexIndex === -1) {
        if (DEBUG) host.println(`WARN: Could not get Side Button Sysex index for type ${buttonType}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// Handles KNOB LEDs
function sendLedUpdateKnob(row, index, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForKnob(row, index); // Use Knob helper
     if (sysexIndex === -1) {
        if (DEBUG) host.println(`WARN: Could not get Knob Sysex index for row ${row}, index ${index}`);
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

// NEW function to update Mode button LEDs
function updateModeButtonLeds() {
    if (DEBUG) host.println(`Updating Mode Button LEDs, Bottom: ${currentBottomRowMode}, Top: ${currentTopRowMode}`);
    // Mute Button
    const muteColor = (currentBottomRowMode === MODE_MUTE) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    sendLedUpdateSideButton(MODE_MUTE, muteColor);
    // Solo Button
    const soloColor = (currentBottomRowMode === MODE_SOLO) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    sendLedUpdateSideButton(MODE_SOLO, soloColor);
    // RecArm Button (Indicates if Top Row is in Track Select mode)
    const recArmColor = (currentTopRowMode === MODE_TRACK) ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
    // We need to use the Note for RecArm button to send its state
    // Can reuse sendLedUpdateSideButton if we adjust the helper or add a mapping
    // Let's adjust the helper for now
    sendLedUpdateSideButton('REC_ARM', recArmColor); // Use a string identifier
}

// NEW LED function for Utility Buttons (Device, Arrows)
function updateUtilityButtonLeds() {
    if (DEBUG) host.println("Updating Utility Button LEDs... (Targeting Page 10)");
    if (!remoteControlsPage10) return; // Check Page 10

    for (const buttonId in UTILITY_BUTTON_MAP) {
         const mapping = UTILITY_BUTTON_MAP[buttonId];
         const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
         let color = LED_COLOR.OFF;
         const paramExists = parameter.exists().get(); // Check existence

         if (paramExists) {
             const value = parameter.value().get();
             // Red Dim/Full based on toggle state
             color = value > 0 ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
         }

         // Specific Debug for Device Button
         if (buttonId === 'DEVICE') {
             if (DEBUG) host.println(`  -> DEVICE LED Check: ParamExists=${paramExists}, Color=${color}`);
         }

         sendLedUpdateUtilityButton(buttonId, color);
    }
}

// NEW function for Utility Button LEDs
function sendLedUpdateUtilityButton(buttonId, colorVelocity) {
     if (!midiOut) return;
    const sysexIndex = getSysexIndexForUtilityButton(buttonId);
     if (sysexIndex === -1) {
        if (DEBUG) host.println(`WARN: Could not get Utility Button Sysex index for ID ${buttonId}`);
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}