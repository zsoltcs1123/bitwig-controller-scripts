# X-Touch Mini Kit Single Controller Script

Bitwig Studio controller script for Behringer X-Touch Mini in Mackie Control mode.

## Overview

This script provides three distinct modes for the **lower buttons** controlled by the **Layer A** and **Layer B buttons**:
- **DEFAULT mode** (Both layers OFF): Control group track mutes
- **LAYER A mode** (Layer A ON): Control current child device mutes or instrument selection
- **LAYER B mode** (Layer B ON): Launch clips on selected child track

The script is designed to work with a **GROUP TRACK** as the pinned track (Track 1 by default).

## Setup

1. Set your X-Touch Mini to **Mackie Control (MC) mode**:
   - Hold Layer A + Layer B while powering on to toggle between modes
   
2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Add the "X-Touch Mini Kit Single 1" controller
   - Set MIDI Input/Output to your X-Touch Mini device

3. Pin the controller to a Group Track (Track 1 by default)

## Encoders

### Default (Layer A OFF, Layer B OFF)
- **Turn**: Adjust parameters on the page tagged `perform` on the GROUP TRACK
- **Push**: Select instrument/chain on all child tracks simultaneously

### Layer A Active (Layer A ON)
- **Turn**: Adjust parameters on the page tagged `perform_extra` on the GROUP TRACK
- **Push**: Select instrument/chain on all child tracks simultaneously

### Layer B Active (Layer B ON)
- **Turn**: Adjust parameters on the page tagged `b` on the first device in the GROUP TRACK
- **Push**: Select instrument/chain on all child tracks simultaneously

## Upper Buttons (1-8)

- Toggle parameters on the page tagged `mutes` on devices in the GROUP TRACK
- LED shows mute state (ON = muted)
- The script scans for the first device with a chain selector to determine which device's mutes to control

## Lower Buttons (1-8)

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
- **Press**: Launch clip on the selected child track
- **Long Press (500ms)**: Stop all clips in the group
- LED ON = Clip is playing
- LED OFF = Clip has content but not playing or is empty

## Fader (Not Implemented)

The fader is available but not currently mapped in this script.

## Layer Buttons

### Layer A Button
- Toggle between DEFAULT and LAYER A mode for lower buttons
- When activated, Layer B is deactivated
- LED ON = LAYER A mode
- LED OFF = DEFAULT mode

### Layer B Button
- Toggle between DEFAULT and LAYER B mode for lower buttons
- When activated, Layer A is deactivated
- LED ON = LAYER B mode
- LED OFF = DEFAULT mode

## Remote Control Page Tags

For the script to work properly, tag your remote control pages in Bitwig:

### GROUP TRACK:
- `perform` - Performance parameters (encoders, default)
- `perform_extra` - Extra performance parameters (encoders, Layer A)
- `b` - Layer B parameters (encoders, Layer B on first device with chain selector)
- `mutes` - Mute parameters (lower buttons, default mode)

### CHILD TRACKS PRIMARY DEVICE:
- `mutes` - Mute parameters for Layer A mode (lower buttons)

## Debug Mode

Debug logging is enabled by default. Check the Bitwig Studio Controller Script Console for detailed information about:
- MIDI messages
- Mode switches
- Parameter changes
- Button presses
- Track status

To disable debug logging, set `DEBUG = false` in the script.

## Technical Details

- **API Version**: 25
- **Pinned Track**: Track 1 (index 0)
- **MIDI Channels**: Input channel 1
- **Child Tracks**: Supports up to 8 child tracks in a group
- **Clip Launcher**: 8 clip slots per child track
- **Scene Launch**: Launches all clips across child tracks in a scene

## Workflow Tips

1. Press Layer A or Layer B to change the lower button functionality
2. Use DEFAULT mode for controlling group-level mutes
3. Use LAYER A mode to control device mutes or select instruments on the selected child
4. Use LAYER B mode for clip launching on the selected child track
5. Use encoder push to select instruments across all child tracks simultaneously
6. The upper buttons always control group device mutes regardless of layer state

