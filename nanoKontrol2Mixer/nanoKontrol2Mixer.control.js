loadAPI(18);

host.defineController("Korg", "nanoKONTROL2 Mixer", "1.0", "E74ABCE1-7BA8-4526-A769-25A7E1F82120"); // Modified UUID
host.defineMidiPorts(1, 1);

// --- Constants ---
const CC = {
	SLIDER1: 0x00, SLIDER8: 0x07,
	KNOB1: 0x10, KNOB8: 0x17,
	S1: 0x20, S8: 0x27,  // Added S buttons
	M1: 0x30, M8: 0x37, // Adjusted M buttons based on nanoKontrol2 standard (seems to be 0x30-0x37)
	R1: 0x40, R8: 0x47, // Added R buttons (assuming standard CCs 0x40-0x47)
	REW: 0x2B,          // Added REW button
	FF: 0x2C,           // Added FF button
	// Add other CCs like transport if needed later
};

const SLIDER_PAGE_INDEX = 9;  // Fixed page index for faders 
const BUTTONS_PAGE_INDEX = 11; // Fixed page index for M buttons
const FF_PAGE_INDEX = 3;      // Page to use when FF is active

// --- Global Variables ---
let midiOutPort;
let projectPerformPage; // Renamed: Project Remote Page 0 (Knobs)
let fadersPage;         // Project Remote Page 1 (Faders)
let mutesPage;          // Project Remote Page 2 (M Buttons)

let trackBank;                     // Bank for first 8 tracks
let trackPerformPages = [];        // Array to hold page 0 for each track's remotes
let trackExists = initArray(false, 8); // Track existence state for LEDs
let trackNames = initArray("", 8);    // Track names for popups

let fixedTrackIndex = -1;          // Index of the track knobs are fixed to (-1 = Project)
let activePerformPage;             // The current page knobs control (project or track)
let isFFMode = false;              // Whether FF mode is active (only applies in project mode)

// NEW: Arrays for mixer track controls
let mixerDevices = [];            // First device on each mixer track (track 0 in each group)
let mixerSliderPages = [];        // Fixed page 9 for each mixer device
let mixerButtonPages = [];        // Fixed page 11 for each mixer device
let mixerKnobPages = [];          // Pages 1-8 for each mixer device (controlled by S buttons)

let muteStates = initArray(false, 8); // Store state for M button LEDs

// Helper to initialize arrays
function initArray(value, count) {
	const arr = [];
	for (let i = 0; i < count; i++) {
		arr.push(value);
	}
	return arr;
}

function init()
{
	midiOutPort = host.getMidiOutPort(0);
	const midiIn = host.getMidiInPort(0);
	midiIn.setMidiCallback(onMidi);
	midiIn.setSysexCallback(onSysex);

	// Get the project object
	const project = host.getProject();
	// Get the root track group from the project
	const rootTrackGroup = project.getRootTrackGroup();

	// Create Project Remote Pages on the root track group, providing null for filterExpression
	projectPerformPage = rootTrackGroup.createCursorRemoteControlsPage("Perform", 8, null);
	fadersPage = rootTrackGroup.createCursorRemoteControlsPage("Faders", 8, null);
	mutesPage = rootTrackGroup.createCursorRemoteControlsPage("Mutes", 8, null);

	// Set the specific page index for each cursor
	projectPerformPage.selectedPageIndex().markInterested();
	projectPerformPage.selectedPageIndex().set(0); 
	fadersPage.selectedPageIndex().markInterested();
	fadersPage.selectedPageIndex().set(1); 
	mutesPage.selectedPageIndex().markInterested();
	mutesPage.selectedPageIndex().set(2); 

	// Add observers to ensure pages stay fixed and debug page changes
	fadersPage.selectedPageIndex().addValueObserver((page) => {
		println("Faders page changed to: " + page);
		if (page !== 1) {
			println("Correcting faders page back to 1");
			fadersPage.selectedPageIndex().set(1);
		}
	});

	mutesPage.selectedPageIndex().addValueObserver((page) => {
		println("Mutes page changed to: " + page);
		if (page !== 2) {
			println("Correcting mutes page back to 2");
			mutesPage.selectedPageIndex().set(2);
		}
	});

	// Debug initial page states
	println("Initial page states:");
	println("Project Perform page: " + projectPerformPage.selectedPageIndex().get());
	println("Faders page: " + fadersPage.selectedPageIndex().get());
	println("Mutes page: " + mutesPage.selectedPageIndex().get());

	println("Attempting to access Project Remote pages by index: 0 (Perform), 1 (Faders), 2 (Mutes)");

	// Initialize active perform page to the project page
	activePerformPage = projectPerformPage;

	// Create TrackBank and track-specific remote pages
	trackBank = host.createTrackBank(8, 0, 0, false); // 8 tracks, 0 sends, 0 scenes
	trackBank.scrollPosition().markInterested(); // Needed for trackExists updates

	// Mark parameters as interested and add observers
	for (let i = 0; i < 8; i++) {
		// Project Remotes
		projectPerformPage.getParameter(i).markInterested();
		fadersPage.getParameter(i).markInterested();
		const muteParam = mutesPage.getParameter(i);
		muteParam.markInterested();
		muteParam.value().addValueObserver((value) => {
			muteStates[i] = value > 0;
		});

		// Track Bank and Track Perform Pages
		const track = trackBank.getItemAt(i);
		track.exists().markInterested();
		track.name().markInterested();

		track.exists().addValueObserver((exists) => {
			trackExists[i] = exists;
			// Maybe update R button LEDs immediately if needed? Flush handles it though.
		});
		track.name().addValueObserver((name) => {
			trackNames[i] = name;
		});

		// Create remote page cursor for track i, page 0
		trackPerformPages[i] = track.createCursorRemoteControlsPage("TrackPerform" + i, 8, null);
		trackPerformPages[i].selectedPageIndex().markInterested();
		trackPerformPages[i].selectedPageIndex().set(0); // Ensure it targets page 0

		// Mark track perform page parameters as interested
		for (let j = 0; j < 8; j++) {
			trackPerformPages[i].getParameter(j).markInterested();
		}

		// NEW: Set up mixer track controls for each group
		const childTrackBank = track.createTrackBank(1, 0, 0, false); // Size 1 for mixer track
		const mixerTrack = childTrackBank.getItemAt(0); // Get track 0 (mixer track)
		mixerTrack.exists().markInterested();

		// Create device bank and get first device
		const deviceBank = mixerTrack.createDeviceBank(1);
		mixerDevices[i] = deviceBank.getDevice(0);
		mixerDevices[i].exists().markInterested();

		// Create fixed remote pages for the mixer device
		mixerSliderPages[i] = mixerDevices[i].createCursorRemoteControlsPage("MixerSliders" + i, 8, null);
		mixerSliderPages[i].selectedPageIndex().markInterested();
		mixerSliderPages[i].selectedPageIndex().set(SLIDER_PAGE_INDEX);

		mixerButtonPages[i] = mixerDevices[i].createCursorRemoteControlsPage("MixerButtons" + i, 8, null);
		mixerButtonPages[i].selectedPageIndex().markInterested();
		mixerButtonPages[i].selectedPageIndex().set(BUTTONS_PAGE_INDEX);

		// NEW: Create knob pages for S button control
		mixerKnobPages[i] = mixerDevices[i].createCursorRemoteControlsPage("MixerKnobs" + i, 8, null);
		mixerKnobPages[i].selectedPageIndex().markInterested();
		mixerKnobPages[i].selectedPageIndex().set(0); // Start at page 0

		// Add observers to ensure pages stay fixed
		mixerSliderPages[i].selectedPageIndex().addValueObserver((page) => {
			if (page !== SLIDER_PAGE_INDEX) {
				println("Mixer slider page changed from " + SLIDER_PAGE_INDEX + " to " + page + ", correcting...");
				mixerSliderPages[i].selectedPageIndex().set(SLIDER_PAGE_INDEX);
			}
		});

		mixerButtonPages[i].selectedPageIndex().addValueObserver((page) => {
			if (page !== BUTTONS_PAGE_INDEX) {
				println("Mixer button page changed from " + BUTTONS_PAGE_INDEX + " to " + page + ", correcting...");
				mixerButtonPages[i].selectedPageIndex().set(BUTTONS_PAGE_INDEX);
			}
		});

	
		// Mark parameters as interested for LED feedback
		for (let j = 0; j < 8; j++) {
			mixerButtonPages[i].getParameter(j).markInterested();
			mixerButtonPages[i].getParameter(j).value().markInterested();
			mixerKnobPages[i].getParameter(j).markInterested();
		}
	}

	println("nanoKontrol2Mixer script initialized!");
}

function exit()
{
	println("nanoKontrol2Mixer script exited.");
	// Turn off Mute and R LEDs on exit
	for (let i = 0; i < 8; i++) {
		sendMidi(0xB0, CC.M1 + i, 0);
		sendMidi(0xB0, CC.R1 + i, 0); // Turn off R LEDs
	}
}

function flush()
{
	// Update M button LEDs based on context
	for (let i = 0; i < 8; i++) {
		let ledValue = 0;
		if (fixedTrackIndex >= 0 && mixerButtonPages[fixedTrackIndex]) {
			// If track is selected, show mixer device button states
			const buttonParam = mixerButtonPages[fixedTrackIndex].getParameter(i);
			ledValue = buttonParam.value().get() > 0 ? 127 : 0;
		} else {
			// Otherwise show project mute states
			ledValue = muteStates[i] ? 127 : 0;
		}
		sendMidi(0xB0, CC.M1 + i, ledValue);
	}

	// Update S button LEDs based on current page in track mode
	for (let i = 0; i < 8; i++) {
		let ledValue = 0;
		if (fixedTrackIndex >= 0 && mixerKnobPages[fixedTrackIndex]) { // Only light S LEDs in track mode
			const currentPage = mixerKnobPages[fixedTrackIndex].selectedPageIndex().get();
			ledValue = (currentPage === i + 1) ? 127 : 0; // Light if on corresponding page
		}
		sendMidi(0xB0, CC.S1 + i, ledValue);
	}

	// Update R LEDs based on fixed track state
	for (let i = 0; i < 8; i++) {
		const ledState = (i === fixedTrackIndex && trackExists[i]) ? 127 : 0;
		sendMidi(0xB0, CC.R1 + i, ledState);
	}

	// Update REW LED - lit when in project mode page 0
	sendMidi(0xB0, CC.REW, (fixedTrackIndex === -1 && !isFFMode) ? 127 : 0);

	// Update FF LED - lit when in project mode page 3
	sendMidi(0xB0, CC.FF, (fixedTrackIndex === -1 && isFFMode) ? 127 : 0);
}

function onMidi(status, data1, data2)
{
	// printMidi(status, data1, data2);

	// Check if it's a CC message (0xB0 - 0xBF)
	if ((status & 0xF0) === 0xB0) 
	{
		const value = data2; // MIDI value 0-127
		
		// Handle different CC ranges
		if (data1 >= CC.KNOB1 && data1 <= CC.KNOB8) { 
			const knobIndex = data1 - CC.KNOB1;
			// Check if we're on a mixer device page (S button active)
			if (fixedTrackIndex >= 0 && mixerKnobPages[fixedTrackIndex] && 
				mixerKnobPages[fixedTrackIndex].selectedPageIndex().get() > 0) {
				// If a track is selected and on a mixer page > 0, control mixer device
				mixerKnobPages[fixedTrackIndex].getParameter(knobIndex).set(value, 128);
			} else if (activePerformPage) {
				// Otherwise control track/project remotes
				activePerformPage.getParameter(knobIndex).set(value, 128);
			}
		}
		else if (data1 >= CC.SLIDER1 && data1 <= CC.SLIDER8) {
			const sliderIndex = data1 - CC.SLIDER1;
			if (fixedTrackIndex >= 0 && mixerSliderPages[fixedTrackIndex]) {
				// If a track is selected, control its mixer device's slider page
				mixerSliderPages[fixedTrackIndex].getParameter(sliderIndex).set(value, 128);
			} else {
				// Otherwise control project faders
				fadersPage.getParameter(sliderIndex).set(value, 128);
			}
		}
		else if (data1 >= CC.S1 && data1 <= CC.S8 && value > 0) { // S Buttons (page selection for mixer device)
			const sIndex = data1 - CC.S1;
			if (fixedTrackIndex >= 0 && mixerKnobPages[fixedTrackIndex]) { // Only handle S buttons in track mode
				const targetPage = sIndex + 1; // S1 = page 1, S8 = page 8
				const currentPage = mixerKnobPages[fixedTrackIndex].selectedPageIndex().get();

				// Toggle logic: if pressing the button for current page, go back to group track controls
				if (currentPage === targetPage) {
					mixerKnobPages[fixedTrackIndex].selectedPageIndex().set(0);
					host.showPopupNotification("Group Track Controls");
				} else {
					mixerKnobPages[fixedTrackIndex].selectedPageIndex().set(targetPage);
					host.showPopupNotification("Mixer Controls: Page " + targetPage);
				}
			}
		}
		else if (data1 >= CC.M1 && data1 <= CC.M8 && value > 0) { // M Buttons (toggle on press)
			const mIndex = data1 - CC.M1;
			if (fixedTrackIndex >= 0 && mixerButtonPages[fixedTrackIndex]) {
				// If a track is selected, toggle its mixer device's button page parameter
				const buttonParam = mixerButtonPages[fixedTrackIndex].getParameter(mIndex);
				const currentValue = buttonParam.value().get();
				buttonParam.set(currentValue > 0 ? 0 : 127, 128);
			} else {
				// Otherwise control project mutes
				const muteParam = mutesPage.getParameter(mIndex);
				const currentValue = muteParam.value().get(); 
				muteParam.set(currentValue > 0 ? 0 : 127, 128);
			}
		}
		else if (data1 >= CC.R1 && data1 <= CC.R8 && value > 0) { // R Buttons (toggle track fixing)
			const rIndex = data1 - CC.R1;
			if (rIndex === fixedTrackIndex) { // Untoggle: return to project remotes
				fixedTrackIndex = -1;
				activePerformPage = projectPerformPage;
				// If FF was previously active, restore FF mode
				if (isFFMode) {
					projectPerformPage.selectedPageIndex().set(FF_PAGE_INDEX);
					host.showPopupNotification("Controls: Project Remotes (Page " + FF_PAGE_INDEX + ")");
				} else {
					projectPerformPage.selectedPageIndex().set(0);
					host.showPopupNotification("Controls: Project Remotes");
				}
			}
			else { // Toggle: fix to track rIndex
				if (trackExists[rIndex]) { // Only fix if track exists
					fixedTrackIndex = rIndex;
					activePerformPage = trackPerformPages[rIndex];
					isFFMode = false; // Exit FF mode when selecting a track
					mixerKnobPages[rIndex].selectedPageIndex().set(0); // Start mixer knobs at page 0
					host.showPopupNotification("Controls Fixed: " + trackNames[rIndex]);
				} else {
					host.showPopupNotification("Track " + (rIndex + 1) + " does not exist");
				}
			}
		}
		else if (data1 === CC.REW && value > 0) { // REW Button (switch to project mode page 0)
			if (fixedTrackIndex >= 0 || isFFMode) { // Act if in track mode OR FF mode
				fixedTrackIndex = -1;
				activePerformPage = projectPerformPage;
				isFFMode = false; // Exit FF mode
				projectPerformPage.selectedPageIndex().set(0);
				host.showPopupNotification("Controls: Project Remotes");
			}
		}
		else if (data1 === CC.FF && value > 0) { // FF Button (switch to project mode page 3)
			if (fixedTrackIndex >= 0 || !isFFMode) { // Act if in track mode OR not in FF mode
				fixedTrackIndex = -1;
				activePerformPage = projectPerformPage;
				isFFMode = true; // Enter FF mode
				projectPerformPage.selectedPageIndex().set(FF_PAGE_INDEX);
				host.showPopupNotification("Controls: Project Remotes (Page " + FF_PAGE_INDEX + ")");
			}
		}
		// --- Add other controls (transport etc.) later ---
	}
}

function onSysex(data)
{
	// printSysex(data);
	// Add Sysex handling code here if needed
}

// --- Helper Functions ---
function sendMidi(status, data1, data2) {
	if (midiOutPort) {
		midiOutPort.sendMidi(status, data1, data2);
	} 
}
