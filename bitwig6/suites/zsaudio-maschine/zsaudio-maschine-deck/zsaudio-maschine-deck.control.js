loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "ZSAudio Maschine Deck",
    "0.1",
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

var DEBUG = false;
var DECK_TRACK_NAME = "DECK A";
var CURSOR_ID = "maschine-deck";
var CURSOR_NAME = "Maschine Deck";
var FLAT_BANK_SIZE = 256;

var NUM_COLUMNS = 8;
var NUM_ROWS = 3;
var DECK_FILTER_PAGE_PARAMS = 7;
var DRUMS_COLUMNAR_PAGE_PARAMS = 7;
var DRUMS_COLUMNAR_2_PARAM_OFFSET = 4;
var DRUMS_MIXER_PAGE_PARAMS = 8;
var DRUMS_MIXER_TAGS = ["faders", "eq", "pans"];
var DECK_FILTER_PAGE_TAG_PREFIX = "p";
var VOLUMES_TAG = "volumes";
var DECK_P0_TAG = "p0";
var LOOPS_GROUP_NAME = "Loops";
var LOOPS_CHILD_PERF_TAG = "perf";
var LOOPS_CHILD_PERF_PARAMS = 3;

// LCXL3 Custom Mode MIDI channels (0-based)
var CH_MAIN_DRUMS_1 = 0;
var CH_MAIN_DRUMS_2 = 1;
var CH_MAIN_DRUMS_3 = 2;
var CH_LOOPS_1 = 3;
var CH_LOOPS_2 = 4;
var CH_LOOPS_3 = 5;
var CH_DECK_FILTER = 6;
var CH_DECK_FILTER_2 = 7;
var CH_GROOVE_DRUMS_1 = 8;
var CH_GROOVE_DRUMS_2 = 9;
var CH_GROOVE_DRUMS_3 = 10;
var CH_MACHINE_1 = 11;
var CH_MACHINE_2 = 12;
var CH_MACHINE_3 = 13;
var CH_DECK_P0 = 14;
var CH_LOOPS_CHILD_PERF = 15;
var MACHINE_TRACK_NAME = "Maschine";
var DECK_FILTER_PARAM_OFFSET = 0;
var DECK_FILTER_2_PARAM_OFFSET = 4;

// Custom Modes 1–16 (one MIDI channel each, 0-based). Mode 16 uses LCXL3 factory CC map on channel 16.
var ENCODER_MODE_CHANNELS = [
    CH_MAIN_DRUMS_1, CH_MAIN_DRUMS_2, CH_MAIN_DRUMS_3,
    CH_LOOPS_1, CH_LOOPS_2, CH_LOOPS_3,
    CH_DECK_FILTER, CH_DECK_FILTER_2,
    CH_GROOVE_DRUMS_1, CH_GROOVE_DRUMS_2, CH_GROOVE_DRUMS_3,
    CH_MACHINE_1, CH_MACHINE_2, CH_MACHINE_3,
    CH_DECK_P0,
    CH_LOOPS_CHILD_PERF,
];

var CC = {
    ENC_ROW_0: 13, ENC_ROW_1: 21, ENC_ROW_2: 29,
    FADER1: 5,
};

var midiIn, midiOut;
var detectBank = null;
var cursorDeckTrack = null;
var deckFound = false;
var deckSelectedIndex = -1;
var deckDevice = null;
var volumesPage = null;
var deckP0Page = null;
var deckFilterPages = [];
var loopsChildPerfPages = [];
var drumsBindings = [];
var lastEncoderMidiChannel = -1;
// LCXL3 Custom Mode encoders are absolute CC only (Novation). Track last CC per control and use
// delta steps (same idea as XTM relative inc), not param.set(position), to avoid cross-mode jumps.
var ENCODER_ALIGN_TOLERANCE = 2;
var lastEncoderMidiByKey = {};

function createDrumsBinding(trackName, cursorId, cursorName, idPrefix, columnarTagPrefix, ch1, ch2, ch3) {
    return {
        trackName: trackName,
        cursorId: cursorId,
        cursorName: cursorName,
        idPrefix: idPrefix,
        columnarTagPrefix: columnarTagPrefix,
        chColumnar1: ch1,
        chColumnar2: ch2,
        chHorizontal: ch3,
        cursor: null,
        device: null,
        columnarPages: [],
        mixerPages: [],
        found: false,
        selectedIndex: -1,
    };
}

function init() {
    drumsBindings = [
        createDrumsBinding(
            "Main Drums", "maschine-deck-main-drums", "Maschine Deck Main Drums",
            "main-", "m", CH_MAIN_DRUMS_1, CH_MAIN_DRUMS_2, CH_MAIN_DRUMS_3
        ),
        createDrumsBinding(
            "Loops", "maschine-deck-loops", "Maschine Deck Loops",
            "loops-", "p", CH_LOOPS_1, CH_LOOPS_2, CH_LOOPS_3
        ),
        createDrumsBinding(
            "Groove Drums", "maschine-deck-groove-drums", "Maschine Deck Groove Drums",
            "groove-", "m", CH_GROOVE_DRUMS_1, CH_GROOVE_DRUMS_2, CH_GROOVE_DRUMS_3
        ),
        createDrumsBinding(
            MACHINE_TRACK_NAME, "maschine-deck-machine", "Maschine Deck Machine",
            "machine-", "p", CH_MACHINE_1, CH_MACHINE_2, CH_MACHINE_3
        ),
    ];

    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    cursorDeckTrack = host.createCursorTrack(CURSOR_ID, CURSOR_NAME, 0, 0, false);
    cursorDeckTrack.isPinned().markInterested();

    for (var d = 0; d < drumsBindings.length; d++) {
        var binding = drumsBindings[d];
        binding.cursor = host.createCursorTrack(binding.cursorId, binding.cursorName, 0, 0, false);
        binding.cursor.isPinned().markInterested();
        setupDrumsDevice(binding);
    }

    setupLoopsChildPerfPages(loopsGroupCursor());

    setupDeckDevice();
    setupDetection();

    host.scheduleTask(function () {
        cursorDeckTrack.isPinned().set(true);
        for (d = 0; d < drumsBindings.length; d++) {
            drumsBindings[d].cursor.isPinned().set(true);
        }
        resolveTargetTracks(true);
        refreshAllEncoderLeds();
    }, 200);

    host.scheduleTask(function () {
        refreshAllEncoderLeds();
    }, 1000);

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
        t.exists().addValueObserver(function () { resolveTargetTracks(); });
        t.name().addValueObserver(function () { resolveTargetTracks(); });
    }
}

function drumsBindingForColumnarPages(pagesRef) {
    for (var i = 0; i < drumsBindings.length; i++) {
        if (drumsBindings[i].columnarPages === pagesRef) {
            return drumsBindings[i];
        }
    }
    return null;
}

function loopsGroupCursor() {
    for (var i = 0; i < drumsBindings.length; i++) {
        if (drumsBindings[i].trackName === LOOPS_GROUP_NAME) {
            return drumsBindings[i].cursor;
        }
    }
    return null;
}

function loopsGroupFound() {
    for (var i = 0; i < drumsBindings.length; i++) {
        if (drumsBindings[i].trackName === LOOPS_GROUP_NAME) {
            return drumsBindings[i].found;
        }
    }
    return false;
}

function setupLoopsChildPerfPages(loopsCursor) {
    if (!loopsCursor) {
        return;
    }
    var childBank = loopsCursor.createTrackBank(NUM_COLUMNS, 0, 0, false);
    loopsChildPerfPages = [];
    for (var col = 0; col < NUM_COLUMNS; col++) {
        var child = childBank.getItemAt(col);
        child.exists().markInterested();
        var device = child.createDeviceBank(1).getDevice(0);
        device.exists().markInterested();
        device.name().markInterested();
        device.exists().addValueObserver(function (exists) {
            if (exists) {
                refreshAllEncoderLeds();
            }
        });
        var page = device.createCursorRemoteControlsPage(
            "loops-child-" + col + "-" + LOOPS_CHILD_PERF_TAG,
            LOOPS_CHILD_PERF_PARAMS,
            LOOPS_CHILD_PERF_TAG
        );
        markPageParams(page, LOOPS_CHILD_PERF_PARAMS);
        setupEncoderLedObservers(col, page, loopsChildPerfPages, encoderLedRoutesForPage(loopsChildPerfPages));
        loopsChildPerfPages[col] = page;
    }
}

function setupTaggedPages(device, idPrefix, tagPrefix, pageCount, paramsPerPage, pagesOut) {
    for (var col = 0; col < pageCount; col++) {
        var tag = tagPrefix + (col + 1);
        var page = device.createCursorRemoteControlsPage(idPrefix + tag, paramsPerPage, tag);
        markPageParams(page, paramsPerPage);
        setupEncoderLedObservers(col, page, pagesOut, encoderLedRoutesForPage(pagesOut));
        pagesOut[col] = page;
    }
}

function encoderLedRoutesForPage(pagesRef) {
    var drums = drumsBindingForColumnarPages(pagesRef);
    if (drums) {
        return [
            { channel: drums.chColumnar1, params: [0, 1, 2] },
            { channel: drums.chColumnar2, params: [4, 5, 6] },
        ];
    }
    if (pagesRef === deckFilterPages) {
        return [
            { channel: CH_DECK_FILTER, params: [0, 1, 2] },
            { channel: CH_DECK_FILTER_2, params: [4, 5, 6] },
        ];
    }
    if (pagesRef === loopsChildPerfPages) {
        return [
            { channel: CH_LOOPS_CHILD_PERF, params: [0, 1, 2] },
        ];
    }
    return [];
}

function setupDeckDevice() {
    var devBank = cursorDeckTrack.createDeviceBank(1);
    deckDevice = devBank.getDevice(0);
    deckDevice.exists().markInterested();
    deckDevice.name().markInterested();
    deckDevice.exists().addValueObserver(function (exists) {
        if (exists) {
            refreshAllEncoderLeds();
        }
    });

    volumesPage = deckDevice.createCursorRemoteControlsPage(
        "deck-" + VOLUMES_TAG, NUM_COLUMNS, VOLUMES_TAG
    );
    markPageParams(volumesPage, NUM_COLUMNS);

    deckP0Page = deckDevice.createCursorRemoteControlsPage(
        "deck-" + DECK_P0_TAG, NUM_COLUMNS, DECK_P0_TAG
    );
    markPageParams(deckP0Page, NUM_COLUMNS);
    setupDeckP0EncoderLedObservers(deckP0Page);

    setupTaggedPages(
        deckDevice,
        "deck-",
        DECK_FILTER_PAGE_TAG_PREFIX,
        NUM_COLUMNS,
        DECK_FILTER_PAGE_PARAMS,
        deckFilterPages
    );
}

function setupDrumsDevice(binding) {
    var devBank = binding.cursor.createDeviceBank(1);
    binding.device = devBank.getDevice(0);
    binding.device.exists().markInterested();
    binding.device.name().markInterested();
    binding.device.exists().addValueObserver(function (exists) {
        if (exists) {
            refreshAllEncoderLeds();
        }
    });

    setupTaggedPages(
        binding.device,
        binding.idPrefix,
        binding.columnarTagPrefix,
        NUM_COLUMNS,
        DRUMS_COLUMNAR_PAGE_PARAMS,
        binding.columnarPages
    );

    for (var row = 0; row < DRUMS_MIXER_TAGS.length; row++) {
        var mixerTag = DRUMS_MIXER_TAGS[row];
        var mixerPage = binding.device.createCursorRemoteControlsPage(
            binding.idPrefix + "mixer-" + mixerTag, DRUMS_MIXER_PAGE_PARAMS, mixerTag
        );
        markPageParams(mixerPage, DRUMS_MIXER_PAGE_PARAMS);
        setupHorizontalEncoderLedObservers(binding, row, mixerPage);
        binding.mixerPages[row] = mixerPage;
    }
}

function setupDeckP0EncoderLedObservers(page) {
    for (var col = 0; col < NUM_COLUMNS; col++) {
        (function (column, p0Page) {
            var param = p0Page.getParameter(column);
            param.value().addValueObserver(function () {
                refreshDeckP0EncoderLeds();
            });
            param.exists().addValueObserver(function () {
                refreshDeckP0EncoderLeds();
            });
        })(col, page);
    }
}

function refreshDeckP0EncoderLeds() {
    var col;
    if (!deckFound || !deckP0Page) {
        return;
    }
    for (col = 0; col < NUM_COLUMNS; col++) {
        sendEncoderLed(
            CH_DECK_P0, 0, col,
            paramLedValue(deckP0Page.getParameter(col))
        );
    }
}

function setupHorizontalEncoderLedObservers(binding, row, page) {
    for (var col = 0; col < NUM_COLUMNS; col++) {
        (function (drumsBinding, encoderRow, column, mixerPage) {
            var param = mixerPage.getParameter(column);
            param.value().addValueObserver(function () {
                updateHorizontalEncoderLed(drumsBinding, encoderRow, column, mixerPage);
            });
            param.exists().addValueObserver(function () {
                updateHorizontalEncoderLed(drumsBinding, encoderRow, column, mixerPage);
            });
        })(binding, row, col, page);
    }
}

function setupEncoderLedObservers(column, page, pagesRef, channelParamRanges) {
    for (var r = 0; r < channelParamRanges.length; r++) {
        var range = channelParamRanges[r];
        for (var row = 0; row < range.params.length; row++) {
            (function (col, pIdx, bank) {
                var param = page.getParameter(pIdx);
                param.value().addValueObserver(function () {
                    updateEncoderLed(col, pIdx, bank);
                });
                param.exists().addValueObserver(function () {
                    updateEncoderLed(col, pIdx, bank);
                });
            })(column, range.params[row], pagesRef);
        }
    }
}

function encoderCc(row, column) {
    return CC.ENC_ROW_0 + row * 8 + column;
}

function sendEncoderLed(channel, row, column, value127) {
    midiOut.sendMidi(0xB0 + channel, encoderCc(row, column), value127);
}

function ledRouteForParam(pagesRef, paramIndex) {
    var ranges = encoderLedRoutesForPage(pagesRef);
    for (var r = 0; r < ranges.length; r++) {
        var range = ranges[r];
        for (var row = 0; row < range.params.length; row++) {
            if (range.params[row] === paramIndex) {
                return { channel: range.channel, row: row };
            }
        }
    }
    return null;
}

function normalizedToMidi(value) {
    var v = Math.round(value * 127);
    if (v < 0) {
        return 0;
    }
    if (v > 127) {
        return 127;
    }
    return v;
}

function paramIsMapped(param) {
    return param && param.exists().get();
}

function paramLedValue(param) {
    if (!paramIsMapped(param)) {
        return 0;
    }
    return normalizedToMidi(param.value().get());
}

function updateHorizontalEncoderLed(binding, row, column, page) {
    if (!binding.found || !page) {
        return;
    }
    sendEncoderLed(
        binding.chHorizontal, row, column,
        paramLedValue(page.getParameter(column))
    );
}

function refreshDrumsMixerEncoderLeds(binding) {
    var row;
    var col;
    for (row = 0; row < binding.mixerPages.length; row++) {
        var page = binding.mixerPages[row];
        if (!page) {
            continue;
        }
        for (col = 0; col < NUM_COLUMNS; col++) {
            updateHorizontalEncoderLed(binding, row, col, page);
        }
    }
}

function updateEncoderLed(column, paramIndex, pagesRef) {
    var mapping = ledRouteForParam(pagesRef, paramIndex);
    if (!mapping) {
        return;
    }
    if (pagesRef === deckFilterPages && !deckFound) {
        return;
    }
    if (pagesRef === loopsChildPerfPages && !loopsGroupFound()) {
        return;
    }
    var drums = drumsBindingForColumnarPages(pagesRef);
    if (drums && !drums.found) {
        return;
    }
    var page = pagesRef[column];
    if (!page) {
        return;
    }
    sendEncoderLed(
        mapping.channel, mapping.row, column,
        paramLedValue(page.getParameter(paramIndex))
    );
}

function refreshChannelEncoderLeds(channel) {
    var mode = encoderModeForChannel(channel);
    if (!mode || !mode.trackReady) {
        return;
    }
    if (mode.layout === "horizontal") {
        if (mode.deckP0) {
            refreshDeckP0EncoderLeds();
        } else {
            refreshDrumsMixerEncoderLeds(mode.drumsBinding);
        }
        return;
    }
    for (var col = 0; col < NUM_COLUMNS; col++) {
        for (var row = 0; row < NUM_ROWS; row++) {
            updateEncoderLed(col, mode.paramOffset + row, mode.pages);
        }
    }
}

function refreshAllEncoderLeds() {
    var col;
    var p;
    var d;
    for (col = 0; col < NUM_COLUMNS; col++) {
        for (p = 0; p < DECK_FILTER_PAGE_PARAMS; p++) {
            updateEncoderLed(col, p, deckFilterPages);
        }
        for (d = 0; d < drumsBindings.length; d++) {
            for (p = 0; p < DRUMS_COLUMNAR_PAGE_PARAMS; p++) {
                updateEncoderLed(col, p, drumsBindings[d].columnarPages);
            }
        }
        for (p = 0; p < LOOPS_CHILD_PERF_PARAMS; p++) {
            updateEncoderLed(col, p, loopsChildPerfPages);
        }
    }
    for (d = 0; d < drumsBindings.length; d++) {
        refreshDrumsMixerEncoderLeds(drumsBindings[d]);
    }
    refreshDeckP0EncoderLeds();
}

function encoderModeForChannel(channel) {
    var i;
    var binding;
    for (i = 0; i < drumsBindings.length; i++) {
        binding = drumsBindings[i];
        if (channel === binding.chColumnar1) {
            return {
                layout: "columnar",
                pages: binding.columnarPages,
                paramOffset: 0,
                trackReady: binding.found,
            };
        }
        if (channel === binding.chColumnar2) {
            return {
                layout: "columnar",
                pages: binding.columnarPages,
                paramOffset: DRUMS_COLUMNAR_2_PARAM_OFFSET,
                trackReady: binding.found,
            };
        }
        if (channel === binding.chHorizontal) {
            return {
                layout: "horizontal",
                pages: binding.mixerPages,
                trackReady: binding.found,
                drumsBinding: binding,
            };
        }
    }
    if (channel === CH_DECK_FILTER) {
        return {
            layout: "columnar",
            pages: deckFilterPages,
            paramOffset: DECK_FILTER_PARAM_OFFSET,
            trackReady: deckFound,
        };
    }
    if (channel === CH_DECK_FILTER_2) {
        return {
            layout: "columnar",
            pages: deckFilterPages,
            paramOffset: DECK_FILTER_2_PARAM_OFFSET,
            trackReady: deckFound,
        };
    }
    if (channel === CH_DECK_P0) {
        return {
            layout: "horizontal",
            pages: [deckP0Page],
            trackReady: deckFound,
            deckP0: true,
        };
    }
    if (channel === CH_LOOPS_CHILD_PERF) {
        return {
            layout: "columnar",
            pages: loopsChildPerfPages,
            paramOffset: 0,
            trackReady: loopsGroupFound(),
        };
    }
    return null;
}

function markPageParams(page, count) {
    for (var i = 0; i < count; i++) {
        var param = page.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
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
        if (count > 0) {
            refreshAllEncoderLeds();
        }
    });
}

function findTrackIndex(name) {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = detectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === name.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function resolveTargetTracks(forceLog) {
    var deckIdx = findTrackIndex(DECK_TRACK_NAME);
    if (deckIdx !== deckSelectedIndex) {
        deckSelectedIndex = deckIdx;
        if (deckIdx !== -1) {
            cursorDeckTrack.selectChannel(detectBank.getItemAt(deckIdx));
        }
    }

    var newDeckFound = deckIdx !== -1;
    if (forceLog || newDeckFound !== deckFound) {
        status("deck " + (newDeckFound ? (DECK_TRACK_NAME + " @ " + deckIdx) : "NOT FOUND"));
    }

    var anyDrumsNewlyFound = false;
    for (var d = 0; d < drumsBindings.length; d++) {
        var binding = drumsBindings[d];
        var idx = findTrackIndex(binding.trackName);
        if (idx !== binding.selectedIndex) {
            binding.selectedIndex = idx;
            if (idx !== -1) {
                binding.cursor.selectChannel(detectBank.getItemAt(idx));
            }
        }
        var newFound = idx !== -1;
        if (forceLog || newFound !== binding.found) {
            status(binding.trackName.toLowerCase() + " " +
                (newFound ? ("@ " + idx) : "NOT FOUND"));
        }
        if (newFound && !binding.found) {
            anyDrumsNewlyFound = true;
        }
        binding.found = newFound;
    }

    if ((newDeckFound && !deckFound) || anyDrumsNewlyFound) {
        refreshAllEncoderLeds();
    }
    deckFound = newDeckFound;
}

function onMidi(status, data1, data2) {
    var msgType = status & 0xF0;
    var channel = status & 0x0F;
    if (msgType !== 0xB0) {
        return;
    }
    handleCC(channel, data1, data2);
}

function handleCC(channel, cc, value) {
    if (cc >= CC.FADER1 && cc < CC.FADER1 + NUM_COLUMNS) {
        handleFader(cc - CC.FADER1, value);
        return;
    }

    var mode = encoderModeForChannel(channel);
    if (!mode) {
        return;
    }

    if (channel !== lastEncoderMidiChannel) {
        onEncoderMidiChannelChange(lastEncoderMidiChannel, channel);
        lastEncoderMidiChannel = channel;
        refreshChannelEncoderLeds(channel);
    }

    var row = encoderRowFromCC(cc);
    if (row < 0) {
        return;
    }

    var column = cc - (CC.ENC_ROW_0 + row * 8);
    if (column < 0 || column >= NUM_COLUMNS) {
        return;
    }

    applyEncoderMidi(channel, row, column, cc, value, mode);
}

function encoderRowFromCC(cc) {
    for (var row = 0; row < NUM_ROWS; row++) {
        var rowStart = CC.ENC_ROW_0 + row * 8;
        if (cc >= rowStart && cc < rowStart + NUM_COLUMNS) {
            return row;
        }
    }
    return -1;
}

function encoderStateKey(channel, cc) {
    return channel + ":" + cc;
}

function clearEncoderMidiHistoryForChannel(channel) {
    var prefix = channel + ":";
    var key;
    for (key in lastEncoderMidiByKey) {
        if (key.indexOf(prefix) === 0) {
            delete lastEncoderMidiByKey[key];
        }
    }
}

function onEncoderMidiChannelChange(previousChannel, channel) {
    if (previousChannel >= 0 && encoderModeForChannel(previousChannel)) {
        clearEncoderMidiHistoryForChannel(previousChannel);
    }
    if (encoderModeForChannel(channel)) {
        clearEncoderMidiHistoryForChannel(channel);
    }
}

function resolveEncoderParam(mode, column, row) {
    var page;
    if (mode.layout === "horizontal") {
        page = mode.pages[row];
        if (!page) {
            return null;
        }
        return page.getParameter(column);
    }
    page = mode.pages[column];
    if (!page) {
        return null;
    }
    return page.getParameter(mode.paramOffset + row);
}

function encoderDelta(previousMidi, midiValue) {
    var delta = midiValue - previousMidi;
    if (delta > 64) {
        delta -= 127;
    } else if (delta < -64) {
        delta += 127;
    }
    return delta;
}

function applyEncoderMidi(channel, row, column, cc, midiValue, mode) {
    if (!mode.trackReady) {
        return;
    }
    var param = resolveEncoderParam(mode, column, row);
    if (!paramIsMapped(param)) {
        return;
    }
    var key = encoderStateKey(channel, cc);
    var expectedMidi = paramLedValue(param);
    var previousMidi = lastEncoderMidiByKey[key];

    if (previousMidi === undefined) {
        lastEncoderMidiByKey[key] = midiValue;
        sendEncoderLed(channel, row, column, expectedMidi);
        if (Math.abs(midiValue - expectedMidi) <= ENCODER_ALIGN_TOLERANCE) {
            param.set(midiValue / 127.0);
        }
        return;
    }

    if (midiValue === previousMidi) {
        return;
    }

    lastEncoderMidiByKey[key] = midiValue;
    var delta = encoderDelta(previousMidi, midiValue);
    if (delta !== 0) {
        param.inc(delta / 127.0);
    }
}

function handleFader(column, value) {
    if (!deckFound || !volumesPage) {
        return;
    }
    var param = volumesPage.getParameter(column);
    if (!paramIsMapped(param)) {
        return;
    }
    param.set(value / 127.0);
}

function flush() {}

function exit() {
    log("exited");
}
