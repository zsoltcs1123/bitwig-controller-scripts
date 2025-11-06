loadAPI(25);
host.setShouldFailOnDeprecatedUse(false);

host.defineController(
    "Behringer",
    "X-Touch Mini Kit Single 2",
    "1.0",
    "c3d4e5f6-a7b8-9012-3456-78901bcdef34",
    "Zsolt"
);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["X-TOUCH MINI"], ["X-TOUCH MINI"]);

const INPUT_MIDI_CHANNEL = 0;
const FADER_MIDI_CHANNEL = 8;
const OUTPUT_MIDI_CHANNEL = 0;
const LED_GLOBAL_CHANNEL = 0;
const DEBUG = true;

const PINNED_TRACK_INDEX = 1;

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
};

const LED_STATE = {
    OFF: 0,
    ON: 127,
    BLINKING: 1,
    ON_ALT: 64
};

let midiIn, midiOut;
let currentEncoderPage = 'perform';

let trackBank;
let pinnedTrack;
let pinnedTrackExists = false;
let pinnedTrackIsGroup = false;

let groupTrackPerformPage;
let groupTrackPerformExtraPage;
let groupTrackMutesPages = [];
let groupTrackLayerBPages = [];
let groupTrackDeviceBank;
let groupTrackChainSelector;
let groupTrackDeviceIndex = 0;

let childTrackBank;
let sceneBank;

let lowerButtonPressTime = [null, null, null, null, null, null, null, null];
let lowerButtonHoldTask = [null, null, null, null, null, null, null, null];
const HOLD_TIME_MS = 500;

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
        host.println("=== X-Touch Mini Kit Single initialized ===");
        host.println(`Pinned to track index: ${PINNED_TRACK_INDEX}`);
        host.println(`Current encoder page: ${currentEncoderPage}`);
        host.println("===========================================");
    }
}

function onMidi(status, data1, data2) {
    const channel = status & 0x0F;
    const command = status & 0xF0;
    
    if (command === 0xE0 && channel === FADER_MIDI_CHANNEL) {
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
    
    let page = null;
    let pageName = "";
    
    if (currentEncoderPage === 'perform') {
        page = groupTrackPerformPage;
        pageName = "perform";
    } else if (currentEncoderPage === 'perform_extra') {
        page = groupTrackPerformExtraPage;
        pageName = "perform_extra";
    } else if (currentEncoderPage === 'b') {
        page = groupTrackLayerBPages[groupTrackDeviceIndex];
        pageName = "b";
    }
    
    if (page) {
        const param = page.getParameter(encoderIndex);
        if (param && param.exists().get()) {
            param.inc(increment);
            updateEncoderLEDRing(encoderIndex, param.get());
            
            if (DEBUG) {
                host.println(`Encoder ${encoderIndex + 1} -> ${pageName}: ${param.name().get()} = ${param.get().toFixed(2)}`);
            }
        }
    }
}

function handleEncoderPush(encoderIndex, isPressed) {
    if (!isPressed) return;
    
    if (DEBUG) {
        host.println(`Encoder ${encoderIndex + 1} pushed`);
    }
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (groupTrackChainSelector && groupTrackChainSelector.exists().get()) {
        const chainCount = groupTrackChainSelector.chainCount().get();
        
        if (encoderIndex < chainCount) {
            groupTrackChainSelector.activeChainIndex().set(encoderIndex);
            
            if (DEBUG) {
                host.println(`Set group track instrument to ${encoderIndex}`);
            }
        } else {
            if (DEBUG) {
                host.println(`Encoder ${encoderIndex} is outside chain count (${chainCount})`);
            }
        }
    } else {
        if (DEBUG) {
            host.println(`Chain selector not available on group track`);
        }
    }
}

function handleUpperButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Upper button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!isPressed) return;
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    const param = groupTrackMutesPages[groupTrackDeviceIndex].getParameter(buttonIndex);
    if (param && param.exists().get()) {
        const currentValue = param.value().get();
        const newValue = currentValue > 0.5 ? 0 : 127;
        param.value().set(newValue, 128);
        
        if (DEBUG) {
            host.println(`Toggled Group mute ${buttonIndex + 1}: ${param.name().get()} = ${newValue > 0.5 ? 'ON' : 'OFF'}`);
        }
    }
}

function handleLowerButton(buttonIndex, isPressed) {
    if (DEBUG) {
        host.println(`Lower button ${buttonIndex + 1} ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (isPressed) {
        lowerButtonPressTime[buttonIndex] = Date.now();
        
        if (lowerButtonHoldTask[buttonIndex] !== null) {
            host.cancelTask(lowerButtonHoldTask[buttonIndex]);
        }
        
        let anyClipPlaying = false;
        if (childTrackBank) {
            for (let i = 0; i < 8; i++) {
                const track = childTrackBank.getItemAt(i);
                if (track && track.exists().get()) {
                    const clipSlotBank = track.clipLauncherSlotBank();
                    if (clipSlotBank) {
                        const slot = clipSlotBank.getItemAt(buttonIndex);
                        if (slot && slot.isPlaying().get()) {
                            anyClipPlaying = true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (anyClipPlaying) {
            lowerButtonHoldTask[buttonIndex] = host.scheduleTask(function() {
                stopSceneOnGroupTrack(buttonIndex);
                lowerButtonHoldTask[buttonIndex] = null;
                if (DEBUG) {
                    host.println(`Hold time reached on button ${buttonIndex + 1} - stopping all clips`);
                }
            }, null, HOLD_TIME_MS);
        }
    } else {
        const pressDuration = lowerButtonPressTime[buttonIndex] !== null 
            ? Date.now() - lowerButtonPressTime[buttonIndex] 
            : 0;
        
        if (lowerButtonHoldTask[buttonIndex] !== null) {
            host.cancelTask(lowerButtonHoldTask[buttonIndex]);
            lowerButtonHoldTask[buttonIndex] = null;
        }
        
        if (pressDuration < HOLD_TIME_MS) {
            launchSceneOnGroupTrack(buttonIndex);
        }
        
        lowerButtonPressTime[buttonIndex] = null;
    }
}

function handleLayerButton(layer, isPressed) {
    if (DEBUG) {
        host.println(`Layer ${layer} button ${isPressed ? 'pressed' : 'released'}`);
    }
    
    if (!isPressed) return;
    
    if (!pinnedTrackIsGroup) {
        return;
    }
    
    if (layer === 'A') {
        if (currentEncoderPage === 'perform_extra') {
            currentEncoderPage = 'perform';
            setLayerLED('A', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A toggled OFF -> encoders now map to: ${currentEncoderPage}`);
            }
        } else {
            currentEncoderPage = 'perform_extra';
            setLayerLED('A', LED_STATE.ON);
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer A toggled ON -> encoders now map to: ${currentEncoderPage}`);
            }
        }
    } else if (layer === 'B') {
        if (currentEncoderPage === 'b') {
            currentEncoderPage = 'perform';
            setLayerLED('B', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer B toggled OFF -> encoders now map to: ${currentEncoderPage}`);
            }
        } else {
            currentEncoderPage = 'b';
            setLayerLED('B', LED_STATE.ON);
            setLayerLED('A', LED_STATE.OFF);
            if (DEBUG) {
                host.println(`Layer B toggled ON -> encoders now map to: ${currentEncoderPage}`);
            }
        }
    }
    
    updateEncoderLEDRingsForCurrentPage();
}

function launchSceneOnGroupTrack(sceneIndex) {
    if (!pinnedTrackIsGroup || !sceneBank) {
        if (DEBUG) {
            host.println(`Cannot launch scene - not in group mode or scene bank unavailable`);
        }
        return;
    }
    
    const scene = sceneBank.getScene(sceneIndex);
    if (scene) {
        if (DEBUG) {
            host.println(`Launching scene ${sceneIndex} on child tracks in group`);
        }
        scene.launch();
    } else {
        if (DEBUG) {
            host.println(`Scene ${sceneIndex} does not exist`);
        }
    }
}

function stopSceneOnGroupTrack(sceneIndex) {
    if (!pinnedTrackIsGroup || !pinnedTrack) {
        if (DEBUG) {
            host.println(`Cannot stop clips - not in group mode`);
        }
        return;
    }
    
    if (DEBUG) {
        host.println(`Stopping all clips in group`);
    }
    
    pinnedTrack.stop();
}

function updateEncoderLEDRingsForCurrentPage() {
    if (!pinnedTrackIsGroup) {
        for (let i = 0; i < 8; i++) {
            setLEDRingValue(i, 32);
        }
        return;
    }
    
    let page = null;
    
    if (currentEncoderPage === 'perform') {
        page = groupTrackPerformPage;
    } else if (currentEncoderPage === 'perform_extra') {
        page = groupTrackPerformExtraPage;
    } else if (currentEncoderPage === 'b') {
        page = groupTrackLayerBPages[groupTrackDeviceIndex];
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

function updateUpperButtonLEDs() {
    if (!pinnedTrackIsGroup) {
        for (let i = 0; i < 8; i++) {
            setUpperButtonLED(i, LED_STATE.OFF);
        }
        return;
    }
    
    for (let i = 0; i < 8; i++) {
        const param = groupTrackMutesPages[groupTrackDeviceIndex].getParameter(i);
        if (param && param.exists().get()) {
            const ledState = param.get() > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
            setUpperButtonLED(i, ledState);
        } else {
            setUpperButtonLED(i, LED_STATE.OFF);
        }
    }
}

function updateLowerButtonLEDs() {
    if (!pinnedTrackIsGroup || !sceneBank || !childTrackBank) {
        for (let i = 0; i < 8; i++) {
            setLowerButtonLED(i, LED_STATE.OFF);
        }
        return;
    }
    
    for (let sceneIndex = 0; sceneIndex < 8; sceneIndex++) {
        let anyPlaying = false;
        
        for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
            const track = childTrackBank.getItemAt(trackIndex);
            if (track && track.exists().get()) {
                const clipSlotBank = track.clipLauncherSlotBank();
                if (clipSlotBank) {
                    const slot = clipSlotBank.getItemAt(sceneIndex);
                    if (slot && slot.isPlaying().get()) {
                        anyPlaying = true;
                        break;
                    }
                }
            }
        }
        
        if (anyPlaying) {
            setLowerButtonLED(sceneIndex, LED_STATE.ON);
        } else {
            setLowerButtonLED(sceneIndex, LED_STATE.OFF);
        }
    }
}

function setupTracks() {
    if (DEBUG) {
        host.println("Setting up track management...");
    }
    
    try {
        trackBank = host.createTrackBank(8, 0, 8, false);
        pinnedTrack = trackBank.getTrack(PINNED_TRACK_INDEX);
        
        pinnedTrack.exists().markInterested();
        pinnedTrack.name().markInterested();
        pinnedTrack.isGroup().markInterested();
        
        groupTrackPerformPage = pinnedTrack.createCursorRemoteControlsPage("GroupTrackPerform", 8, "perform");
        groupTrackPerformExtraPage = pinnedTrack.createCursorRemoteControlsPage("GroupTrackPerformExtra", 8, "perform_extra");
        
        groupTrackDeviceBank = pinnedTrack.createDeviceBank(8);
        
        for (let i = 0; i < 8; i++) {
            const device = groupTrackDeviceBank.getDevice(i);
            
            groupTrackMutesPages[i] = device.createCursorRemoteControlsPage("GroupMutes" + i, 8, "mutes");
            groupTrackLayerBPages[i] = device.createCursorRemoteControlsPage("GroupLayerB" + i, 8, "b");
            
            const chainSelector = device.createChainSelector();
            chainSelector.exists().markInterested();
            chainSelector.chainCount().markInterested();
            chainSelector.activeChainIndex().markInterested();
            
            const deviceIndex = i;
            chainSelector.exists().addValueObserver(function(exists) {
                if (exists && !groupTrackChainSelector) {
                    groupTrackChainSelector = chainSelector;
                    groupTrackDeviceIndex = deviceIndex;
                    if (DEBUG) {
                        host.println(`Found chain selector at device index ${deviceIndex}`);
                    }
                }
            });
            
            chainSelector.activeChainIndex().addValueObserver(function(index) {
                if (deviceIndex === groupTrackDeviceIndex) {
                    if (DEBUG) {
                        host.println(`Active chain changed to: ${index}`);
                    }
                    if (pinnedTrackIsGroup) {
                        updateEncoderLEDRingsForCurrentPage();
                        updateUpperButtonLEDs();
                    }
                }
            });
        }
        
        childTrackBank = pinnedTrack.createTrackBank(8, 0, 8, false);
        sceneBank = childTrackBank.sceneBank();
        
        for (let i = 0; i < 8; i++) {
            const track = childTrackBank.getItemAt(i);
            if (track) {
                track.exists().markInterested();
                track.name().markInterested();
                
                const clipSlotBank = track.clipLauncherSlotBank();
                if (clipSlotBank) {
                    for (let slotIndex = 0; slotIndex < 8; slotIndex++) {
                        const slot = clipSlotBank.getItemAt(slotIndex);
                        if (slot) {
                            slot.isPlaying().markInterested();
                            slot.hasContent().markInterested();
                        }
                    }
                }
            }
        }
        
        if (DEBUG) {
            host.println(`Scene bank created: ${sceneBank}`);
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
            updateEncoderLEDRingsForCurrentPage();
        }
    });
}

function setupRemoteControlPageObservers() {
    for (let i = 0; i < 8; i++) {
        const param = groupTrackPerformPage.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        
        const encoderIndex = i;
        
        param.exists().addValueObserver(function(exists) {
            if (DEBUG) {
                host.println(`Perform page param ${encoderIndex} exists changed: ${exists}`);
            }
            if (pinnedTrackIsGroup && currentEncoderPage === 'perform') {
                updateEncoderLEDRingsForCurrentPage();
            }
        });
        
        param.value().addValueObserver(function(value) {
            if (pinnedTrackIsGroup && currentEncoderPage === 'perform') {
                updateEncoderLEDRing(encoderIndex, value);
            }
        });
    }
    
    for (let i = 0; i < 8; i++) {
        const param = groupTrackPerformExtraPage.getParameter(i);
        param.exists().markInterested();
        param.name().markInterested();
        param.value().markInterested();
        
        const encoderIndex = i;
        
        param.exists().addValueObserver(function(exists) {
            if (DEBUG) {
                host.println(`Perform_extra page param ${encoderIndex} exists changed: ${exists}`);
            }
            if (pinnedTrackIsGroup && currentEncoderPage === 'perform_extra') {
                updateEncoderLEDRingsForCurrentPage();
            }
        });
        
        param.value().addValueObserver(function(value) {
            if (pinnedTrackIsGroup && currentEncoderPage === 'perform_extra') {
                updateEncoderLEDRing(encoderIndex, value);
            }
        });
    }
    
    for (let deviceIdx = 0; deviceIdx < 8; deviceIdx++) {
        const devIndex = deviceIdx;
        
        for (let i = 0; i < 8; i++) {
            const param = groupTrackMutesPages[deviceIdx].getParameter(i);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
            
            const buttonIndex = i;
            
            param.exists().addValueObserver(function(exists) {
                if (DEBUG) {
                    host.println(`Mutes page device ${devIndex} param ${buttonIndex} exists changed: ${exists}`);
                }
                if (pinnedTrackIsGroup && devIndex === groupTrackDeviceIndex) {
                    updateUpperButtonLEDs();
                }
            });
            
            param.value().addValueObserver(function(value) {
                if (pinnedTrackIsGroup && devIndex === groupTrackDeviceIndex) {
                    const ledState = value > 0.5 ? LED_STATE.ON : LED_STATE.OFF;
                    setUpperButtonLED(buttonIndex, ledState);
                }
            });
        }
        
        for (let i = 0; i < 8; i++) {
            const param = groupTrackLayerBPages[deviceIdx].getParameter(i);
            param.exists().markInterested();
            param.name().markInterested();
            param.value().markInterested();
            
            const encoderIndex = i;
            
            param.exists().addValueObserver(function(exists) {
                if (DEBUG) {
                    host.println(`Layer B page device ${devIndex} param ${encoderIndex} exists changed: ${exists}`);
                }
                if (pinnedTrackIsGroup && currentEncoderPage === 'b' && devIndex === groupTrackDeviceIndex) {
                    updateEncoderLEDRingsForCurrentPage();
                }
            });
            
            param.value().addValueObserver(function(value) {
                if (pinnedTrackIsGroup && currentEncoderPage === 'b' && devIndex === groupTrackDeviceIndex) {
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
        host.println("Setting up clip observers...");
    }
    
    try {
        if (childTrackBank) {
            for (let trackIndex = 0; trackIndex < 8; trackIndex++) {
                const track = childTrackBank.getItemAt(trackIndex);
                if (track) {
                    const clipSlotBank = track.clipLauncherSlotBank();
                    if (clipSlotBank) {
                        for (let slotIndex = 0; slotIndex < 8; slotIndex++) {
                            const slot = clipSlotBank.getItemAt(slotIndex);
                            if (slot) {
                                slot.isPlaying().addValueObserver((isPlaying) => {
                                    if (pinnedTrackIsGroup) {
                                        updateLowerButtonLEDs();
                                    }
                                });
                                
                                slot.hasContent().addValueObserver((hasContent) => {
                                    if (pinnedTrackIsGroup) {
                                        updateLowerButtonLEDs();
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        
        if (DEBUG) {
            host.println("Clip observers setup complete");
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
        host.println(`Current encoder page: ${currentEncoderPage}`);
        host.println("===========================");
    }
}

function flush() {
}

function exit() {
    if (DEBUG) {
        host.println("X-Touch Mini Kit Single exited");
    }
}

