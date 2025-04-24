loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
host.defineController("Korg", "nanoKontrol2 Drum Machine Group Sub", "0.1", "3c89f296-4535-4856-a201-c4556ed0ba1a", "Zsolt");
host.defineMidiPorts(1, 1);

// --- Global Variables ---
let mainTrackBank;      // Scrollable bank for selecting the main group track
let groupTrack;         // The specific group track object currently targeted by mainTrackBank
let trackBank;          // Bank for children of the current groupTrack
let fixedTrack;         // Window (size 1) into the child trackBank

let cursorDevice;       // Currently active device (either group or child)
let remoteControls;     // Currently active remote controls page (knobs)
let drumPadBank;        // Currently active drum pad bank

let groupCursorDevice;  // Device for the group track
let groupRemoteControls;// Knobs page for the group track
let groupSliderPage;    // Sliders page for the group track (fixed index)
let groupDrumPadBank;   // Drum pads for the group track
let groupButtonsPage;   // Buttons page for the group track (fixed index 10)

let childCursorDevice;  // Device for the selected child track
let childRemoteControls;// Knobs page for the selected child track
let childSliderPage;    // Sliders page for the child track (fixed index)
let childDrumPadBank;   // Drum pads for the selected child track
let childButtonsPage;   // Buttons page for the child track (fixed index 10)

let targetGroupTrackIndex = 0; // Index of the main track bank scroll position
let currentTrackIndex = 0; // Index of the child trackBank scroll position (0-7)
let currentPage = 0;       // The remote control page index (0-8) for KNOBS
let midiOutPort;
let transport;
let isPlaying = false;

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
    REW: 0x2B, FF: 0x2C, PLAY: 0x29, STOP: 0x2A, REC: 0x2D, CYCLE: 0x2E,
    PREV_TRACK: 0x3A, // 58 (Track <)
    NEXT_TRACK: 0x3B  // 59 (Track >)
};

const TRACK_BANK_SIZE = 8; // Number of child tracks to control
const SLIDER_PAGE_INDEX = 9; // The 0-based index for the sliders page
const BUTTONS_PAGE_INDEX = 10; // The 0-based index for the buttons page

// Helper function to ensure slider pages are on correct page
function ensureSliderPagesOnCorrectPage() {
    if (groupSliderPage) {
        groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    }
    if (childSliderPage) {
        childSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    }
}

// --- Initialization ---
function init() {
    host.println("nanoKontrol2 Drum Machine initializing...");
    
    // Initialize MIDI
    midiOutPort = host.getMidiOutPort(0);
    const midiIn = host.getMidiInPort(0);
    midiIn.setMidiCallback(onMidi);
    midiIn.setSysexCallback(onSysex);
    
    // --- Create scrollable bank for the main group track ---
    mainTrackBank = host.createMainTrackBank(1, 0, 0); // size 1, 0 sends, 0 scenes
    mainTrackBank.scrollPosition().markInterested();
    mainTrackBank.canScrollForwards().markInterested();
    mainTrackBank.canScrollBackwards().markInterested();

    // --- Get the Group Track Object (will follow mainTrackBank) ---
    groupTrack = mainTrackBank.getItemAt(0);
    groupTrack.name().markInterested();
    groupTrack.exists().markInterested();

    // --- Initialize Group Track Controls (Done ONCE) ---
    // These API objects will automatically point to the correct track/device
    // when mainTrackBank scrolls, because they originate from groupTrack.
    const groupDeviceBank = groupTrack.createDeviceBank(1); // Create bank for first device slot
    groupCursorDevice = groupDeviceBank.getDevice(0);     // Get the device itself
    groupCursorDevice.exists().markInterested();         // Monitor existence
    groupCursorDevice.name().markInterested();           // Monitor name
    groupRemoteControls = groupCursorDevice.createCursorRemoteControlsPage(8);
    groupSliderPage = groupCursorDevice.createCursorRemoteControlsPage("GroupSliderPage", 8, null);
    groupDrumPadBank = groupCursorDevice.createDrumPadBank(8);
    groupButtonsPage = groupCursorDevice.createCursorRemoteControlsPage("GroupButtonsPage", 8, null); // Create buttons page

    groupRemoteControls.selectedPageIndex().markInterested();
    groupSliderPage.selectedPageIndex().markInterested();
    groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX); // Set fixed slider page index
    groupButtonsPage.selectedPageIndex().markInterested();
    groupButtonsPage.selectedPageIndex().set(BUTTONS_PAGE_INDEX); // Set fixed buttons page index

    // Add observers for group drum pad mutes ONCE
    for (let i = 0; i < 8; i++) {
        let pad = groupDrumPadBank.getItemAt(i);
        pad.exists().markInterested();
        pad.mute().markInterested();
        pad.mute().addValueObserver((isMuted) => {
            if (cursorDevice === groupCursorDevice) { 
                sendMidi(0xB0, CC.M1 + i, isMuted ? 127 : 0);
            }
        });
    }

    // Add observer for group knob page changes ONCE
    groupRemoteControls.selectedPageIndex().addValueObserver((page) => {
        if (cursorDevice === groupCursorDevice) {
            host.println("Selected Group Knob Page Index: " + page);
            currentPage = page; // Update global currentPage based on group context
            updatePageLeds();
        }
    });

    // Add observer for group slider page changes
    groupSliderPage.selectedPageIndex().addValueObserver((page) => {
        if (page !== SLIDER_PAGE_INDEX) {
            host.println("Group slider page changed from " + SLIDER_PAGE_INDEX + " to " + page + ", correcting...");
            groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
        }
    });

    // Add observer for group buttons page changes
    groupButtonsPage.selectedPageIndex().addValueObserver((page) => {
        if (page !== BUTTONS_PAGE_INDEX) {
            host.println("Group buttons page changed from " + BUTTONS_PAGE_INDEX + " to " + page + ", correcting...");
            groupButtonsPage.selectedPageIndex().set(BUTTONS_PAGE_INDEX);
        }
    });

    // Add observer for group REC button parameter (param 0 on buttons page)
    groupButtonsPage.getParameter(0).value().markInterested();
    groupButtonsPage.getParameter(0).value().addValueObserver((value) => {
        if (cursorDevice === groupCursorDevice) {
            sendMidi(0xB0, CC.REC, value > 0 ? 127 : 0);
        }
    });

    // --- Create Child Track Bank (connected to groupTrack) ---
    // This bank will automatically show children of the currently scrolled groupTrack.
    trackBank = groupTrack.createTrackBank(TRACK_BANK_SIZE, 0, 0, false);
    fixedTrack = trackBank.getItemAt(0); // Get the window into the child bank
    fixedTrack.name().markInterested();
    fixedTrack.exists().markInterested();
    trackBank.scrollPosition().markInterested(); // Needed for selectChildTrack

    // --- Initialize Child Track Controls (Done ONCE) ---
    // These controls follow fixedTrack -> trackBank -> groupTrack -> mainTrackBank.
    const childDeviceBank = fixedTrack.createDeviceBank(1); // Create bank for first device slot
    childCursorDevice = childDeviceBank.getDevice(0);     // Get the device itself
    childCursorDevice.exists().markInterested();         // Monitor existence
    childCursorDevice.name().markInterested();           // Monitor name
    childRemoteControls = childCursorDevice.createCursorRemoteControlsPage(8);
    childSliderPage = childCursorDevice.createCursorRemoteControlsPage("ChildSliderPage", 8, null);
    childDrumPadBank = childCursorDevice.createDrumPadBank(8);
    childButtonsPage = childCursorDevice.createCursorRemoteControlsPage("ChildButtonsPage", 8, null); // Create buttons page

    childRemoteControls.selectedPageIndex().markInterested();
    childSliderPage.selectedPageIndex().markInterested();
    childSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX); // Set fixed slider page index
    childButtonsPage.selectedPageIndex().markInterested();
    childButtonsPage.selectedPageIndex().set(BUTTONS_PAGE_INDEX); // Set fixed buttons page index

    // Add observers for child drum pad mutes ONCE
    for (let i = 0; i < 8; i++) {
        let pad = childDrumPadBank.getItemAt(i);
        pad.exists().markInterested();
        pad.mute().markInterested();
        pad.mute().addValueObserver((isMuted) => {
            if (cursorDevice === childCursorDevice) { 
                sendMidi(0xB0, CC.M1 + i, isMuted ? 127 : 0);
            }
        });
    }

    // Add observer for child knob page changes ONCE
    childRemoteControls.selectedPageIndex().addValueObserver((page) => {
        if (cursorDevice === childCursorDevice) {
            host.println("Selected Child Knob Page Index: " + page);
            currentPage = page; // Update global currentPage based on child context
            updatePageLeds();
        }
    });

    // Add observer for child slider page changes
    childSliderPage.selectedPageIndex().addValueObserver((page) => {
        if (page !== SLIDER_PAGE_INDEX) {
            host.println("Child slider page changed from " + SLIDER_PAGE_INDEX + " to " + page + ", correcting...");
            childSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
        }
    });

    // Add observer for child buttons page changes
    childButtonsPage.selectedPageIndex().addValueObserver((page) => {
        if (page !== BUTTONS_PAGE_INDEX) {
            host.println("Child buttons page changed from " + BUTTONS_PAGE_INDEX + " to " + page + ", correcting...");
            childButtonsPage.selectedPageIndex().set(BUTTONS_PAGE_INDEX);
        }
    });

    // Add observer for child REC button parameter (param 0 on buttons page)
    childButtonsPage.getParameter(0).value().markInterested();
    childButtonsPage.getParameter(0).value().addValueObserver((value) => {
        if (cursorDevice === childCursorDevice) {
            sendMidi(0xB0, CC.REC, value > 0 ? 127 : 0);
        }
    });

    // --- Observer for Group Track Changes (mainTrackBank scroll) ---
    mainTrackBank.scrollPosition().addValueObserver((newIndex) => {
        host.println("Main group track scrolled to index: " + newIndex);
        targetGroupTrackIndex = newIndex; // Update our tracked index
        
        // Reset state when group track changes
        currentTrackIndex = 0; // Reset child track index focus
        // Switch focus to the new group track, page 0
        switchToGroupMode(0); 
        // LEDs updated within switchToGroupMode
        // Notification shown within switchToGroupMode
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

// --- Mode Switching Functions ---

function selectChildTrack(index) {
    if (!childCursorDevice || !trackBank || !fixedTrack) { 
        host.println("Cannot select child track: Controls not ready (group track might be missing or empty).");
        return; 
    }
    if (index >= 0 && index < TRACK_BANK_SIZE) {
        currentTrackIndex = index;
        trackBank.scrollPosition().set(index); // Scrolls the child bank window
        
        // The child* variables already point to the API objects linked to fixedTrack.
        // We just need to set our global state variables to use them.
        cursorDevice = childCursorDevice;
        remoteControls = childRemoteControls;
        drumPadBank = childDrumPadBank;

        // Reset to page 0 for the newly selected child track
        currentPage = 0;
        if (remoteControls) remoteControls.selectedPageIndex().set(0); // Tell Bitwig to change page
        
        // Ensure slider pages stay on page 9
        ensureSliderPagesOnCorrectPage();
        
        // fixedTrack should now point to the scrolled child due to trackBank.scrollPosition().set()
        // Wait a tiny moment for the API to potentially update the name if needed?
        // host.scheduleTask(() => { // Might not be necessary
             host.showPopupNotification("Selected Child: " + fixedTrack.name().get() + " (" + (currentTrackIndex + 1) + ")");
        // }, 10);
        
        updatePageLeds();
    }
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
        sendMidi(0xB0, CC.S1 + i, (currentPage === i + 1) ? 127 : 0);
    }
    
    // M buttons (Drum Pad Mute)
    // Check if the currently selected drumPadBank is valid and has pads
    if (drumPadBank && drumPadBank.getItemAt(0).exists().get()) { 
        for (let i = 0; i < 8; i++) {
            let drumPad = drumPadBank.getItemAt(i);
            sendMidi(0xB0, CC.M1 + i, drumPad.mute().get() ? 127 : 0);
        }
    } else { // Turn off M LEDs if no valid/existing drumPadBank
        for (let i = 0; i < 8; i++) {
            sendMidi(0xB0, CC.M1 + i, 0);
        }
    }

    // R buttons (Child Track Selection)
    for (let i = 0; i < 8; i++) {
        // Only light up if we are in child mode AND on the corresponding child track index
        let isSelected = (cursorDevice === childCursorDevice && currentTrackIndex === i);
        sendMidi(0xB0, CC.R1 + i, isSelected ? 127 : 0);
    }

    // Transport buttons
    sendMidi(0xB0, CC.PLAY, transport.isPlaying().get() ? 127 : 0); // Use .get() for marked values

    // Update REC LED based on current device's button page parameter 0
    let currentButtonsPage = (cursorDevice === groupCursorDevice) ? groupButtonsPage : childButtonsPage;
    if (currentButtonsPage) {
        let paramValue = currentButtonsPage.getParameter(0).value().get();
        sendMidi(0xB0, CC.REC, paramValue > 0 ? 127 : 0);
    } else {
        sendMidi(0xB0, CC.REC, 0); // Turn off if no valid device/page
    }
    
    // Group mode / Page LEDs (REW/FF)
    // Light up REW if in group mode on page 0
    sendMidi(0xB0, CC.REW, (cursorDevice === groupCursorDevice && currentPage === 0) ? 127 : 0);
    // Light up FF if in group mode on page 11
    sendMidi(0xB0, CC.FF, (cursorDevice === groupCursorDevice && currentPage === 11) ? 127 : 0);

    // Track Navigation LEDs (TRACK < / >)
    if (mainTrackBank) {
        sendMidi(0xB0, CC.PREV_TRACK, mainTrackBank.canScrollBackwards().get() ? 127 : 0);
        sendMidi(0xB0, CC.NEXT_TRACK, mainTrackBank.canScrollForwards().get() ? 127 : 0);
    } else {
        sendMidi(0xB0, CC.PREV_TRACK, 0);
        sendMidi(0xB0, CC.NEXT_TRACK, 0);
    }
}

// --- MIDI Handling ---
function onMidi(status, data1, data2) {
    if (isChannelController(status)) {
        // --- Handle Track Navigation (Scrolling mainTrackBank) --- 
        if (data1 === CC.PREV_TRACK && data2 > 0) {
            if (mainTrackBank && mainTrackBank.canScrollBackwards().get()) {
                mainTrackBank.scrollBackwards(); // Observer triggers state update
            }
            return;
        }
        if (data1 === CC.NEXT_TRACK && data2 > 0) {
            if (mainTrackBank && mainTrackBank.canScrollForwards().get()) {
                mainTrackBank.scrollForwards(); // Observer triggers state update
            }
            return;
        }
        
        // --- Handle REW/FF Buttons (Group Mode Page 0/11 or Toggle) ---
        if (data1 === CC.REW && data2 > 0) {
            if (!groupCursorDevice) return; 
            if (cursorDevice === groupCursorDevice && currentPage === 0) {
                if (childCursorDevice) {
                    selectChildTrack(currentTrackIndex);
                }
            } else {
                switchToGroupMode(0);
            }
            return;
        }
        if (data1 === CC.FF && data2 > 0) {
            if (!groupCursorDevice) return; 
            if (cursorDevice === groupCursorDevice && currentPage === 11) {
                // Currently in group mode page 11, try switching to last selected child
                 if (childCursorDevice) {
                    selectChildTrack(currentTrackIndex);
                }
            } else {
                // Switch to group mode, page 11
                switchToGroupMode(11);
            }
            return;
        }

        // --- Sliders (Control current mode's Slider Page) ---
        if (data1 >= CC.SLIDER1 && data1 <= CC.SLIDER8) {
            let sliderPage = (cursorDevice === groupCursorDevice) ? groupSliderPage : childSliderPage;
            if (!sliderPage) return; // Check if valid
            let index = data1 - CC.SLIDER1;
            sliderPage.getParameter(index).set(data2, 128);
            return;
        }

        // --- Handle R Buttons (Child Track Selection) ---
        if (data1 >= CC.R1 && data1 <= CC.R8 && data2 > 0) {
            if (!childCursorDevice) return; // Only works if child controls valid
            let index = data1 - CC.R1;
            selectChildTrack(index);
            return;
        }

        // --- Transport --- 
        if (data1 === CC.PLAY && data2 > 0) { transport.play(); return; }
        if (data1 === CC.STOP && data2 > 0) { transport.stop(); return; }
        if (data1 === CC.REC && data2 > 0) { 
            let currentButtonsPage = (cursorDevice === groupCursorDevice) ? groupButtonsPage : childButtonsPage;
            if (currentButtonsPage) {
                let param = currentButtonsPage.getParameter(0);
                let currentValue = param.value().get();
                // Toggle logic: set to 127 (max) if currently 0, else set to 0
                param.set(currentValue > 0 ? 0 : 127, 128); 
                // Observer will update the LED
            }
            return; 
        }
        if (data1 === CC.CYCLE && data2 > 0) { transport.toggleLoop(); return; }

        // --- Remote Controls (Knobs - use currently active 'remoteControls') --- 
        if (data1 >= CC.KNOB1 && data1 <= CC.KNOB8) {
            if (!remoteControls) return; // Check if valid
            let index = data1 - CC.KNOB1;
            remoteControls.getParameter(index).set(data2, 128);
            return;
        }

        // --- Page Selection (S Buttons - use currently active 'remoteControls') --- 
        if (data1 >= CC.S1 && data1 <= CC.S8) {
            if (!remoteControls) return; // Check if valid
            if (data2 > 0) { // Button pressed
                 let pageIndex = data1 - CC.S1 + 1; // S1 = Page 1, S8 = Page 8
                 if (currentPage === pageIndex) {
                    // Toggle back to page 0
                    currentPage = 0;
                 } else {
                    // Switch to page S[index+1]
                    currentPage = pageIndex;
                 }
                 remoteControls.selectedPageIndex().set(currentPage);
                 updatePageLeds(); // Update LEDs based on new currentPage
            }
            return;
        }

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
    // host.println("Sysex received: " + data);
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