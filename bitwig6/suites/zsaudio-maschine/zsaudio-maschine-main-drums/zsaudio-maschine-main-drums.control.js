loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);
host.defineController(
    "Behringer",
    "ZSAudio Maschine Main Drums",
    "0.1",
    "d4e5f6a7-b8c9-0123-def4-567890123456",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const DEBUG = false;
const ENCODER_SENSITIVITY = 2.5; // step multiplier: 1 = default, 2 = double, 0.5 = half
const ENCODER_RESOLUTION = 128;
const BANK_SIZE = 8;
const MAX_CHAINS = 8;
const NUM_CLIPS = BANK_SIZE * MAX_CHAINS;
const LONG_PRESS_DELAY = 500;
const FLAT_BANK_SIZE = 256;
const TARGET_TRACK_NAME = "Main Drums";
const CURSOR_ID = "maschine-main-drums";
const CURSOR_NAME = "Maschine Main Drums";
const MUTES_TAG = "mutes";
const KILL_TAG = "kill";
const CHAIN_KILL_TAG = "chainkill";
const DEFAULT_TAG = "m0";
const FADERS_TAG = "faders";
const VOLS_TAG = "vols";
const PANS_TAG = "pans";
const EQ_TAG = "eq";
const PAGE_TAGS = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"];

const PAGE_INDEX_M0 = -1;
const PAGE_INDEX_FADERS = -2;
const PAGE_INDEX_VOLS = -3;
const PAGE_INDEX_PANS = -4;
const PAGE_INDEX_EQ = -5;

const CC = {
    ENCODER_1: 16, ENCODER_2: 17, ENCODER_3: 18, ENCODER_4: 19,
    ENCODER_5: 20, ENCODER_6: 21, ENCODER_7: 22, ENCODER_8: 23,
    LED_RING_1: 48, LED_RING_2: 49, LED_RING_3: 50, LED_RING_4: 51,
    LED_RING_5: 52, LED_RING_6: 53, LED_RING_7: 54, LED_RING_8: 55,
};

const NOTE = {
    ENCODER_PUSH_1: 32, ENCODER_PUSH_2: 33, ENCODER_PUSH_3: 34, ENCODER_PUSH_4: 35,
    ENCODER_PUSH_5: 36, ENCODER_PUSH_6: 37, ENCODER_PUSH_7: 38, ENCODER_PUSH_8: 39,
    BUTTON_UPPER_1: 89, BUTTON_UPPER_2: 90, BUTTON_UPPER_3: 40, BUTTON_UPPER_4: 41,
    BUTTON_UPPER_5: 42, BUTTON_UPPER_6: 43, BUTTON_UPPER_7: 44, BUTTON_UPPER_8: 45,    
    BUTTON_LOWER_1: 87, BUTTON_LOWER_2: 88, BUTTON_LOWER_3: 91, BUTTON_LOWER_4: 92,
    BUTTON_LOWER_5: 86, BUTTON_LOWER_6: 93, BUTTON_LOWER_7: 94, BUTTON_LOWER_8: 95,
    BUTTON_A: 84,
    BUTTON_B: 85,
};


const LED_STATE = { OFF: 0, ON: 127 };

const UPPER_BUTTON_NOTES = [
    NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
    NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8
];

const LOWER_BUTTON_NOTES = [
    NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
    NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8
];

const ENCODER_PUSH_NOTES = [
    NOTE.ENCODER_PUSH_1, NOTE.ENCODER_PUSH_2, NOTE.ENCODER_PUSH_3, NOTE.ENCODER_PUSH_4,
    NOTE.ENCODER_PUSH_5, NOTE.ENCODER_PUSH_6, NOTE.ENCODER_PUSH_7, NOTE.ENCODER_PUSH_8
];
let midiIn, midiOut;
let detectBank = null;
let cursorTrack = null;
let control = null;
let found = false;
let selectedIndex = -1;

// PAGE_INDEX_M0, 0..7 = d1..d8, PAGE_INDEX_FADERS/VOLS/PANS/EQ
let selectedPageIndex = PAGE_INDEX_M0;
// zero | A | B
let bottomMode = "zero";
let clipButtonStates = {};
function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    cursorTrack = host.createCursorTrack(CURSOR_ID, CURSOR_NAME, 0, NUM_CLIPS, false);    cursorTrack.isPinned().markInterested();
    control = createControl(cursorTrack);

    setupDetection();
    updateLEDs();

    host.scheduleTask(function () {
        cursorTrack.isPinned().set(true);
        resolveTargetTrack(true);
        updateLEDs();
        if (DEBUG) reportDebugStatus();
    }, 200);

    status("ready");
}

function status(message) {
    host.println(CURSOR_NAME + ": " + message);
}

function log(message) {
    if (DEBUG) {
        status(message);
    }
}

function setupDetection() {
    var rootGroup = host.getProject().getRootTrackGroup();
    detectBank = rootGroup.createTrackBank(FLAT_BANK_SIZE, 0, 0, true);
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        t.exists().markInterested();
        t.name().markInterested();
        t.exists().addValueObserver(function () { resolveTargetTrack(); });
        t.name().addValueObserver(function () { resolveTargetTrack(); });
    }
}

function createControl(track) {
    var device = track.createDeviceBank(1).getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();

    var prefix = "xtm-";
    var pageMutes = device.createCursorRemoteControlsPage(prefix + MUTES_TAG, 8, MUTES_TAG);
    var pageKill = device.createCursorRemoteControlsPage(prefix + KILL_TAG, 1, KILL_TAG);
    var pageTrackKill = track.createCursorRemoteControlsPage(prefix + CHAIN_KILL_TAG, 8, CHAIN_KILL_TAG);
    var pageDefault = device.createCursorRemoteControlsPage(prefix + DEFAULT_TAG, 8, DEFAULT_TAG);
    var pageFaders = device.createCursorRemoteControlsPage(prefix + FADERS_TAG, 8, FADERS_TAG);
    var pageVols = device.createCursorRemoteControlsPage(prefix + VOLS_TAG, 8, VOLS_TAG);
    var pagePans = device.createCursorRemoteControlsPage(prefix + PANS_TAG, 8, PANS_TAG);
    var pageEq = device.createCursorRemoteControlsPage(prefix + EQ_TAG, 8, EQ_TAG);
    setupPageObservers(pageMutes, prefix + MUTES_TAG);
    setupPageObservers(pageKill, prefix + KILL_TAG, 1);
    markPageParams(pageTrackKill, 8);
    setupPageObservers(pageDefault, prefix + DEFAULT_TAG);
    setupPageObservers(pageFaders, prefix + FADERS_TAG);
    setupPageObservers(pageVols, prefix + VOLS_TAG);
    setupPageObservers(pagePans, prefix + PANS_TAG);
    setupPageObservers(pageEq, prefix + EQ_TAG);

    var chainSelector = device.createChainSelector();
    chainSelector.exists().markInterested();
    chainSelector.chainCount().markInterested();
    chainSelector.activeChainIndex().markInterested();
    chainSelector.activeChainIndex().addValueObserver(function () {
        if (bottomMode === "A" || bottomMode === "B") {
            updateLowerButtonLEDs();
        }
    });
    chainSelector.chainCount().addValueObserver(function () {
        if (bottomMode === "B") {
            updateLowerButtonLEDs();
        }
    });

    var clipSlots = [];
    var clipLauncher = track.clipLauncherSlotBank();
    if (clipLauncher) {
        for (var c = 0; c < NUM_CLIPS; c++) {
            var clip = clipLauncher.getItemAt(c);
            clip.exists().markInterested();
            clip.hasContent().markInterested();
            clip.isPlaying().markInterested();
            clipSlots.push(clip);
            (function (clipIndex) {
                clip.isPlaying().addValueObserver(function (isPlaying) {
                    if (bottomMode !== "A" || !found) return;
                    var chainIndex = getActiveChainIndex();
                    if (Math.floor(clipIndex / BANK_SIZE) !== chainIndex) return;
                    var buttonIndex = clipIndex % BANK_SIZE;
                    setButtonLED(LOWER_BUTTON_NOTES[buttonIndex], isPlaying ? LED_STATE.ON : LED_STATE.OFF);
                });
            })(c);
        }
    }

    var numberedPages = [];    for (var k = 0; k < 8; k++) {
        var tag = PAGE_TAGS[k];
        var page = device.createCursorRemoteControlsPage(prefix + tag, 8, tag);
        setupPageObservers(page, prefix + tag);
        numberedPages.push(page);
    }

    return {
        device: device,
        prefix: prefix,
        pageMutes: pageMutes,
        pageKill: pageKill,
        pageTrackKill: pageTrackKill,
        pageDefault: pageDefault,
        pageFaders: pageFaders,
        pageVols: pageVols,
        pagePans: pagePans,
        pageEq: pageEq,
        numberedPages: numberedPages,
        chainSelector: chainSelector,
        clipSlots: clipSlots
    };
}
function setupPageObservers(page, id, paramCount) {
    var count = (paramCount !== undefined) ? paramCount : 8;
    for (var j = 0; j < count; j++) {
        var param = page.getParameter(j);
        param.exists().markInterested();
        (function (idx) {
            param.value().addValueObserver(function (value) {
                onParamValueChanged(id, idx, value);
            });
        })(j);
    }
    autoSelectPageWhenAvailable(page);
}

function markPageParams(page, count) {
    for (var i = 0; i < count; i++) {
        page.getParameter(i).exists().markInterested();
    }
    autoSelectPageWhenAvailable(page);
}
function autoSelectPageWhenAvailable(page) {
    page.selectedPageIndex().markInterested();
    page.pageCount().markInterested();
    page.pageCount().addValueObserver(function (count) {
        if (count > 0 && page.selectedPageIndex().get() < 0) {
            page.selectedPageIndex().set(0);
        }
    });
}

function findTrackIndex() {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === TARGET_TRACK_NAME.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function resolveTargetTrack(forceLog) {
    var idx = findTrackIndex();
    if (idx !== selectedIndex) {
        selectedIndex = idx;
        if (idx !== -1) {
            cursorTrack.selectChannel(detectBank.getItemAt(idx));
        }
    }

    var newFound = idx !== -1;
    if (forceLog || newFound !== found) {
        status("track " + (newFound ? (TARGET_TRACK_NAME + " @ index " + idx) : "NOT FOUND"));
    }
    if (newFound !== found) {
        found = newFound;
        updateLEDs();
    }
}

function currentEncoderPage() {
    if (!control) return null;
    if (selectedPageIndex === PAGE_INDEX_M0) return control.pageDefault;
    if (selectedPageIndex === PAGE_INDEX_FADERS) return control.pageFaders;
    if (selectedPageIndex === PAGE_INDEX_VOLS) return control.pageVols;
    if (selectedPageIndex === PAGE_INDEX_PANS) return control.pagePans;
    if (selectedPageIndex === PAGE_INDEX_EQ) return control.pageEq;
    if (selectedPageIndex >= 0 && selectedPageIndex < 8) {
        return control.numberedPages[selectedPageIndex];
    }
    return control.pageDefault;
}

function currentEncoderPageId() {
    if (!control) return null;
    return control.prefix + selectedPageTag();
}

function selectedPageTag() {
    if (selectedPageIndex === PAGE_INDEX_M0) return DEFAULT_TAG;
    if (selectedPageIndex === PAGE_INDEX_FADERS) return FADERS_TAG;
    if (selectedPageIndex === PAGE_INDEX_VOLS) return VOLS_TAG;
    if (selectedPageIndex === PAGE_INDEX_PANS) return PANS_TAG;
    if (selectedPageIndex === PAGE_INDEX_EQ) return EQ_TAG;
    if (selectedPageIndex >= 0 && selectedPageIndex < 8) return PAGE_TAGS[selectedPageIndex];
    return DEFAULT_TAG;
}

function getActiveChainIndex() {
    if (!control || !control.chainSelector.exists().get()) return 0;
    return control.chainSelector.activeChainIndex().get();
}

function getChainCount() {
    if (!control || !control.chainSelector.exists().get()) return 0;
    return control.chainSelector.chainCount().get();
}

function chainExists(chainIndex) {
    return chainIndex >= 0 && chainIndex < getChainCount();
}

function getClipIndexForButton(buttonIndex) {
    return getActiveChainIndex() * BANK_SIZE + buttonIndex;
}

function clipHasContent(clip) {
    return clip && clip.exists().get() && clip.hasContent().get();
}

function getChainKillParam(chainIndex) {
    if (!control || chainIndex < 0 || chainIndex >= MAX_CHAINS) return null;
    var param = control.pageTrackKill.getParameter(chainIndex);
    if (param && param.exists().get()) return param;
    return null;
}

function setChainKill(chainIndex, muted) {
    var param = getChainKillParam(chainIndex);
    if (param) param.setImmediately(muted ? 1 : 0);
}

function onParamValueChanged(id, paramIndex, value) {    if (!found || !control) return;
    if (id === control.prefix + MUTES_TAG) {
        updateUpperButtonLED(paramIndex, value);
        return;
    }
    if (id === currentEncoderPageId()) {
        updateLEDRing(paramIndex, value);
    }
}

function reportDebugStatus() {
    host.println("--- " + CURSOR_NAME + " ---");
    host.println("Track: " + (found ? ("index " + selectedIndex) : "NOT FOUND"));
    host.println("Bottom mode: " + bottomMode + ", page index: " + selectedPageIndex);
}

function onMidi(status, data1, data2) {
    var channel = status & 0x0F;
    var command = status & 0xF0;

    if (channel === INPUT_MIDI_CHANNEL) {
        log("midi ch=" + channel + " cmd=" + command + " d1=" + data1 + " d2=" + data2);

        if (command === 0xB0) {
            handleCC(data1, data2);
        } else if (command === 0x90 || command === 0x80) {
            handleNote(data1, (command === 0x90) && (data2 > 0));
        }
    } else if (channel === FADER_MIDI_CHANNEL && command === 0xE0) {
        handleFader((data2 << 7) | data1);
    }
}
function handleCC(cc, value) {
    if (cc < CC.ENCODER_1 || cc > CC.ENCODER_8) return;
    if (!found) return;
    var index = cc - CC.ENCODER_1;
    var increment = (value >= 1 && value <= 63) ? 1 : -1;
    var page = currentEncoderPage();
    if (!page) return;

    var param = page.getParameter(index);
    if (param && param.exists().get()) {
        param.inc(increment * ENCODER_SENSITIVITY, ENCODER_RESOLUTION);
    }
}

function handleFader(value) {
    if (!found || !control) return;
    var param = control.pageKill.getParameter(0);
    if (param && param.exists().get()) {
        param.setImmediately(1 - (value / 16383));
    }
}

function handleNote(note, isPressed) {
    var lowerIndex = LOWER_BUTTON_NOTES.indexOf(note);
    if (lowerIndex !== -1) {
        if (bottomMode === "zero") {
            if (isPressed) selectPage(lowerIndex);
        } else if (bottomMode === "A") {
            handleClipButton(lowerIndex, isPressed);
        } else if (bottomMode === "B") {
            if (isPressed) handleChainButton(lowerIndex);
        }
        return;
    }

    if (!isPressed) return;

    var upperIndex = UPPER_BUTTON_NOTES.indexOf(note);    if (upperIndex !== -1) {
        if (!found || !control) return;
        var muteParam = control.pageMutes.getParameter(upperIndex);
        if (muteParam && muteParam.exists().get()) {
            muteParam.setImmediately(muteParam.value().get() > 0.5 ? 0 : 1);
        }
        return;
    }

    if (note === NOTE.BUTTON_A) {
        bottomMode = (bottomMode === "A") ? "zero" : "A";
        updateLEDs();
        log("bottom mode: " + bottomMode);
        return;
    }
    if (note === NOTE.BUTTON_B) {
        bottomMode = (bottomMode === "B") ? "zero" : "B";
        updateLEDs();
        log("bottom mode: " + bottomMode);
        return;
    }

    var encoderPushIndex = ENCODER_PUSH_NOTES.indexOf(note);
    if (encoderPushIndex !== -1) {
        handleEncoderPush(encoderPushIndex);
    }
}

function handleEncoderPush(index) {
    if (index === 0) selectEncoderPage(PAGE_INDEX_FADERS);
    else if (index === 1) selectEncoderPage(PAGE_INDEX_VOLS);
    else if (index === 2) selectEncoderPage(PAGE_INDEX_PANS);
    else if (index === 3) selectEncoderPage(PAGE_INDEX_EQ);
    else if (index === 7) selectEncoderPage(PAGE_INDEX_M0);
}

function selectEncoderPage(pageIndex) {
    selectedPageIndex = pageIndex;
    log("encoder page: " + selectedPageTag());
    updateLEDs();
}

function selectPage(index) {
    if (selectedPageIndex === index) {
        selectEncoderPage(PAGE_INDEX_M0);
    } else {
        selectEncoderPage(index);
    }
}

function handleClipButton(buttonIndex, isPressed) {
    if (!found || !control) return;
    var clipIndex = getClipIndexForButton(buttonIndex);
    if (clipIndex < 0 || clipIndex >= NUM_CLIPS) return;
    var clip = control.clipSlots[clipIndex];
    if (!clip) return;
    var note = LOWER_BUTTON_NOTES[buttonIndex];

    if (isPressed) {
        if (!clipHasContent(clip)) return;
        if (clip.isPlaying().get()) {
            clipButtonStates[note] = { released: false, handled: false };
            host.scheduleTask(function () {
                checkClipLongPress(note, buttonIndex);
            }, LONG_PRESS_DELAY);
        } else {
            clip.launch();
        }
    } else if (clipButtonStates[note]) {
        clipButtonStates[note].released = true;
        if (!clipButtonStates[note].handled && clipHasContent(clip)) {
            clip.launch();
        }
        delete clipButtonStates[note];
    }
}

function checkClipLongPress(note, buttonIndex) {
    if (!clipButtonStates[note] || clipButtonStates[note].released) return;
    if (!found) return;
    var clipIndex = getClipIndexForButton(buttonIndex);
    var clip = control.clipSlots[clipIndex];
    if (clipHasContent(clip) && clip.isPlaying().get()) {
        cursorTrack.stop();
    }
    clipButtonStates[note].handled = true;
}

function handleChainButton(chainIndex) {
    if (!found || !control || !control.chainSelector.exists().get()) return;
    if (!chainExists(chainIndex)) return;

    var current = getActiveChainIndex();
    cursorTrack.stop();

    if (chainIndex !== current) {
        setChainKill(current, true);
        control.chainSelector.activeChainIndex().set(chainIndex);
        setChainKill(chainIndex, false);
        log("chain " + (current + 1) + " -> " + (chainIndex + 1));
    } else {
        setChainKill(chainIndex, false);
    }

    updateLowerButtonLEDs();
}

function updateLowerButtonLEDs() {
    if (bottomMode === "B") {
        var activeChain = getActiveChainIndex();
        var chainCount = getChainCount();
        for (var b = 0; b < 8; b++) {
            var lit = (b < chainCount) && (b === activeChain);
            setButtonLED(LOWER_BUTTON_NOTES[b], lit ? LED_STATE.ON : LED_STATE.OFF);
        }
        return;
    }

    if (bottomMode === "A") {
        var chainIndex = getActiveChainIndex();
        for (var k = 0; k < 8; k++) {
            var clip = control ? control.clipSlots[chainIndex * BANK_SIZE + k] : null;
            var playing = clipHasContent(clip) && clip.isPlaying().get();
            setButtonLED(LOWER_BUTTON_NOTES[k], playing ? LED_STATE.ON : LED_STATE.OFF);
        }
        return;
    }

    if (bottomMode !== "zero") {
        for (var i = 0; i < 8; i++) {
            setButtonLED(LOWER_BUTTON_NOTES[i], LED_STATE.OFF);
        }
        return;
    }

    for (var j = 0; j < 8; j++) {
        setButtonLED(LOWER_BUTTON_NOTES[j], (selectedPageIndex === j) ? LED_STATE.ON : LED_STATE.OFF);
    }
}
function updateLEDs() {
    updateLowerButtonLEDs();
    setButtonLED(NOTE.BUTTON_A, (bottomMode === "A") ? LED_STATE.ON : LED_STATE.OFF);
    setButtonLED(NOTE.BUTTON_B, (bottomMode === "B") ? LED_STATE.ON : LED_STATE.OFF);

    var page = currentEncoderPage();
    for (var i = 0; i < 8; i++) {
        if (page) {
            var param = page.getParameter(i);
            if (param && param.exists().get()) {
                updateLEDRing(i, param.value().get());
            } else {
                setLEDRingValue(i, 0);
            }
        } else {
            setLEDRingValue(i, 0);
        }
    }

    if (found && control) {
        for (var m = 0; m < 8; m++) {
            var mp = control.pageMutes.getParameter(m);
            if (mp && mp.exists().get()) {
                updateUpperButtonLED(m, mp.value().get());
            } else {
                setButtonLED(UPPER_BUTTON_NOTES[m], LED_STATE.OFF);
            }
        }
    } else {
        for (var n = 0; n < 8; n++) {
            setButtonLED(UPPER_BUTTON_NOTES[n], LED_STATE.OFF);
        }
    }
}

function updateUpperButtonLED(index, value) {
    setButtonLED(UPPER_BUTTON_NOTES[index], (value > 0.5) ? LED_STATE.ON : LED_STATE.OFF);
}

function updateLEDRing(index, value) {
    var position = Math.floor(value * 11);
    if (position > 11) position = 11;
    setLEDRingValue(index, position + 32);
}

function setLEDRingValue(index, value) {
    midiOut.sendMidi(0xB0 + OUTPUT_MIDI_CHANNEL, CC.LED_RING_1 + index, value);
}

function setButtonLED(note, state) {
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, state);
}

function flush() {}

function exit() {
    log("exited");
}
