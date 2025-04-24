loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
host.defineController("Korg", "nanoKontrol2 Drum Machine Group", "0.1", "3c89f296-4535-4856-a201-c4556ed0ba1a", "Zsolt");
host.defineMidiPorts(1, 1);

// --- Global Variables ---
let mainTrackBank;      // Scrollable bank for selecting the main group track
let groupTrack;         // The specific group track object currently targeted by mainTrackBank

let cursorDevice;       // Currently active device (group)
let remoteControls;     // Currently active remote controls page (knobs)
let drumPadBank;        // Currently active drum pad bank

// Arrays to hold controls for each group track
let groupDevices = [];      // Array of cursor devices for each group track
let groupRemotePages = [];  // Array of remote control pages for each group track
let groupSliderPages = [];  // Array of slider pages for each group track
let groupDrumPadBanks = []; // Array of drum pad banks for each group track
let groupButtonPages = [];  // Array of button pages for each group track

// Arrays to hold child track controls for each group track
let groupChildTrackBanks = []; // Array of child track banks for each group
let groupChildDevices = [];    // 2D array of devices for each group's child tracks
let groupChildControls = [];    // 2D array of controls for each group's child tracks

// Current active references
let groupCursorDevice;  // Device for the group track
let groupRemoteControls;// Knobs page for the group track
let groupSliderPage;    // Sliders page for the group track (fixed index)
let groupDrumPadBank;   // Drum pads for the group track
let groupButtonsPage;   // Buttons page for the group track (fixed index 10)

// Current child track references
let childTrackBank;     // Currently active child track bank
let childTrackDevices;  // Currently active child track devices array
let childTrackControls; // Currently active child track controls array

let targetGroupTrackIndex = 0; // Index of the main track bank scroll position
let currentPage = 0;       // The remote control page index (0-8) for KNOBS
let midiOutPort;
let transport;
let isPlaying = false;

// NEW: Knob mode states
let isREWPressed = true;   // When true, knobs map to group track's remote page 0
let isFFPressed = false;   // When true, knobs map to page 11
let isSTOPPressed = false; // When true, S buttons map knobs to child track devices

// CC numbers for controls
const CC = {
    SLIDER1: 0x00, SLIDER2: 0x01, SLIDER3: 0x02, SLIDER4: 0x03, 
    SLIDER5: 0x04, SLIDER6: 0x05, SLIDER7: 0x06, SLIDER8: 0x07, 
    KNOB1: 0x10, KNOB2: 0x11, KNOB3: 0x12, KNOB4: 0x13,
    KNOB5: 0x14, KNOB6: 0x15, KNOB7: 0x16, KNOB8: 0x17,
    S1: 0x20, S2: 0x21, S3: 0x22, S4: 0x23, 
    S5: 0x24, S6: 0x25, S7: 0x26, S8: 0x27,
    M1: 0x30, M2: 0x31, M3: 0x32, M4: 0x33, 
    M5: 0x34, M6: 0x35, M7: 0x36, M8: 0x37,
    R1: 0x40, R2: 0x41, R3: 0x42, R4: 0x43, 
    R5: 0x44, R6: 0x45, R7: 0x46, R8: 0x47, 
    REW: 0x2B, FF: 0x2C, PLAY: 0x29, STOP: 0x2A, REC: 0x2D, CYCLE: 0x2E
};

const SLIDER_PAGE_INDEX = 9; // The 0-based index for the sliders page
const BUTTONS_PAGE_INDEX = 10; // The 0-based index for the buttons page

// Helper function to ensure slider pages are on correct page
function ensureSliderPagesOnCorrectPage() {
    if (groupSliderPage) {
        groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    }
}

// --- Initialization ---
function init() {
    host.println("nanoKontrol2 Drum Machine Group initializing...");
    
    // Initialize MIDI
    midiOutPort = host.getMidiOutPort(0);
    const midiIn = host.getMidiInPort(0);
    midiIn.setMidiCallback(onMidi);
    midiIn.setSysexCallback(onSysex);
    
    // --- Create scrollable bank for the main group tracks ---
    mainTrackBank = host.createTrackBank(8, 0, 0, false); // size 8, 0 sends, 0 scenes
    mainTrackBank.scrollPosition().markInterested();
    mainTrackBank.canScrollForwards().markInterested();
    mainTrackBank.canScrollBackwards().markInterested();

    // Initialize controls for each group track
    for (let i = 0; i < 8; i++) {
        const track = mainTrackBank.getItemAt(i);
        track.name().markInterested();
        track.exists().markInterested();

        // Create device bank and controls for this group track
        const deviceBank = track.createDeviceBank(1);
        const device = deviceBank.getDevice(0);
        device.exists().markInterested();
        device.name().markInterested();

        const remotePage = device.createCursorRemoteControlsPage(8);
        const sliderPage = device.createCursorRemoteControlsPage("GroupSliderPage" + i, 8, null);
        const drumPadBank = device.createDrumPadBank(8);
        const buttonPage = device.createCursorRemoteControlsPage("GroupButtonsPage" + i, 8, null);

        remotePage.selectedPageIndex().markInterested();
        sliderPage.selectedPageIndex().markInterested();
        buttonPage.selectedPageIndex().markInterested();

        // Mark parameters as interested
        for (let j = 0; j < 8; j++) {
            remotePage.getParameter(j).value().markInterested();
            remotePage.getParameter(j).exists().markInterested();
            sliderPage.getParameter(j).value().markInterested();
            sliderPage.getParameter(j).exists().markInterested();
            buttonPage.getParameter(j).value().markInterested();
            buttonPage.getParameter(j).exists().markInterested();
        }

        // Add observer for REC button parameter
        buttonPage.getParameter(0).value().addValueObserver(value => {
            if (cursorDevice === device) {
                sendMidi(0xB0, CC.REC, value > 0 ? 127 : 0);
            }
        });

        // Create child track bank and controls for this group
        const childBank = track.createTrackBank(8, 0, 0, false);
        const childDevices = [];
        const childControls = [];
        
        // Initialize device and control objects for each child track
        for (let j = 0; j < 8; j++) {
            const childTrack = childBank.getItemAt(j);
            childTrack.name().markInterested();
            childTrack.exists().markInterested();
            
            // Create a device bank and set instrument matcher
            const childDeviceBank = childTrack.createDeviceBank(1);
            const instrumentMatcher = host.createInstrumentMatcher();
            childDeviceBank.setDeviceMatcher(instrumentMatcher);
            const childDevice = childDeviceBank.getDevice(0);
            childDevice.name().markInterested();
            childDevice.exists().markInterested();
            
            const controls = childDevice.createCursorRemoteControlsPage(8);
            controls.selectedPageIndex().markInterested();
            // Force to page 0
            controls.selectedPageIndex().set(0);
            
            // Mark all parameters as interested
            for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
                controls.getParameter(paramIndex).exists().markInterested();
                controls.getParameter(paramIndex).value().markInterested();
            }
            
            childDevices[j] = childDevice;
            childControls[j] = controls;
        }

        // Store all the banks and controls
        groupDevices[i] = device;
        groupRemotePages[i] = remotePage;
        groupSliderPages[i] = sliderPage;
        groupDrumPadBanks[i] = drumPadBank;
        groupButtonPages[i] = buttonPage;
        groupChildTrackBanks[i] = childBank;
        groupChildDevices[i] = childDevices;
        groupChildControls[i] = childControls;

        // Set up observers for group track drum pad mutes
        for (let k = 0; k < 8; k++) {
            const pad = groupDrumPadBanks[i].getItemAt(k);
            pad.exists().markInterested();
            pad.mute().markInterested();
            pad.solo().markInterested();
            // Add mute observer
            pad.mute().addValueObserver(isMuted => {
                if (drumPadBank === groupDrumPadBanks[i]) {
                    sendMidi(0xB0, CC.M1 + k, isMuted ? 127 : 0);
                }
            });
        }
    }

    // Set initial active group track (index 0)
    groupTrack = mainTrackBank.getItemAt(0);
    groupCursorDevice = groupDevices[0];
    groupRemoteControls = groupRemotePages[0];
    groupSliderPage = groupSliderPages[0];
    groupDrumPadBank = groupDrumPadBanks[0];
    groupButtonsPage = groupButtonPages[0];
    childTrackBank = groupChildTrackBanks[0];
    childTrackDevices = groupChildDevices[0];
    childTrackControls = groupChildControls[0];

    // Set initial page indices
    groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    groupButtonsPage.selectedPageIndex().set(BUTTONS_PAGE_INDEX);

    // Add observers for page changes
    for (let i = 0; i < 8; i++) {
        groupRemotePages[i].selectedPageIndex().addValueObserver(page => {
            if (cursorDevice === groupDevices[i]) {
                currentPage = page;
                updatePageLeds();
            }
        });

        groupSliderPages[i].selectedPageIndex().addValueObserver(page => {
            if (page !== SLIDER_PAGE_INDEX) {
                groupSliderPages[i].selectedPageIndex().set(SLIDER_PAGE_INDEX);
            }
        });

        groupButtonPages[i].selectedPageIndex().addValueObserver(page => {
            if (page !== BUTTONS_PAGE_INDEX) {
                groupButtonPages[i].selectedPageIndex().set(BUTTONS_PAGE_INDEX);
            }
        });
    }

    // --- Observer for Group Track Changes (mainTrackBank scroll) ---
    mainTrackBank.scrollPosition().addValueObserver((newIndex) => {
        host.println("Main group track scrolled to index: " + newIndex);
        targetGroupTrackIndex = newIndex; // Update our tracked index
        
        // Switch focus to the new group track, page 0
        switchToGroupMode(0); 
    });

    // --- Create Transport Object ---
    transport = host.createTransport();
    transport.isPlaying().markInterested();

    transport.isPlaying().addValueObserver((on) => {
        isPlaying = on;
        updatePageLeds();
    });

    // Set initial state (Group mode, page 0 for the track at index 0)
    switchToGroupMode(0);
    
    host.println("nanoKontrol2 Drum Machine initialized successfully!");
}

function switchToGroupMode(targetPage) {
    if (!groupCursorDevice || !groupTrack) {
        host.println("Cannot switch to group mode: Controls not ready (group track might be missing?).");
        // Clear global state variables
        cursorDevice = null;
        remoteControls = null;
        drumPadBank = null;
        currentPage = 0;
        updatePageLeds();
        return;
    }
    // Set global state variables to use the group objects
    cursorDevice = groupCursorDevice;
    remoteControls = groupRemoteControls;
    drumPadBank = groupDrumPadBank;
    
    currentPage = targetPage;
    if (remoteControls) remoteControls.selectedPageIndex().set(targetPage); // Tell Bitwig to change page
    
    // Ensure slider pages stay on page 9
    ensureSliderPagesOnCorrectPage();
    
    // groupTrack should point to the current group track due to mainTrackBank scrolling
    host.showPopupNotification("Selected Group: " + groupTrack.name().get() + " (Page " + currentPage + ")");
    updatePageLeds();
}

// --- LED Update Function ---
function updatePageLeds() {
    // S buttons (Knob page select)
    for (let i = 0; i < 8; i++) {
        // S button LEDs show page selection state independently
        let ledState = (currentPage === i + 1) ? 127 : 0;
        
        // If STOP is pressed and this S button is selected, show child track state
        if (isSTOPPressed && currentPage === i + 1) {
            const childTrack = childTrackBank.getItemAt(i);
            if (childTrack && childTrack.exists().get()) {
                const device = childTrackDevices[i];
                if (device && device.exists().get()) {
                    ledState = 127; // Full brightness for active child track
                }
            }
        }
        
        sendMidi(0xB0, CC.S1 + i, ledState);
    }
    
    // M buttons (Drum Pad Mute)
    if (drumPadBank) {
        for (let i = 0; i < 8; i++) {
            let drumPad = drumPadBank.getItemAt(i);
            sendMidi(0xB0, CC.M1 + i, drumPad.mute().get() ? 127 : 0);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            sendMidi(0xB0, CC.M1 + i, 0);
        }
    }

    // R buttons (Group Track Selection)
    for (let i = 0; i < 8; i++) {
        let track = mainTrackBank.getItemAt(i);
        sendMidi(0xB0, CC.R1 + i, (track.exists().get() && track === groupTrack) ? 127 : 0);
    }

    // Transport buttons
    sendMidi(0xB0, CC.PLAY, transport.isPlaying().get() ? 127 : 0);
    
    // Mode buttons
    sendMidi(0xB0, CC.REW, isREWPressed ? 127 : 0);
    sendMidi(0xB0, CC.FF, isFFPressed ? 127 : 0);
    sendMidi(0xB0, CC.STOP, isSTOPPressed ? 127 : 0);

    // Update REC LED based on current device's button page parameter 0
    if (groupButtonsPage) {
        sendMidi(0xB0, CC.REC, groupButtonsPage.getParameter(0).value().get() > 0 ? 127 : 0);
    } else {
        sendMidi(0xB0, CC.REC, 0);
    }
}

// --- MIDI Handling ---
function onMidi(status, data1, data2) {
    if (isChannelController(status)) {
        // --- Handle REW/FF/STOP Buttons (Knob Mode Selection) ---
        if (data1 === CC.REW && data2 > 0) {
            isREWPressed = !isREWPressed;
            if (isREWPressed) {
                isFFPressed = false;
                // Don't touch isSTOPPressed - it's independent
                // Force group remote controls to page 0
                if (groupRemoteControls) {
                    groupRemoteControls.selectedPageIndex().set(0);
                }
            }
            updatePageLeds();
            return;
        }
        if (data1 === CC.FF && data2 > 0) {
            isFFPressed = !isFFPressed;
            if (isFFPressed) {
                isREWPressed = false;
                // Don't touch isSTOPPressed - it's independent
                // Force group remote controls to page 11
                if (groupRemoteControls) {
                    groupRemoteControls.selectedPageIndex().set(11);
                }
            }
            updatePageLeds();
            return;
        }
        if (data1 === CC.STOP && data2 > 0) {
            // STOP can be toggled any time, independent of other states
            isSTOPPressed = !isSTOPPressed;
            updatePageLeds();
            return;
        }

        // --- Handle S Buttons (Page Selection or Child Track Selection) ---
        if (data1 >= CC.S1 && data1 <= CC.S8 && data2 > 0) {
            let index = data1 - CC.S1;
            // S buttons always control page selection, regardless of STOP state
            if (currentPage === index + 1) {
                // Deactivating current S button
                currentPage = 0;
                // When deactivating an S button, activate REW mode
                isREWPressed = true;
                isFFPressed = false;
                if (groupRemoteControls) {
                    groupRemoteControls.selectedPageIndex().set(0);
                }
            } else {
                // Activating new S button
                currentPage = index + 1;
                // Selecting a page deactivates REW/FF modes
                isREWPressed = false;
                isFFPressed = false;
            }
            if (remoteControls) remoteControls.selectedPageIndex().set(currentPage);
            updatePageLeds();
            return;
        }

        // --- Handle Knobs based on current mode ---
        if (data1 >= CC.KNOB1 && data1 <= CC.KNOB8) {
            let index = data1 - CC.KNOB1;
            
            if (isSTOPPressed && currentPage >= 1 && currentPage <= 8) {
                // Map to child track's first instrument device page 0
                let childIndex = currentPage - 1; // Convert page 1-8 to index 0-7
                const childTrack = childTrackBank.getItemAt(childIndex);
                const device = childTrackDevices[childIndex];
                const controls = childTrackControls[childIndex];
                
                if (childTrack && childTrack.exists().get() && 
                    device && device.exists().get() && 
                    controls && controls.getParameter(index).exists().get()) {
                    controls.getParameter(index).set(data2, 128);
                }
            } else if (isREWPressed) {
                // Map to group track's remote page 0
                if (groupRemoteControls) {
                    groupRemoteControls.getParameter(index).set(data2, 128);
                }
            } else if (isFFPressed) {
                // Map to page 11
                if (remoteControls) {
                    remoteControls.getParameter(index).set(data2, 128);
                }
            } else {
                // Normal mode - use currently selected page
                if (remoteControls) {
                    remoteControls.getParameter(index).set(data2, 128);
                }
            }
            return;
        }

        // --- Sliders (Control current mode's Slider Page) ---
        if (data1 >= CC.SLIDER1 && data1 <= CC.SLIDER8) {
            if (!groupSliderPage) return; // Check if valid
            let index = data1 - CC.SLIDER1;
            groupSliderPage.getParameter(index).set(data2, 128);
            return;
        }

        // --- Handle R Buttons (Group Track Selection) ---
        if (data1 >= CC.R1 && data1 <= CC.R8 && data2 > 0) {
            let index = data1 - CC.R1;
            handleGroupTrackSelection(index);
            return;
        }

        // --- Transport --- 
        if (data1 === CC.PLAY && data2 > 0) { transport.play(); return; }
        if (data1 === CC.STOP && data2 > 0) { transport.stop(); return; }
        if (data1 === CC.REC && data2 > 0) { 
            if (groupButtonsPage) {
                let param = groupButtonsPage.getParameter(0);
                let currentValue = param.value().get();
                param.set(currentValue > 0 ? 0 : 127, 128); 
                // LED will be updated by the value observer
            }
            return; 
        }
        if (data1 === CC.CYCLE && data2 > 0) { transport.toggleLoop(); return; }

        // --- Drum Pad Mutes (M Buttons - use currently active 'drumPadBank') --- 
        if (data1 >= CC.M1 && data1 <= CC.M8) {
             if (!drumPadBank) return; // Check if valid
             if (data2 > 0) { // Button pressed
                let index = data1 - CC.M1;
                let drumPad = drumPadBank.getItemAt(index);
                if (drumPad.exists().get()) { 
                    drumPad.mute().toggle(); // Observer updates the LED
                }
             }
             return;
        }
    }
}

// --- Utility Functions ---
function sendMidi(status, data1, data2) {
    if (midiOutPort) {
        midiOutPort.sendMidi(status, data1, data2);
    } 
}

function onSysex(data) {
    // Not used currently
}

function exit() {
    host.println("nanoKontrol2 Drum Machine exiting...");
    // Turn off all LEDs
    // Clear REC LED specifically as well
    try { sendMidi(0xB0, CC.REC, 0); } catch(e) {} 
    for (let cc = 0; cc < 128; cc++) { // Send 0 to all CCs just in case
         try { sendMidi(0xB0, cc, 0); } catch(e) {}
    }
    host.println("nanoKontrol2 Drum Machine exited!");
}

function isChannelController(status) {
    return (status & 0xF0) === 0xB0;
}

// Modify R button handling to use pre-initialized controls
function handleGroupTrackSelection(index) {
    if (!groupDevices[index] || !mainTrackBank.getItemAt(index).exists().get()) return;

    // Update group track reference
    groupTrack = mainTrackBank.getItemAt(index);
    targetGroupTrackIndex = index;

    // Update active group controls
    groupCursorDevice = groupDevices[index];
    groupRemoteControls = groupRemotePages[index];
    groupSliderPage = groupSliderPages[index];
    groupDrumPadBank = groupDrumPadBanks[index];
    groupButtonsPage = groupButtonPages[index];
    
    // Update child track references
    childTrackBank = groupChildTrackBanks[index];
    childTrackDevices = groupChildDevices[index];
    childTrackControls = groupChildControls[index];

    // Switch to group mode
    cursorDevice = groupCursorDevice;
    remoteControls = groupRemoteControls;
    drumPadBank = groupDrumPadBank;
    currentPage = 0;
    
    if (remoteControls) remoteControls.selectedPageIndex().set(0);
    ensureSliderPagesOnCorrectPage();

    // Show notification and update LEDs
    host.showPopupNotification("Selected Group: " + groupTrack.name().get());
    updatePageLeds();
} 