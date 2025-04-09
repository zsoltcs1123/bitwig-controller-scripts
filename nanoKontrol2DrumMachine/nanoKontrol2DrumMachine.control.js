loadAPI(18);
host.setShouldFailOnDeprecatedUse(true);

// Remove this if you want to be able to use deprecated methods without causing script to stop.
host.defineController("Korg", "nanoKontrol2 Drum Machine", "0.1", "3c89f296-4535-4856-a201-c4556ed0ba1a", "Zsolt");
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
    REC: 0x2D        // 45
};

const TRACK_BANK_SIZE = 16; // Define how many tracks we can navigate
const SLIDER_PAGE_INDEX = 9; // The 0-based index for the sliders page
const R_BUTTON_PAGE_INDEX = 10; // The 0-based index for the R buttons page

function init() {
    host.println("nanoKontrol2 Drum Machine initializing...");
    
    // Initialize MIDI
    var midiIn = host.getMidiInPort(0);
    midiOutPort = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);
    midiIn.setSysexCallback(onSysex);
    
    // --- Create Bank and Fixed Track Window ---
    trackBank = host.createTrackBank(TRACK_BANK_SIZE, 0, 0, false);
    fixedTrack = trackBank.getItemAt(0); 

    // --- Create Device and Control Objects (ONCE) ---
    cursorDevice = fixedTrack.createCursorDevice("DrumMachineCursor");
    // Page for Knobs (follows S1-S8 selection) - The MAIN unnamed page
    remoteControls = cursorDevice.createCursorRemoteControlsPage(8);
    // Dedicated page for Sliders (fixed to SLIDER_PAGE_INDEX) - NAMED page
    sliderPage = cursorDevice.createCursorRemoteControlsPage("SliderPage", 8, null); 
    sliderPage.selectedPageIndex().markInterested();
    sliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
    // Dedicated page for R buttons (fixed to R_BUTTON_PAGE_INDEX) - NAMED page
    rButtonPage = cursorDevice.createCursorRemoteControlsPage("RButtonPage", 8, null); 
    rButtonPage.selectedPageIndex().markInterested();
    rButtonPage.selectedPageIndex().set(R_BUTTON_PAGE_INDEX);
    
    drumPadBank = cursorDevice.createDrumPadBank(8);

    // --- Create Transport Object ---
    transport = host.createTransport();
    
    host.println(`Bank, Device, Controls, Transport created. Slider page: ${SLIDER_PAGE_INDEX}, R button page: ${R_BUTTON_PAGE_INDEX}`);

    // --- Setup Observers (ONCE) ---

    // Observer for track bank scrolling
    trackBank.scrollPosition().addValueObserver(function(scrollPosition) {
        currentTrackIndex = scrollPosition;
        host.println("Track bank scrolled to index: " + currentTrackIndex);
        host.showPopupNotification("Selected Track: " + (currentTrackIndex + 1)); // Show track number on screen (1-based)
        currentPage = 0;
        if (remoteControls) remoteControls.selectedPageIndex().set(0);
        // Ensure dedicated pages are reset if they change (shouldn't usually happen here)
        if (sliderPage) sliderPage.selectedPageIndex().set(SLIDER_PAGE_INDEX);
        if (rButtonPage) rButtonPage.selectedPageIndex().set(R_BUTTON_PAGE_INDEX);
        updatePageLeds(); 
    });

    // Observer for the name of the track currently in the window
    fixedTrack.name().addValueObserver((name) => {
        host.println("Current Fixed Track (Index " + currentTrackIndex + "): " + name);
    });

    // Observer for the name of the device on the current track
    cursorDevice.name().addValueObserver((name) => {
        host.println("Current Device Name (Track " + currentTrackIndex + "): " + name);
    });

    // Observer for remote control page names on the current device
    remoteControls.pageNames().addValueObserver((names) => {
        const jsNames = Array.from(names);
        host.println("Available Remote Pages (Track " + currentTrackIndex + "): " + jsNames.join(', '));
    });

    // Observer for selected remote control page index (Knobs)
    remoteControls.selectedPageIndex().addValueObserver((page) => {
        host.println("Selected Knob Page Index (Track " + currentTrackIndex + "): " + page);
        currentPage = page;
        updatePageLeds();
    });

    // Observers for drum pad mute states (M Buttons)
    for (let i = 0; i < 8; i++) {
        let drumPad = drumPadBank.getItemAt(i);
        drumPad.mute().addValueObserver((isMuted) => {
            sendMidi(0xB0, CC.M1 + i, isMuted ? 127 : 0);
        });
    }

    // Transport Observers for LED feedback
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

    // Observer to ensure R button page stays fixed
    rButtonPage.selectedPageIndex().addValueObserver((index) => {
        if (index !== R_BUTTON_PAGE_INDEX) {
            host.println(`WARN: R Button page index (${index}) differs from target (${R_BUTTON_PAGE_INDEX}). Forcing back.`);
            rButtonPage.selectedPageIndex().set(R_BUTTON_PAGE_INDEX);
        }
    });

    // Observers for R button parameter values (for LED feedback)
    for (let i = 0; i < 8; i++) {
        if (rButtonPage) {
            let parameter = rButtonPage.getParameter(i);
            parameter.value().addValueObserver((value) => {
                 // Assuming value > 0 means ON for the toggle
                sendMidi(0xB0, CC.R1 + i, value > 0 ? 127 : 0);
            });
        }
    }
    
    host.println("Observers attached.");
    // Set initial LED states
    updatePageLeds(); 
    host.println("nanoKontrol2 Drum Machine initialized successfully!");
}

function navigateToTrack(newIndex) {
    if (newIndex >= 0 && newIndex < TRACK_BANK_SIZE) {
        host.println("Attempting to navigate to track index: " + newIndex);
        trackBank.scrollPosition().set(newIndex);
    } else {
        host.println("Cannot navigate to track index outside bounds: " + newIndex);
    }
}

function flush() {
    // updatePageLeds(); // Generally not needed as observers handle updates
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

    // R buttons (Page 10 Toggles)
    if (rButtonPage) {
        for (let i = 0; i < 8; i++) {
            let parameter = rButtonPage.getParameter(i);
            sendMidi(0xB0, CC.R1 + i, parameter.value().get() > 0 ? 127 : 0);
        }
    }

    // Transport buttons
    sendMidi(0xB0, CC.PLAY, isPlaying ? 127 : 0);
    sendMidi(0xB0, CC.REC, isRecording ? 127 : 0);

    // Track Navigation buttons (REW/FF)
    sendMidi(0xB0, CC.REW, currentTrackIndex > 0 ? 127 : 0); 
    sendMidi(0xB0, CC.FF, currentTrackIndex < TRACK_BANK_SIZE - 1 ? 127 : 0);
}

function onMidi(status, data1, data2) {
    if (isChannelController(status)) {

        // --- Sliders (Dedicated Page 9) ---
        if (sliderPage) {
            for (let i = 0; i < 8; i++) {
                if (data1 === CC.SLIDER1 + i) {
                    host.println(`Slider ${i+1}: Target Page Index = ${sliderPage.selectedPageIndex().get()}`); 
                    sliderPage.getParameter(i).set(data2, 128);
                    return; 
                }
            }
        }

        // --- R Buttons (Dedicated Page 10 Toggles) ---
        if (rButtonPage) {
            for (let i = 0; i < 8; i++) {
                if (data1 === CC.R1 + i) {
                    if (data2 > 0) { // Button pressed
                        host.println(`R${i+1}: Target Page Index = ${rButtonPage.selectedPageIndex().get()}`);
                        let parameter = rButtonPage.getParameter(i);
                        // Toggle behavior: Set to max (127) if currently 0, otherwise set to 0
                        parameter.value().set(parameter.value().get() === 0 ? 127 : 0, 128);
                    }
                    return; 
                }
            }
        }
        
        // --- Track Navigation --- 
        if (data1 === CC.REW && data2 > 0) { 
            navigateToTrack(currentTrackIndex - 1);
            return;
        }
        if (data1 === CC.FF && data2 > 0) { 
            navigateToTrack(currentTrackIndex + 1);
            return;
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