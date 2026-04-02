loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "Launch Control XL 3 AR",
    "0.1",
    "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

const DEBUG = true;
const PINNED_TRACK_INDEX = 0; // Track 1 (0-indexed)

// MIDI Channels (0-indexed)
const CH_CHILD_START = 0;   // Channels 1-8 -> child tracks 0-7
const CH_CHILD_END = 7;
const CH_PRIMARY_1 = 8;     // Channel 9 -> primary params 0,1,2
const CH_PRIMARY_2 = 9;     // Channel 10 -> primary params 4,5,6
const CH_SENDS = 10;        // Channel 11 -> sends 0,1,2 on child tracks

const NUM_CHILD_RC_PAGES = 3; // Pages tagged '1', '2', '3'
const NUM_CHILD_RC_PARAMS = 8; // 8 params per page (one per knob column)

// LCXL3 Custom Mode MIDI CC mappings
const CC = {
    // Encoders Top Row (CC13-CC20)
    ENC_T1: 13, ENC_T2: 14, ENC_T3: 15, ENC_T4: 16,
    ENC_T5: 17, ENC_T6: 18, ENC_T7: 19, ENC_T8: 20,
    
    // Encoders Middle Row (CC21-CC28)
    ENC_M1: 21, ENC_M2: 22, ENC_M3: 23, ENC_M4: 24,
    ENC_M5: 25, ENC_M6: 26, ENC_M7: 27, ENC_M8: 28,
    
    // Encoders Bottom Row (CC29-CC36)
    ENC_B1: 29, ENC_B2: 30, ENC_B3: 31, ENC_B4: 32,
    ENC_B5: 33, ENC_B6: 34, ENC_B7: 35, ENC_B8: 36,
    
    // Faders (CC5-CC12)
    FADER1: 5, FADER2: 6, FADER3: 7, FADER4: 8,
    FADER5: 9, FADER6: 10, FADER7: 11, FADER8: 12,
    
    // Upper Buttons (CC37-CC44)
    BTN_U1: 37, BTN_U2: 38, BTN_U3: 39, BTN_U4: 40,
    BTN_U5: 41, BTN_U6: 42, BTN_U7: 43, BTN_U8: 44,
    
    // Bottom Buttons (CC45-CC52)
    BTN_B1: 45, BTN_B2: 46, BTN_B3: 47, BTN_B4: 48,
    BTN_B5: 49, BTN_B6: 50, BTN_B7: 51, BTN_B8: 52,
};

// Globals
let midiIn, midiOut;

// Track management
let trackBank;
let pinnedTrack;
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;

// Primary device on group track
let primaryDeviceBank;
let primaryDevice;

// Remote control pages '1' to '8' on the primary device
// Each page has 7 parameters:
//   Mode 1 (ch1): params 0,1,2 (top, middle, bottom encoders)
//   Mode 2 (ch2): params 4,5,6 (top, middle, bottom encoders)
//   Param 3 is skipped/reserved
let devicePages = []; // Array of 8 pages

// Volumes page on primary device for faders
let volumesPage;

// Child tracks of pinned group
let childTrackBank;

// Upper buttons MUTE
let muteStates = [];            // Array of mute() SettableBooleanValue for each track

// Bottom buttons REC ARM
let armTracks = [];             // Array of 8 child tracks in pinned group
let armStates = [];             // Array of arm() SettableBooleanValue for each track

// Sends for Mode 3 (3 sends per child track)
const NUM_SENDS = 3;
let childTrackSends = [];       // 2D array: childTrackSends[trackIndex][sendIndex]

// Modes 9-16: remote control pages on child track devices
// childTrackRCs[trackIndex] = { device, pages: [page1, page2, page3] }
let childTrackRCs = [];

function init() {
    log("LCXL3-AR - Initializing...");
    
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    log("LCXL3-AR - Initialized!");
}

function setupTracks() {
    log("Setting up track management...");
    
    trackBank = host.createTrackBank(8, 0, 0, false);
    pinnedTrack = trackBank.getItemAt(PINNED_TRACK_INDEX);
    
    // Mark track properties as interested
    pinnedTrack.exists().markInterested();
    pinnedTrack.name().markInterested();
    pinnedTrack.isGroup().markInterested();
    
    // Setup primary device on the pinned track
    primaryDeviceBank = pinnedTrack.createDeviceBank(1);
    primaryDevice = primaryDeviceBank.getDevice(0);
    primaryDevice.exists().markInterested();
    primaryDevice.name().markInterested();
    
    // Create remote control pages '1' to '8' on the primary device
    // Each page has 7 parameters (Mode 1: 0,1,2 and Mode 2: 4,5,6)
    for (let i = 0; i < 8; i++) {
        const pageTag = String(i + 1); // Tags '1' to '8'
        const page = primaryDevice.createCursorRemoteControlsPage("Page" + pageTag, 7, pageTag);
        devicePages[i] = page;
        
        // Mark all 7 parameters as interested
        for (let p = 0; p < 7; p++) {
            const param = page.getParameter(p);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
        }
    }
    
    // Setup volumes page on primary device for faders
    setupVolumesPage();
    
    // Setup child tracks for sends and REC ARM
    setupChildTracks();
    
    // Setup observers
    setupObservers();
    
    host.scheduleTask(function() {
        logTrackStatus();
    }, 100);
}

function setupVolumesPage() {
    log("Setting up volumes page for faders...");
    
    volumesPage = primaryDevice.createCursorRemoteControlsPage("Volumes", 8, "volumes");
    
    for (let p = 0; p < 8; p++) {
        const param = volumesPage.getParameter(p);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
    }
    
    log("Volumes page setup complete");
}

function setupChildTracks() {
    log("Setting up child tracks (sends + REC ARM)...");
    
    childTrackBank = pinnedTrack.createTrackBank(8, NUM_SENDS, 0, false);
    
    for (let i = 0; i < 8; i++) {
        const track = childTrackBank.getItemAt(i);
        track.exists().markInterested();
        track.name().markInterested();
        
        childTrackSends[i] = [];
        for (let s = 0; s < NUM_SENDS; s++) {
            const send = track.getSend(s);
            send.exists().markInterested();
            send.name().markInterested();
            send.value().markInterested();
            childTrackSends[i][s] = send;
        }
        
        // Remote control pages on the child track's primary device (modes 9-16)
        setupChildTrackRC(track, i);
        
        armTracks[i] = track;
        
        const buttonIndex = i;
        
        const mute = track.mute();
        mute.markInterested();
        muteStates[i] = mute;
        
        mute.addValueObserver(function(isMuted) {
            const cc = CC.BTN_U1 + buttonIndex;
            const ledValue = isMuted ? 0 : 127;
            for (let ch = 0; ch < 16; ch++) {
                midiOut.sendMidi(0xB0 + ch, cc, ledValue);
            }
        });
        
        const arm = track.arm();
        arm.markInterested();
        armStates[i] = arm;
        
        arm.addValueObserver(function(isArmed) {
            const cc = CC.BTN_B1 + buttonIndex;
            const ledValue = isArmed ? 0 : 127;
            for (let ch = 0; ch < 16; ch++) {
                midiOut.sendMidi(0xB0 + ch, cc, ledValue);
            }
        });
    }
    
    log("Child tracks setup complete");
}

function setupChildTrackRC(track, trackIndex) {
    const deviceBank = track.createDeviceBank(1);
    const device = deviceBank.getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();
    
    const pages = [];
    for (let p = 0; p < NUM_CHILD_RC_PAGES; p++) {
        const tag = String(p + 1);
        const page = device.createCursorRemoteControlsPage(
            "Child" + trackIndex + "_Page" + tag, NUM_CHILD_RC_PARAMS, tag
        );
        for (let j = 0; j < NUM_CHILD_RC_PARAMS; j++) {
            const param = page.getParameter(j);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
        }
        pages[p] = page;
    }
    
    childTrackRCs[trackIndex] = { device: device, pages: pages };
}

function setupObservers() {
    pinnedTrack.exists().addValueObserver(function(exists) {
        pinnedTrackExists = exists;
        log(`Pinned track exists: ${exists}`);
    });
    
    pinnedTrack.name().addValueObserver(function(name) {
        log(`Pinned track name: ${name}`);
    });
    
    pinnedTrack.isGroup().addValueObserver(function(isGroup) {
        pinnedTrackIsGroup = isGroup;
        log(`Pinned track is group: ${isGroup}`);
    });
    
    primaryDevice.exists().addValueObserver(function(exists) {
        log(`Primary device exists: ${exists}`);
    });
    
    primaryDevice.name().addValueObserver(function(name) {
        log(`Primary device name: ${name}`);
    });
}

function onMidi(status, data1, data2) {
    const msgType = status & 0xF0;
    const channel = status & 0x0F;
    
    if (msgType === 0xB0) {
        handleCC(channel, data1, data2);
    }
}

function handleCC(channel, cc, value) {
    // 1. Child Track Remote Controls (Channels 1-8 / index 0-7)
    if (channel >= CH_CHILD_START && channel <= CH_CHILD_END) {
        const trackIndex = channel - CH_CHILD_START;
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleChildRCEncoder(trackIndex, 0, cc - CC.ENC_T1, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleChildRCEncoder(trackIndex, 1, cc - CC.ENC_M1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleChildRCEncoder(trackIndex, 2, cc - CC.ENC_B1, value);
            return;
        }
    }
    
    // 2. Primary Device Parameters (Channel 9 & 10 / index 8 & 9)
    if (channel === CH_PRIMARY_1 || channel === CH_PRIMARY_2) {
        const paramOffset = (channel === CH_PRIMARY_1) ? 0 : 4;
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleEncoderColumn(cc - CC.ENC_T1, paramOffset + 0, value, channel);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleEncoderColumn(cc - CC.ENC_M1, paramOffset + 1, value, channel);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleEncoderColumn(cc - CC.ENC_B1, paramOffset + 2, value, channel);
            return;
        }
    }
    
    // 3. Sends (Channel 11 / index 10)
    if (channel === CH_SENDS) {
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleSendEncoder(cc - CC.ENC_T1, 0, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleSendEncoder(cc - CC.ENC_M1, 1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleSendEncoder(cc - CH_CHILD_START, 2, value);
            return;
        }
    }
    
    // 4. Shared Faders and Buttons (All channels)
    // Faders -> 'volumes' page on primary device
    if (cc >= CC.FADER1 && cc <= CC.FADER8) {
        handleFader(cc - CC.FADER1, value);
        return;
    }
    
    // Upper Buttons -> Toggle MUTE on child tracks
    if (cc >= CC.BTN_U1 && cc <= CC.BTN_U8) {
        handleUpperButton(cc - CC.BTN_U1);
        return;
    }
    
    // Bottom Buttons -> Toggle REC ARM on child tracks
    if (cc >= CC.BTN_B1 && cc <= CC.BTN_B8) {
        handleBottomButton(cc - CC.BTN_B1);
        return;
    }
}

function handleUpperButton(buttonIndex) {
    if (!pinnedTrackIsGroup) {
        log(`Upper button ${buttonIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    const track = armTracks[buttonIndex];
    if (!track || !track.exists().get()) {
        log(`Upper button ${buttonIndex + 1}: no child track at index`);
        return;
    }
    
    const mute = muteStates[buttonIndex];
    if (!mute) {
        log(`Upper button ${buttonIndex + 1}: no mute control`);
        return;
    }
    
    mute.toggle();
    log(`Upper button ${buttonIndex + 1}: toggled MUTE on ${track.name().get()}`);
}

function handleBottomButton(buttonIndex) {
    if (!pinnedTrackIsGroup) {
        log(`Bottom button ${buttonIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    const track = armTracks[buttonIndex];
    if (!track || !track.exists().get()) {
        log(`Bottom button ${buttonIndex + 1}: no child track at index`);
        return;
    }
    
    const arm = armStates[buttonIndex];
    if (!arm) {
        log(`Bottom button ${buttonIndex + 1}: no arm control`);
        return;
    }
    
    // Toggle the arm state - observer will update LED
    arm.toggle();
    log(`Bottom button ${buttonIndex + 1}: toggled REC ARM on ${track.name().get()}`);
}

function handleFader(faderIndex, value) {
    if (!pinnedTrackIsGroup) {
        log(`Fader ${faderIndex + 1}: ignored (not a group track)`);
        return;
    }
    
    const param = volumesPage.getParameter(faderIndex);
    if (!param || !param.exists().get()) {
        log(`Fader ${faderIndex + 1}: param doesn't exist`);
        return;
    }
    
    const normalizedValue = value / 127.0;
    param.set(normalizedValue);
    
    if (DEBUG && Math.random() < 0.1) {
        log(`Fader ${faderIndex + 1}: ${param.name().get()} = ${normalizedValue.toFixed(2)}`);
    }
}

/**
 * Handle send encoder input
 * @param {number} trackIndex - Child track index 0-7
 * @param {number} sendIndex - Send index 0-2
 * @param {number} value - MIDI CC value (0-127 absolute)
 */
function handleSendEncoder(trackIndex, sendIndex, value) {
    if (!pinnedTrackIsGroup) {
        log(`Send encoder track ${trackIndex + 1} send ${sendIndex}: ignored (not a group track)`);
        return;
    }
    
    const sends = childTrackSends[trackIndex];
    if (!sends) {
        log(`Send encoder track ${trackIndex + 1}: no sends array`);
        return;
    }
    
    const send = sends[sendIndex];
    if (!send || !send.exists().get()) {
        log(`Send encoder track ${trackIndex + 1} send ${sendIndex}: send doesn't exist`);
        return;
    }
    
    const linear = value / 127.0;
    const normalizedValue = Math.pow(linear, 0.15);
    send.set(normalizedValue);
    
    if (DEBUG && Math.random() < 0.1) {
        host.println(`[SENDS] Track ${trackIndex + 1} Send ${sendIndex + 1}: ${send.name().get()} = ${normalizedValue.toFixed(2)}`);
    }
}

/**
 * Handle encoder input for child track remote controls
 * @param {number} trackIndex - Child track index 0-7 (derived from MIDI channel)
 * @param {number} pageIndex - RC page index 0-2 (0=top row, 1=middle, 2=bottom)
 * @param {number} paramIndex - Parameter index 0-7 (knob column)
 * @param {number} value - MIDI CC value (0-127 absolute)
 */
function handleChildRCEncoder(trackIndex, pageIndex, paramIndex, value) {
    if (!pinnedTrackIsGroup) {
        log(`Child RC track ${trackIndex + 1} page ${pageIndex + 1} param ${paramIndex}: ignored (not a group track)`);
        return;
    }
    
    const rc = childTrackRCs[trackIndex];
    if (!rc) {
        log(`Child RC track ${trackIndex + 1}: no RC data`);
        return;
    }
    
    const page = rc.pages[pageIndex];
    if (!page) {
        log(`Child RC track ${trackIndex + 1} page ${pageIndex + 1}: no page`);
        return;
    }
    
    const param = page.getParameter(paramIndex);
    if (!param || !param.exists().get()) {
        log(`Child RC track ${trackIndex + 1} page ${pageIndex + 1} param ${paramIndex}: doesn't exist`);
        return;
    }
    
    const linear = value / 127.0;
    const normalizedValue = Math.pow(linear, 0.5);
    param.set(normalizedValue);
    
    if (DEBUG && Math.random() < 0.1) {
        host.println(`[CH${trackIndex + 1}] Page '${pageIndex + 1}' P${paramIndex}: ${param.name().get()} = ${normalizedValue.toFixed(2)}`);
    }
}

/**
 * Handle encoder input for a specific column and parameter index
 * @param {number} columnIndex - Column index 0-7 (maps to pages '1'-'8')
 * @param {number} paramIndex - Parameter index 0-5
 * @param {number} value - MIDI CC value (0-127 absolute)
 * @param {number} channel - MIDI channel for logging
 */
function handleEncoderColumn(columnIndex, paramIndex, value, channel) {
    if (!pinnedTrackIsGroup) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: ignored (not a group track)`);
        return;
    }
    
    const page = devicePages[columnIndex];
    if (!page) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: no page`);
        return;
    }
    
    const param = page.getParameter(paramIndex);
    if (!param || !param.exists().get()) {
        log(`Encoder col ${columnIndex + 1} param ${paramIndex}: param doesn't exist`);
        return;
    }
    
    const linear = value / 127.0;
    const normalizedValue = Math.pow(linear, 0.5);
    param.set(normalizedValue);
    
    if (DEBUG && Math.random() < 0.1) { // Log 10% of the time to reduce spam
        const pageName = String(columnIndex + 1);
        const modeName = channel === CH_PRIMARY_1 ? 'P1' : 'P2';
        host.println(`[${modeName}] Encoder col ${columnIndex + 1} -> Page '${pageName}' P${paramIndex}: ${param.name().get()} = ${normalizedValue.toFixed(2)}`);
    }
}

function logTrackStatus() {
    log("=== LCXL3-AR Track Status ===");
    log(`Pinned track index: ${PINNED_TRACK_INDEX}`);
    log(`Pinned track exists: ${pinnedTrackExists}`);
    log(`Pinned track is group: ${pinnedTrackIsGroup}`);
    log(`Primary device exists: ${primaryDevice.exists().get()}`);
    if (primaryDevice.exists().get()) {
        log(`Primary device name: ${primaryDevice.name().get()}`);
    }
    
    // Log encoder page status
    log("--- Encoder Pages ---");
    for (let i = 0; i < 8; i++) {
        const page = devicePages[i];
        let paramCount = 0;
        for (let p = 0; p < 7; p++) {
            if (page.getParameter(p).exists().get()) {
                paramCount++;
            }
        }
        if (paramCount > 0) {
            log(`  Page '${i + 1}': ${paramCount}/7 params`);
        }
    }
    
    // Log volumes page status for faders
    log("--- Volumes Page (faders) ---");
    if (volumesPage) {
        let paramCount = 0;
        for (let p = 0; p < 8; p++) {
            if (volumesPage.getParameter(p).exists().get()) {
                paramCount++;
            }
        }
        log(`  ${paramCount}/8 params mapped`);
    }
    
    // Log child track RC pages (channels 1-8)
    log("--- Child Track RC Pages (channels 1-8) ---");
    for (let t = 0; t < 8; t++) {
        const rc = childTrackRCs[t];
        if (!rc || !rc.device.exists().get()) continue;
        const trackName = childTrackBank.getItemAt(t).name().get();
        for (let p = 0; p < NUM_CHILD_RC_PAGES; p++) {
            let paramCount = 0;
            for (let j = 0; j < NUM_CHILD_RC_PARAMS; j++) {
                if (rc.pages[p].getParameter(j).exists().get()) paramCount++;
            }
            if (paramCount > 0) {
                log(`  Child ${t + 1} (${trackName}) Page '${p + 1}': ${paramCount}/${NUM_CHILD_RC_PARAMS} params`);
            }
        }
    }
    
    log("=============================");
}

function log(msg) {
    if (DEBUG) host.println(msg);
}

function flush() {
    // Called periodically
}

function exit() {
    log("LCXL3-AR - Exiting...");
}
