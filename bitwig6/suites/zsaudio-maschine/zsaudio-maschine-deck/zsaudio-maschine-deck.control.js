loadAPI(25);
host.setShouldFailOnDeprecatedUse(true);

host.defineController(
    "Novation",
    "ZSAudio Maschine Deck",
    "0.1",
    "d3aad263-b2ee-4aa4-9466-004d7818b938",
    "Zsolt"
);

host.defineMidiPorts(1, 1);

var DEBUG = true;
var DECK_TRACK_NAME = "DECK A";
var NANO_TRACK_NAME = "NANO";
var CURSOR_ID = "maschine-deck";
var CURSOR_NAME = "Maschine Deck";
var CURSOR_NANO_ID = "maschine-deck-nano";
var CURSOR_NANO_NAME = "Maschine Deck Nano";
var FLAT_BANK_SIZE = 256;

var NUM_COLUMNS = 8;
var NUM_ROWS = 3;
var DECK_PAGE_PARAMS = 7;
var DRUMS_COLUMNAR_PAGE_PARAMS = 7;
var DRUMS_COLUMNAR_2_PARAM_OFFSET = 4;
var DRUMS_COLUMNAR_1_PARAM_OFFSET = 0;
var COLUMNAR_TAG_PREFIX = "m";
var COLUMNAR_U_TAG_PREFIX = "u";
var FADERS_TAG = "faders";

var DECK_SET1_TAGS = [
    "xtm1-mix", "xtm2-mix", "nano-mix", "maschine-mix",
    "fx1-mix", "fx2-mix", "fx3-mix", "master-mix",
];
var DECK_UTIL_TAGS = [
    "xtm1-util", "xtm2-util", "nano-util", "maschine-util",
    "fx1-util", "fx2-util", "fx3-util", "master-util",
];
var DECK_SET3_TAGS = ["eq-gain", "eq-freq", "eq-q", "comp", "sidechain"];
var DECK_SET3_SIDECHAIN_INDEX = 4;
var DECK_EQ_COMP_EQ_PARAMS = 5;
var DECK_EQ_COMP_COMP_PARAMS = 6;
var DECK_EQ_COMP_SIDECHAIN_PARAMS = 3;

var PARAMETRIC_BANDS = 5;
var PARAMETRIC_GROUP_COUNT = 4;
var PARAMETRIC_PAGE_TAGS = ["eq-gain", "eq-freq", "eq-q"];

var EQ_DJ_GROUP_COUNT = 4;
var EQ_DJ_BANDS = 3;
var EQ_DJ_PARAM_OFFSET = 0;
var PANS_TAG = "pans";
var PAN_PARAMS = 8;
var PAN_ROWS = 1;
var UTIL_GROUP_COUNT = 4;
var UTIL_ROWS = 3;
// Remote slots 5–7: gain, sidechain, width. XTM1 and XTM2 have no util pages.
var UTIL_PARAM_OFFSET = 4;
var UTIL_DEFAULT_GROUP = 2;
// Toggle press latches that button. CC 0 does not release it.
// One CC 127 on that button's MIDI channel does. Do not send it on every channel.
var LCXL3_BUTTON_LED_ON = 127;
var LCXL3_BUTTON_LED_OFF = 0;
// LCXL3 Custom Mode MIDI channels (0-based). Mode number = channel + 1.
// Full map: `../lcxl3/mode-map.md`. Names match `lcxl3/<N> - <Title>.syx`.
var CH_NANO_FILTER = 2;       // 3 — NANO Filter (perf)
var CH_MACHINE_FILTER = 3;    // 4 — MASCHINE Filter (perf)
var CH_DECK_FILTER = 4;       // 5 — DECK Filter (perf)
var CH_UTIL = 5;              // 6 — Util (edit)
var CH_GROUP_CONTROL = 6;     // 7 — Group Control (edit)
var CH_PAN = 7;               // 8 — Pan (edit)
var CH_DECK_SENDS = 12;       // 13 — DECK Sends (perf)
var CH_EQ_DJ = 14;            // 15 — EQ-DJ (edit)
var CH_DECK_MASTER = 15;        // 16 — DECK Master (edit)
var CH_XTM1_SENDS = 8;        // 9 — XTM1 Sends (perf)
var CH_XTM2_SENDS = 9;        // 10 — XTM2 Sends (perf)
var CH_NANO_SENDS = 10;       // 11 — NANO Sends (perf)
var CH_MACHINE_SENDS = 11;    // 12 — MASCHINE Sends (perf)
var CH_UNUSED = -1;
// Log encoder handling for one LCXL3 mode only, or -1 for every mapped mode.
var DEBUG_FOCUS_CHANNEL = CH_DECK_MASTER;

var CC = {
    ENC_ROW_0: 13, ENC_ROW_1: 21, ENC_ROW_2: 29,
    FADER1: 5,
    BUTTON_FIRST: 37,
    BUTTON_LAST: 52,
};

var midiIn, midiOut;
var detectBank = null;
var cursorDeckTrack = null;
var cursorNanoTrack = null;
var deckFound = false;
var deckSelectedIndex = -1;
var nanoFound = false;
var nanoSelectedIndex = -1;
var fadersPage = null;
var deckSet1Pages = [];
var deckUtilPages = [];
var deckSet3Pages = [];
var nanoMPages = [];
var nanoUPages = [];
var drumsBindings = [];
var parametricBindings = [];
var parametricSelectedGroupIndex = 0;
var groupControlTopOn = [false, false, false, false, false, false, false, false];
var groupControlEnterPending = false;
var machineEqDjUPages = [];
var eqDjGroupPages = [];
var eqDjSelectedGroupIndex = 0;
var eqDjTopOn = [false, false, false, false, false, false, false, false];
var eqDjEnterPending = false;
var panGroupPages = [];
var panSelectedGroupIndex = 0;
var panTopOn = [false, false, false, false, false, false, false, false];
var panEnterPending = false;
var utilGroupPages = [];
var utilSelectedGroupIndex = UTIL_DEFAULT_GROUP;
var utilTopOn = [false, false, false, false, false, false, false, false];
var utilEnterPending = false;
var lastEncoderMidiChannel = -1;
var lastEncoderMidiByKey = {};
var debugOnceKeys = {};

function createDrumsBinding(trackName, cursorId, cursorName, idPrefix, chEq, chSends) {
    return {
        trackName: trackName,
        cursorId: cursorId,
        cursorName: cursorName,
        idPrefix: idPrefix,
        chColumnar1: chEq,
        chColumnar2: chSends,
        cursor: null,
        device: null,
        columnarPages: [],
        found: false,
        selectedIndex: -1,
    };
}

function init() {
    drumsBindings = [
        createDrumsBinding(
            "XTM1", "maschine-deck-xtm1", "Maschine Deck XTM1",
            "xtm1-", CH_UNUSED, CH_XTM1_SENDS
        ),
        createDrumsBinding(
            "XTM2", "maschine-deck-xtm2", "Maschine Deck XTM2",
            "xtm2-", CH_UNUSED, CH_XTM2_SENDS
        ),
        createDrumsBinding(
            "MASCHINE", "maschine-deck-machine", "Maschine Deck Machine",
            "machine-", CH_MACHINE_FILTER, CH_MACHINE_SENDS
        ),
    ];

    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    cursorDeckTrack = host.createCursorTrack(CURSOR_ID, CURSOR_NAME, 0, 0, false);
    cursorDeckTrack.isPinned().markInterested();
    cursorNanoTrack = host.createCursorTrack(CURSOR_NANO_ID, CURSOR_NANO_NAME, 0, 0, false);
    cursorNanoTrack.isPinned().markInterested();

    for (var d = 0; d < drumsBindings.length; d++) {
        var binding = drumsBindings[d];
        binding.cursor = host.createCursorTrack(binding.cursorId, binding.cursorName, 0, 0, false);
        binding.cursor.isPinned().markInterested();
        setupDrumsRemotes(binding);
    }

    setupDeckRemotes();
    setupNanoRemotes();
    setupParametricBindings();
    setupEqDjRemotes();
    setupPanRemotes();
    setupUtilRemotes();
    setupDetection();

    host.scheduleTask(function () {
        cursorDeckTrack.isPinned().set(true);
        cursorNanoTrack.isPinned().set(true);
        for (d = 0; d < drumsBindings.length; d++) {
            drumsBindings[d].cursor.isPinned().set(true);
        }
        resolveTargetTracks(true);
        refreshAllEncoderLeds();
    }, 200);

    host.scheduleTask(function () {
        refreshAllEncoderLeds();
    }, 1000);

    host.scheduleTask(function () {
        refreshAllEncoderLeds();
    }, 3000);

    if (DEBUG) {
        var focus = DEBUG_FOCUS_CHANNEL < 0
            ? "all mapped modes"
            : encoderModeLabel(DEBUG_FOCUS_CHANNEL);
        status("debug on — encoder focus: " + focus);
    }
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

function shouldLogEncoderChannel(channel) {
    if (!DEBUG) {
        return false;
    }
    if (DEBUG_FOCUS_CHANNEL < 0) {
        return true;
    }
    return channel === DEBUG_FOCUS_CHANNEL;
}

function logOnce(key, message) {
    if (!DEBUG) {
        return;
    }
    if (debugOnceKeys[key]) {
        return;
    }
    debugOnceKeys[key] = true;
    status(message);
}

function encoderModeLabel(channel) {
    if (channel === CH_DECK_FILTER) {
        return "mode 5 DECK Filter";
    }
    if (channel === CH_DECK_SENDS) {
        return "mode 13 DECK Sends";
    }
    if (channel === CH_NANO_FILTER) {
        return "mode 3 NANO Filter";
    }
    if (channel === CH_MACHINE_FILTER) {
        return "mode 4 MASCHINE Filter";
    }
    if (channel === CH_GROUP_CONTROL) {
        return "mode 7 Group Control";
    }
    if (channel === CH_PAN) {
        return "mode 8 Pan";
    }
    if (channel === CH_EQ_DJ) {
        return "mode 15 EQ-DJ";
    }
    if (channel === CH_UTIL) {
        return "mode 6 Util";
    }
    if (channel === CH_DECK_MASTER) {
        return "mode 16 DECK Master";
    }
    return "MIDI ch " + (channel + 1);
}

function debugEncoder(channel, message) {
    if (!shouldLogEncoderChannel(channel)) {
        return;
    }
    status(encoderModeLabel(channel) + ": " + message);
}

function describeEncoderParam(mode, column, row, param) {
    if (mode.layout === "eqDj") {
        var eqDjTag = eqDjChannelTag(eqDjSelectedGroupIndex, column);
        if (!param) {
            return eqDjTag + " band " + (row + 1) + " (no param handle)";
        }
        var eqDjName = param.exists().get() ? param.name().get() : "(not mapped)";
        return eqDjTag + " lo/mid/hi " + (row + 1) + " — " + eqDjName;
    }
    if (mode.layout === "pan") {
        var panLabel = "P" + (column + 1);
        if (!param) {
            return panLabel + " (no param handle)";
        }
        var panName = param.exists().get() ? param.name().get() : "(not mapped)";
        return panLabel + " — " + panName;
    }
    if (mode.layout === "util") {
        var utilNames = ["gain", "sidechain", "width"];
        var utilTag = "u" + (column + 1);
        if (!param) {
            return utilTag + " " + utilNames[row] + " (no param handle)";
        }
        var utilName = param.exists().get() ? param.name().get() : "(not mapped)";
        return utilTag + " " + utilNames[row] + " — " + utilName;
    }
    if (mode.layout === "deckEqComp") {
        var deckEqTag = DECK_SET3_TAGS[row] || "?";
        if (column >= DECK_EQ_COMP_EQ_PARAMS) {
            if (row === 2) {
                deckEqTag = DECK_SET3_TAGS[DECK_SET3_SIDECHAIN_INDEX];
            } else {
                deckEqTag = "comp";
            }
        }
        if (!param) {
            return deckEqTag + " col " + (column + 1) + " (no param handle)";
        }
        var deckEqName = param.exists().get() ? param.name().get() : "(not mapped)";
        return deckEqTag + " col " + (column + 1) + " — " + deckEqName;
    }
    if (mode.layout === "parametricEq") {
        if (row === 0 && column >= PARAMETRIC_BANDS) {
            var gcUtilNames = ["gain", "sidechain", "width"];
            var gcUtilTag = DECK_UTIL_TAGS[parametricSelectedGroupIndex] || "?";
            var gcUtilIdx = column - PARAMETRIC_BANDS;
            if (!param) {
                return gcUtilTag + " " + gcUtilNames[gcUtilIdx] + " (no param handle)";
            }
            var gcUtilName = param.exists().get() ? param.name().get() : "(not mapped)";
            return gcUtilTag + " " + gcUtilNames[gcUtilIdx] + " — " + gcUtilName;
        }
        var peqTag = PARAMETRIC_PAGE_TAGS[row] || "?";
        if (!param) {
            return peqTag + " band " + (column + 1) + " (no param handle)";
        }
        var peqName = param.exists().get() ? param.name().get() : "(not mapped)";
        return peqTag + " band " + (column + 1) + " — " + peqName;
    }
    var slot = mode.paramOffset + row + 1;
    if (!param) {
        return "col " + (column + 1) + " slot " + slot + " (no param handle)";
    }
    var exists = param.exists().get();
    var name = exists ? param.name().get() : "(not mapped)";
    var tag = "";
    if (mode.pages === deckSet1Pages && column < DECK_SET1_TAGS.length) {
        tag = DECK_SET1_TAGS[column];
    }
    return "col " + (column + 1) + (tag ? " " + tag : "") + " slot " + slot + " — " + name;
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

function encoderLedRoutesForPage(pagesRef) {
    var drums = drumsBindingForColumnarPages(pagesRef);
    if (drums) {
        var routes = [];
        if (drums.chColumnar1 >= 0) {
            routes.push({ channel: drums.chColumnar1, params: [0, 1, 2] });
        }
        if (drums.chColumnar2 >= 0) {
            routes.push({ channel: drums.chColumnar2, params: [4, 5, 6] });
        }
        return routes;
    }
    if (pagesRef === nanoUPages) {
        return [];
    }
    if (pagesRef === nanoMPages) {
        return [
            { channel: CH_NANO_SENDS, params: [4, 5, 6] },
            { channel: CH_NANO_FILTER, params: [0, 1, 2] },
        ];
    }
    if (pagesRef === deckSet1Pages) {
        return [
            { channel: CH_DECK_FILTER, params: [0, 1, 2] },
            { channel: CH_DECK_SENDS, params: [4, 5, 6] },
        ];
    }
    if (pagesRef === deckUtilPages) {
        return [];
    }
    return [];
}

function setupTaggedPages(remoteHost, idPrefix, tags, paramsPerPage, pagesOut) {
    for (var col = 0; col < tags.length; col++) {
        var tag = tags[col];
        var page = remoteHost.createCursorRemoteControlsPage(idPrefix + tag, paramsPerPage, tag);
        markPageParams(page, paramsPerPage);
        setupEncoderLedObservers(col, page, pagesOut, encoderLedRoutesForPage(pagesOut));
        pagesOut[col] = page;
    }
}

function setupDeckRemotes() {
    fadersPage = cursorDeckTrack.createCursorRemoteControlsPage(
        "deck-" + FADERS_TAG, NUM_COLUMNS, FADERS_TAG
    );
    markPageParams(fadersPage, NUM_COLUMNS);

    setupTaggedPages(
        cursorDeckTrack, "deck-s1-", DECK_SET1_TAGS, DECK_PAGE_PARAMS, deckSet1Pages
    );
    setupTaggedPages(
        cursorDeckTrack, "deck-util-", DECK_UTIL_TAGS, DECK_PAGE_PARAMS, deckUtilPages
    );
    for (var i = 0; i < DECK_SET3_TAGS.length; i++) {
        var tag3 = DECK_SET3_TAGS[i];
        var page3 = cursorDeckTrack.createCursorRemoteControlsPage(
            "deck-s3-" + tag3, NUM_COLUMNS, tag3
        );
        markPageParams(page3, NUM_COLUMNS);
        deckSet3Pages[i] = page3;
    }
    setupDeckEqCompEncoderLedObservers();
    setupGroupControlUtilEncoderLedObservers();
}

function setupGroupControlUtilEncoderLedObservers() {
    var group;
    var utilCol;
    for (group = 0; group < 4; group++) {
        var utilPage = deckUtilPages[group];
        if (!utilPage) {
            continue;
        }
        for (utilCol = 0; utilCol < 3; utilCol++) {
            (function (groupIndex, column, paramIndex) {
                var param = utilPage.getParameter(paramIndex);
                param.value().addValueObserver(function () {
                    if (groupIndex === parametricSelectedGroupIndex) {
                        updateParametricEncoderLed(0, column);
                    }
                });
                param.exists().addValueObserver(function () {
                    if (groupIndex === parametricSelectedGroupIndex) {
                        updateParametricEncoderLed(0, column);
                    }
                });
            })(group, PARAMETRIC_BANDS + utilCol, UTIL_PARAM_OFFSET + utilCol);
        }
    }
}

function setupNanoRemotes() {
    setupTaggedPages(
        cursorNanoTrack, "nano-", buildColumnarTags(COLUMNAR_U_TAG_PREFIX),
        DECK_PAGE_PARAMS, nanoUPages
    );
    setupTaggedPages(
        cursorNanoTrack, "nano-", buildColumnarTags(COLUMNAR_TAG_PREFIX),
        DECK_PAGE_PARAMS, nanoMPages
    );
}

function setupDeckEqCompEncoderLedObservers() {
    var col;
    var row;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            (function (encoderRow, column) {
                var param = resolveDeckEqCompParam(encoderRow, column);
                if (!param) {
                    return;
                }
                param.value().addValueObserver(function () {
                    updateDeckEqCompEncoderLed(encoderRow, column);
                });
                param.exists().addValueObserver(function () {
                    updateDeckEqCompEncoderLed(encoderRow, column);
                });
            })(row, col);
        }
    }
}

function deckEqCompPageForRow(row) {
    if (row === 0) {
        return deckSet3Pages[0];
    }
    if (row === 1) {
        return deckSet3Pages[1];
    }
    if (row === 2) {
        return deckSet3Pages[2];
    }
    return null;
}

function resolveDeckEqCompParam(row, column) {
    if (column < DECK_EQ_COMP_EQ_PARAMS) {
        var eqPage = deckEqCompPageForRow(row);
        if (!eqPage) {
            return null;
        }
        return eqPage.getParameter(column);
    }
    if (row === 2) {
        var sidechainPage = deckSet3Pages[DECK_SET3_SIDECHAIN_INDEX];
        if (!sidechainPage || column < DECK_EQ_COMP_EQ_PARAMS) {
            return null;
        }
        var sidechainIndex = column - DECK_EQ_COMP_EQ_PARAMS;
        if (sidechainIndex < 0 || sidechainIndex >= DECK_EQ_COMP_SIDECHAIN_PARAMS) {
            return null;
        }
        return sidechainPage.getParameter(sidechainIndex);
    }
    var compPage = deckSet3Pages[3];
    if (!compPage) {
        return null;
    }
    var compIndex = (row === 0) ? column - DECK_EQ_COMP_EQ_PARAMS : column - DECK_EQ_COMP_EQ_PARAMS + 3;
    if (compIndex < 0 || compIndex >= DECK_EQ_COMP_COMP_PARAMS) {
        return null;
    }
    return compPage.getParameter(compIndex);
}

function updateDeckEqCompEncoderLed(row, column) {
    if (!deckFound) {
        return;
    }
    var param = resolveDeckEqCompParam(row, column);
    sendEncoderLed(
        CH_DECK_MASTER, row, column,
        paramLedValue(param)
    );
}

function refreshDeckEqCompEncoderLeds() {
    var row;
    var col;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            updateDeckEqCompEncoderLed(row, col);
        }
    }
}

function setupDrumsRemotes(binding) {
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
        buildColumnarTags(COLUMNAR_TAG_PREFIX),
        DRUMS_COLUMNAR_PAGE_PARAMS,
        binding.columnarPages
    );
}

function createParametricBinding(trackName, drumsIdx, isNano) {
    return {
        trackName: trackName,
        drumsIdx: drumsIdx,
        isNano: isNano,
        deviceBank: null,
        device: null,
        pages: [],
        found: false,
    };
}

function parametricBindingCursor(binding) {
    if (binding.isNano) {
        return cursorNanoTrack;
    }
    return drumsBindings[binding.drumsIdx].cursor;
}

function parametricBindingFound(binding) {
    if (binding.isNano) {
        return nanoFound;
    }
    return drumsBindings[binding.drumsIdx].found;
}

function activeParametricBinding() {
    return parametricBindings[parametricSelectedGroupIndex];
}

function isParametricGroupReady() {
    var binding = activeParametricBinding();
    if (!binding || !binding.found) {
        return false;
    }
    return binding.device.exists().get();
}

function isGroupControlUtilEncoder(row, column) {
    return row === 0 && column >= PARAMETRIC_BANDS && column < NUM_COLUMNS;
}

function isGroupControlEncoderReady(row, column) {
    if (isGroupControlUtilEncoder(row, column)) {
        return deckFound;
    }
    return isParametricGroupReady();
}

function setupParametricBindings() {
    parametricBindings = [
        createParametricBinding("XTM1", 0, false),
        createParametricBinding("XTM2", 1, false),
        createParametricBinding("NANO", -1, true),
        createParametricBinding("MASCHINE", 2, false),
    ];
    for (var i = 0; i < parametricBindings.length; i++) {
        setupParametricRemotes(parametricBindings[i]);
    }
}

function scrollDeviceBankToLast(deviceBank) {
    var count = deviceBank.itemCount().get();
    if (count > 0) {
        deviceBank.scrollPosition().set(count - 1);
    }
}

function setupParametricRemotes(binding) {
    var cursor = parametricBindingCursor(binding);
    var deviceBank = cursor.createDeviceBank(1);
    binding.deviceBank = deviceBank;
    binding.device = deviceBank.getDevice(0);
    binding.device.exists().markInterested();
    binding.device.name().markInterested();
    deviceBank.itemCount().markInterested();
    deviceBank.itemCount().addValueObserver(function () {
        scrollDeviceBankToLast(deviceBank);
        refreshParametricEncoderLeds();
    });
    binding.device.exists().addValueObserver(function () {
        refreshParametricEncoderLeds();
    });

    var idPrefix = "peq-" + binding.trackName.toLowerCase() + "-";
    for (var row = 0; row < PARAMETRIC_PAGE_TAGS.length; row++) {
        var tag = PARAMETRIC_PAGE_TAGS[row];
        var page = binding.device.createCursorRemoteControlsPage(
            idPrefix + tag, DECK_PAGE_PARAMS, tag
        );
        markPageParams(page, DECK_PAGE_PARAMS);
        setupParametricEncoderLedObservers(row, page);
        binding.pages[row] = page;
    }
    scrollDeviceBankToLast(deviceBank);
}

function setupParametricEncoderLedObservers(row, page) {
    var col;
    for (col = 0; col < PARAMETRIC_BANDS; col++) {
        (function (encoderRow, column) {
            var param = page.getParameter(column);
            param.value().addValueObserver(function () {
                updateParametricEncoderLed(encoderRow, column);
            });
            param.exists().addValueObserver(function () {
                updateParametricEncoderLed(encoderRow, column);
            });
        })(row, col);
    }
}

function updateParametricEncoderLed(row, column) {
    if (isGroupControlUtilEncoder(row, column)) {
        if (!deckFound) {
            sendEncoderLed(CH_GROUP_CONTROL, row, column, 0);
            return;
        }
        var utilPage = deckUtilPages[parametricSelectedGroupIndex];
        if (!utilPage) {
            sendEncoderLed(CH_GROUP_CONTROL, row, column, 0);
            return;
        }
        var utilParam = utilPage.getParameter(UTIL_PARAM_OFFSET + (column - PARAMETRIC_BANDS));
        sendEncoderLed(CH_GROUP_CONTROL, row, column, paramLedValue(utilParam));
        return;
    }
    if (column >= PARAMETRIC_BANDS) {
        sendEncoderLed(CH_GROUP_CONTROL, row, column, 0);
        return;
    }
    var binding = activeParametricBinding();
    if (!binding || !binding.found || !binding.device.exists().get()) {
        sendEncoderLed(CH_GROUP_CONTROL, row, column, 0);
        return;
    }
    var page = binding.pages[row];
    if (!page) {
        sendEncoderLed(CH_GROUP_CONTROL, row, column, 0);
        return;
    }
    sendEncoderLed(
        CH_GROUP_CONTROL, row, column,
        paramLedValue(page.getParameter(column))
    );
}

function refreshParametricEncoderLeds() {
    var row;
    var col;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            updateParametricEncoderLed(row, col);
        }
    }
}

// One CC 127 on the button's own MIDI channel flips a latched toggle off.
// All 16 channels is an even number of flips, so the previous button stayed lit.
function releaseLatchedToggle(midiChannel, cc) {
    midiOut.sendMidi(0xB0 + midiChannel, cc, LCXL3_BUTTON_LED_ON);
}

function groupControlSelectionLabel() {
    return eqDjGroupTrackName(parametricSelectedGroupIndex);
}

function groupControlBeginEnter() {
    var i;
    parametricSelectedGroupIndex = 0;
    for (i = 0; i < groupControlTopOn.length; i++) {
        groupControlTopOn[i] = false;
    }
    groupControlEnterPending = true;
    refreshParametricEncoderLeds();
}

function groupControlFinishEnter(midiChannel) {
    if (!groupControlEnterPending) {
        return;
    }
    groupControlEnterPending = false;
    eqDjLightIfDark(midiChannel, groupControlTopOn, parametricSelectedGroupIndex, CC.BUTTON_FIRST);
    status("group control — " + groupControlSelectionLabel());
}

function groupControlNoteSelectionChange(changed) {
    if (!changed) {
        return;
    }
    clearEncoderMidiHistoryForChannel(CH_GROUP_CONTROL);
    refreshParametricEncoderLeds();
    if (!groupControlEnterPending) {
        status("group control — " + groupControlSelectionLabel());
    }
}

function handleGroupControlButton(midiChannel, cc, value) {
    var top = eqDjTopButtonIndex(cc);
    if (top < 0 || top >= PARAMETRIC_GROUP_COUNT) {
        if (value !== 0) {
            releaseLatchedToggle(midiChannel, cc);
        }
        return;
    }
    groupControlNoteSelectionChange(eqDjApplySelector(
        midiChannel, top, value, groupControlTopOn, PARAMETRIC_GROUP_COUNT, CC.BUTTON_FIRST,
        function () { return parametricSelectedGroupIndex; },
        function (index) { parametricSelectedGroupIndex = index; }
    ));
}

function eqDjChannelTag(groupIndex, channelIndex) {
    var prefix = (groupIndex === 0 || groupIndex === 1)
        ? COLUMNAR_TAG_PREFIX
        : COLUMNAR_U_TAG_PREFIX;
    return prefix + (channelIndex + 1);
}

function eqDjSelectionLabel() {
    return eqDjGroupTrackName(eqDjSelectedGroupIndex);
}

function eqDjGroupTrackName(groupIndex) {
    if (groupIndex === 0) {
        return "XTM1";
    }
    if (groupIndex === 1) {
        return "XTM2";
    }
    if (groupIndex === 2) {
        return "NANO";
    }
    return "MASCHINE";
}

function eqDjGroupFound(groupIndex) {
    if (groupIndex === 2) {
        return nanoFound;
    }
    var drumsIdx = groupIndex === 3 ? 2 : groupIndex;
    return drumsBindings[drumsIdx].found;
}

function isEqDjGroupReady() {
    return eqDjGroupFound(eqDjSelectedGroupIndex);
}

function activeEqDjPages() {
    return eqDjGroupPages[eqDjSelectedGroupIndex];
}

function setupEqDjRemotes() {
    setupTaggedPages(
        drumsBindings[2].device,
        "machine-eqdj-",
        buildColumnarTags(COLUMNAR_U_TAG_PREFIX),
        DECK_PAGE_PARAMS,
        machineEqDjUPages
    );
    eqDjGroupPages = [
        drumsBindings[0].columnarPages,
        drumsBindings[1].columnarPages,
        nanoUPages,
        machineEqDjUPages,
    ];
    setupEqDjEncoderLedObservers();
}

function setupEqDjEncoderLedObservers() {
    var group;
    var col;
    var row;
    for (group = 0; group < eqDjGroupPages.length; group++) {
        var pages = eqDjGroupPages[group];
        for (col = 0; col < NUM_COLUMNS; col++) {
            var page = pages[col];
            if (!page) {
                continue;
            }
            for (row = 0; row < EQ_DJ_BANDS; row++) {
                (function (encoderRow, column, grp) {
                    var param = page.getParameter(EQ_DJ_PARAM_OFFSET + encoderRow);
                    param.value().addValueObserver(function () {
                        if (grp === eqDjSelectedGroupIndex) {
                            updateEqDjEncoderLed(encoderRow, column);
                        }
                    });
                    param.exists().addValueObserver(function () {
                        if (grp === eqDjSelectedGroupIndex) {
                            updateEqDjEncoderLed(encoderRow, column);
                        }
                    });
                })(row, col, group);
            }
        }
    }
}

function updateEqDjEncoderLed(row, column) {
    if (row >= EQ_DJ_BANDS) {
        sendEncoderLed(CH_EQ_DJ, row, column, 0);
        return;
    }
    if (!isEqDjGroupReady()) {
        sendEncoderLed(CH_EQ_DJ, row, column, 0);
        return;
    }
    var pages = activeEqDjPages();
    var page = pages[column];
    if (!page) {
        sendEncoderLed(CH_EQ_DJ, row, column, 0);
        return;
    }
    var param = page.getParameter(EQ_DJ_PARAM_OFFSET + row);
    sendEncoderLed(CH_EQ_DJ, row, column, paramLedValue(param));
}

function refreshEqDjEncoderLeds() {
    var row;
    var col;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            updateEqDjEncoderLed(row, col);
        }
    }
}

function eqDjTopButtonIndex(cc) {
    if (cc < CC.BUTTON_FIRST || cc >= CC.BUTTON_FIRST + 8) {
        return -1;
    }
    return cc - CC.BUTTON_FIRST;
}

function eqDjBeginEnter() {
    var i;
    eqDjSelectedGroupIndex = 0;
    for (i = 0; i < NUM_COLUMNS; i++) {
        eqDjTopOn[i] = false;
    }
    eqDjEnterPending = true;
    refreshEqDjEncoderLeds();
}

function eqDjLightIfDark(midiChannel, onArray, index, ccBase) {
    var i;
    if (onArray[index]) {
        return;
    }
    for (i = 0; i < onArray.length; i++) {
        if (onArray[i]) {
            return;
        }
    }
    releaseLatchedToggle(midiChannel, ccBase + index);
    onArray[index] = true;
}

function eqDjFinishEnter(midiChannel) {
    if (!eqDjEnterPending) {
        return;
    }
    eqDjEnterPending = false;
    eqDjLightIfDark(midiChannel, eqDjTopOn, eqDjSelectedGroupIndex, CC.BUTTON_FIRST);
    status("eq-dj — " + eqDjSelectionLabel());
}

function eqDjNoteSelectionChange(changed) {
    if (!changed) {
        return;
    }
    clearEncoderMidiHistoryForChannel(CH_EQ_DJ);
    refreshEqDjEncoderLeds();
    if (!eqDjEnterPending) {
        status("eq-dj — " + eqDjSelectionLabel());
    }
}

// Hardware toggle: a press flips that button. CC 127 flips it again. CC 0 does not.
// onArray is the latch we believe. Only flip a button we believe is on, plus
// re-light the selected one if the press just turned it off.
function eqDjApplySelector(midiChannel, index, value, onArray, count, ccBase, getSelected, setSelected) {
    var i;
    var changed = false;
    if (value === 0) {
        onArray[index] = false;
        if (index === getSelected()) {
            releaseLatchedToggle(midiChannel, ccBase + index);
            onArray[index] = true;
        }
        return false;
    }
    onArray[index] = true;
    if (index !== getSelected()) {
        setSelected(index);
        changed = true;
    }
    for (i = 0; i < count; i++) {
        if (i !== index && onArray[i]) {
            releaseLatchedToggle(midiChannel, ccBase + i);
            onArray[i] = false;
        }
    }
    return changed;
}

function handleEqDjButton(midiChannel, cc, value) {
    var top = eqDjTopButtonIndex(cc);
    if (top < 0 || top >= EQ_DJ_GROUP_COUNT) {
        if (value !== 0) {
            releaseLatchedToggle(midiChannel, cc);
        }
        return;
    }
    eqDjNoteSelectionChange(eqDjApplySelector(
        midiChannel, top, value, eqDjTopOn, EQ_DJ_GROUP_COUNT, CC.BUTTON_FIRST,
        function () { return eqDjSelectedGroupIndex; },
        function (index) { eqDjSelectedGroupIndex = index; }
    ));
}

function createPanRemotePage(remoteHost, idPrefix) {
    var page = remoteHost.createCursorRemoteControlsPage(
        idPrefix + PANS_TAG, PAN_PARAMS, PANS_TAG
    );
    markPageParams(page, PAN_PARAMS);
    return page;
}

function isPanGroupReady() {
    return eqDjGroupFound(panSelectedGroupIndex);
}

function activePanPage() {
    return panGroupPages[panSelectedGroupIndex];
}

function setupPanRemotes() {
    panGroupPages = [
        createPanRemotePage(drumsBindings[0].device, "xtm1-pans-"),
        createPanRemotePage(drumsBindings[1].device, "xtm2-pans-"),
        createPanRemotePage(cursorNanoTrack, "nano-pans-"),
        createPanRemotePage(drumsBindings[2].cursor, "machine-pans-"),
    ];
    setupPanEncoderLedObservers();
}

function setupPanEncoderLedObservers() {
    var group;
    var col;
    for (group = 0; group < panGroupPages.length; group++) {
        var page = panGroupPages[group];
        if (!page) {
            continue;
        }
        for (col = 0; col < NUM_COLUMNS; col++) {
            (function (column, grp) {
                var param = page.getParameter(column);
                param.value().addValueObserver(function () {
                    if (grp === panSelectedGroupIndex) {
                        updatePanEncoderLed(0, column);
                    }
                });
                param.exists().addValueObserver(function () {
                    if (grp === panSelectedGroupIndex) {
                        updatePanEncoderLed(0, column);
                    }
                });
            })(col, group);
        }
    }
}

function updatePanEncoderLed(row, column) {
    if (row >= PAN_ROWS) {
        sendEncoderLed(CH_PAN, row, column, 0);
        return;
    }
    if (!isPanGroupReady()) {
        sendEncoderLed(CH_PAN, row, column, 0);
        return;
    }
    var page = activePanPage();
    if (!page) {
        sendEncoderLed(CH_PAN, row, column, 0);
        return;
    }
    var param = page.getParameter(column);
    sendEncoderLed(CH_PAN, row, column, paramLedValue(param));
}

function refreshPanEncoderLeds() {
    var row;
    var col;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            updatePanEncoderLed(row, col);
        }
    }
}

function panBeginEnter() {
    var i;
    panSelectedGroupIndex = 0;
    for (i = 0; i < NUM_COLUMNS; i++) {
        panTopOn[i] = false;
    }
    panEnterPending = true;
    refreshPanEncoderLeds();
}

function panFinishEnter(midiChannel) {
    if (!panEnterPending) {
        return;
    }
    panEnterPending = false;
    eqDjLightIfDark(midiChannel, panTopOn, panSelectedGroupIndex, CC.BUTTON_FIRST);
    status("pan — " + eqDjGroupTrackName(panSelectedGroupIndex));
}

function panNoteSelectionChange(changed) {
    if (!changed) {
        return;
    }
    clearEncoderMidiHistoryForChannel(CH_PAN);
    refreshPanEncoderLeds();
    if (!panEnterPending) {
        status("pan — " + eqDjGroupTrackName(panSelectedGroupIndex));
    }
}

function handlePanButton(midiChannel, cc, value) {
    var top = eqDjTopButtonIndex(cc);
    if (top < 0 || top >= EQ_DJ_GROUP_COUNT) {
        if (value !== 0) {
            releaseLatchedToggle(midiChannel, cc);
        }
        return;
    }
    panNoteSelectionChange(eqDjApplySelector(
        midiChannel, top, value, panTopOn, EQ_DJ_GROUP_COUNT, CC.BUTTON_FIRST,
        function () { return panSelectedGroupIndex; },
        function (index) { panSelectedGroupIndex = index; }
    ));
}

function utilGroupEnabled(groupIndex) {
    return groupIndex === 2 || groupIndex === 3;
}

function utilSelectionLabel() {
    return eqDjGroupTrackName(utilSelectedGroupIndex);
}

function isUtilGroupReady() {
    if (!utilGroupEnabled(utilSelectedGroupIndex)) {
        return false;
    }
    return eqDjGroupFound(utilSelectedGroupIndex);
}

function activeUtilPages() {
    return utilGroupPages[utilSelectedGroupIndex];
}

function setupUtilRemotes() {
    utilGroupPages = [
        null,
        null,
        nanoUPages,
        machineEqDjUPages,
    ];
    setupUtilEncoderLedObservers();
}

function setupUtilEncoderLedObservers() {
    var group;
    var col;
    var row;
    for (group = 0; group < utilGroupPages.length; group++) {
        var pages = utilGroupPages[group];
        if (!pages) {
            continue;
        }
        for (col = 0; col < NUM_COLUMNS; col++) {
            var page = pages[col];
            if (!page) {
                continue;
            }
            for (row = 0; row < UTIL_ROWS; row++) {
                (function (encoderRow, column, grp) {
                    var param = page.getParameter(UTIL_PARAM_OFFSET + encoderRow);
                    param.value().addValueObserver(function () {
                        if (grp === utilSelectedGroupIndex) {
                            updateUtilEncoderLed(encoderRow, column);
                        }
                    });
                    param.exists().addValueObserver(function () {
                        if (grp === utilSelectedGroupIndex) {
                            updateUtilEncoderLed(encoderRow, column);
                        }
                    });
                })(row, col, group);
            }
        }
    }
}

function updateUtilEncoderLed(row, column) {
    if (row >= UTIL_ROWS || !isUtilGroupReady()) {
        sendEncoderLed(CH_UTIL, row, column, 0);
        return;
    }
    var pages = activeUtilPages();
    var page = pages && pages[column];
    if (!page) {
        sendEncoderLed(CH_UTIL, row, column, 0);
        return;
    }
    var param = page.getParameter(UTIL_PARAM_OFFSET + row);
    sendEncoderLed(CH_UTIL, row, column, paramLedValue(param));
}

function refreshUtilEncoderLeds() {
    var row;
    var col;
    for (row = 0; row < NUM_ROWS; row++) {
        for (col = 0; col < NUM_COLUMNS; col++) {
            updateUtilEncoderLed(row, col);
        }
    }
}

function utilBeginEnter() {
    var i;
    utilSelectedGroupIndex = UTIL_DEFAULT_GROUP;
    for (i = 0; i < NUM_COLUMNS; i++) {
        utilTopOn[i] = false;
    }
    utilEnterPending = true;
    refreshUtilEncoderLeds();
}

function utilFinishEnter(midiChannel) {
    if (!utilEnterPending) {
        return;
    }
    utilEnterPending = false;
    eqDjLightIfDark(midiChannel, utilTopOn, utilSelectedGroupIndex, CC.BUTTON_FIRST);
    status("util — " + utilSelectionLabel());
}

function utilNoteSelectionChange(changed) {
    if (!changed) {
        return;
    }
    clearEncoderMidiHistoryForChannel(CH_UTIL);
    refreshUtilEncoderLeds();
    if (!utilEnterPending) {
        status("util — " + utilSelectionLabel());
    }
}

function handleUtilButton(midiChannel, cc, value) {
    var top = eqDjTopButtonIndex(cc);
    if (top < 0 || top >= UTIL_GROUP_COUNT || !utilGroupEnabled(top)) {
        if (value !== 0) {
            releaseLatchedToggle(midiChannel, cc);
        }
        return;
    }
    utilNoteSelectionChange(eqDjApplySelector(
        midiChannel, top, value, utilTopOn, UTIL_GROUP_COUNT, CC.BUTTON_FIRST,
        function () { return utilSelectedGroupIndex; },
        function (index) { utilSelectedGroupIndex = index; }
    ));
}

function buildColumnarTags(prefix) {
    var tags = [];
    for (var i = 0; i < NUM_COLUMNS; i++) {
        tags[i] = prefix + (i + 1);
    }
    return tags;
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

function updateEncoderLed(column, paramIndex, pagesRef) {
    var mapping = ledRouteForParam(pagesRef, paramIndex);
    if (!mapping) {
        return;
    }
    if ((pagesRef === deckSet1Pages || pagesRef === deckUtilPages) && !deckFound) {
        return;
    }
    if ((pagesRef === nanoMPages || pagesRef === nanoUPages) && !nanoFound) {
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
    if (!mode) {
        return;
    }
    if (mode.layout === "deckEqComp") {
        refreshDeckEqCompEncoderLeds();
        return;
    }
    if (mode.layout === "parametricEq") {
        refreshParametricEncoderLeds();
        return;
    }
    if (mode.layout === "eqDj") {
        refreshEqDjEncoderLeds();
        return;
    }
    if (mode.layout === "pan") {
        refreshPanEncoderLeds();
        return;
    }
    if (mode.layout === "util") {
        refreshUtilEncoderLeds();
        return;
    }
    var col;
    var row;
    for (col = 0; col < NUM_COLUMNS; col++) {
        for (row = 0; row < NUM_ROWS; row++) {
            updateEncoderLed(col, mode.paramOffset + row, mode.pages);
        }
    }
}

function refreshAllEncoderLeds() {
    var col;
    var p;
    var d;
    for (col = 0; col < NUM_COLUMNS; col++) {
        for (p = 0; p < DECK_PAGE_PARAMS; p++) {
            updateEncoderLed(col, p, deckSet1Pages);
            updateEncoderLed(col, p, deckUtilPages);
            updateEncoderLed(col, p, nanoMPages);
            updateEncoderLed(col, p, nanoUPages);
        }
        for (d = 0; d < drumsBindings.length; d++) {
            for (p = 0; p < DRUMS_COLUMNAR_PAGE_PARAMS; p++) {
                updateEncoderLed(col, p, drumsBindings[d].columnarPages);
            }
        }
    }
    refreshDeckEqCompEncoderLeds();
    refreshParametricEncoderLeds();
    refreshEqDjEncoderLeds();
    refreshPanEncoderLeds();
    refreshUtilEncoderLeds();
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
                paramOffset: DRUMS_COLUMNAR_1_PARAM_OFFSET,
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
    }
    if (channel === CH_NANO_SENDS) {
        return {
            layout: "columnar",
            pages: nanoMPages,
            paramOffset: DRUMS_COLUMNAR_2_PARAM_OFFSET,
            trackReady: nanoFound,
        };
    }
    if (channel === CH_NANO_FILTER) {
        return {
            layout: "columnar",
            pages: nanoMPages,
            paramOffset: DRUMS_COLUMNAR_1_PARAM_OFFSET,
            trackReady: nanoFound,
        };
    }
    if (channel === CH_DECK_FILTER) {
        return {
            layout: "columnar",
            pages: deckSet1Pages,
            paramOffset: 0,
            trackReady: deckFound,
        };
    }
    if (channel === CH_DECK_SENDS) {
        return {
            layout: "columnar",
            pages: deckSet1Pages,
            paramOffset: DRUMS_COLUMNAR_2_PARAM_OFFSET,
            trackReady: deckFound,
        };
    }
    if (channel === CH_GROUP_CONTROL) {
        return {
            layout: "parametricEq",
            trackReady: isParametricGroupReady(),
        };
    }
    if (channel === CH_EQ_DJ) {
        return {
            layout: "eqDj",
            trackReady: isEqDjGroupReady(),
        };
    }
    if (channel === CH_PAN) {
        return {
            layout: "pan",
            trackReady: isPanGroupReady(),
        };
    }
    if (channel === CH_UTIL) {
        return {
            layout: "util",
            trackReady: isUtilGroupReady(),
        };
    }
    if (channel === CH_DECK_MASTER) {
        return {
            layout: "deckEqComp",
            trackReady: deckFound,
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

    var nanoIdx = findTrackIndex(NANO_TRACK_NAME);
    if (nanoIdx !== nanoSelectedIndex) {
        nanoSelectedIndex = nanoIdx;
        if (nanoIdx !== -1) {
            cursorNanoTrack.selectChannel(detectBank.getItemAt(nanoIdx));
        }
    }
    var newNanoFound = nanoIdx !== -1;
    if (forceLog || newNanoFound !== nanoFound) {
        status("nano " + (newNanoFound ? (NANO_TRACK_NAME + " @ " + nanoIdx) : "NOT FOUND"));
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

    if ((newDeckFound && !deckFound) || (newNanoFound && !nanoFound) || anyDrumsNewlyFound) {
        refreshAllEncoderLeds();
    }
    deckFound = newDeckFound;
    nanoFound = newNanoFound;

    for (var p = 0; p < parametricBindings.length; p++) {
        parametricBindings[p].found = parametricBindingFound(parametricBindings[p]);
    }
    refreshParametricEncoderLeds();
    refreshEqDjEncoderLeds();
    refreshPanEncoderLeds();
    refreshUtilEncoderLeds();
}

function onMidi(status, data1, data2) {
    var msgType = status & 0xF0;
    var channel = status & 0x0F;
    if (msgType !== 0xB0) {
        return;
    }
    handleCC(channel, data1, data2);
}

function onCustomModeMidiChannel(channel) {
    if (!encoderModeForChannel(channel)) {
        return;
    }
    if (channel !== lastEncoderMidiChannel) {
        debugEncoder(channel, "active (MIDI status ch " + channel + ")");
        onEncoderMidiChannelChange(lastEncoderMidiChannel, channel);
        lastEncoderMidiChannel = channel;
        refreshChannelEncoderLeds(channel);
    }
}

function customModeActivityCc(cc) {
    if (encoderRowFromCC(cc) >= 0) {
        return true;
    }
    return cc >= CC.BUTTON_FIRST && cc <= CC.BUTTON_LAST;
}

function handleCC(channel, cc, value) {
    if (cc >= CC.FADER1 && cc < CC.FADER1 + NUM_COLUMNS) {
        handleFader(cc - CC.FADER1, value);
        return;
    }

    if (DEBUG && encoderRowFromCC(cc) >= 0) {
        logOnce("midi-encoder-ch-" + channel,
            "encoder CC on MIDI status ch " + channel + " (LCXL3 mode " + (channel + 1) + ")");
    }

    var mode = encoderModeForChannel(channel);
    if (!mode) {
        if (encoderRowFromCC(cc) >= 0) {
            logOnce("no-mode-ch-" + channel,
                "encoder CC " + cc + " on MIDI ch " + (channel + 1) + " — no script mode");
        }
        return;
    }

    if (!customModeActivityCc(cc)) {
        return;
    }

    onCustomModeMidiChannel(channel);

    if (cc >= CC.BUTTON_FIRST && cc <= CC.BUTTON_LAST) {
        if (mode.layout === "parametricEq") {
            handleGroupControlButton(channel, cc, value);
            groupControlFinishEnter(channel);
        } else if (mode.layout === "eqDj") {
            handleEqDjButton(channel, cc, value);
            eqDjFinishEnter(channel);
        } else if (mode.layout === "pan") {
            handlePanButton(channel, cc, value);
            panFinishEnter(channel);
        } else if (mode.layout === "util") {
            handleUtilButton(channel, cc, value);
            utilFinishEnter(channel);
        } else if (mode.layout === "deckEqComp" && value !== 0) {
            releaseLatchedToggle(channel, cc);
        }
        return;
    }

    if (mode.layout === "parametricEq") {
        groupControlFinishEnter(channel);
    }
    if (mode.layout === "eqDj") {
        eqDjFinishEnter(channel);
    }
    if (mode.layout === "pan") {
        panFinishEnter(channel);
    }
    if (mode.layout === "util") {
        utilFinishEnter(channel);
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
    if (channel === CH_GROUP_CONTROL) {
        groupControlBeginEnter();
    }
    if (channel === CH_EQ_DJ) {
        eqDjBeginEnter();
    }
    if (channel === CH_PAN) {
        panBeginEnter();
    }
    if (channel === CH_UTIL) {
        utilBeginEnter();
    }
}

function resolveEncoderParam(mode, column, row) {
    if (mode.layout === "deckEqComp") {
        return resolveDeckEqCompParam(row, column);
    }
    if (mode.layout === "parametricEq") {
        if (row === 0 && column >= PARAMETRIC_BANDS && column < NUM_COLUMNS) {
            if (!deckFound) {
                return null;
            }
            var groupUtilPage = deckUtilPages[parametricSelectedGroupIndex];
            if (!groupUtilPage) {
                return null;
            }
            return groupUtilPage.getParameter(UTIL_PARAM_OFFSET + (column - PARAMETRIC_BANDS));
        }
        if (column >= PARAMETRIC_BANDS) {
            return null;
        }
        var peqBinding = activeParametricBinding();
        if (!peqBinding || !peqBinding.pages[row]) {
            return null;
        }
        return peqBinding.pages[row].getParameter(column);
    }
    if (mode.layout === "eqDj") {
        if (row >= EQ_DJ_BANDS) {
            return null;
        }
        var eqDjPages = activeEqDjPages();
        if (!eqDjPages || !eqDjPages[column]) {
            return null;
        }
        return eqDjPages[column].getParameter(EQ_DJ_PARAM_OFFSET + row);
    }
    if (mode.layout === "pan") {
        if (row >= PAN_ROWS) {
            return null;
        }
        var panPage = activePanPage();
        if (!panPage) {
            return null;
        }
        return panPage.getParameter(column);
    }
    if (mode.layout === "util") {
        if (row >= UTIL_ROWS || !utilGroupEnabled(utilSelectedGroupIndex)) {
            return null;
        }
        var utilPages = activeUtilPages();
        if (!utilPages || !utilPages[column]) {
            return null;
        }
        return utilPages[column].getParameter(UTIL_PARAM_OFFSET + row);
    }
    var page = mode.pages[column];
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

function encoderTargetReady(mode, row, column) {
    if (mode.layout === "parametricEq") {
        return isGroupControlEncoderReady(row, column);
    }
    return mode.trackReady;
}

function applyEncoderMidi(channel, row, column, cc, midiValue, mode) {
    if (!encoderTargetReady(mode, row, column)) {
        logOnce("track-not-ready-ch-" + channel + "-c" + column + "-r" + row,
            encoderModeLabel(channel) + " — target not ready for col " + (column + 1) +
            " row " + (row + 1));
        return;
    }
    var param = resolveEncoderParam(mode, column, row);
    if (!paramIsMapped(param)) {
        logOnce("unmap-ch-" + channel + "-c" + column + "-r" + row,
            encoderModeLabel(channel) + " — " + describeEncoderParam(mode, column, row, param));
        return;
    }
    var key = encoderStateKey(channel, cc);
    var expectedMidi = paramLedValue(param);
    var previousMidi = lastEncoderMidiByKey[key];

    if (previousMidi === undefined) {
        lastEncoderMidiByKey[key] = midiValue;
        sendEncoderLed(channel, row, column, expectedMidi);
        debugEncoder(channel, "pickup " + describeEncoderParam(mode, column, row, param) +
            " hw=" + midiValue + " led=" + expectedMidi);
        return;
    }

    if (midiValue === previousMidi) {
        return;
    }

    lastEncoderMidiByKey[key] = midiValue;
    var delta = encoderDelta(previousMidi, midiValue);
    if (delta !== 0) {
        param.inc(delta / 127.0);
        debugEncoder(channel, "inc " + describeEncoderParam(mode, column, row, param) +
            " delta=" + delta);
    }
}

function handleFader(column, value) {
    if (!deckFound || !fadersPage) {
        return;
    }
    var param = fadersPage.getParameter(column);
    if (!paramIsMapped(param)) {
        return;
    }
    param.set(value / 127.0);
}

function flush() {}

function exit() {
    log("exited");
}
