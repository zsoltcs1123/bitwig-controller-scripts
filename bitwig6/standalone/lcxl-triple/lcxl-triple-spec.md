# LaunchControlXL Triple Controller Specification

## Core Concept
The controller is designed exclusively for **Group Track Mode**, providing **triple control** over three child tracks simultaneously. If the fixed track is not a group track, the controller remains inactive.

## Hardware Layout
- **8 Top Row Knobs** (T1-T8)
- **8 Middle Row Knobs** (M1-M8) 
- **8 Bottom Row Knobs** (B1-B8)
- **8 Faders** (1-8)
- **16 Buttons** (8 top row, 8 bottom row)
- **4 Control Buttons**: MUTE, SOLO, REC ARM, DEVICE
- **2 Send Select Buttons**: Up/Down (for instrument selector)

## Operating Mode

### Group Track Mode (Triple Control)
**When on a group track with child tracks:**

#### Division 1 (Controls Child Track 1):
- **Top knobs 1-2**: Child track 1 remote controls page 0 parameters 0-1 (RED LEDs)
- **Middle knobs 1-2**: Child track 1 remote controls page 0 parameters 2-3 (RED LEDs)
- **Bottom knobs 1-2**: Child track 1 primary device page 0 parameters 0-1 (RED_MED LEDs)
- **Faders 1-2**: Child track 1 remote controls page 1 parameters 0-1
- **Top buttons 1-2**: Child track 1 primary device page 1 parameters 0-1 (toggle)
- **Bottom buttons 1-2**: Child track 1 primary device page 1 parameters 2-3 (toggle)

#### Division 2 (Controls Child Track 2):
- **Top knobs 3-5**: Child track 2 remote controls page 0 parameters 0-2 (AMBER LEDs)
- **Middle knobs 3-5**: Child track 2 remote controls page 0 parameters 3-5 (AMBER LEDs)
- **Bottom knobs 3-5**: Child track 2 primary device page 0 parameters 0-2 (AMBER_MED LEDs)
- **Faders 3-5**: Child track 2 remote controls page 1 parameters 0-2
- **Top buttons 3-5**: Child track 2 primary device page 1 parameters 0-2 (toggle)
- **Bottom buttons 3-5**: Child track 2 primary device page 1 parameters 3-5 (toggle)

#### Division 3 (Controls Child Track 3):
- **Top knobs 6-8**: Child track 3 remote controls page 0 parameters 0-2 (GREEN LEDs)
- **Middle knobs 6-8**: Child track 3 remote controls page 0 parameters 3-5 (GREEN LEDs)
- **Bottom knobs 6-8**: Child track 3 primary device page 0 parameters 0-2 (GREEN_MED LEDs)
- **Faders 6-8**: Child track 3 remote controls page 1 parameters 0-2
- **Top buttons 6-8**: Child track 3 primary device page 1 parameters 0-2 (toggle)
- **Bottom buttons 6-8**: Child track 3 primary device page 1 parameters 3-5 (toggle)

#### Common Controls (Always Active):
- **MUTE/SOLO/REC ARM/DEVICE**: Current track remote controls page 2

## Instrument Selector Modes

### Instrument Selector Mode 1 (Child Track 1):
- **Activated by**: Track Select Left button
- **Controls**: Division 1 buttons (top row 1-2, bottom row 1-2)
- **Function**: Select instrument chains 0-3 in child track 1's primary device
- **LEDs**: RED_FULL for active chain, RED_LOW for available chains
- **Track Select Left LED**: RED_FULL when active

### Instrument Selector Mode 2 (Child Track 2):
- **Activated by**: Send Select Up button
- **Controls**: Division 2 buttons (top row 3-5, bottom row 3-5)
- **Function**: Select instrument chains 0-5 in child track 2's primary device
- **LEDs**: AMBER_FULL for active chain, AMBER_LOW for available chains
- **Send Select Up LED**: AMBER_FULL when active

### Instrument Selector Mode 3 (Child Track 3):
- **Activated by**: Send Select Down button
- **Controls**: Division 3 buttons (top row 6-8, bottom row 6-8)
- **Function**: Select instrument chains 0-5 in child track 3's primary device
- **LEDs**: GREEN_FULL for active chain, GREEN_LOW for available chains
- **Send Select Down LED**: GREEN_FULL when active

## Key Features

### "Track Fixing" (Pinning)
- Controller maintains independent control that doesn't follow user's track selection in Bitwig
- Each control surface element is bound to specific tracks/devices
- Provides consistent, predictable control mapping

### LED Feedback
- **Color coding**: RED (child track 1), AMBER (child track 2), GREEN (child track 3)
- **Intensity levels**: OFF, LOW, MED, FULL indicate parameter states
- **Real-time updates**: LEDs reflect current parameter values and modes

### Intelligent Mode Switching
- **Automatic detection**: Detects group vs regular tracks
- **Dynamic layout**: Control mapping changes based on track type
- **Contextual buttons**: Same buttons serve different functions in different modes

### MIDI Configuration
- **Channel**: MIDI Channel 6 (User Mode 6)
- **Protocol**: Uses both CC messages (knobs/faders) and Note messages (buttons)
- **Bidirectional**: Sends LED updates via SysEx messages

---

This specification describes a sophisticated triple-track controller that maximizes the LaunchControlXL's limited controls by providing context-aware, intelligent mapping that adapts to the track structure in Bitwig Studio. The key innovation is the "triple control" concept for group tracks, allowing simultaneous control of three child tracks with clear visual feedback.

## Control Division Layout Summary

**Division 1 (Child Track 1)**: 2 knobs per row + 2 faders + 2 buttons per row = RED LEDs
**Division 2 (Child Track 2)**: 3 knobs per row + 3 faders + 3 buttons per row = AMBER LEDs  
**Division 3 (Child Track 3)**: 3 knobs per row + 3 faders + 3 buttons per row = GREEN LEDs

This layout provides balanced control across three child tracks while maintaining the intuitive color-coded feedback system.