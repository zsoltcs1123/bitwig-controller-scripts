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
const MODE_TRACK = 'TRACK';   
const MODE_PAGE = 'PAGE';     // Top row is now exclusively for page selection

// --- Globals ---
let midiIn;
let midiOut;
let trackBank; // Top-level groups
let selectedGroupTrack; // The currently selected group track via trackBank
let mixerTrack; // Child track 0 of selectedGroupTrack (primary target)
let childTrackBank; // Bank for children of selectedGroupTrack (size 9)
let cursorDevice; // Device on mixerTrack
let drumPadBank; // Drum pads on mixerTrack's device
let remoteControlsPage0;  // Top Knobs - FIXED page 0 (on mixerTrack device)
let remoteControlsPage9;  // Sliders - FIXED page 9 (on mixerTrack device)
let remoteControlsPage10; // Utility Buttons - FIXED page 10 (on mixerTrack device)
let remoteControlsPageSelect; // Bottom Knobs - FOLLOWS SELECTION (pages 1-8, on mixerTrack device)
let currentSelectedPage = 1; // Default to page 1 (index 1)
const PAGE_SELECT_OFFSET = 1; // Buttons select pages 1-8
let currentBottomRowMode = MODE_MUTE; // Mode for bottom row buttons (Mute/Solo/Track)
let currentSelectedGroupIndex = 0; // Index of the GROUP track the bank is scrolled to (0-7)

// Control for child tracks 1-8 (Middle Knobs)
let childDevices = []; // Devices for each child track (index 1-8)
let childDeviceControls = []; // DEFAULT remote control pages (Device Pages) for each child track's device (index 1-8)
let childPresetControls = []; // PRESET remote control pages for each child track's device (index 1-8)

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

    midiIn.setMidiCallback(onMidi);

    // --- Create Top-Level Group Track Bank ---
    trackBank = host.createTrackBank(8, 0, 0, false);
    trackBank.scrollPosition().markInterested();

    // --- Setup for Focused Group Track (Item 0 initially) ---
    // We get the item at 0 to set up objects, but the actual track will follow scroll position
    selectedGroupTrack = trackBank.getItemAt(0);
    selectedGroupTrack.name().markInterested();
    selectedGroupTrack.isGroup().markInterested();
    selectedGroupTrack.isGroupExpanded().markInterested();

    // --- Setup Child Track Bank (relative to the *focused* group track) ---
    childTrackBank = selectedGroupTrack.createTrackBank(9, 0, 0, false); // Size 9 for 0-8

    // --- Setup Mixer Track (Child 0 of focused group) ---
    mixerTrack = childTrackBank.getItemAt(0);
    mixerTrack.name().markInterested();
    mixerTrack.exists().markInterested();

    // --- Setup Device & Controls for Mixer Track ---
    const mixerDeviceBank = mixerTrack.createDeviceBank(1);
    const instrumentMatcher = host.createInstrumentMatcher();
    mixerDeviceBank.setDeviceMatcher(instrumentMatcher);
    cursorDevice = mixerDeviceBank.getDevice(0); // Device on Mixer Track
    cursorDevice.exists().markInterested();
    cursorDevice.name().markInterested();

    drumPadBank = cursorDevice.createDrumPadBank(8);
    drumPadBank.exists().markInterested();
    for (let i = 0; i < 8; i++) {
        let drumPad = drumPadBank.getItemAt(i);
        drumPad.exists().markInterested();
        drumPad.mute().markInterested();
        drumPad.solo().markInterested();
    }

    // --- Setup Remote Control Pages ---
    // Top Knobs (Page 0 on Focused GROUP Track)
    remoteControlsPage0 = selectedGroupTrack.createCursorRemoteControlsPage("FixedPage0_Group", 8, null);
    remoteControlsPage0.selectedPageIndex().markInterested();
    remoteControlsPage0.selectedPageIndex().set(0);
    for (let i = 0; i < 8; i++) {
        remoteControlsPage0.getParameter(i).exists().markInterested();
    }

    // Sliders (Page 9 on Mixer Track Device)
    remoteControlsPage9 = cursorDevice.createCursorRemoteControlsPage("FixedPage9_MixerSliders", 8, null);
    remoteControlsPage9.selectedPageIndex().markInterested();
    remoteControlsPage9.selectedPageIndex().set(9);
    for (let i = 0; i < 8; i++) {
        remoteControlsPage9.getParameter(i).exists().markInterested(); // Need exists for CC handler logic? Let's assume not.
    }

    // Utility Buttons (Page 10 on Mixer Track Device)
    remoteControlsPage10 = cursorDevice.createCursorRemoteControlsPage("FixedPage10_MixerUtility", 8, null);
    remoteControlsPage10.selectedPageIndex().markInterested();
    remoteControlsPage10.selectedPageIndex().set(10);
    for (let i = 0; i < 8; i++) {
        const param = remoteControlsPage10.getParameter(i);
        param.exists().markInterested();
        param.value().markInterested(); // Value needed for LED updates
    }

    // Bottom Knobs (Selectable Page 1-8 (or 0) on Mixer Track Device)
    remoteControlsPageSelect = cursorDevice.createCursorRemoteControlsPage(8); // Follows user selection
    remoteControlsPageSelect.selectedPageIndex().markInterested();
    remoteControlsPageSelect.pageNames().markInterested();
    remoteControlsPageSelect.pageCount().markInterested(); // Potentially useful
    remoteControlsPageSelect.selectedPageIndex().set(currentSelectedPage); // Set initial page
    for (let i = 0; i < 8; i++) {
        remoteControlsPageSelect.getParameter(i).exists().markInterested();
    }

    // --- Setup Child Tracks 1-8 (relative to focused group) ---
    childDevices = []; // Clear/init arrays
    childDeviceControls = [];
    childPresetControls = [];
    for (let i = 1; i <= 8; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        childTrack.name().markInterested();
        childTrack.exists().markInterested();

        const deviceBank = childTrack.createDeviceBank(1);
        deviceBank.setDeviceMatcher(instrumentMatcher);
        const device = deviceBank.getDevice(0);
        device.name().markInterested();
        device.exists().markInterested();

        const deviceControls = device.createCursorRemoteControlsPage("ChildTrackDeviceControls" + i, 8, null);
        const perfControls = device.createCursorRemoteControlsPage("ChildTrackPerfControls" + i, 8, "perf");

        deviceControls.selectedPageIndex().markInterested();
        perfControls.selectedPageIndex().markInterested();
        deviceControls.selectedPageIndex().set(0);
        perfControls.selectedPageIndex().set(0);

        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            deviceControls.getParameter(paramIndex).exists().markInterested();
            perfControls.getParameter(paramIndex).exists().markInterested();
        }

        childDevices[i] = device; // Store device proxy
        childDeviceControls[i] = deviceControls; // Store device page cursor
        childPresetControls[i] = perfControls; // Store perf page cursor
    }

    // --- Add Observers (MUST NOT call markInterested) ---

    // Group Track Selection Observer
    trackBank.scrollPosition().addValueObserver(newIndex => {
        // The banks/cursors handle the focus change automatically.
        // We just need to update our internal index and trigger LED updates.
        if (newIndex !== currentSelectedGroupIndex) {
            currentSelectedGroupIndex = newIndex;
            // Update LEDs that depend on the selected group index or its children
            if (currentBottomRowMode === MODE_TRACK) {
                updateBottomRow_Mode(); // Update track select LEDs
            }
            updateTopKnobLeds(); // Group track params might change
            updateUtilityButtonLeds(); // Group expansion state might change
            updateMiddleKnobLeds(); // Child tracks change
            // Mixer track controls LEDs (BottomKnobs, Sliders, Utility(partially)) might also need update implicitly
        }
    });

    // Observer for the *focused* group track's name (for logging)
    selectedGroupTrack.name().addValueObserver((name) => {
    });

    // Observer for the *focused* group track's expansion state (for Utility LED)
    selectedGroupTrack.isGroup().addValueObserver((isGroup) => {
        updateUtilityButtonLeds();
    });
    selectedGroupTrack.isGroupExpanded().addValueObserver((isExpanded) => {
        updateUtilityButtonLeds();
    });

    // Mixer Track Observers (Child 0 of focused group)
    mixerTrack.exists().addValueObserver(exists => {
        updateAllLeds(); // Update LEDs if mixer track appears/disappears
    });
    mixerTrack.name().addValueObserver(name => { /* Mixer Track name changed */ });

    // Mixer Track Device Observers
    cursorDevice.exists().addValueObserver((exists) => {
        updateAllLeds(); // Major change, update everything
    });
    cursorDevice.name().addValueObserver((name) => {
        updateAllLeds(); // Device changed, parameters/pads might change
    });

    // Mixer Track Drum Pad Bank Observer
    drumPadBank.exists().addValueObserver((exists) => {
        updateBottomRow_Mode(); // Affects Mute/Solo LEDs
    });

    // Mixer Track Drum Pad Observers (Mute/Solo)
    for (let i = 0; i < 8; i++) {
        let drumPad = drumPadBank.getItemAt(i);
        drumPad.exists().addValueObserver((exists) => {
             updateBottomRow_Mode();
        });
        drumPad.mute().addValueObserver((isMuted) => {
            if (currentBottomRowMode === MODE_MUTE) updateBottomRow_Mode();
        });
        drumPad.solo().addValueObserver((isSoloed) => {
             if (currentBottomRowMode === MODE_SOLO) updateBottomRow_Mode();
        });
    }

    // Remote Control Page Observers
    // Fixed Page 0 (Group Track) - Param Existence
    for (let i = 0; i < 8; i++) {
        remoteControlsPage0.getParameter(i).exists().addValueObserver((exists) => {
            updateTopKnobLeds();
        });
    }

    // Fixed Page 10 (Mixer Utility) - Param Value/Existence
    for (let i = 0; i < 8; i++) {
         const param = remoteControlsPage10.getParameter(i);
         param.exists().addValueObserver(exists => {
             updateUtilityButtonLeds();
         });
         param.value().addValueObserver(value => {
             updateUtilityButtonLeds();
         });
    }

    // Selectable Page (Mixer Bottom Knobs) - Page Index & Param Existence
    remoteControlsPageSelect.selectedPageIndex().addValueObserver((pageIndex) => {
        if (pageIndex !== currentSelectedPage) { // Prevent loops if setting triggers observer
             currentSelectedPage = pageIndex;
            updateTopRow_PageSelect(); // Update page select LEDs (top row)
            updateBottomKnobLeds(); // Update bottom knob LEDs
            updateMiddleKnobLeds(); // Update middle knob LEDs (depend on page to select child 1-8)
        }
    });
    for (let i = 0; i < 8; i++) {
        remoteControlsPageSelect.getParameter(i).exists().addValueObserver((exists) => {
            updateBottomKnobLeds();
        });
    }

    // Child Track Observers (Existence for Middle Knobs)
    // Note: We observe the items *within* the bank (childTrackBank.getItemAt(i)).
    // When the bank's focus changes (implicitly via selectedGroupTrack changing), these observers
    // should report the state of the *new* tracks/devices/parameters at those indices.
    for (let i = 1; i <= 8; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        const device = childDevices[i]; // Use the stored device proxy
        const deviceControls = childDeviceControls[i];
        const perfControls = childPresetControls[i];

        childTrack.exists().addValueObserver((exists) => {
            updateMiddleKnobLeds();
        });
        device.exists().addValueObserver((exists) => {
            updateMiddleKnobLeds();
        });

        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            deviceControls.getParameter(paramIndex).exists().addValueObserver((exists) => {
                updateMiddleKnobLeds();
            });
            perfControls.getParameter(paramIndex).exists().addValueObserver((exists) => {
                updateMiddleKnobLeds();
            });
        }
    }

    // Observers to keep fixed pages fixed (Error checking/Correction)
    remoteControlsPage0.selectedPageIndex().addValueObserver((index) => {
        if (index !== 0) {
            host.println(`WARN: Fixed Page 0 (Group) index (${index}) changed? Forcing back.`);
            remoteControlsPage0.selectedPageIndex().set(0);
        }
    });
    remoteControlsPage9.selectedPageIndex().addValueObserver((index) => {
        if (index !== 9) {
            host.println(`WARN: Fixed Page 9 (Sliders) index (${index}) changed? Forcing back.`);
            remoteControlsPage9.selectedPageIndex().set(9);
        }
    });
    remoteControlsPage10.selectedPageIndex().addValueObserver((index) => {
        if (index !== 10) {
            host.println(`WARN: Fixed Page 10 (Utility) index (${index}) changed? Forcing back.`);
            remoteControlsPage10.selectedPageIndex().set(10);
        }
    });

    // --- Initial state setup ---
    updateAllLeds(); // Set initial LED states based on initial focus

    host.println("LCXL Drum Machine Group initialized successfully.");
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
    // Ensure API objects related to the mixer track are valid
    if (!mixerTrack || !mixerTrack.exists().get() || !cursorDevice || !cursorDevice.exists().get() || !remoteControlsPage0 || !remoteControlsPage9 || !remoteControlsPage10 || !remoteControlsPageSelect) {
        host.println(`WARN: Mixer track or its device/controls not ready in handleCC. CC ${cc} ignored.`);
        return;
    }

    // Check for Utility Button CCs (only react on press: value > 0)
    if (value > 0) {
        for (const buttonId in UTILITY_BUTTON_MAP) {
            const mapping = UTILITY_BUTTON_MAP[buttonId];
            if (mapping.cc === cc) {
                    const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
                     if (parameter.exists().get()) {
                        const currentValue = parameter.value().get();
                        parameter.value().set(currentValue === 0 ? 127 : 0, 128);
                     } else {
                         host.println(`     -> WARN: Param ${mapping.paramIndex} does NOT exist on Page 10 for Utility CC ${cc}.`);
                }
                return; // Consume CC
            }
        }
    }

    const paramIndex = findParameterIndex(cc);
    if (paramIndex === -1) {
        return;
    }

    // Top Knobs (FIXED Page 0 on Mixer Track)
    if (cc >= CC.KNOB_T1 && cc <= CC.KNOB_T8) {
        remoteControlsPage0.getParameter(paramIndex).set(value, 128);
    }
    // Middle Knobs (Control Child Tracks 1-8 based on selected page 1-8)
    else if (cc >= CC.KNOB_M1 && cc <= CC.KNOB_M8) {
        const childTrackIndex = currentSelectedPage; // Page 1-8 maps to Child Index 1-8
        if (childTrackIndex >= 1 && childTrackIndex <= 8) {
            const presetControls = childPresetControls[childTrackIndex];
            const deviceControls = childDeviceControls[childTrackIndex];
            let targetControls = null;
            let targetType = "None";

            // Prioritize PRESET controls if its page 0 parameter exists
            if (presetControls && presetControls.getParameter(paramIndex).exists().get()) {
                 targetControls = presetControls;
                 targetType = "PRESET";
            }
            // Fallback to DEVICE controls if its page 0 parameter exists
            else if (deviceControls && deviceControls.getParameter(paramIndex).exists().get()) {
                 targetControls = deviceControls;
                 targetType = "DEVICE";
            }

            if (targetControls) {
                 targetControls.getParameter(paramIndex).set(value, 128);
            } else {
            }
        } else {
             host.println(`  -> WARN: Middle Knob ${paramIndex + 1} (CC ${cc}) -> Invalid page ${currentSelectedPage} for child track control.`);
        }
    }
    // Bottom Knobs (FOLLOWS Selected Page 1-8 on Mixer Track)
    else if (cc >= CC.KNOB_B1 && cc <= CC.KNOB_B8) {
        remoteControlsPageSelect.getParameter(paramIndex).set(value, 128);
    }
    // Sliders (FIXED Page 9 on Mixer Track)
    else if (cc >= CC.SLIDER1 && cc <= CC.SLIDER8) {
        remoteControlsPage9.getParameter(paramIndex).set(value, 128);
    } else {
    }
}

function handleNoteOn(note, velocity) {
    // Mode Buttons (Mute, Solo, Rec Arm / Track Select Mode) - No change needed
    if (note === NOTE.BTN_MUTE) {
        if (currentBottomRowMode !== MODE_MUTE) {
             currentBottomRowMode = MODE_MUTE;
             updateModeButtonLeds();
             updateBottomRow_Mode();
        }
        return;
    }
    if (note === NOTE.BTN_SOLO) {
        if (currentBottomRowMode !== MODE_SOLO) {
            currentBottomRowMode = MODE_SOLO;
            updateModeButtonLeds();
            updateBottomRow_Mode();
        }
         return;
    }
     if (note === NOTE.BTN_REC_ARM) {
        if (currentBottomRowMode !== MODE_TRACK) {
            currentBottomRowMode = MODE_TRACK;
        } else {
            currentBottomRowMode = MODE_MUTE; // Default back to Mute
        }
        updateModeButtonLeds();
        updateBottomRow_Mode();
        return;
    }

    // Check for Utility Device Button Note - Target Selected GROUP
    if (note === NOTE.DEVICE_BTN) {
        if (selectedGroupTrack && selectedGroupTrack.isGroup().get()) {
            selectedGroupTrack.isGroupExpanded().toggle();
        } else {
             host.println(`   -> WARN: Selected Group Track ${currentSelectedGroupIndex + 1} not available or not a group.`);
        }
        return; // Consume Note
    }

    // Ensure API objects for the MIXER track are ready for other buttons
     if (!mixerTrack || !mixerTrack.exists().get() || !drumPadBank || !remoteControlsPageSelect) {
        host.println(`WARN: Mixer track objects not ready in handleNoteOn for note ${note}`);
        return;
    }

    const buttonIndex = findButtonIndex(note);
     if (buttonIndex === -1) {
        if (note !== NOTE.BTN_MUTE && note !== NOTE.BTN_SOLO && note !== NOTE.BTN_REC_ARM) {
        }
        return;
    }

    // Top Buttons (Page Select ONLY) - Targets remoteControlsPageSelect on Mixer Track
    if (note >= NOTE.BTN_T1 && note <= NOTE.BTN_T8) {
            const targetPage = buttonIndex + PAGE_SELECT_OFFSET;
        
        // NEW: Check if the pressed button corresponds to the currently selected page
        if (targetPage === currentSelectedPage) {
            remoteControlsPageSelect.selectedPageIndex().set(0);
        } else {
        remoteControlsPageSelect.selectedPageIndex().set(targetPage);
        }
            // Observer updates LEDs
        return; // Consume event
    }
    // Bottom Buttons (Mute / Solo / Track)
    else if (note >= NOTE.BTN_B1 && note <= NOTE.BTN_B8) {
        switch(currentBottomRowMode) {
            case MODE_MUTE:
            case MODE_SOLO:
                // Target Drum Pad Bank on Mixer Track
        if (drumPadBank.exists().get()) {
            const drumPad = drumPadBank.getItemAt(buttonIndex);
            if (drumPad.exists().get()) {
                        if (currentBottomRowMode === MODE_MUTE) {
                        drumPad.mute().toggle();
                        } else {
                        drumPad.solo().toggle();
                        }
                    } else {
                    }
                } else {
                }
                break;
            case MODE_TRACK:
                // Target Top-Level Group Selection
                trackBank.scrollPosition().set(buttonIndex); // This triggers the observer to update references
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
        // Page Select Mode - Amber Dim/Full
        for (let i = 0; i < 8; i++) {
            const targetPage = i + PAGE_SELECT_OFFSET;
            let color = LED_COLOR.AMBER_LOW; // Default to low amber
            if (currentSelectedPage === targetPage) {
                 color = LED_COLOR.AMBER_FULL; // Full amber if selected
            }
            // If currentSelectedPage is 0, all remain AMBER_LOW (default)
            sendLedUpdate('T', i, color);
        }
}

// Renamed to reflect it now handles all bottom row modes
function updateBottomRow_Mode() {

    // Check if mixer track and its drum pad bank are ready for Mute/Solo modes
    const canUsePads = mixerTrack && mixerTrack.exists().get() && drumPadBank && drumPadBank.exists().get();

    for (let i = 0; i < 8; i++) {
        let color = LED_COLOR.OFF;
        
                switch(currentBottomRowMode) {
                    case MODE_MUTE:
                        if (canUsePads) {
                    const drumPad = drumPadBank.getItemAt(i);
                    if (drumPad.exists().get()) {
                        const isMuted = drumPad.mute().get();
                        color = isMuted ? LED_COLOR.GREEN_FULL : LED_COLOR.GREEN_LOW;
                    }
                }
                        break;
                    case MODE_SOLO:
                        if (canUsePads) {
                    const drumPad = drumPadBank.getItemAt(i);
                    if (drumPad.exists().get()) {
                        const isSoloed = drumPad.solo().get();
                        color = isSoloed ? LED_COLOR.AMBER_FULL : LED_COLOR.AMBER_LOW;
                }
            }
                break;
            case MODE_TRACK:
                // Reflects the selected GROUP index
                const isSelectedGroup = (i === currentSelectedGroupIndex);
                color = isSelectedGroup ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
                break;
        }
        
        sendLedUpdate('B', i, color);
    }
}

// --- NEW Knob LED Update Functions ---

function updateTopKnobLeds() { // Top KNOBS (Page 0 on Group Track)
    if (!remoteControlsPage0) {
        host.println(" -> WARN: remoteControlsPage0 not ready in updateTopKnobLeds.");
        // Turn off all LEDs?
        for (let i = 0; i < 8; i++) sendLedUpdateKnob('T', i, LED_COLOR.OFF);
        return;
    }
    for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPage0.getParameter(i).exists().get();
        const color = paramExists ? LED_COLOR.RED_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('T', i, color);
    }
}

function updateMiddleKnobLeds() { // Middle KNOBS (Child Tracks 1-8)
    // Middle knobs depend on the currently selected page (1-8) which determines the child track (1-8)
    const childTrackIndex = currentSelectedPage; // Page 1-8 maps to Child Index 1-8

    for (let i = 0; i < 8; i++) { // Iterate through the 8 middle knobs (param index 0-7)
        let color = LED_COLOR.OFF;
        if (childTrackIndex >= 1 && childTrackIndex <= 8) {
            const presetControls = childPresetControls[childTrackIndex];
            const deviceControls = childDeviceControls[childTrackIndex];

            // Check existence of the parameter 'i' on either page 0 type
            const presetParamExists = presetControls && presetControls.getParameter(i).exists().get();
            const deviceParamExists = deviceControls && deviceControls.getParameter(i).exists().get();

            // Light up if the parameter exists on *either* the Perf page 0 or the Device page 0
            if (presetParamExists || deviceParamExists) {
                color = LED_COLOR.YELLOW_FULL; // Use Yellow for child track parameters
            }
        }
        // Send update for the i-th middle knob LED
        sendLedUpdateKnob('M', i, color);
    }
}


function updateBottomKnobLeds() { // Bottom KNOBS (Selected Page 1-8 on Mixer Track)
    if (!remoteControlsPageSelect) {
         host.println(" -> WARN: remoteControlsPageSelect not ready in updateBottomKnobLeds.");
        for (let i = 0; i < 8; i++) sendLedUpdateKnob('B', i, LED_COLOR.OFF);
        return;
    }
     for (let i = 0; i < 8; i++) {
        const paramExists = remoteControlsPageSelect.getParameter(i).exists().get();
        const color = paramExists ? LED_COLOR.AMBER_FULL : LED_COLOR.OFF;
        sendLedUpdateKnob('B', i, color);
    }
}

function updateAllLeds() {
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
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// NEW function for Side Button LEDs (Mute, Solo, RecArm, Device)
function sendLedUpdateSideButton(buttonType, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForSideButton(buttonType); // Use Side Button helper
     if (sysexIndex === -1) {
        return;
    }
    sendSysexLedCommand(sysexIndex, colorVelocity);
}

// Handles KNOB LEDs
function sendLedUpdateKnob(row, index, colorVelocity) {
    if (!midiOut) return;
    const sysexIndex = getSysexIndexForKnob(row, index); // Use Knob helper
     if (sysexIndex === -1) {
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
    // Check mixer track page 10 for most buttons
    const canUseUtilityPage = mixerTrack && mixerTrack.exists().get() && remoteControlsPage10;
    // Check selected group track for device button
    const canUseGroup = selectedGroupTrack; // selectedGroupTrack might be null initially or if track doesn't exist

    for (const buttonId in UTILITY_BUTTON_MAP) {
        const mapping = UTILITY_BUTTON_MAP[buttonId];
        let color = LED_COLOR.OFF;

        // Special handling for Device button - reflects group expansion
        if (buttonId === 'DEVICE') {
            if (canUseGroup && selectedGroupTrack.isGroup().get()) {
                color = selectedGroupTrack.isGroupExpanded().get() ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
            }
        }
        // Handling for other utility buttons (Arrows) based on Mixer Track Page 10
        else {
            if (canUseUtilityPage) {
            const parameter = remoteControlsPage10.getParameter(mapping.paramIndex);
            const paramExists = parameter.exists().get();
            if (paramExists) {
                const value = parameter.value().get();
                color = value > 0 ? LED_COLOR.RED_FULL : LED_COLOR.RED_LOW;
                }
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

// --- Remove old/redundant globals ---
/*
let fixedTrack; // Removed
let middleKnobTrackBank; // Removed
let middleKnobDevices = []; // Removed
let middleKnobControls = []; // Removed
let childTrackDevices = []; // Renamed to childDevices
let childTrackControls = []; // Renamed to childControls
let currentFixedTrackIndex = 0; // Renamed to currentSelectedGroupIndex
*/