# X-Touch Mini AR Controller Script

Bitwig Studio controller script for Behringer X-Touch Mini in Mackie Control mode.

## Overview

This script provides two distinct modes controlled by the fader position:
- **PLAY mode** (fader < 50%): Performance and clip launching
- **MIXER mode** (fader > 50%): Volume and mute control

The script is designed to work with a **GROUP TRACK** as the pinned track (Track 1 by default).

## Setup

1. Set your X-Touch Mini to **Mackie Control (MC) mode**:
   - Hold Layer A + Layer B while powering on to toggle between modes
   
2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Add the "X-Touch Mini AR 1" controller
   - Set MIDI Input/Output to your X-Touch Mini device

3. Pin the controller to a Group Track (Track 1 by default)

## MIXER Mode (Fader > 50%)

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
- Toggle parameters on the page tagged `mutes` on the GROUP TRACK
- LED shows mute state (ON = muted)

### Lower Buttons (1-8)
- Select child track (1-8) within the group
- LED shows currently selected child track
- Selected child is retained for all modes

### Layer A Button
- Toggle between GROUP and CHILD encoder contexts (same as PLAY mode)
- LED ON = Child mode (encoders control current child's c_perform page)
- LED OFF = Group mode (encoders control group perform page)

### Layer B Button
- Stop all clips on the CURRENT CHILD TRACK (same as PLAY mode)

## PLAY Mode (Fader < 50%)

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
- Launch clips 1-8 on the CURRENT CHILD TRACK
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
- Stop all clips on the CURRENT CHILD TRACK

## Remote Control Page Tags

For the script to work properly, tag your remote control pages in Bitwig:

### GROUP TRACK:
- `volumes` - Volume parameters for mixer mode
- `mutes` - Mute parameters for mixer mode
- `perform` - Performance parameters for play mode
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

1. Use MIXER mode for quick volume and mute adjustments across your group
2. Select child tracks in MIXER mode, then switch to PLAY mode to launch clips
3. Use Layer A in PLAY mode to control individual child track devices
4. Create multiple parameter pages (p2-p7) for extended control without leaving the controller
5. Tag your most-used parameters with appropriate tags for quick access

