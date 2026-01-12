loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "Launch Control XL 2 FX",
    "0.1",
    "b2c3d4e5-f6a7-8901-bcde-f23456789123",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

const USER_CHANNEL = 5; // User 6 (0-indexed)

// MIDI CC Mappings for last 3 columns (6, 7, 8)
const CONTROL = {
    FADERS: [82, 83, 84],
    KNOBS_TOP: [18, 19, 20],
    KNOBS_MID: [34, 35, 36],
    KNOBS_BOT: [54, 55, 56],
    PERF_KNOBS: [13, 14, 15, 16], // Top row knobs 1-4
    PERF_KNOBS_MID: [29, 30, 31, 32], // Middle row knobs 1-4
    PERF_KNOBS_BOT: [49, 50, 51, 52], // Bottom row knobs 1-4
    PERF_FADERS: [77, 78, 79, 80, 81] // First 5 faders
};

let effectTrackBank;
let fx1PerfPage;
let fx2PerfPage;
let fx3PerfPage;
let lastFXTrackBank;
let lastFXPerfPage;

function init() {
    host.getMidiInPort(0).setMidiCallback(onMidi);
    
    // Create bank for first 3 effect tracks
    effectTrackBank = host.createEffectTrackBank(3, 3, 0);

    for (let i = 0; i < 3; i++) {
        const track = effectTrackBank.getItemAt(i);
        track.exists().markInterested();
        track.name().markInterested();
        track.volume().markInterested();
        
        for (let s = 0; s < 3; s++) {
            track.getSend(s).markInterested();
        }
    }

    // Setup 'perf' page for FX Track 1
    const fx1 = effectTrackBank.getItemAt(0);
    fx1PerfPage = fx1.createCursorRemoteControlsPage("fx1_perf", 4, "perf");
    for (let i = 0; i < 4; i++) fx1PerfPage.getParameter(i).markInterested();

    // Setup 'perf' page for FX Track 2
    const fx2 = effectTrackBank.getItemAt(1);
    fx2PerfPage = fx2.createCursorRemoteControlsPage("fx2_perf", 4, "perf");
    for (let i = 0; i < 4; i++) fx2PerfPage.getParameter(i).markInterested();

    // Setup 'perf' page for FX Track 3
    const fx3 = effectTrackBank.getItemAt(2);
    fx3PerfPage = fx3.createCursorRemoteControlsPage("fx3_perf", 4, "perf");
    for (let i = 0; i < 4; i++) fx3PerfPage.getParameter(i).markInterested();

    // Setup 'perf' page for the ABSOLUTE LAST FX track
    // We create a bank of 1 track and scroll it to the end
    lastFXTrackBank = host.createEffectTrackBank(1, 0, 0);
    
    // Keep it scrolled to the last track by observing the count
    lastFXTrackBank.channelCount().addValueObserver(function(count) {
        lastFXTrackBank.scrollPosition().set(count - 1);
    });

    const lastFX = lastFXTrackBank.getItemAt(0);
    lastFX.name().markInterested();
    lastFXPerfPage = lastFX.createCursorRemoteControlsPage("last_fx_perf", 5, "perf");
    for (let i = 0; i < 5; i++) lastFXPerfPage.getParameter(i).markInterested();

    host.println("LCXL2-FX - Initialized!");
    host.println("Controlling first 3 Effect Tracks via LCXL2 Channels 6, 7, 8");
    host.println("Top row knobs 1-4 mapped to FX1 'perf' page");
    host.println("Middle row knobs 1-4 mapped to FX2 'perf' page");
    host.println("Bottom row knobs 1-4 mapped to FX3 'perf' page");
    host.println("Faders 1-5 mapped to the LAST FX track 'perf' page");
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const msgType = status & 0xF0;

    if (channel !== USER_CHANNEL) return;

    if (msgType === 0xB0) { // CC
        handleCC(data1, data2);
    }
}

function handleCC(cc, value) {
    const val = value / 127.0;

    // Check 'perf' knobs for FX1 (Top row 1-4)
    for (let i = 0; i < 4; i++) {
        if (cc === CONTROL.PERF_KNOBS[i]) {
            fx1PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' knobs for FX2 (Middle row 1-4)
    for (let i = 0; i < 4; i++) {
        if (cc === CONTROL.PERF_KNOBS_MID[i]) {
            fx2PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' knobs for FX3 (Bottom row 1-4)
    for (let i = 0; i < 4; i++) {
        if (cc === CONTROL.PERF_KNOBS_BOT[i]) {
            fx3PerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check 'perf' faders for the LAST FX track (Faders 1-5)
    for (let i = 0; i < 5; i++) {
        if (cc === CONTROL.PERF_FADERS[i]) {
            lastFXPerfPage.getParameter(i).set(val);
            return;
        }
    }

    // Check last 3 faders (Volume for FX 1-3)
    for (let i = 0; i < 3; i++) {
        if (cc === CONTROL.FADERS[i]) {
            effectTrackBank.getItemAt(i).volume().set(val);
            return;
        }
    }

    // Check knobs for Sends 1, 2, 3 (Columns 6-8)
    for (let i = 0; i < 3; i++) {
        const track = effectTrackBank.getItemAt(i);
        
        if (cc === CONTROL.KNOBS_TOP[i]) {
            track.getSend(0).set(val);
            return;
        }
        if (cc === CONTROL.KNOBS_MID[i]) {
            track.getSend(1).set(val);
            return;
        }
        if (cc === CONTROL.KNOBS_BOT[i]) {
            track.getSend(2).set(val);
            return;
        }
    }
}

function flush() {
    // Called periodically
}

function exit() {
    host.println("LCXL2-FX - Exiting...");
}