loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini AR 1",
    "1.0",
    "b2c3d4e5-f6a7-8901-2345-67890bcdef12",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const LED_GLOBAL_CHANNEL = 0;
const DEBUG = true;

const PINNED_TRACK_INDEX = 0;

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
    
    LAYER_A: 84,
    LAYER_B: 85,
    
    LED_BUTTON_UPPER_1: 89, LED_BUTTON_UPPER_2: 90, LED_BUTTON_UPPER_3: 40, LED_BUTTON_UPPER_4: 41,
    LED_BUTTON_UPPER_5: 42, LED_BUTTON_UPPER_6: 43, LED_BUTTON_UPPER_7: 44, LED_BUTTON_UPPER_8: 45,
    LED_BUTTON_LOWER_1: 87, LED_BUTTON_LOWER_2: 88, LED_BUTTON_LOWER_3: 91, LED_BUTTON_LOWER_4: 92,
    LED_BUTTON_LOWER_5: 86, LED_BUTTON_LOWER_6: 93, LED_BUTTON_LOWER_7: 94, LED_BUTTON_LOWER_8: 95,
    LED_LAYER_A: 84,
    LED_LAYER_B: 85,
};

const LED_RING_BEHAVIOR = {
    SINGLE: 0,
    PAN: 1,
    FAN: 2,
    SPREAD: 3,
    TRIM: 4
};

const LED_STATE = {
    OFF: 0,
    ON: 127,
    BLINKING: 1,
    ON_ALT: 64
};

const MODE = {
    PLAY: 'PLAY',
    MIXER: 'MIXER'
};

let midiIn, midiOut;
let currentMode = MODE.PLAY;
let selectedChildIndex = 0;
let faderValue = 0.0;
let layerAActive = false;
let currentPageIndex = 0;

let trackBank;
let pinnedTrack;
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;

let childTrackBank;
let childTracks = [];

let groupTrackVolumesPage;
let groupTrackMutesPage;
let groupTrackPerformPage;
let groupTrackDeviceBank;
let groupTrackPrimaryDevice;
let groupTrackAdditionalPages = [];

let childTrackDevicePages = [];
let childTrackMutesPages = [];
let childTrackAdditionalPages = [];
let childTrackClipLauncherSlotBanks = [];

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    
    midiIn.setMidiCallback(onMidi);
    
    setupTracks();
    
    initializeLEDRings();
    
    setLayerLED('A', LED_STATE.OFF);
    setLayerLED('B', LED_STATE.OFF);
    
    initializeButtonLEDs();
    
    if (DEBUG) {
        host.println("=== X-Touch Mini AR initialized ===");
        host.println(`Pinned to track index: ${PINNED_TRACK_INDEX}`);
        host.println(`Current mode: ${currentMode}`);
        host.println(`Selected child index: ${selectedChildIndex}`);
        host.println("===================================");
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (command === 0xE0 && channel === FADER_MIDI_CHANNEL) {
        handleFaderPitchBend(data1, data2);
        return;
    }
    
    if (channel !== INPUT_MIDI_CHANNEL) return;
    
    if (DEBUG) {
        const commandName = command === 0xB0 ? 'CC' : command === 0x90 ? 'NoteOn' : command === 0x80 ? 'NoteOff' : 'Unknown';
        host.println(`MIDI: ${commandName} Status=0x${status.toString(16)} Data1=${data1} Data2=${data2} Channel=${channel + 1}`);
    }
    
    if (command === 0xB0) {
        handleControlChange(data1, data2);
    } else if (command === 0x90 || command === 0x80) {
        const isNoteOn = (command === 0x90) && (data2 > 0);
        handleNote(data1, isNoteOn, data2);
    }
}

function handleControlChange(cc, value) {
    if (cc >= CC.ENCODER_1 && cc <= CC.ENCODER_8) {
        const encoderIndex = cc - CC.ENCODER_1;
        handleEncoderTurn(encoderIndex, value);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled CC: ${cc} Value: ${value}`);
    }
}

function handleNote(note, isPressed, velocity) {
    if (note >= NOTE.ENCODER_PUSH_1 && note <= NOTE.ENCODER_PUSH_8) {
        const encoderIndex = note - NOTE.ENCODER_PUSH_1;
        handleEncoderPush(encoderIndex, isPressed);
        return;
    }
    
    const upperButtons = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                         NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    const upperIndex = upperButtons.indexOf(note);
    if (upperIndex !== -1) {
        handleUpperButton(upperIndex, isPressed);
        return;
    }
    
    const lowerButtons = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                         NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    const lowerIndex = lowerButtons.indexOf(note);
    if (lowerIndex !== -1) {
        handleLowerButton(lowerIndex, isPressed);
        return;
    }
    
    if (note === NOTE.LAYER_A) {
        handleLayerButton('A', isPressed);
        return;
    }
    if (note === NOTE.LAYER_B) {
        handleLayerButton('B', isPressed);
        return;
    }
    
    if (DEBUG) {
        host.println(`Unhandled Note: ${note} Pressed: ${isPressed} Velocity: ${velocity}`);
    }
}

function handleEncoderTurn(encoderIndex, value) {
    let increment = 0;

    if (value >= 1 && value <= 63) {
        increment = 0.03;
    } else if (value >= 65 && value <= 127) {
        increment = -0.03;
    } else {
        return;
    }
    
    if (!pinnedTrackIsGroup) {
        if (DEBUG) {
            host.println(`Encoder ${encoderIndex + 1} turned: ${increment > 0 ? 'CW' : 'CCW'} (non-group mode not implemented)`);
        }
        return;
    }
    
    if (currentMode === MODE.MIXER || currentMode === MODE.PLAY) {
        let page = null;
        let pageName = "";
        
        if (layerAActive) {
            if (currentPageIndex === 0) {
                page = childTrackDevicePages[selectedChildIndex];
                pageName = "Child Perform";
            } else if (currentPageIndex >= 2 && currentPageIndex <= 7) {
                const additionalPages = childTrackAdditionalPages[selectedChildIndex];
                if (additionalPages) {
                    page = additionalPages[currentPageIndex];
                    pageName = `Child P${currentPageIndex}`;
                }
            }
        } else {
            if (currentPageIndex === 0) {
                page = groupTrackPerformPage;
                pageName = "Group Perform";
            } else if (currentPageIndex >= 2 && currentPageIndex <= 7) {
                page = groupTrackAdditionalPages[currentPageIndex];
                pageName = `Group P${currentPageIndex}`;
            }
        }
        
        if (page) {
            const param = page.getParameter(encoderIndex);
            if (param && param.exists().get()) {
                param.inc(increment);
                updateEncoderLEDRing(encoderIndex, param.get());
                
                if (DEBUG && Math.random() < 0.1) {
                    host.println(`Encoder ${encoderIndex + 1} -> ${pageName}: ${param.name().get()} = ${param.get().toFixed(2)}`);
                }
            }
        }
    }
}

function handleEncoderPush(encoderIndex, isPressed) {
    if (!isPressed) return;
    
    if (DEBUG) {
        host.println(`Encoder ${encoderIndex + 1} pushed in mode: ${currentMode}`);
    }
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (currentMode === MODE.MIXER || currentMode === MODE.PLAY) {
        if (encoderIndex === 0) {
            currentPageIndex = 0;
            if (DEBUG) {
                host.println(`Page selector: Back to ${layerAActive ? 'c_perform' : 'perform'} page`);
            }
        } else {
            const newPageIndex = encoderIndex + 1;
            if (newPageIndex >= 2 && newPageIndex <= 7) {
                currentPageIndex = newPageIndex;
                if (DEBUG) {
                    host.println(`Page selector: Switched to p${newPageIndex} page (${layerAActive ? 'child' : 'group'})`);
                }
            }
        }
        updateEncoderLEDRingsForCurrentMode();
    }
}

function handleUpperButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'} in mode: ${currentMode}`);
    }
    
    if (!isPressed) return;
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (currentMode === MODE.MIXER) {
        const param = groupTrackMutesPage.getParameter(buttonIndex);
        if (param && param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0.5 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Toggled Group mute ${buttonIndex + 1}: ${param.name().get()} = ${newValue > 0.5 ? 'ON' : 'OFF'}`);
            }
        }
    } else if (currentMode === MODE.PLAY) {
        const param = childTrackMutesPages[selectedChildIndex].getParameter(buttonIndex);
        if (param && param.exists().get()) {
            const currentValue = param.value().get();
            const newValue = currentValue > 0.5 ? 0 : 127;
            param.value().set(newValue, 128);
            
            if (DEBUG) {
                host.println(`Toggled Child ${selectedChildIndex} mute ${buttonIndex + 1}: ${param.name().get()} = ${newValue > 0.5 ? 'ON' : 'OFF'}`);
            }
        }
    }
}

function handleLowerButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'} in mode: ${currentMode}`);
    }
    
    if (!isPressed) return;
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (currentMode === MODE.MIXER) {
        selectChildTrack(buttonIndex);
    } else if (currentMode === MODE.PLAY) {
        launchClipOnSelectedChild(buttonIndex);
    }
}

function launchClipOnSelectedChild(slotIndex) {
    const clipSlotBank = childTrackClipLauncherSlotBanks[selectedChildIndex];
    if (!clipSlotBank) {
        if (DEBUG) {
            host.println(`Clip launcher not available for child ${selectedChildIndex}`);
        }
        return;
    }
    
    const childTrack = childTracks[selectedChildIndex];
    if (!childTrack || !childTrack.exists().get()) {
        if (DEBUG) {
            host.println(`Child track ${selectedChildIndex} does not exist`);
        }
        return;
    }
    
    const clipSlot = clipSlotBank.getItemAt(slotIndex);
    if (clipSlot) {
        if (DEBUG) {
            host.println(`Launching clip slot ${slotIndex} on child track ${selectedChildIndex}: ${childTrack.name().get()}`);
        }
        clipSlot.launch();
    } else {
        if (DEBUG) {
            host.println(`Clip slot ${slotIndex} does not exist on child ${selectedChildIndex}`);
        }
    }
}

function selectChildTrack(childIndex) {
    if (!pinnedTrackIsGroup || !childTrackBank) {
        if (DEBUG) {
            host.println(`Cannot select child ${childIndex} - not in group mode`);
        }
        return;
    }
    
    if (childIndex < 0 || childIndex > 7) {
        if (DEBUG) {
            host.println(`Invalid child index: ${childIndex}`);
        }
        return;
    }
    
    const childTrack = childTracks[childIndex];
    if (!childTrack || !childTrack.exists().get()) {
        if (DEBUG) {
            host.println(`Child track ${childIndex} does not exist`);
        }
        return;
    }
    
    selectedChildIndex = childIndex;
    
    if (DEBUG) {
        host.println(`Selected child track ${selectedChildIndex}: ${childTrack.name().get()}`);
    }
    
    updateLowerButtonLEDs();
}

function handleFaderPitchBend(lsb, msb) {
    const pitchBendValue = (msb << 7) | lsb;
    const normalizedValue = pitchBendValue / 16383.0;
    
    faderValue = normalizedValue;
    
    if (DEBUG && Math.random() < 0.1) {
        host.println(`Fader: ${faderValue.toFixed(3)} (raw=${pitchBendValue})`);
    }
    
    const newMode = faderValue > 0.5 ? MODE.MIXER : MODE.PLAY;
    
    if (newMode !== currentMode) {
        currentMode = newMode;
        
        if (DEBUG) {
            host.println(`Mode switch: ${currentMode} (fader=${faderValue.toFixed(2)})`);
        }
        
        onModeChange();
    }
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'} in mode: ${currentMode}`);
    }
    
    if (!isPressed) return;
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (currentMode === MODE.MIXER || currentMode === MODE.PLAY) {
        if (layer === 'A') {
            layerAActive = !layerAActive;
            currentPageIndex = 0;
            
            if (DEBUG) {
                host.println(`Layer A toggled: ${layerAActive ? 'CHILD' : 'GROUP'} - encoders now map to ${layerAActive ? 'c_perform' : 'perform'} page`);
            }
            
            setLayerLED('A', layerAActive ? LED_STATE.ON : LED_STATE.OFF);
            updateEncoderLEDRingsForCurrentMode();
            updateLowerButtonLEDs();
        } else if (layer === 'B') {
            stopAllClipsOnSelectedChild();
        }
    }
}

function stopAllClipsOnSelectedChild() {
    const childTrack = childTracks[selectedChildIndex];
    if (!childTrack || !childTrack.exists().get()) {
        if (DEBUG) {
            host.println(`Cannot stop clips - child track ${selectedChildIndex} does not exist`);
        }
        return;
    }
    
    if (DEBUG) {
        host.println(`Stopping all clips on child track ${selectedChildIndex}: ${childTrack.name().get()}`);
    }
    
    childTrack.stop();
}

function onModeChange() {
    if (DEBUG) {
        host.println(`Mode changed to: ${currentMode}`);
    }
    
    updateUpperButtonLEDs();
    updateLowerButtonLEDs();
    updateEncoderLEDRingsForCurrentMode();
}

function updateEncoderLEDRingsForCurrentMode() {
    if (!pinnedTrackIsGroup) {
        for (let i = 0; i < 8; i++) {
            setLEDRingValue(i, 32);
        }
        return;
    }
    
    if (currentMode === MODE.MIXER || currentMode === MODE.PLAY) {
        let page = null;
        
        if (layerAActive) {
            if (currentPageIndex === 0) {
                page = childTrackDevicePages[selectedChildIndex];
            } else if (currentPageIndex >= 2 && currentPageIndex <= 7) {
                const additionalPages = childTrackAdditionalPages[selectedChildIndex];
                if (additionalPages) {
                    page = additionalPages[currentPageIndex];
                }
            }
        } else {
            if (currentPageIndex === 0) {
                page = groupTrackPerformPage;
            } else if (currentPageIndex >= 2 && currentPageIndex <= 7) {
                page = groupTrackAdditionalPages[currentPageIndex];
            }
        }
        
        if (page) {
            for (let i = 0; i < 8; i++) {
                const param = page.getParameter(i);
                if (param && param.exists().get()) {
                    updateEncoderLEDRing(i, param.get());
                } else {
                    setLEDRingValue(i, 32);
                }
            }
        } else {
            for (let i = 0; i < 8; i++) {
                setLEDRingValue(i, 32);
            }
        }
    }
}

function updateUpperButtonLEDs() {
    if (!pinnedTrackIsGroup) {
        for (let i = 0; i < 8; i++) {
            setUpperButtonLED(i, LED_STATE.OFF);
        }
        return;
    }
    
    if (currentMode === MODE.MIXER) {
        for (let i = 0; i < 8; i++) {
            const param = groupTrackMutesPage.getParameter(i);
            if (param && param.exists().get()) {
                const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setUpperButtonLED(i, ledState);
            } else {
                setUpperButtonLED(i, LED_STATE.OFF);
            }
        }
    } else if (currentMode === MODE.PLAY) {
        const mutesPage = childTrackMutesPages[selectedChildIndex];
        if (mutesPage) {
            for (let i = 0; i < 8; i++) {
                const param = mutesPage.getParameter(i);
                if (param && param.exists().get()) {
                    const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                    setUpperButtonLED(i, ledState);
                } else {
                    setUpperButtonLED(i, LED_STATE.OFF);
                }
            }
        } else {
            for (let i = 0; i < 8; i++) {
                setUpperButtonLED(i, LED_STATE.OFF);
            }
        }
    }
}

function updateLowerButtonLEDs() {
    if (!pinnedTrackIsGroup) {
        for (let i = 0; i < 8; i++) {
            setLowerButtonLED(i, LED_STATE.OFF);
        }
        return;
    }
    
    if (currentMode === MODE.MIXER) {
        for (let i = 0; i < 8; i++) {
            if (childTracks[i] && childTracks[i].exists().get()) {
                if (i === selectedChildIndex) {
                    setLowerButtonLED(i, LED_STATE.ON);
                } else {
                    setLowerButtonLED(i, LED_STATE.OFF);
                }
            } else {
                setLowerButtonLED(i, LED_STATE.OFF);
            }
        }
    } else if (currentMode === MODE.PLAY) {
        const clipSlotBank = childTrackClipLauncherSlotBanks[selectedChildIndex];
        if (clipSlotBank) {
            for (let i = 0; i < 8; i++) {
                const slot = clipSlotBank.getItemAt(i);
                if (slot) {
                    if (slot.isPlaying().get()) {
                        setLowerButtonLED(i, LED_STATE.ON);
                    } else if (slot.hasContent().get()) {
                        setLowerButtonLED(i, LED_STATE.OFF);
                    } else {
                        setLowerButtonLED(i, LED_STATE.OFF);
                    }
                } else {
                    setLowerButtonLED(i, LED_STATE.OFF);
                }
            }
        } else {
            for (let i = 0; i < 8; i++) {
                setLowerButtonLED(i, LED_STATE.OFF);
            }
        }
    }
}

function setupTracks() {
    if (DEBUG) {
        host.println("Setting up track management...");
    }
    
    try {
        trackBank = host.createTrackBank(8, 0, 0, false);
        pinnedTrack = trackBank.getTrack(PINNED_TRACK_INDEX);
        
        pinnedTrack.exists().markInterested();
        pinnedTrack.name().markInterested();
        pinnedTrack.isGroup().markInterested();
        
        groupTrackVolumesPage = pinnedTrack.createCursorRemoteControlsPage("GroupVolumes", 8, "volumes");
        groupTrackMutesPage = pinnedTrack.createCursorRemoteControlsPage("GroupMutes", 8, "mutes");
        groupTrackPerformPage = pinnedTrack.createCursorRemoteControlsPage("GroupPerform", 8, "perform");
        
        groupTrackDeviceBank = pinnedTrack.createDeviceBank(8);
        groupTrackPrimaryDevice = groupTrackDeviceBank.getDevice(0);
        
        for (let i = 2; i <= 7; i++) {
            const page = pinnedTrack.createCursorRemoteControlsPage("GroupP" + i, 8, "p" + i);
            groupTrackAdditionalPages[i] = page;
            for (let j = 0; j < 8; j++) {
                const param = page.getParameter(j);
                param.exists().markInterested();
                param.value().markInterested();
            }
        }
        
        childTrackBank = pinnedTrack.createTrackBank(8, 0, 8, false);
        
        for (let i = 0; i < 8; i++) {
            const childTrack = childTrackBank.getTrack(i);
            childTracks[i] = childTrack;
            
            childTrack.exists().markInterested();
            childTrack.name().markInterested();
            
            const deviceBank = childTrack.createDeviceBank(8);
            const primaryDevice = deviceBank.getDevice(0);
            const devicePage = primaryDevice.createCursorRemoteControlsPage("ChildDevice" + i, 8, "c_perform");
            childTrackDevicePages[i] = devicePage;
            
            const mutesPage = primaryDevice.createCursorRemoteControlsPage("ChildMutes" + i, 8, "c_mutes");
            childTrackMutesPages[i] = mutesPage;
            
            const additionalPages = [];
            for (let j = 2; j <= 7; j++) {
                const page = childTrack.createCursorRemoteControlsPage("ChildP" + i + "_" + j, 8, "p" + j);
                additionalPages[j] = page;
                for (let k = 0; k < 8; k++) {
                    const param = page.getParameter(k);
                    param.exists().markInterested();
                    param.value().markInterested();
                }
            }
            childTrackAdditionalPages[i] = additionalPages;
            
            const clipSlots = childTrack.clipLauncherSlotBank();
            childTrackClipLauncherSlotBanks[i] = clipSlots;
        }
        
        if (DEBUG) {
            host.println("Child track bank created (will be used if pinned track is a group)");
        }
        
        setupTrackObservers();
        setupRemoteControlPageObservers();
        setupClipLauncherObservers();
        
        host.scheduleTask(logTrackStatus, null, 100);
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupTracks: ${error}`);
        }
    }
}

function setupTrackObservers() {
    pinnedTrack.exists().addValueObserver(function(exists) {
        pinnedTrackExists = exists;
        if (DEBUG) {
            host.println(`Pinned track exists: ${exists}`);
        }
    });
    
    pinnedTrack.name().addValueObserver(function(name) {
        if (DEBUG) {
            host.println(`Pinned track name: ${name}`);
        }
    });
    
    pinnedTrack.isGroup().addValueObserver(function(isGroup) {
        pinnedTrackIsGroup = isGroup;
        if (DEBUG) {
            host.println(`Pinned track is group: ${isGroup}`);
        }
        if (isGroup) {
            updateUpperButtonLEDs();
            updateLowerButtonLEDs();
        }
    });
    
    for (let i = 0; i < 8; i++) {
        const childIndex = i;
        childTracks[i].exists().addValueObserver(function(exists) {
            if (DEBUG) {
                host.println(`Child track ${childIndex} exists: ${exists}`);
            }
            if (pinnedTrackIsGroup) {
                updateLowerButtonLEDs();
            }
        });
        
        childTracks[i].name().addValueObserver(function(name) {
            if (DEBUG && name && pinnedTrackIsGroup) {
                host.println(`Child track ${childIndex} name: ${name}`);
            }
        });
    }
}

function setupRemoteControlPageObservers() {
    for (let i = 0; i < 8; i++) {
        const param = groupTrackVolumesPage.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        
        const encoderIndex = i;
        param.value().addValueObserver(function(value) {
            if (pinnedTrackIsGroup && currentMode === MODE.MIXER) {
                updateEncoderLEDRing(encoderIndex, value);
            }
        });
    }
    
    for (let i = 0; i < 8; i++) {
        const param = groupTrackMutesPage.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        
        const buttonIndex = i;
        param.value().addValueObserver(function(value) {
            if (pinnedTrackIsGroup && currentMode === MODE.MIXER) {
                const ledState = value > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                setUpperButtonLED(buttonIndex, ledState);
            }
        });
    }
    
    for (let i = 0; i < 8; i++) {
        const childIndex = i;
        const mutesPage = childTrackMutesPages[i];
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            const param = mutesPage.getParameter(paramIndex);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
            
            const buttonIndex = paramIndex;
            param.value().addValueObserver(function(value) {
                if (pinnedTrackIsGroup && currentMode === MODE.PLAY && selectedChildIndex === childIndex) {
                    const ledState = value > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                    setUpperButtonLED(buttonIndex, ledState);
                }
            });
        }
    }
    
    for (let i = 0; i < 8; i++) {
        const param = groupTrackPerformPage.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        
        const encoderIndex = i;
        param.value().addValueObserver(function(value) {
            if (pinnedTrackIsGroup && currentMode === MODE.PLAY && !layerAActive && currentPageIndex === 0) {
                updateEncoderLEDRing(encoderIndex, value);
            }
        });
    }
    
    for (let i = 0; i < 8; i++) {
        const devicePage = childTrackDevicePages[i];
        for (let paramIndex = 0; paramIndex < 8; paramIndex++) {
            const param = devicePage.getParameter(paramIndex);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
            
            const childIndex = i;
            const encoderIndex = paramIndex;
            param.value().addValueObserver(function(value) {
                if (pinnedTrackIsGroup && currentMode === MODE.PLAY && layerAActive && 
                    selectedChildIndex === childIndex && currentPageIndex === 0) {
                    updateEncoderLEDRing(encoderIndex, value);
                }
            });
        }
    }
    
    if (DEBUG) {
        host.println("Remote control page observers setup complete");
    }
}

function setupClipLauncherObservers() {
    if (DEBUG) {
        host.println("Setting up clip launcher observers...");
    }
    
    try {
        for (let i = 0; i < 8; i++) {
            const clipSlotBank = childTrackClipLauncherSlotBanks[i];
            if (clipSlotBank) {
                const childIndex = i;
                for (let slotIndex = 0; slotIndex < 8; slotIndex++) {
                    const slot = clipSlotBank.getItemAt(slotIndex);
                    if (slot) {
                        slot.hasContent().markInterested();
                        slot.isPlaying().markInterested();
                        
                        const buttonIndex = slotIndex;
                        
                        slot.isPlaying().addValueObserver((isPlaying) => {
                            if (pinnedTrackIsGroup && selectedChildIndex === childIndex && 
                                currentMode === MODE.PLAY && !layerAActive) {
                                if (isPlaying) {
                                    setLowerButtonLED(buttonIndex, LED_STATE.ON);
                                } else if (slot.hasContent().get()) {
                                    setLowerButtonLED(buttonIndex, LED_STATE.OFF);
                                } else {
                                    setLowerButtonLED(buttonIndex, LED_STATE.OFF);
                                }
                            }
                        });
                        
                        slot.hasContent().addValueObserver((hasContent) => {
                            if (pinnedTrackIsGroup && selectedChildIndex === childIndex && 
                                currentMode === MODE.PLAY && !layerAActive) {
                                if (!hasContent) {
                                    setLowerButtonLED(buttonIndex, LED_STATE.OFF);
                                } else if (!slot.isPlaying().get()) {
                                    setLowerButtonLED(buttonIndex, LED_STATE.OFF);
                                }
                            }
                        });
                    }
                }
            }
        }
        
        if (DEBUG) {
            host.println("Clip launcher observers setup complete");
        }
        
    } catch (error) {
        if (DEBUG) {
            host.println(`ERROR in setupClipLauncherObservers: ${error}`);
        }
    }
}

function initializeLEDRings() {
    for (let i = 0; i < 8; i++) {
        setLEDRingValue(i, 32);
    }
}

function initializeButtonLEDs() {
    for (let i = 0; i < 8; i++) {
        setUpperButtonLED(i, LED_STATE.OFF);
        setLowerButtonLED(i, LED_STATE.OFF);
    }
}

function setLEDRingValue(encoderIndex, value) {
    const ccNumbers = [CC.LED_RING_1, CC.LED_RING_2, CC.LED_RING_3, CC.LED_RING_4,
                       CC.LED_RING_5, CC.LED_RING_6, CC.LED_RING_7, CC.LED_RING_8];
    const cc = ccNumbers[encoderIndex];
    
    midiOut.sendMidi(0xB0 + LED_GLOBAL_CHANNEL, cc, value);
}

function updateEncoderLEDRing(encoderIndex, parameterValue) {
    let position;
    if (parameterValue <= 0.0) {
        position = 0;
    } else if (parameterValue >= 1.0) {
        position = 11;
    } else {
        position = Math.floor(parameterValue * 10) + 1;
    }
    
    const ledValue = position + 32;
    setLEDRingValue(encoderIndex, ledValue);
}

function setLayerLED(layer, state) {
    const note = (layer === 'A') ? NOTE.LAYER_A : NOTE.LAYER_B;
    const velocity = state;
    
    midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
}

function setUpperButtonLED(buttonIndex, state) {
    const upperButtonNotes = [NOTE.BUTTON_UPPER_1, NOTE.BUTTON_UPPER_2, NOTE.BUTTON_UPPER_3, NOTE.BUTTON_UPPER_4,
                             NOTE.BUTTON_UPPER_5, NOTE.BUTTON_UPPER_6, NOTE.BUTTON_UPPER_7, NOTE.BUTTON_UPPER_8];
    
    if (buttonIndex >= 0 && buttonIndex < upperButtonNotes.length) {
        const note = upperButtonNotes[buttonIndex];
        const velocity = state;
        
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function setLowerButtonLED(buttonIndex, state) {
    const lowerButtonNotes = [NOTE.BUTTON_LOWER_1, NOTE.BUTTON_LOWER_2, NOTE.BUTTON_LOWER_3, NOTE.BUTTON_LOWER_4,
                             NOTE.BUTTON_LOWER_5, NOTE.BUTTON_LOWER_6, NOTE.BUTTON_LOWER_7, NOTE.BUTTON_LOWER_8];
    
    if (buttonIndex >= 0 && buttonIndex < lowerButtonNotes.length) {
        const note = lowerButtonNotes[buttonIndex];
        const velocity = state;
        
        midiOut.sendMidi(0x90 + OUTPUT_MIDI_CHANNEL, note, velocity);
    }
}

function logTrackStatus() {
    if (DEBUG) {
        host.println("=== Track Status Summary ===");
        host.println(`Pinned track exists: ${pinnedTrackExists}`);
        host.println(`Pinned track is group: ${pinnedTrackIsGroup}`);
        host.println(`Selected child index: ${selectedChildIndex}`);
        host.println(`Current mode: ${currentMode}`);
        host.println("===========================");
    }
}

function flush() {
}

function exit() {
    if (DEBUG) {
        host.println("X-Touch Mini AR exited");
    }
}

