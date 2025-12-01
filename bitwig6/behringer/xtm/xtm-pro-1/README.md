# X-Touch Mini Pro Controller Script

Bitwig Studio controller script for Behringer X-Touch Mini in Mackie Control mode.

## Overview

This script provides advanced child track control with:
- **Fader-controlled encoder context switching**: Position determines whether encoders control `perform` or `device` pages
- **Layer-based lower button modes**: Three distinct modes for different workflow needs
- **Upper button child selection**: Quick access to 8 child tracks

The script is designed to work with a **GROUP TRACK** as the pinned track (Track 1 by default).

## Setup

1. Set your X-Touch Mini to **Mackie Control (MC) mode**:
   - Hold Layer A + Layer B while powering on to toggle between modes
   
2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Add the "X-Touch Mini Pro 1" controller
   - Set MIDI Input/Output to your X-Touch Mini device

3. Pin the controller to a Group Track (Track 1 by default)

## Fader

The fader controls the **encoder context**:
- **Fader < 50%**: Encoders control `perform` page on selected child track
- **Fader > 50%**: Encoders control `device` page on selected child track's primary device

This allows smooth transitions between performance and device-level control.

## Encoders

- **Turn**: Adjust parameters on the active page (either `perform` or `device` based on fader position)
- **Push**: Set instrument/chain across all child tracks that have chain selectors
  - Encoder 1-8 selects chain 0-7 on all compatible child tracks simultaneously

## Upper Buttons (1-8)

- **Press**: Select child track (1-8)
- LED ON = This child track is selected
- LED OFF = This child track is not selected
- Only works when pinned track is a group
- Selecting a child updates encoder LEDs and lower button states

## Lower Buttons (1-8)

The lower buttons have three modes controlled by Layer A and Layer B:

### DEFAULT Mode (Both layers OFF)
- Toggle parameters on the page tagged `mutes` on the GROUP TRACK
- LED ON = Muted
- LED OFF = Not muted

### LAYER A Mode (Layer A ON)

If the selected child has a chain selector:
- **Press**: Select instrument/chain (buttons 1-N show available chains)
- LED ON = This chain is active
- LED OFF = This chain is not active

If the selected child has no chain selector:
- Toggle parameters on the page tagged `mutes` on the PRIMARY DEVICE on the selected child track
- LED ON = Muted
- LED OFF = Not muted

### LAYER B Mode (Layer B ON)
- **Press**: Launch clip (1-8) on the selected child track
- LED ON = Clip is playing
- LED OFF = Clip has content but not playing or is empty
- Only launches clips that exist

## Layer Buttons

### Layer A Button
- Toggle LAYER A mode for lower buttons
- When activated, Layer B is deactivated
- LED ON = LAYER A mode active
- LED OFF = LAYER A mode inactive

### Layer B Button
- Toggle LAYER B mode for lower buttons
- When activated, Layer A is deactivated
- LED ON = LAYER B mode active
- LED OFF = LAYER B mode inactive

## Remote Control Page Tags

For the script to work properly, tag your remote control pages in Bitwig:

### CHILD TRACKS:
- `perform` - Performance parameters (encoders when fader < 50%)

### CHILD TRACKS PRIMARY DEVICE:
- `device` - Device parameters (encoders when fader > 50%)
- `mutes` - Mute parameters for Layer A mode (lower buttons)

### GROUP TRACK:
- `mutes` - Group-level mute parameters (lower buttons, default mode)

## Debug Mode

Debug logging is enabled by default. Check the Bitwig Studio Controller Script Console for detailed information about:
- MIDI messages
- Fader position and context switches
- Child track selection
- Mode switches
- Parameter changes
- Button presses
- Chain selector status

To disable debug logging, set `DEBUG = false` in the script.

## Technical Details

- **API Version**: 25
- **Pinned Track**: Track 1 (index 0)
- **MIDI Channels**: Input channel 1, Fader channel 9 (pitch bend)
- **Child Tracks**: Supports up to 8 child tracks in a group
- **Clip Launcher**: 8 clip slots per child track
- **Encoder Context**: Dynamically switches based on fader position

## Workflow Tips

1. Use the **fader** to switch between performance and device control contexts
2. Use **upper buttons** to quickly select child tracks
3. Press **Layer A** to access device mutes or instrument selection on the selected child
4. Press **Layer B** to access clip launching on the selected child
5. Use **encoder push** to change instruments across all child tracks at once
6. The encoder LEDs update automatically when you change child tracks or fader position
7. Long encoder turns provide finer control with 0.03 increments per step

