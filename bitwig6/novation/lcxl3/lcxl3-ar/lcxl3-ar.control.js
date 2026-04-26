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
var MAX_DEPTH = 2;

var CH_CHILD_START = 0;
var CH_CHILD_END = 7;
var CH_PRIMARY_1 = 8;
var CH_PRIMARY_2 = 9;
var CH_SENDS = 10;
var CH_SUB_GROUPS = 11;
var CH_TRACKS = 12;

var NUM_TRACKS_PAGES = 3;
var TRACKS_PAGE_TAG = "tracks-";
var NUM_SUB_GROUP_PAGES = 3;
var NUM_SUB_GROUP_PARAMS = 4;
var SUB_GROUP_PAGE_TAG = "track-";
var NUM_CHILD_RC_PAGES = 3;
var NUM_CHILD_RC_PARAMS = 8;
var NUM_SUB_GROUPS = 2;
var TRACKS_PER_SUB_GROUP = 4;
var NUM_CHILDREN = NUM_SUB_GROUPS * TRACKS_PER_SUB_GROUP;
var NUM_SENDS = 3;

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

function init() {
    log("LCXL3-AR - Initializing...");
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);
    setupCandidates();
    log("LCXL3-AR - Initialized!");
}

function setupCandidates() {
    var tracks = [];
    var bank0 = host.createTrackBank(1, 0, 0, false);
    tracks[0] = bank0.getItemAt(0);

    for (var d = 1; d < MAX_DEPTH; d++) {
        var childBank = tracks[d - 1].createTrackBank(1, 0, 0, false);
        tracks[d] = childBank.getItemAt(0);
    }

    for (var d = 0; d < MAX_DEPTH; d++) {
        candidates[d] = createCandidate(tracks[d], "d" + d);
    }

    var parentTrack = tracks[0].createParentTrack(0, 0);
    parentCandidate = createCandidate(parentTrack, "parent");

    for (var d = 0; d < MAX_DEPTH; d++) {
        observeCandidate(candidates[d]);
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
}

function observeCandidate(c) {
    c.track.exists().addValueObserver(function() { resolveActiveCandidate(); });
    c.track.name().addValueObserver(function() { resolveActiveCandidate(); });
}

function resolveActiveCandidate() {
    var match = null;
    for (var d = 0; d < MAX_DEPTH; d++) {
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

    if (channel === CH_SUB_GROUPS) {
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleSubGroupEncoder(0, cc - CC.ENC_T1, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleSubGroupEncoder(1, cc - CC.ENC_M1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleSubGroupEncoder(2, cc - CC.ENC_B1, value);
            return;
        }
    }

    if (channel === CH_TRACKS) {
        log("CH_TRACKS hit: cc=" + cc + " value=" + value);
        if (cc >= CC.ENC_T1 && cc <= CC.ENC_T8) {
            handleTracksEncoder(0, cc - CC.ENC_T1, value);
            return;
        }
        if (cc >= CC.ENC_M1 && cc <= CC.ENC_M8) {
            handleTracksEncoder(1, cc - CC.ENC_M1, value);
            return;
        }
        if (cc >= CC.ENC_B1 && cc <= CC.ENC_B8) {
            handleTracksEncoder(2, cc - CC.ENC_B1, value);
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

function handleSubGroupEncoder(pageIndex, columnIndex, value) {
    var a = active();
    if (!a) return;
    var groupIdx = columnIndex < TRACKS_PER_SUB_GROUP ? 0 : 1;
    var paramIdx = columnIndex - groupIdx * TRACKS_PER_SUB_GROUP;
    var pages = a.subGroupPages[groupIdx];
    if (!pages) return;
    var page = pages[pageIndex];
    if (!page) return;
    var param = page.getParameter(paramIdx);
    if (!param || !param.exists().get()) return;
    param.set(value / 127.0);
}

function handleTracksEncoder(pageIndex, paramIndex, value) {
    var a = active();
    if (!a) { log("TracksEnc: no active candidate"); return; }
    var page = a.tracksPages[pageIndex];
    if (!page) { log("TracksEnc: no page at index " + pageIndex); return; }
    var param = page.getParameter(paramIndex);
    if (!param) { log("TracksEnc: no param at page " + pageIndex + " param " + paramIndex); return; }
    if (!param.exists().get()) { log("TracksEnc: param not mapped - page " + pageIndex + " param " + paramIndex + " name=" + param.name().get()); return; }
    log("TracksEnc: setting page " + pageIndex + " param " + paramIndex + " (" + param.name().get() + ") = " + value);
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
    for (var d = 0; d < MAX_DEPTH; d++) {
        var c = candidates[d];
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
