loadAPI(18);

host.defineController("Korg", "nanoKONTROL2 Mixer", "1.0", "E74ABCE1-7BA8-4526-A769-25A7E1F82120");
host.defineMidiPorts(1, 1);

// --- Constants ---
const CC = {
	SLIDER1: 0x00, SLIDER8: 0x07,
	KNOB1: 0x10, KNOB8: 0x17,
	M1: 0x30, M8: 0x37,
	R1: 0x40, R8: 0x47,
	REW: 0x2B,
	FF: 0x2C,
};

const FF_PAGE_INDEX = 3; // Page to use when FF is active

// --- Global Variables ---
let midiOutPort;
let projectPerformPage; // Project Remote Page 0 (Knobs)
let fadersPage;         // Project Remote Page 1 (Faders)
let mutesPage;          // Project Remote Page 2 (M Buttons)

let trackBank;                     // Bank for first 8 tracks
let trackPerformPages = [];        // Array to hold page 0 for each track's remotes
let trackExists = initArray(false, 8); // Track existence state for LEDs
let trackNames = initArray("", 8);    // Track names for popups

let fixedTrackIndex = -1;          // Index of the track knobs are fixed to (-1 = Project)
let activePerformPage;             // The current page knobs control (project or track)
let isFFMode = false;              // Whether FF mode is active (only applies in project mode)

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

	// Create Project Remote Pages on the root track group
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

	// Add observers to ensure pages stay fixed
	fadersPage.selectedPageIndex().addValueObserver((page) => {
		if (page !== 1) {
			fadersPage.selectedPageIndex().set(1);
		}
	});

	mutesPage.selectedPageIndex().addValueObserver((page) => {
		if (page !== 2) {
			mutesPage.selectedPageIndex().set(2);
		}
	});

	// Initialize active perform page to the project page
	activePerformPage = projectPerformPage;

	// Create TrackBank and track-specific remote pages
	trackBank = host.createTrackBank(8, 0, 0, false);
	trackBank.scrollPosition().markInterested();

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
		});
		track.name().addValueObserver((name) => {
			trackNames[i] = name;
		});

		// Create remote page cursor for track i, page 0
		trackPerformPages[i] = track.createCursorRemoteControlsPage(8);
		trackPerformPages[i].selectedPageIndex().markInterested();
		trackPerformPages[i].selectedPageIndex().set(0);

		// Mark track perform page parameters as interested
		for (let j = 0; j < 8; j++) {
			trackPerformPages[i].getParameter(j).markInterested();
		}
	}

	println("nanoKontrol2Mixer script initialized!");
}

function exit()
{
	println("nanoKontrol2Mixer script exited.");
	// Turn off M and R LEDs on exit
	for (let i = 0; i < 8; i++) {
		sendMidi(0xB0, CC.M1 + i, 0);
		sendMidi(0xB0, CC.R1 + i, 0);
	}
}

function flush()
{
	// Update M button LEDs based on project mute states
	for (let i = 0; i < 8; i++) {
		const ledValue = muteStates[i] ? 127 : 0;
		sendMidi(0xB0, CC.M1 + i, ledValue);
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
	// Check if it's a CC message (0xB0 - 0xBF)
	if ((status & 0xF0) === 0xB0) 
	{
		const value = data2; // MIDI value 0-127
		
		// Handle different CC ranges
		if (data1 >= CC.KNOB1 && data1 <= CC.KNOB8) { 
			const knobIndex = data1 - CC.KNOB1;
			if (activePerformPage) {
				activePerformPage.getParameter(knobIndex).set(value, 128);
			}
		}
		else if (data1 >= CC.SLIDER1 && data1 <= CC.SLIDER8) {
			const sliderIndex = data1 - CC.SLIDER1;
			fadersPage.getParameter(sliderIndex).set(value, 128);
		}
		else if (data1 >= CC.M1 && data1 <= CC.M8 && value > 0) { // M Buttons
			const mIndex = data1 - CC.M1;
			const muteParam = mutesPage.getParameter(mIndex);
			const currentValue = muteParam.value().get(); 
			muteParam.set(currentValue > 0 ? 0 : 127, 128);
		}
		else if (data1 >= CC.R1 && data1 <= CC.R8 && value > 0) { // R Buttons
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
					host.showPopupNotification("Controls Fixed: " + trackNames[rIndex]);
				} else {
					host.showPopupNotification("Track " + (rIndex + 1) + " does not exist");
				}
			}
		}
		else if (data1 === CC.REW && value > 0) { // REW Button
			if (fixedTrackIndex >= 0 || isFFMode) { // Act if in track mode OR FF mode
				fixedTrackIndex = -1;
				activePerformPage = projectPerformPage;
				isFFMode = false; // Exit FF mode
				projectPerformPage.selectedPageIndex().set(0);
				host.showPopupNotification("Controls: Project Remotes");
			}
		}
		else if (data1 === CC.FF && value > 0) { // FF Button
			if (fixedTrackIndex >= 0 || !isFFMode) { // Act if in track mode OR not in FF mode
				fixedTrackIndex = -1;
				activePerformPage = projectPerformPage;
				isFFMode = true; // Enter FF mode
				projectPerformPage.selectedPageIndex().set(FF_PAGE_INDEX);
				host.showPopupNotification("Controls: Project Remotes (Page " + FF_PAGE_INDEX + ")");
			}
		}
	}
}

function onSysex(data)
{
	// Add Sysex handling code here if needed
}

// --- Helper Functions ---
function sendMidi(status, data1, data2) {
	if (midiOutPort) {
		midiOutPort.sendMidi(status, data1, data2);
	} 
}
