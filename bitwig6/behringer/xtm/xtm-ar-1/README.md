# X-Touch Mini AR Controller Script

Bitwig Studio controller script for Behringer X-Touch Mini in Mackie Control mode.

## Overview

This script provides two distinct modes controlled by the **Layer B button**:
- **PLAY mode** (Layer B OFF): Performance and clip launching
- **MIXER mode** (Layer B ON): Volume and mute control

The **fader** is mapped to a remote control parameter tagged `fader` on the GROUP TRACK.

The script is designed to work with a **GROUP TRACK** as the pinned track (Track 1 by default).

## Setup

1. Set your X-Touch Mini to **Mackie Control (MC) mode**:
   - Hold Layer A + Layer B while powering on to toggle between modes
   
2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Add the "X-Touch Mini AR 1" controller
   - Set MIDI Input/Output to your X-Touch Mini device

3. Pin the controller to a Group Track (Track 1 by default)

## Fader

The fader is mapped to the first parameter on a remote control page tagged `fader` on the GROUP TRACK. This allows you to control any parameter (e.g., master volume, mix level, send amount) from the hardware fader.

## MIXER Mode (Layer B ON)

### Encoders

**Default (Layer A OFF):**
- **Turn**: Adjust parameters on the page tagged `perform` on the GROUP TRACK
- **Push**: Page selector
  - Encoder 1: Return to `perform` page
  - Encoders 2-8: Switch to pages `p2-p7` (if available)

**Layer A Active (Layer A ON):**
- **Turn**: Adjust parameters on the page tagged `c_perform` on the CURRENT CHILD TRACK's PRIMARY DEVICE
- **Push**: Page selector
  - Encoder 1: Return to `c_perform` page
  - Encoders 2-8: Switch to pages `p2-p7` on current child (if available)

### Upper Buttons (1-8)
- **Exclusive select**: Select and unmute one child track, mute all others
- LED ON = This child is active (selected and unmuted)
- LED OFF = This child is muted
- Selected child is retained for all modes
- **Resource optimization**: Muted tracks automatically stop their clips after 100ms (saves CPU)

### Lower Buttons (1-8)
- **Press**: Launch clips 1-8 on the **currently active (selected) child track only**
- **Long Press (1.4 seconds)**: Stop the playing clip on this slot
  - Only works if a clip is currently playing
  - Provides tactile control without needing Layer B
- Only launches clips that have content
- LED ON = This clip is playing on the active child
- LED OFF = This clip is not playing (but may have content)
- **Works identically in both MIXER and PLAY modes** - always launches clips on the selected child

### Layer A Button
- Toggle between GROUP and CHILD encoder contexts (same as PLAY mode)
- LED ON = Child mode (encoders control current child's c_perform page)
- LED OFF = Group mode (encoders control group perform page)

### Layer B Button
- Toggle between MIXER and PLAY modes
- LED ON = MIXER mode
- LED OFF = PLAY mode

## PLAY Mode (Layer B OFF)

### Encoders

**Default (Layer A OFF):**
- **Turn**: Adjust parameters on the page tagged `perform` on the GROUP TRACK
- **Push**: Page selector
  - Encoder 1: Return to `perform` page
  - Encoders 2-8: Switch to pages `p2-p7` (if available)

**Layer A Active (Layer A ON):**
- **Turn**: Adjust parameters on the page tagged `c_perform` on the CURRENT CHILD TRACK's PRIMARY DEVICE
- **Push**: Page selector
  - Encoder 1: Return to `c_perform` page
  - Encoders 2-8: Switch to pages `p2-p7` on current child (if available)

### Upper Buttons (1-8)
- Toggle parameters on the page tagged `c_mutes` on the PRIMARY DEVICE on the CURRENT CHILD TRACK
- LED shows mute state (ON = muted)
- Changes as you select different child tracks

### Lower Buttons (1-8)
- **Press**: Launch clips 1-8 on the CURRENT CHILD TRACK
- **Long Press (1.4 seconds)**: Stop the playing clip on this slot
  - Only works if a clip is currently playing
  - Provides tactile control without needing Layer B
- LED shows clip state:
  - ON = Playing
  - OFF = Has content but not playing
  - OFF = Empty slot

### Layer A Button
- Toggle between GROUP and CHILD encoder contexts
- LED ON = Child mode (encoders control current child's device)
- LED OFF = Group mode (encoders control group perform page)
- When toggled, resets to page 0 (perform/device)

### Layer B Button
- Toggle between MIXER and PLAY modes
- LED ON = MIXER mode
- LED OFF = PLAY mode

## Remote Control Page Tags

For the script to work properly, tag your remote control pages in Bitwig:

### GROUP TRACK:
- `fader` - Parameter controlled by the hardware fader (1 parameter)
- `volumes` - Volume parameters for mixer mode (not currently used)
- `mutes` - Mute parameters for mixer mode (not currently used)
- `perform` - Performance parameters for both modes (encoders)
- `p2` through `p7` - Additional pages (optional)

### CHILD TRACKS PRIMARY DEVICE:
- `c_perform` - Performance parameters for Layer A mode (encoders)
- `c_mutes` - Mute parameters for Play mode (upper buttons)
- `p2` through `p7` - Additional pages (optional)
  
### Optional Child Track Tags:
- `c_volumes` - (Reserved for future use)

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
- **MIDI Channels**: Input channel 1, Fader channel 9 (pitch bend)
- **Child Tracks**: Supports up to 8 child tracks in a group
- **Clip Launcher**: 8 clip slots per child track

## Workflow Tips

1. Press Layer B to toggle between MIXER and PLAY modes
2. Use MIXER mode for track selection and mixing (exclusive select on upper buttons)
3. Switch to PLAY mode to launch clips and control device parameters
4. Use Layer A to switch encoder context between GROUP and CHILD track
5. Map the fader to your most important parameter (e.g., group master volume, mix wet/dry)
6. Long press (0.5 seconds) on any playing clip button to stop it
7. Create multiple parameter pages (p2-p7) for extended control without leaving the controller
8. Tag your most-used parameters with appropriate tags for quick access

