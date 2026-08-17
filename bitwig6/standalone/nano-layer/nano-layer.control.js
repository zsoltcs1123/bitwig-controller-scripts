loadAPI(25);

host.defineController("Korg", "nano-layer", "0.1", "f7a2c31e-8b04-4d6f-a9e1-3c5d7e2f0b18", "Zsolt");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["nanoKONTROL2"], ["nanoKONTROL2"]);

const CC_S_BUTTONS = [32, 33, 34, 35, 36, 37, 38, 39];
const CC_M_BUTTONS = [48, 49, 50, 51, 52, 53, 54, 55];
const CC_R_BUTTONS = [64, 65, 66, 67, 68, 69, 70, 71];
const CC_KNOBS = [16, 17, 18, 19, 20, 21, 22, 23];
const CC_FADERS = [0, 1, 2, 3, 4, 5, 6, 7];
const BUTTON_CC_ROWS = [CC_S_BUTTONS, CC_M_BUTTONS, CC_R_BUTTONS];

const PINNED_TRACK_INDEX = 0;
const NUM_TRACKS = 8;

let midiOut;
let groupPerformPage;
let groupFxPage;
let childLayersPages = [];

function init() {
    const midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    const trackBank = host.createTrackBank(NUM_TRACKS, 0, 0, false);
    const pinnedTrack = trackBank.getItemAt(PINNED_TRACK_INDEX);
    pinnedTrack.exists().markInterested();
    pinnedTrack.isGroup().markInterested();

    groupPerformPage = pinnedTrack.createCursorRemoteControlsPage("perform", 8, "perform");
    for (let i = 0; i < 8; i++) {
        groupPerformPage.getParameter(i).markInterested();
        groupPerformPage.getParameter(i).setIndication(true);
    }

    groupFxPage = pinnedTrack.createCursorRemoteControlsPage("fx", 8, "fx");
    for (let i = 0; i < 8; i++) {
        groupFxPage.getParameter(i).markInterested();
        groupFxPage.getParameter(i).setIndication(true);
    }

    const childTrackBank = pinnedTrack.createTrackBank(NUM_TRACKS, 0, 0, false);

    for (let i = 0; i < NUM_TRACKS; i++) {
        const childTrack = childTrackBank.getItemAt(i);
        childTrack.exists().markInterested();

        const primaryDevice = childTrack.createDeviceBank(1).getDevice(0);
        const layersPage = primaryDevice.createCursorRemoteControlsPage("ChildLayers" + i, 3, "layers");

        for (let j = 0; j < 3; j++) {
            layersPage.getParameter(j).markInterested();
            layersPage.getParameter(j).setIndication(true);

            const trackIdx = i;
            const paramIdx = j;
            layersPage.getParameter(j).value().addValueObserver(function (value) {
                midiOut.sendMidi(0xB0, BUTTON_CC_ROWS[paramIdx][trackIdx], value > 0.5 ? 127 : 0);
            });
        }

        childLayersPages[i] = layersPage;
    }

    turnOffAllButtonLeds();
    host.println("nano-layer: Initialized.");
}

function onMidi(status, data1, data2) {
    if ((status & 0xF0) !== 0xB0) return;

    const knobIndex = CC_KNOBS.indexOf(data1);
    if (knobIndex !== -1) {
        groupPerformPage.getParameter(knobIndex).set(data2 / 127.0);
        return;
    }

    const faderIndex = CC_FADERS.indexOf(data1);
    if (faderIndex !== -1) {
        groupFxPage.getParameter(faderIndex).set(data2 / 127.0);
        return;
    }

    if (data2 === 0) return;

    for (let row = 0; row < 3; row++) {
        const trackIndex = BUTTON_CC_ROWS[row].indexOf(data1);
        if (trackIndex !== -1) {
            const param = childLayersPages[trackIndex].getParameter(row);
            param.set(param.get() > 0.5 ? 0.0 : 1.0);
            return;
        }
    }
}

function turnOffAllButtonLeds() {
    for (let i = 0; i < NUM_TRACKS; i++) {
        midiOut.sendMidi(0xB0, CC_S_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_M_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_R_BUTTONS[i], 0);
    }
}

function exit() {
    turnOffAllButtonLeds();
    host.println("nano-layer: Exited.");
}
