// nano-launch by Gemini
// 8x3 Clip Launcher for Korg nanoKONTROL2

loadAPI(25);

host.defineController("Korg", "nano-launch", "0.1", "c1e479a0-5329-436c-8591-623253bde6a7", "Gemini");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["nanoKONTROL2"], ["nanoKONTROL2"]);

const DEBUG = true;

// MIDI CCs for nanoKONTROL2 buttons
const CC_S_BUTTONS = [32, 33, 34, 35, 36, 37, 38, 39]; // S buttons (Solo)
const CC_M_BUTTONS = [48, 49, 50, 51, 52, 53, 54, 55]; // M buttons (Mute)
const CC_R_BUTTONS = [64, 65, 66, 67, 68, 69, 70, 71]; // R buttons (Record)

// Transport buttons for Chain Selection
const CC_TRANS_REW = 43;  // Chain 1 (Index 0)
const CC_TRANS_FF = 44;   // Chain 2 (Index 1)
const CC_TRANS_STOP = 42; // Chain 3 (Index 2)
const CC_TRANS_PLAY = 41; // Chain 4 (Index 3)
const CC_TRANS_REC = 45;  // Chain 5 (Index 4)
const CC_TRANS_BUTTONS = [CC_TRANS_REW, CC_TRANS_FF, CC_TRANS_STOP, CC_TRANS_PLAY, CC_TRANS_REC];

const CC_PREV_TRACK = 58; // Mode Toggle Button
const CC_NEXT_TRACK = 59; // Clip Page Toggle Button
const CC_CYCLE = 46;      // Chain/Bank Link Toggle

const CC_MARKER_SET = 60;
const CC_MARKER_PREV = 61;
const CC_MARKER_NEXT = 62;

const CC_KNOBS = [16, 17, 18, 19, 20, 21, 22, 23];
const CC_FADERS = [0, 1, 2, 3, 4, 5, 6, 7];

const PINNED_TRACK_INDEX = 0;
const NUM_TRACKS = 8;
const BANK_SIZE = 3; // Can be 3 or 6
const NUM_CLIPS = 5 * BANK_SIZE; 

let midiIn, midiOut;
let trackBank;
let pinnedTrack;
let groupTrackRemoteControls;
let groupTrackVolControls;
let childTrackBank;
let sceneBank;
let childTrackSlots = []; // 2D array for [track][clip]
let childTrackChainSelectors = [];
let groupTrackChainSelector;

let isInstrumentSwitchMode = false;
let isClipPage2 = false;
let isChainLinkedToBank = false;
let currentBank = 0; // 0 to 4

function getTotalOffset() {
    const bankOffset = currentBank * BANK_SIZE;
    const pageOffset = (BANK_SIZE === 6 && isClipPage2) ? 3 : 0;
    return bankOffset + pageOffset;
}

function init() {
    midiIn = host.getMidiInPort(0);
    midiOut = host.getMidiOutPort(0);
    midiIn.setMidiCallback(onMidi);

    // Create a track bank to pin to the first track.
    // We need to see 8 tracks for the children, and 6 scenes for the clips (2 pages).
    trackBank = host.createTrackBank(NUM_TRACKS, 0, NUM_CLIPS, false);
    pinnedTrack = trackBank.getItemAt(PINNED_TRACK_INDEX);
    pinnedTrack.exists().markInterested();
    pinnedTrack.isGroup().markInterested();

    // Group Track Remote Controls (Performance Page)
    groupTrackRemoteControls = pinnedTrack.createCursorRemoteControlsPage("perform", 8, "perform");
    for (let i = 0; i < 8; i++) {
        groupTrackRemoteControls.getParameter(i).markInterested();
        groupTrackRemoteControls.getParameter(i).setIndication(true);
    }

    // Group Track Remote Controls (Volume Page)
    groupTrackVolControls = pinnedTrack.createCursorRemoteControlsPage("vols", 8, "vols");
    for (let i = 0; i < 8; i++) {
        groupTrackVolControls.getParameter(i).markInterested();
        groupTrackVolControls.getParameter(i).setIndication(true);
    }

    // Group Track Chain Selector (Primary Device)
    const groupDevice = pinnedTrack.createDeviceBank(1).getDevice(0);
    groupTrackChainSelector = groupDevice.createChainSelector();
    groupTrackChainSelector.exists().markInterested();
    groupTrackChainSelector.activeChainIndex().markInterested();
    
    // Add observer for Transport LED feedback (Instrument Mode)
    groupTrackChainSelector.activeChainIndex().addValueObserver((index) => {
        if (isInstrumentSwitchMode) {
            updateTransportLeds();
        }
    });

    // Create a bank for the child tracks of the pinned group track
    childTrackBank = pinnedTrack.createTrackBank(NUM_TRACKS, 0, NUM_CLIPS, false);
    
    // Get Scene Bank from Child Track Bank
    sceneBank = childTrackBank.sceneBank();
    for (let i = 0; i < NUM_CLIPS; i++) {
        sceneBank.getScene(i).exists().markInterested();
    }

    for (let i = 0; i < NUM_TRACKS; i++) {
        const track = childTrackBank.getItemAt(i);
        track.exists().markInterested();
        const clipLauncher = track.clipLauncherSlotBank();
        childTrackSlots[i] = [];
        for (let j = 0; j < NUM_CLIPS; j++) {
            const clip = clipLauncher.getItemAt(j);
            clip.exists().markInterested();
            clip.isPlaying().markInterested();
            childTrackSlots[i][j] = clip;

            // Add observer for LED feedback
            const trackIndex = i;
            const clipIndex = j;
            clip.isPlaying().addValueObserver((isPlaying) => {
                updateLed(trackIndex, clipIndex, isPlaying);
            });
        }

        // Child Track Chain Selector (Primary Device)
        const childDevice = track.createDeviceBank(1).getDevice(0);
        const chainSelector = childDevice.createChainSelector();
        chainSelector.exists().markInterested();
        childTrackChainSelectors[i] = chainSelector;
    }

    // Turn off all LEDs on init
    turnOffAllLeds();
    updateTransportLeds(); // Initialize Bank LEDs

    host.println("nano-launch: Initialized with 8x3 clip launcher grid (5 Banks).");
}

const LONG_PRESS_DELAY = 500; // ms
let buttonStates = {}; // { [cc]: { released: boolean, handled: boolean } }

function onMidi(status, data1, data2) {
    if (DEBUG) {
        host.println("MIDI: " + status + ", " + data1 + ", " + data2);
    }

    const msgType = status & 0xF0;

    // Check for Control Change message
    if (msgType === 0xB0) {
        if (data2 > 0) { // On Press
            // Handle PREV_TRACK as Mode Toggle
            if (data1 === CC_PREV_TRACK) {
                isInstrumentSwitchMode = !isInstrumentSwitchMode;
                updateModeLeds();
                host.println("Instrument Switch Mode: " + (isInstrumentSwitchMode ? "ON" : "OFF"));
                return;
            }

            // Handle NEXT_TRACK as Clip Page Toggle
            if (data1 === CC_NEXT_TRACK) {
                if (BANK_SIZE === 6) {
                    isClipPage2 = !isClipPage2;
                    refreshGridLeds();
                    host.println("Clip Page 2: " + (isClipPage2 ? "ON" : "OFF"));
                } else {
                    host.println("Page switching disabled (Bank Size is 3)");
                }
                return;
            }

            // Handle CYCLE as Chain/Bank Link Toggle
            if (data1 === CC_CYCLE) {
                isChainLinkedToBank = !isChainLinkedToBank;
                updateCycleLed();
                updateTransportLeds(); // Refresh Indicators
                host.println("Chain/Bank Link: " + (isChainLinkedToBank ? "ON" : "OFF"));
                return;
            }

            // Handle Knobs (Group Track Performance Page)
            const knobIndex = CC_KNOBS.indexOf(data1);
            if (knobIndex !== -1) {
                if (groupTrackRemoteControls) {
                    // Normalize 0-127 to 0.0-1.0
                    const normalizedValue = data2 / 127.0;
                    groupTrackRemoteControls.getParameter(knobIndex).set(normalizedValue);
                }
                return;
            }

            // Handle Faders (Group Track Volume Page)
            const faderIndex = CC_FADERS.indexOf(data1);
            if (faderIndex !== -1) {
                if (groupTrackVolControls) {
                    // Normalize 0-127 to 0.0-1.0
                    const normalizedValue = data2 / 127.0;
                    groupTrackVolControls.getParameter(faderIndex).set(normalizedValue);
                }
                return;
            }

            // Handle Transport Buttons
            const transIndex = CC_TRANS_BUTTONS.indexOf(data1);
            if (transIndex !== -1) {
                if (isInstrumentSwitchMode) {
                    setChainOnAllTracks(transIndex);
                } else {
                    currentBank = transIndex;
                    updateTransportLeds();
                    refreshGridLeds();
                    host.println("Switched to Bank " + (currentBank + 1));
                }
                return;
            }

            // Handle Scene Launching (Marker Buttons)
            if (data1 === CC_MARKER_SET || data1 === CC_MARKER_PREV || data1 === CC_MARKER_NEXT) {
                const baseIndex = getTotalOffset();
                let sceneOffset = 0;
                
                if (data1 === CC_MARKER_SET) sceneOffset = 0;
                else if (data1 === CC_MARKER_PREV) sceneOffset = 1;
                else if (data1 === CC_MARKER_NEXT) sceneOffset = 2;
                
                const sceneIndex = baseIndex + sceneOffset;
                
                if (sceneBank) {
                    const scene = sceneBank.getScene(sceneIndex);
                    if (scene && scene.exists().get()) {
                        // If Link is active, sync chain to current bank
                        if (isChainLinkedToBank) {
                            setChainOnAllTracks(currentBank);
                        }
                        scene.launch();
                        host.println("Launching Scene " + (sceneIndex + 1));
                    } else {
                        host.println("Scene " + (sceneIndex + 1) + " does not exist.");
                    }
                }
                return;
            }
            
            // If not handled above, pass to grid handler
            // Note: If Transport button pressed while mode OFF, it falls through here.
            // handleButton checks against S, M, R arrays, so transport buttons will be safely ignored.
            handleButton(data1, data2);
        } else {
             // Handle Release for grid buttons
             handleButton(data1, data2);
        }
    }
}

function setChainOnAllTracks(chainIndex) {
    if (DEBUG) host.println("Switching to Chain Index: " + chainIndex);

    // 1. Group Track
    if (groupTrackChainSelector.exists().get()) {
        groupTrackChainSelector.activeChainIndex().set(chainIndex);
    }

    // 2. Child Tracks
    for (let i = 0; i < NUM_TRACKS; i++) {
        const selector = childTrackChainSelectors[i];
        if (selector && selector.exists().get()) {
            selector.activeChainIndex().set(chainIndex);
        }
    }
}

function getClipInfoFromCC(cc) {
    let trackIndex = -1;
    let clipIndex = -1;
    const totalOffset = getTotalOffset();

    // Check S buttons
    trackIndex = CC_S_BUTTONS.indexOf(cc);
    if (trackIndex !== -1) {
        clipIndex = 0 + totalOffset; // First visible clip
    }

    // Check M buttons if not found yet
    if (trackIndex === -1) {
        trackIndex = CC_M_BUTTONS.indexOf(cc);
        if (trackIndex !== -1) {
            clipIndex = 1 + totalOffset; // Second visible clip
        }
    }

    // Check R buttons if not found yet
    if (trackIndex === -1) {
        trackIndex = CC_R_BUTTONS.indexOf(cc);
        if (trackIndex !== -1) {
            clipIndex = 2 + totalOffset; // Third visible clip
        }
    }

    if (trackIndex !== -1 && clipIndex !== -1) {
        if (childTrackSlots[trackIndex] && childTrackSlots[trackIndex][clipIndex]) {
            return {
                trackIndex: trackIndex,
                clipIndex: clipIndex,
                clip: childTrackSlots[trackIndex][clipIndex]
            };
        }
    }
    return null;
}

function handleButton(cc, value) {
    const info = getClipInfoFromCC(cc);
    if (!info) return;

    const { trackIndex, clipIndex, clip } = info;
    const isDown = value > 0;

    if (isDown) {
        // Button Down
        if (clip.exists().get()) {
            if (clip.isPlaying().get()) {
                // Clip is playing: Wait to see if it's a long press
                buttonStates[cc] = { released: false, handled: false };
                host.scheduleTask(function() {
                    checkLongPress(cc);
                }, LONG_PRESS_DELAY);
            } else {
                // Clip not playing: Launch immediately
                if (isChainLinkedToBank) {
                    setChainOnAllTracks(currentBank);
                }
                clip.launch();
                host.println("Launching Track " + (trackIndex + 1) + ", Clip " + (clipIndex + 1));
            }
        } else {
            host.println("Clip slot at Track " + (trackIndex + 1) + ", Clip " + (clipIndex + 1) + " is empty.");
        }
    } else {
        // Button Up
        if (buttonStates[cc]) {
            buttonStates[cc].released = true;
            
            // If the timer hasn't fired yet (not handled) and it was a wait-state
            // then this is a short press on a playing clip -> Re-trigger
            if (!buttonStates[cc].handled) {
                if (clip.exists().get()) {
                    if (isChainLinkedToBank) {
                        setChainOnAllTracks(currentBank);
                    }
                    clip.launch();
                    host.println("Re-triggering Track " + (trackIndex + 1) + ", Clip " + (clipIndex + 1));
                }
            }
            // Cleanup
            delete buttonStates[cc];
        }
    }
}

function checkLongPress(cc) {
    // This task runs after the delay
    if (buttonStates[cc] && !buttonStates[cc].released) {
        // Button is STILL held down -> Long Press detected
        const info = getClipInfoFromCC(cc);
        if (info && info.clip.exists().get()) {
            // ClipLauncherSlot doesn't have stop(), so we stop the track
            childTrackBank.getItemAt(info.trackIndex).stop();
            host.println("Stopping Track " + (info.trackIndex + 1));
        }
        
        // Mark as handled so release doesn't re-trigger
        buttonStates[cc].handled = true;
    }
}

function updateLed(trackIndex, clipIndex, isPlaying) {
    const totalOffset = getTotalOffset();
    
    // Check if the updating clip is on the current page/bank
    if (clipIndex >= totalOffset && clipIndex < totalOffset + 3) {
        // Map to visible button index (0, 1, 2)
        const visibleIndex = clipIndex - totalOffset;
        
        let cc = -1;
        switch (visibleIndex) {
            case 0:
                cc = CC_S_BUTTONS[trackIndex];
                break;
            case 1:
                cc = CC_M_BUTTONS[trackIndex];
                break;
            case 2:
                cc = CC_R_BUTTONS[trackIndex];
                break;
        }

        if (cc !== -1) {
            const value = isPlaying ? 127 : 0;
            midiOut.sendMidi(0xB0, cc, value);
        }
    }
}

function refreshGridLeds() {
    const totalOffset = getTotalOffset();
    
    for (let i = 0; i < NUM_TRACKS; i++) {
        for (let j = 0; j < 3; j++) {
            const clipIndex = j + totalOffset;
            const clip = childTrackSlots[i][clipIndex];
            if (clip) {
                // Manually trigger the LED update logic
                updateLed(i, clipIndex, clip.isPlaying().get());
            }
        }
    }
}

function updateCycleLed() {
    midiOut.sendMidi(0xB0, CC_CYCLE, isChainLinkedToBank ? 127 : 0);
}

function updateModeLeds() {
    // 1. Update Mode Toggle LED (PREV_TRACK)
    midiOut.sendMidi(0xB0, CC_PREV_TRACK, isInstrumentSwitchMode ? 127 : 0);

    // 2. Refresh Transport LEDs based on current state and mode
    if (groupTrackChainSelector.exists().get()) {
        updateTransportLeds(groupTrackChainSelector.activeChainIndex().get());
    } else {
        updateTransportLeds(-1);
    }
}

function updateTransportLeds(activeIndex) {
    let targetIndex = -1;

    if (isInstrumentSwitchMode) {
        // Show active Instrument Chain
        if (typeof activeIndex !== 'undefined') {
            targetIndex = activeIndex;
        } else if (groupTrackChainSelector.exists().get()) {
            targetIndex = groupTrackChainSelector.activeChainIndex().get();
        }
    } else {
        // Show active MIDI Bank
        targetIndex = currentBank;
    }

    for (let i = 0; i < CC_TRANS_BUTTONS.length; i++) {
        const cc = CC_TRANS_BUTTONS[i];
        const value = (i === targetIndex) ? 127 : 0;
        midiOut.sendMidi(0xB0, cc, value);
    }
}

function turnOffAllLeds() {
    for (let i = 0; i < NUM_TRACKS; i++) {
        midiOut.sendMidi(0xB0, CC_S_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_M_BUTTONS[i], 0);
        midiOut.sendMidi(0xB0, CC_R_BUTTONS[i], 0);
    }
    for (let i = 0; i < CC_TRANS_BUTTONS.length; i++) {
        midiOut.sendMidi(0xB0, CC_TRANS_BUTTONS[i], 0);
    }
    midiOut.sendMidi(0xB0, CC_PREV_TRACK, 0); // Turn off Mode Toggle LED
    midiOut.sendMidi(0xB0, CC_CYCLE, 0);      // Turn off Link Toggle LED
    if (DEBUG) {
        host.println("All LEDs turned off.");
    }
}

function exit() {
    turnOffAllLeds();
    host.println("nano-launch: Exited.");
}