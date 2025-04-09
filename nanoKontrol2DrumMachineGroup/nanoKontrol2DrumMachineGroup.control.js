loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
host.defineController("Korg", "nanoKontrol2 Drum Machine Group", "0.1", "3c89f296-4535-4856-a201-c4556ed0ba1a", "Zsolt");
host.defineMidiPorts(1, 1);

let trackBank;
let fixedTrack;       // Represents the track at the current scroll position (index 0 of the bank window)
let cursorDevice;
let remoteControls;
let drumPadBank;
let currentTrackIndex = 0; // The index the trackBank is scrolled to
let currentPage = 0;       // The remote control page index (0-8) for KNOBS
let midiOutPort;
let transport;
let isPlaying = false;
let isRecording = false;
let sliderPage; // Dedicated remote page for sliders
let rButtonPage; // Dedicated remote page for R buttons (toggles)
let isOnGroupTrack = false; // Track whether we're currently on the group track
let mainTrackBank; // Bank for accessing the group track

// Group track controls
let groupCursorDevice;
let groupRemoteControls;
let groupSliderPage;
let groupRButtonPage;
let groupDrumPadBank;

// Child track controls
let childCursorDevice;
let childRemoteControls;
let childSliderPage;
let childRButtonPage;
let childDrumPadBank;

// CC numbers for controls
const CC = {
    SLIDER1: 0x00, // 0
    SLIDER2: 0x01,
    SLIDER3: 0x02,
    SLIDER4: 0x03,
    SLIDER5: 0x04,
    SLIDER6: 0x05,
    SLIDER7: 0x06,
    SLIDER8: 0x07, // 7
    KNOB1: 0x10, // 16
    KNOB2: 0x11,
    KNOB3: 0x12,
    KNOB4: 0x13,
    KNOB5: 0x14,
    KNOB6: 0x15,
    KNOB7: 0x16,
    KNOB8: 0x17,
    S1: 0x20, // 32
    S2: 0x21,
    S3: 0x22,
    S4: 0x23,
    S5: 0x24,
    S6: 0x25,
    S7: 0x26,
    S8: 0x27,
    M1: 0x30, // 48
    M2: 0x31,
    M3: 0x32,
    M4: 0x33,
    M5: 0x34,
    M6: 0x35,
    M7: 0x36,
    M8: 0x37,
    R1: 0x40, // 64
    R2: 0x41,
    R3: 0x42,
    R4: 0x43,
    R5: 0x44,
    R6: 0x45,
    R7: 0x46,
    R8: 0x47, // 71
    REW: 0x2B,        // 43
    FF: 0x2C,         // 44
    PLAY: 0x29,       // 41
    STOP: 0x2A,       // 42
    REC: 0x2D,        // 45
    CYCLE: 0x2E       // 46
};

const TRACK_BANK_SIZE = 8; // Change to 8 since we're fixing to 8 tracks
const SLIDER_PAGE_INDEX = 9; // The 0-based index for the sliders page

function init() {
    host.println("nanoKontrol2 Drum Machine initializing...");
    
    // Initialize MIDI
    var midiIn = host.getMidiInPort(0);
    midiOutPort = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);
    midiIn.setSysexCallback(onSysex);
    
    // --- Get the Group Track at Index 0 ---
    mainTrackBank = host.createTrackBank(1, 0, 0, false); // Bank just to grab the group
    const groupTrack = mainTrackBank.getItemAt(0); 
    groupTrack.name().markInterested(); 

    // --- Create Bank and Fixed Track Window (Connected to the Group Track) ---
    trackBank = groupTrack.createTrackBank(TRACK_BANK_SIZE, 0, 0, false); // Bank for children of the group
    fixedTrack = trackBank.getItemAt(0); // First child track WITHIN the group

    // Initialize group track controls
    groupCursorDevice = groupTrack.createCursorDevice("DrumMachineCursor");
    groupRemoteControls = groupCursorDevice.createCursorRemoteControlsPage(8);
    groupSliderPage = groupCursorDevice.createCursorRemoteControlsPage("SliderPage", 8, null);
    groupDrumPadBank = groupCursorDevice.createDrumPadBank(8);

    // Initialize child track controls
    childCursorDevice = fixedTrack.createCursorDevice("DrumMachineCursor");
    childRemoteControls = childCursorDevice.createCursorRemoteControlsPage(8);
    childSliderPage = childCursorDevice.createCursorRemoteControlsPage("SliderPage", 8, null);
    childDrumPadBank = childCursorDevice.createDrumPadBank(8);

    // Mark values as interested
    groupRemoteControls.selectedPageIndex().markInterested();
    groupSliderPage.selectedPageIndex().markInterested();
    childRemoteControls.selectedPageIndex().markInterested();
    childSliderPage.selectedPageIndex().markInterested();

    // For drum pad mutes
    for (let i = 0; i < 8; i++) {
        groupDrumPadBank.getItemAt(i).mute().markInterested();
        childDrumPadBank.getItemAt(i).mute().markInterested();

        // Add observers for both group and child drum pad mutes
        groupDrumPadBank.getItemAt(i).mute().addValueObserver((isMuted) => {
            if (cursorDevice === groupCursorDevice) { 
                sendMidi(0xB0, CC.M1 + i, isMuted ? 127 : 0);
            }
        });

        childDrumPadBank.getItemAt(i).mute().addValueObserver((isMuted) => {
            if (cursorDevice === childCursorDevice) { 
                sendMidi(0xB0, CC.M1 + i, isMuted ? 127 : 0);
            }
        });
    }

    // Set initial controls to group track
    cursorDevice = groupCursorDevice;
    remoteControls = groupRemoteControls;
    sliderPage = groupSliderPage;
    drumPadBank = groupDrumPadBank;

    // Set initial page indices
    groupSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    childSliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    
    // Start with page 0 in group mode
    currentPage = 0;
    if (remoteControls) remoteControls.selectedPageIndex().set(0);
    
    // --- Create Transport Object ---
    transport = host.createTransport();
    
    host.println(`Bank, Device, Controls, Transport created. Slider page: ${SLIDER_PAGE_INDEX}`);

    // --- Setup Observers (ONCE) ---
    transport.isPlaying().addValueObserver((on) => {
        isPlaying = on;
        updatePageLeds();
    });

    transport.isArrangerRecordEnabled().addValueObserver((on) => {
        isRecording = on;
        updatePageLeds();
    });

    // Observer to ensure slider page stays fixed
    sliderPage.selectedPageIndex().addValueObserver((index) => {
        if (index !== SLIDER_PAGE_INDEX) {
            host.println(`WARN: Slider page index (${index}) differs from target (${SLIDER_PAGE_INDEX}). Forcing back.`);
            sliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX); 
        }
    });

    // Observer for selected remote control page index (Knobs)
    remoteControls.selectedPageIndex().addValueObserver((page) => {
        host.println("Selected Knob Page Index (Track " + currentTrackIndex + "): " + page);
        currentPage = page;
        updatePageLeds();
    });
    
    host.println("Observers attached.");
    // Set initial LED states
    updatePageLeds(); 
    host.println("nanoKontrol2 Drum Machine initialized successfully!");
}

function selectChildTrack(index) {
    if (index >= 0 && index < TRACK_BANK_SIZE) {
        currentTrackIndex = index;
        trackBank.scrollPosition().set(index);
        fixedTrack = trackBank.getItemAt(0);
        
        // Update device and controls for the new track
        cursorDevice = childCursorDevice;
        remoteControls = childRemoteControls;
        // Don't change sliderPage - keep it on group
        drumPadBank = childDrumPadBank;

        // Reset pages
        currentPage = 0;
        if (remoteControls) remoteControls.selectedPageIndex().set(0);
        
        host.showPopupNotification("Selected Track: " + (currentTrackIndex + 1));
        updatePageLeds();
    }
}

function updatePageLeds() {
    // S buttons (Knob page select)
    for (let i = 0; i < 8; i++) {
        sendMidi(0xB0, CC.S1 + i, (currentPage === i + 1) ? 127 : 0);
    }
    
    // M buttons (Drum Pad Mute)
    if (drumPadBank) {
        for (let i = 0; i < 8; i++) {
            let drumPad = drumPadBank.getItemAt(i);
            if (drumPad) { 
                sendMidi(0xB0, CC.M1 + i, drumPad.mute().get() ? 127 : 0);
            } else {
                sendMidi(0xB0, CC.M1 + i, 0);
            }
        }
    }

    // R buttons (Track Selection)
    for (let i = 0; i < 8; i++) {
        // Light up the R button if we're on the corresponding track in child mode
        // In group mode, all R LEDs should be off
        let isSelected = (cursorDevice === childCursorDevice && currentTrackIndex === i);
        sendMidi(0xB0, CC.R1 + i, isSelected ? 127 : 0);
    }

    // Transport buttons
    sendMidi(0xB0, CC.PLAY, isPlaying ? 127 : 0);
    sendMidi(0xB0, CC.REC, isRecording ? 127 : 0);
    // Group mode LEDs
    sendMidi(0xB0, CC.REW, cursorDevice === groupCursorDevice && currentPage === 0 ? 127 : 0);
    sendMidi(0xB0, CC.FF, cursorDevice === groupCursorDevice && currentPage === 1 ? 127 : 0);
}

function switchToGroupMode(targetPage) {
    // Switch to group track controls
    cursorDevice = groupCursorDevice;
    remoteControls = groupRemoteControls;
    // Don't change sliderPage - it's already on group
    drumPadBank = groupDrumPadBank;
    
    // Set the target page and ensure slider page is set to 9
    currentPage = targetPage;
    if (remoteControls) remoteControls.selectedPageIndex().set(targetPage);
    host.showPopupNotification("Selected Group Track (Page " + targetPage + ")");
    updatePageLeds();
}

function onMidi(status, data1, data2) {
    if (isChannelController(status)) {
        // --- Handle REW/FF Buttons (Group Mode) ---
        if (data1 === CC.REW && data2 > 0) {
            if (cursorDevice === groupCursorDevice && currentPage === 0) {
                // Switch back to last selected child track
                selectChildTrack(currentTrackIndex);
            } else {
                switchToGroupMode(0);
            }
            return;
        }
        if (data1 === CC.FF && data2 > 0) {
            if (cursorDevice === groupCursorDevice && currentPage === 1) {
                // Switch back to last selected child track
                selectChildTrack(currentTrackIndex);
            } else {
                switchToGroupMode(1);
            }
            return;
        }

        // --- Sliders (Always on Group Page 9) ---
        if (data1 >= CC.SLIDER1 && data1 <= CC.SLIDER8) {
            let index = data1 - CC.SLIDER1;
            host.println(`Slider ${index+1}: Target Page Index = ${SLIDER_PAGE_INDEX}`); 
            groupSliderPage.getParameter(index).set(data2, 128);
            return;
        }

        // --- Handle R Buttons (Track Selection) ---
        for (let i = 0; i < 8; i++) {
            if (data1 === CC.R1 + i && data2 > 0) {
                selectChildTrack(i);
                return;
            }
        }

        // --- Transport --- 
        if (data1 === CC.PLAY && data2 > 0) {
            transport.play();
            return;
        }
        if (data1 === CC.STOP && data2 > 0) {
            transport.stop();
            return;
        }
        if (data1 === CC.REC && data2 > 0) {
            transport.record();
            return;
        }

        // --- Remote Controls (Knobs, uses 'remoteControls' page) --- 
        if (remoteControls) {
             for (let i = 0; i < 8; i++) {
                if (data1 === CC.KNOB1 + i) {
                    host.println(`Knob ${i+1}: Target Page Index = ${remoteControls.selectedPageIndex().get()}`);
                    remoteControls.getParameter(i).set(data2, 128);
                    return;
                }
            }
        }

        // --- Page Selection (S Buttons, controls 'remoteControls' page) --- 
        if (remoteControls) {
            for (let i = 0; i < 8; i++) {
                if (data1 === CC.S1 + i) {
                    if (data2 > 0) { // Button pressed
                        host.println(`S${i+1} pressed: Current Knob Page = ${currentPage}`);
                        if (currentPage === i + 1) {
                            host.println(`S${i+1}: Toggling back to page 0`);
                            remoteControls.selectedPageIndex().set(0);
                        } else {
                            host.println(`S${i+1}: Setting page to ${i + 1}`);
                            remoteControls.selectedPageIndex().set(i + 1);
                        }
                    }
                    return;
                }
            }
        }

        // --- Drum Pad Mutes (M Buttons) --- 
        if (drumPadBank) {
            for (let i = 0; i < 8; i++) {
                if (data1 === CC.M1 + i) {
                    if (data2 > 0) { // Button pressed
                        let drumPad = drumPadBank.getItemAt(i);
                        if (drumPad) { 
                            drumPad.mute().toggle();
                        }
                    }
                    return;
                }
            }
        }
    }
    
    host.println("Unknown MIDI: " + status + ", " + data1 + ", " + data2);
}

function sendMidi(status, data1, data2) {
    if (midiOutPort) {
        midiOutPort.sendMidi(status, data1, data2);
    } 
}

function onSysex(data) {
    host.println("Sysex received: " + data);
}

function exit() {
    host.println("nanoKontrol2 Drum Machine exiting...");
    // Turn off all LEDs when exiting
    for (let i = 0; i < 8; i++) {
        sendMidi(0xB0, CC.S1 + i, 0);
        sendMidi(0xB0, CC.M1 + i, 0);
        sendMidi(0xB0, CC.R1 + i, 0); // Turn off R LEDs
    }
    // Turn off transport LEDs
    sendMidi(0xB0, CC.PLAY, 0);
    sendMidi(0xB0, CC.REC, 0);
    sendMidi(0xB0, CC.STOP, 0);
    // Turn off navigation LEDs
    sendMidi(0xB0, CC.REW, 0);
    sendMidi(0xB0, CC.FF, 0);

    host.println("nanoKontrol2 Drum Machine exited!");
}

function isChannelController(status) {
    return (status & 0xF0) === 0xB0;
} 