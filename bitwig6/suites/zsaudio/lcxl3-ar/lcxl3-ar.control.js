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

var DEBUG = true;
var TARGET_TRACK_NAME = "TRACKS";
var MAX_DEPTH = 1;
var SIBLINGS_PER_DEPTH = 8;

var CH_CHILD_START = 0;
var CH_CHILD_END = 7;
var CH_PRIMARY_1 = 8;
var CH_PRIMARY_2 = 9;
var CH_SENDS = 10;
var CH_MODE12 = 11;
var CH_MODE13 = 12;

var NUM_TRACKS_PAGES = 3;
var TRACKS_PAGE_TAG = "tracks-";
var NUM_SUB_GROUP_PAGES = 3;
var NUM_SUB_GROUP_PARAMS = 4;
var SUB_GROUP_PAGE_TAG = "track-";
var NUM_CHILD_RC_PAGES = 8;
var NUM_CHILD_RC_PARAMS = 3;
var NUM_SUB_GROUPS = 2;
var TRACKS_PER_SUB_GROUP = 4;
var NUM_CHILDREN = NUM_SUB_GROUPS * TRACKS_PER_SUB_GROUP;
var NUM_SENDS = 3;

var MODE12_TARGET_TRACK = "TRACK 1/2";
var FLAT_BANK_SIZE = 256;
var MODE12_RC_PARAMS = 7;
var MODE12_PARAM_OFFSET = 4;
var MODE13_NUM_CHILDREN = 8;
var MODE13_NUM_PAGES = 3;
var MODE13_PAGE_TAG_PREFIX = "c-perf-";
var MODE13_PARAM_OFFSET = 0;
var MODE13_PARAMS_PER_PAGE = 3;

var CC = {
    ENC_T1: 13, ENC_T2: 14, ENC_T3: 15, ENC_T4: 16,
    ENC_T5: 17, ENC_T6: 18, ENC_T7: 19, ENC_T8: 20,
    ENC_M1: 21, ENC_M2: 22, ENC_M3: 23, ENC_M4: 24,
    ENC_M5: 25, ENC_M6: 26, ENC_M7: 27, ENC_M8: 28,
    ENC_B1: 29, ENC_B2: 30, ENC_B3: 31, ENC_B4: 32,
    ENC_B5: 33, ENC_B6: 34, ENC_B7: 35, ENC_B8: 36,
    FADER1: 5, FADER2: 6, FADER3: 7, FADER4: 8,
    FADER5: 9, FADER6: 10, FADER7: 11, FADER8: 12,
    BTN_U1: 37, BTN_U2: 38, BTN_U3: 39, BTN_U4: 40,
    BTN_U5: 41, BTN_U6: 42, BTN_U7: 43, BTN_U8: 44,
    BTN_B1: 45, BTN_B2: 46, BTN_B3: 47, BTN_B4: 48,
    BTN_B5: 49, BTN_B6: 50, BTN_B7: 51, BTN_B8: 52,
};

var midiIn, midiOut;
var candidates = [];
var parentCandidate = null;
var activeCandidate = null;
var mode12DetectBank = null;
var cursorMode12Track = null;
var mode12Pages = [];
var mode12Device = null;
var mode12Found = false;
var mode12SelectedIndex = -1;
var mode13ChildBank = null;
var mode13ChildPages = [];

function init() {
    log("LCXL3-AR - Initializing...");
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);
    setupCandidates();
    setupMode12();
    log("LCXL3-AR - Initialized!");
}

function setupMode12() {
    var rootGroup = host.getProject().getRootTrackGroup();
    mode12DetectBank = rootGroup.createTrackBank(FLAT_BANK_SIZE, 0, 0, true);
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = mode12DetectBank.getItemAt(i);
        t.exists().markInterested();
        t.name().markInterested();
        t.exists().addValueObserver(function() { resolveMode12Track(); });
        t.name().addValueObserver(function() { resolveMode12Track(); });
    }

    cursorMode12Track = host.createCursorTrack("lcxl3-mode12", "LCXL3 Mode12", 0, 0, false);
    cursorMode12Track.isPinned().markInterested();

    var devBank = cursorMode12Track.createDeviceBank(1);
    mode12Device = devBank.getDevice(0);
    mode12Device.exists().markInterested();
    mode12Device.name().markInterested();

    for (var p = 0; p < 8; p++) {
        var tag = "c" + (p + 1);
        var page = mode12Device.createCursorRemoteControlsPage("mode12-" + tag, MODE12_RC_PARAMS, tag);
        markPageParams(page, MODE12_RC_PARAMS);
        mode12Pages[p] = page;
    }

    mode13ChildBank = cursorMode12Track.createTrackBank(MODE13_NUM_CHILDREN, 0, 0, false);
    for (var c = 0; c < MODE13_NUM_CHILDREN; c++) {
        var child = mode13ChildBank.getItemAt(c);
        child.exists().markInterested();
        child.name().markInterested();
        var childDev = child.createDeviceBank(1).getDevice(0);
        childDev.exists().markInterested();
        childDev.name().markInterested();
        mode13ChildPages[c] = [];
        for (var pg = 0; pg < MODE13_NUM_PAGES; pg++) {
            var tag = MODE13_PAGE_TAG_PREFIX + (pg + 1);
            var perfPage = childDev.createCursorRemoteControlsPage(
                "mode13-child" + c + "-" + tag, MODE12_RC_PARAMS, tag
            );
            markPageParams(perfPage, MODE12_RC_PARAMS);
            mode13ChildPages[c][pg] = perfPage;
        }
    }

    host.scheduleTask(function() {
        cursorMode12Track.isPinned().set(true);
        resolveMode12Track();
    }, 200);
}

function findMode12TrackIndex(targetName) {
    for (var i = 0; i < FLAT_BANK_SIZE; i++) {
        var t = mode12DetectBank.getItemAt(i);
        if (t.exists().get() && t.name().get().toLowerCase() === targetName.toLowerCase()) return i;
    }
    return -1;
}

function resolveMode12Track() {
    var idx = findMode12TrackIndex(MODE12_TARGET_TRACK);
    if (idx !== mode12SelectedIndex) {
        mode12SelectedIndex = idx;
        if (idx !== -1) {
            cursorMode12Track.selectChannel(mode12DetectBank.getItemAt(idx));
        }
    }
    var newFound = idx !== -1;
    if (newFound !== mode12Found) {
        mode12Found = newFound;
        log("Mode 12 track '" + MODE12_TARGET_TRACK + "': " + (mode12Found ? ("index " + idx) : "NOT FOUND"));
    }
}

function setupCandidates() {
    var rootGroup = host.getProject().getRootTrackGroup();
    var rootBank = rootGroup.createTrackBank(SIBLINGS_PER_DEPTH, 0, 0, false);
    for (var i = 0; i < SIBLINGS_PER_DEPTH; i++) {
        candidates.push(createCandidate(rootBank.getItemAt(i), "d0-" + i));
    }

    var prevLevel = [];
    for (var i = 0; i < SIBLINGS_PER_DEPTH; i++) {
        prevLevel.push(rootBank.getItemAt(i));
    }

    for (var d = 1; d < MAX_DEPTH; d++) {
        var nextLevel = [];
        for (var p = 0; p < prevLevel.length; p++) {
            var childBank = prevLevel[p].createTrackBank(SIBLINGS_PER_DEPTH, 0, 0, false);
            for (var i = 0; i < SIBLINGS_PER_DEPTH; i++) {
                var ct = childBank.getItemAt(i);
                candidates.push(createCandidate(ct, "d" + d + "-" + p + "-" + i));
                nextLevel.push(ct);
            }
        }
        prevLevel = nextLevel;
    }

    var parentTrack = rootBank.getItemAt(0).createParentTrack(0, 0);
    parentCandidate = createCandidate(parentTrack, "parent");

    for (var i = 0; i < candidates.length; i++) {
        observeCandidate(candidates[i]);
    }
    observeCandidate(parentCandidate);

    host.scheduleTask(function() {
        resolveActiveCandidate();
        logTrackStatus();
    }, 200);
}

function createCandidate(track, id) {
    track.exists().markInterested();
    track.name().markInterested();

    var prefix = id + "-";

    var devBank = track.createDeviceBank(1);
    var device = devBank.getDevice(0);
    device.exists().markInterested();
    device.name().markInterested();

    var devicePages = [];
    for (var i = 0; i < 8; i++) {
        var pageTag = "p" + (i + 1);
        var page = device.createCursorRemoteControlsPage(prefix + "Page" + pageTag, 7, pageTag);
        markPageParams(page, 7);
        devicePages[i] = page;
    }

    var volumesPage = device.createCursorRemoteControlsPage(prefix + "Volumes", 8, "volumes");
    markPageParams(volumesPage, 8);

    var tracksPages = [];
    for (var i = 0; i < NUM_TRACKS_PAGES; i++) {
        var tTag = TRACKS_PAGE_TAG + (i + 1);
        var tPage = track.createCursorRemoteControlsPage(prefix + "Tracks" + tTag, 8, tTag);
        markPageParams(tPage, 8);
        tracksPages[i] = tPage;
    }

    var topLevelBank = track.createTrackBank(NUM_SUB_GROUPS, 0, 0, false);
    var childTracks = [];
    var childTrackSends = [];
    var childTrackRCs = [];
    var muteStates = [];
    var armStates = [];
    var subGroupPages = [];

    for (var g = 0; g < NUM_SUB_GROUPS; g++) {
        var groupTrack = topLevelBank.getItemAt(g);
        groupTrack.exists().markInterested();
        groupTrack.name().markInterested();

        subGroupPages[g] = [];
        for (var p = 0; p < NUM_SUB_GROUP_PAGES; p++) {
            var sgTag = SUB_GROUP_PAGE_TAG + (g + 1) + "-" + (p + 1);
            var sgPage = groupTrack.createCursorRemoteControlsPage(
                prefix + "SG" + g + "_P" + p, NUM_SUB_GROUP_PARAMS, sgTag
            );
            markPageParams(sgPage, NUM_SUB_GROUP_PARAMS);
            subGroupPages[g][p] = sgPage;
        }

        var bank = groupTrack.createTrackBank(TRACKS_PER_SUB_GROUP, NUM_SENDS, 0, false);

        for (var t = 0; t < TRACKS_PER_SUB_GROUP; t++) {
            var flatIndex = g * TRACKS_PER_SUB_GROUP + t;
            var ct = bank.getItemAt(t);
            ct.exists().markInterested();
            ct.name().markInterested();

            childTracks[flatIndex] = ct;

            childTrackSends[flatIndex] = [];
            for (var s = 0; s < NUM_SENDS; s++) {
                var send = ct.getSend(s);
                send.exists().markInterested();
                send.name().markInterested();
                send.value().markInterested();
                childTrackSends[flatIndex][s] = send;
            }

            var ctDevBank = ct.createDeviceBank(1);
            var ctDevice = ctDevBank.getDevice(0);
            ctDevice.exists().markInterested();
            ctDevice.name().markInterested();

            var rcPages = [];
            for (var p = 0; p < NUM_CHILD_RC_PAGES; p++) {
                var tag = "c" + (p + 1);
                var rcPage = ctDevice.createCursorRemoteControlsPage(
                    prefix + "Child" + flatIndex + "_P" + tag, NUM_CHILD_RC_PARAMS, tag
                );
                markPageParams(rcPage, NUM_CHILD_RC_PARAMS);
                rcPages[p] = rcPage;
            }
            childTrackRCs[flatIndex] = { device: ctDevice, pages: rcPages };

            var mute = ct.mute();
            mute.markInterested();
            muteStates[flatIndex] = mute;

            var arm = ct.arm();
            arm.markInterested();
            armStates[flatIndex] = arm;

            (function(btnIdx) {
                mute.addValueObserver(function(isMuted) {
                    if (activeCandidate && activeCandidate.muteStates[btnIdx] === muteStates[btnIdx]) {
                        var cc = CC.BTN_U1 + btnIdx;
                        var ledValue = isMuted ? 0 : 127;
                        for (var ch = 0; ch < 16; ch++) {
                            midiOut.sendMidi(0xB0 + ch, cc, ledValue);
                        }
                    }
                });
                arm.addValueObserver(function(isArmed) {
                    if (activeCandidate && activeCandidate.armStates[btnIdx] === armStates[btnIdx]) {
                        var cc = CC.BTN_B1 + btnIdx;
                        var ledValue = isArmed ? 0 : 127;
                        for (var ch = 0; ch < 16; ch++) {
                            midiOut.sendMidi(0xB0 + ch, cc, ledValue);
                        }
                    }
                });
            })(flatIndex);
        }
    }

    return {
        id: id,
        track: track,
        device: device,
        devicePages: devicePages,
        volumesPage: volumesPage,
        tracksPages: tracksPages,
        subGroupPages: subGroupPages,
        childTracks: childTracks,
        childTrackSends: childTrackSends,
        childTrackRCs: childTrackRCs,
        muteStates: muteStates,
        armStates: armStates
    };
}

function markPageParams(page, count) {
    for (var j = 0; j < count; j++) {
        var param = page.getParameter(j);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
    }
    autoSelectPageWhenAvailable(page);
}

function autoSelectPageWhenAvailable(page) {
    page.selectedPageIndex().markInterested();
    page.pageCount().markInterested();
    page.pageCount().addValueObserver(function(count) {
        if (count > 0 && page.selectedPageIndex().get() < 0) {
            page.selectedPageIndex().set(0);
        }
    });
}

function observeCandidate(c) {
    c.track.exists().addValueObserver(function() { resolveActiveCandidate(); });
    c.track.name().addValueObserver(function() { resolveActiveCandidate(); });
}

function resolveActiveCandidate() {
    var match = null;
    for (var d = 0; d < candidates.length; d++) {
        var c = candidates[d];
        if (c.track.exists().get() && c.track.name().get() === TARGET_TRACK_NAME) {
            match = c;
            break;
        }
    }
    if (!match && parentCandidate.track.exists().get() &&
        parentCandidate.track.name().get() === TARGET_TRACK_NAME) {
        match = parentCandidate;
    }
    if (match !== activeCandidate) {
        activeCandidate = match;
        log("Active candidate changed to " + (activeCandidate ? activeCandidate.id : "NONE"));
        refreshAllLEDs();
    }
}

function active() {
    return activeCandidate;
}

function refreshAllLEDs() {
    var a = active();
    for (var i = 0; i < NUM_CHILDREN; i++) {
        var muteVal = 127;
        var armVal = 127;
        if (a) {
            var ct = a.childTracks[i];
            if (ct && ct.exists().get()) {
                muteVal = a.muteStates[i].get() ? 0 : 127;
                armVal = a.armStates[i].get() ? 0 : 127;
            }
        }
        for (var ch = 0; ch < 16; ch++) {
            midiOut.sendMidi(0xB0 + ch, CC.BTN_U1 + i, muteVal);
            midiOut.sendMidi(0xB0 + ch, CC.BTN_B1 + i, armVal);
        }
    }
}

function onMidi(status, data1, data2) {
    var msgType = status & 0xF0;
    var channel = status & 0x0F;
    if (msgType === 0xB0) {
        handleCC(channel, data1, data2);
    }
}

function handleCC(channel, cc, value) {
    if (channel >= CH_CHILD_START && channel <= CH_CHILD_END) {
        var trackIndex = channel - CH_CHILD_START;
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleChildRCEncoder(trackIndex, cc - CC.ENC_T1, 0, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleChildRCEncoder(trackIndex, cc - CC.ENC_M1, 1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleChildRCEncoder(trackIndex, cc - CC.ENC_B1, 2, value);
            return;
        }
    }

    if (channel === CH_PRIMARY_1 || channel === CH_PRIMARY_2) {
        var paramOffset = (channel === CH_PRIMARY_1) ? 0 : 4;
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
            handleSendEncoder(cc - CC.ENC_B1, 2, value);
            return;
        }
    }

    if (channel === CH_MODE12) {
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleMode12Encoder(cc - CC.ENC_T1, 0, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleMode12Encoder(cc - CC.ENC_M1, 1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleMode12Encoder(cc - CC.ENC_B1, 2, value);
            return;
        }
    }

    if (channel === CH_MODE13) {
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleMode13Encoder(cc - CC.ENC_T1, 0, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleMode13Encoder(cc - CC.ENC_M1, 1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleMode13Encoder(cc - CC.ENC_B1, 2, value);
            return;
        }
    }

    if (cc >= CC.FADER1 && cc <= CC.FADER8) {
        handleFader(cc - CC.FADER1, value);
        return;
    }

    if (cc >= CC.BTN_U1 && cc <= CC.BTN_U8) {
        handleUpperButton(cc - CC.BTN_U1);
        return;
    }

    if (cc >= CC.BTN_B1 && cc <= CC.BTN_B8) {
        handleBottomButton(cc - CC.BTN_B1);
        return;
    }
}

function handleUpperButton(buttonIndex) {
    var a = active();
    if (!a) return;
    var track = a.childTracks[buttonIndex];
    if (!track || !track.exists().get()) return;
    var mute = a.muteStates[buttonIndex];
    if (mute) mute.toggle();
}

function handleBottomButton(buttonIndex) {
    var a = active();
    if (!a) return;
    var track = a.childTracks[buttonIndex];
    if (!track || !track.exists().get()) return;
    var arm = a.armStates[buttonIndex];
    if (arm) arm.toggle();
}

function handleFader(faderIndex, value) {
    var a = active();
    if (!a) return;
    var param = a.volumesPage.getParameter(faderIndex);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function handleSendEncoder(trackIndex, sendIndex, value) {
    var a = active();
    if (!a) return;
    var sends = a.childTrackSends[trackIndex];
    if (!sends) return;
    var send = sends[sendIndex];
    if (!send || !send.exists().get()) return;
    send.set(value / 127.0);
}

function handleChildRCEncoder(trackIndex, pageIndex, paramIndex, value) {
    var a = active();
    if (!a) return;
    var rc = a.childTrackRCs[trackIndex];
    if (!rc) return;
    var page = rc.pages[pageIndex];
    if (!page) return;
    var param = page.getParameter(paramIndex);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function handleMode12Encoder(columnIndex, rowIndex, value) {
    if (!mode12Found) return;
    var page = mode12Pages[columnIndex];
    if (!page) return;
    var param = page.getParameter(MODE12_PARAM_OFFSET + rowIndex);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function handleMode13Encoder(columnIndex, rowIndex, value) {
    if (!mode12Found) return;
    var pages = mode13ChildPages[columnIndex];
    if (!pages) return;
    var page = pages[0];
    if (!page) return;
    var param = page.getParameter(MODE13_PARAM_OFFSET + rowIndex);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function handleEncoderColumn(columnIndex, paramIndex, value, channel) {
    var a = active();
    if (!a) return;
    var page = a.devicePages[columnIndex];
    if (!page) return;
    var param = page.getParameter(paramIndex);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function logTrackStatus() {
    if (!DEBUG) return;
    log("=== LCXL3-AR Track Status ===");
    for (var d = 0; d < candidates.length; d++) {
        var c = candidates[d];
        if (!c.track.exists().get()) continue;
        log("  " + c.id + ": exists=" + c.track.exists().get() +
            " name=" + c.track.name().get() +
            " device=" + c.device.name().get());
    }
    var pc = parentCandidate;
    log("  " + pc.id + ": exists=" + pc.track.exists().get() +
        " name=" + pc.track.name().get() +
        " device=" + pc.device.name().get());
    log("Active candidate: " + (activeCandidate ? activeCandidate.id : "NONE"));

    var a = active();
    if (a) {
        log("--- Primary Device Pages ---");
        for (var i = 0; i < 8; i++) {
            var count = 0;
            for (var p = 0; p < 7; p++) {
                if (a.devicePages[i].getParameter(p).exists().get()) count++;
            }
            if (count > 0) log("  Page '" + (i + 1) + "': " + count + "/7 params");
        }
        log("--- Tracks Pages (tags: " + TRACKS_PAGE_TAG + "1-" + NUM_TRACKS_PAGES + ") ---");
        for (var i = 0; i < NUM_TRACKS_PAGES; i++) {
            var tCount = 0;
            for (var p = 0; p < 8; p++) {
                if (a.tracksPages[i].getParameter(p).exists().get()) tCount++;
            }
            log("  Page '" + TRACKS_PAGE_TAG + (i + 1) + "': " + tCount + "/8 params");
        }
        log("--- Volumes Page ---");
        var vCount = 0;
        for (var p = 0; p < 8; p++) {
            if (a.volumesPage.getParameter(p).exists().get()) vCount++;
        }
        log("  " + vCount + "/8 params mapped");
        log("--- Mode 12 (" + MODE12_TARGET_TRACK + ") ---");
        log("  found=" + mode12Found + " device=" + (mode12Found && mode12Device.exists().get() ? mode12Device.name().get() : "n/a"));
        for (var m = 0; m < 8; m++) {
            var mCount = 0;
            for (var mp = MODE12_PARAM_OFFSET; mp < MODE12_PARAM_OFFSET + 3; mp++) {
                if (mode12Pages[m].getParameter(mp).exists().get()) mCount++;
            }
            if (mCount > 0) log("  Page 'c" + (m + 1) + "': " + mCount + "/3 slots (4-6)");
        }
        log("--- Mode 13 (children of " + MODE12_TARGET_TRACK + ", " + MODE13_PAGE_TAG_PREFIX + "1) ---");
        for (var c = 0; c < MODE13_NUM_CHILDREN; c++) {
            var child = mode13ChildBank.getItemAt(c);
            if (!child.exists().get()) continue;
            var page = mode13ChildPages[c][0];
            if (!page) continue;
            var pCount = 0;
            for (var cp = MODE13_PARAM_OFFSET; cp < MODE13_PARAM_OFFSET + MODE13_PARAMS_PER_PAGE; cp++) {
                if (page.getParameter(cp).exists().get()) pCount++;
            }
            if (pCount > 0) {
                log("  Child " + (c + 1) + " (" + child.name().get() + "): " + pCount + "/3 params on " +
                    MODE13_PAGE_TAG_PREFIX + "1");
            }
        }
        log("--- Child Tracks ---");
        for (var t = 0; t < NUM_CHILDREN; t++) {
            var ct = a.childTracks[t];
            if (ct && ct.exists().get()) {
                log("  Child " + (t + 1) + ": " + ct.name().get());
            }
        }
    }
    log("=============================");
}

function log(msg) {
    if (DEBUG) host.println(msg);
}

function flush() {}

function exit() {
    log("LCXL3-AR - Exiting...");
}
