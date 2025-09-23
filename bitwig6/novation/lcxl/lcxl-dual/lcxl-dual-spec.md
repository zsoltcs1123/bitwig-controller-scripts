# LaunchControlXL Dual Controller Specification

## Core Concept
The controller operates in **two modes** depending on the selected track type:
- **Regular Track Mode**: Controls a single track
- **Group Track Mode**: Provides **dual control** over two child tracks simultaneously

## Hardware Layout
- **8 Top Row Knobs** (T1-T8)
- **8 Middle Row Knobs** (M1-M8) 
- **8 Bottom Row Knobs** (B1-B8)
- **8 Faders** (1-8)
- **16 Buttons** (8 top row, 8 bottom row)
- **4 Control Buttons**: MUTE, SOLO, REC ARM, DEVICE
- **2 Send Select Buttons**: Up/Down (for instrument selector)

## Operating Modes

### 1. Regular Track Mode
**When on a regular (non-group) track:**
- **Top 8 knobs**: Control current track's remote controls page 0 (RED LEDs)
- **Middle/Bottom knobs**: Inactive (LEDs OFF)
- **Faders**: Inactive
- **Buttons**: Inactive (LEDs OFF)
- **MUTE/SOLO/REC ARM/DEVICE**: Control current track's remote controls page 1

> **Note**: The regular mode is not that important. It's just a fallback so that the controller does something when it's fixed to a track that is not a group track.

### 2. Group Track Mode (Dual Control)
**When on a group track with child tracks:**

#### Left Side (Controls Child Track 1):
- **Middle knobs 1-4**: Child track 1 remote controls page 0 (AMBER LEDs)
- **Bottom knobs 1-4**: Child track 1 primary device page 0 (AMBER_MED LEDs)
- **Faders 1-4**: Child track 1 remote controls page 1
- **Top buttons 1-4**: Child track 1 primary device page 1 parameters 0-3 (toggle)
- **Bottom buttons 1-4**: Child track 1 primary device page 1 parameters 4-7 (toggle)

#### Right Side (Controls Child Track 2):
- **Middle knobs 5-8**: Child track 2 remote controls page 0 (GREEN LEDs)
- **Bottom knobs 5-8**: Child track 2 primary device page 0 (GREEN_MED LEDs)
- **Faders 5-8**: Child track 2 remote controls page 1
- **Top buttons 5-8**: Child track 2 primary device page 1 parameters 0-3 (toggle)
- **Bottom buttons 5-8**: Child track 2 primary device page 1 parameters 4-7 (toggle)

#### Common Controls (Always Active):
- **Top 8 knobs**: Current track remote controls page 0 (RED LEDs)
- **MUTE/SOLO/REC ARM/DEVICE**: Current track remote controls page 1

## 3. Instrument Selector Modes

### Instrument Selector Mode 1 (Child Track 1):
- **Activated by**: Send Select Up button
- **Controls**: First 8 buttons (top row 1-4, bottom row 1-4)
- **Function**: Select instrument chains 0-7 in child track 1's primary device
- **LEDs**: RED_FULL for active chain, RED_LOW for available chains
- **Send Select Up LED**: AMBER_FULL when active

### Instrument Selector Mode 2 (Child Track 2):
- **Activated by**: Send Select Down button  
- **Controls**: Last 8 buttons (top row 5-8, bottom row 5-8)
- **Function**: Select instrument chains 0-7 in child track 2's primary device
- **LEDs**: RED_FULL for active chain, RED_LOW for available chains
- **Send Select Down LED**: AMBER_FULL when active

## Key Features

### "Track Fixing" (Pinning)
- Controller maintains independent control that doesn't follow user's track selection in Bitwig
- Each control surface element is bound to specific tracks/devices
- Provides consistent, predictable control mapping

### LED Feedback
- **Color coding**: RED (main track), AMBER (child track 1), GREEN (child track 2)
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

This specification describes a sophisticated dual-track controller that maximizes the LaunchControlXL's limited controls by providing context-aware, intelligent mapping that adapts to the track structure in Bitwig Studio. The key innovation is the "dual control" concept for group tracks, allowing simultaneous control of two child tracks with clear visual feedback.