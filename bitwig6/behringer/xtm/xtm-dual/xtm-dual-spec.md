# X-Touch Mini Dual Controller Specification

## Overview

The **X-Touch Mini Dual** controller script is designed for Bitwig Studio 6 (API version 25) to control two child tracks within a Group track simultaneously using a single Behringer X-Touch Mini controller in Standard Mode.

## Hardware Configuration

- **Controller**: Behringer X-Touch Mini
- **Mode**: Standard Mode (not MC Mode)
- **MIDI Channels**: 
  - Input: Channel 11 (CC 10, 0-based)
  - Output: Channel 12 (CC 11, 0-based) for LED feedback
- **Connection**: Single MIDI input/output port

## Core Concepts

### Track Pinning
- The controller is **pinned** to a specific Group track (configurable index)
- Does **not** follow the cursor track - maintains focus on the pinned track
- Remote Control Pages are also **pinned** to specific page indices
- This ensures consistent, predictable control mapping

### Dual Child Track Control
- Simultaneous control of **Child Track 0** and **Child Track 1** within the pinned Group track
- Each child track has dedicated controls on the physical controller
- Layer switching affects certain controls while others remain constant

### Layer System
- **Layer A** and **Layer B** provide different functionality modes
- Layer switching is automatic based on which physical layer is used
- Encoders are **not layer-aware** - always map to the same controls
- Upper buttons have **layer-dependent** functionality

## Control Mapping

### Encoders (Layer-Independent)
| Physical Control | Target | Description |
|------------------|--------|-------------|
| Encoders 1-4 | Child Track 0 → Remote Control Page 0 | Always active, regardless of layer |
| Encoders 5-8 | Child Track 1 → Remote Control Page 0 | Always active, regardless of layer |

### Upper Buttons (Layer-Dependent)
| Physical Control | Layer A Target | Layer B Target | Description |
|------------------|----------------|----------------|-------------|
| Upper Buttons 1-4 | Child Track 0 → Remote Control Page 1 | Child Track 0 → First 4 MIDI Clips (launch/stop) | Layer-dependent functionality |
| Upper Buttons 5-8 | Child Track 1 → Remote Control Page 1 | Child Track 1 → First 4 MIDI Clips (launch/stop) | Layer-dependent functionality |

### Lower Buttons (Always Active)
| Physical Control | Target | Description |
|------------------|--------|-------------|
| Lower Buttons 1-4 | Child Track 0 → Remote Control Page 2 | Always mapped, layer-independent |
| Lower Buttons 5-8 | Child Track 1 → Remote Control Page 2 | Always mapped, layer-independent |

### Fader (Always Active)
| Physical Control | Target | Description |
|------------------|--------|-------------|
| Fader | Group Track → Remote Control Page 4 | Always mapped to group track, layer-independent |

## Remote Control Page Assignments

### Child Track 0
- **Page 0**: Encoders 1-4 (always active)
- **Page 1**: Upper Buttons 1-4 (Layer A only)
- **Page 2**: Lower Buttons 1-4 (always active)

### Child Track 1
- **Page 0**: Encoders 5-8 (always active)
- **Page 1**: Upper Buttons 5-8 (Layer A only)
- **Page 2**: Lower Buttons 5-8 (always active)

### Group Track
- **Page 4**: Fader (always active)

## MIDI Clip Control (Layer B)

When in **Layer B**, upper buttons control MIDI clip launching:

### Child Track 0
- Upper Button 1 → Clip slot 0 (launch/stop)
- Upper Button 2 → Clip slot 1 (launch/stop)  
- Upper Button 3 → Clip slot 2 (launch/stop)
- Upper Button 4 → Clip slot 3 (launch/stop)

### Child Track 1
- Upper Button 5 → Clip slot 0 (launch/stop)
- Upper Button 6 → Clip slot 1 (launch/stop)
- Upper Button 7 → Clip slot 2 (launch/stop)
- Upper Button 8 → Clip slot 3 (launch/stop)

## Configuration

### Pinned Track Configuration
```javascript
const PINNED_GROUP_TRACK_INDEX = 0; // Configurable - which group track to pin to
```

### MIDI Configuration
```javascript
const INPUT_MIDI_CHANNEL = 10;  // Channel 11 (0-based)
const OUTPUT_MIDI_CHANNEL = 11; // Channel 12 (0-based)
```

## LED Feedback

### Encoder LED Rings
- **Behavior**: Show parameter values using LED ring patterns
- **Ring Mode**: Appropriate for each parameter type (single, pan, fan, etc.)
- **Updates**: Real-time feedback as parameters change

### Button LEDs
- **Remote Control Parameters**: 
  - ON (bright) when parameter value > 0
  - DIM when parameter exists but value = 0
  - OFF when parameter doesn't exist
- **MIDI Clips**:
  - GREEN when clip exists and is playing
  - AMBER when clip exists but is stopped
  - OFF when no clip exists

### Layer Indication
- Visual feedback to show current active layer
- Could use specific LED patterns or dedicated indicator

## API Integration

### Track Bank Setup
```javascript
// Pinned group track
const groupTrack = trackBank.getItemAt(PINNED_GROUP_TRACK_INDEX);

// Child tracks using cursor approach for pinning
const childTrack0 = host.createCursorTrack("ChildTrack0", "Child Track 0", 0, 0, true);
const childTrack1 = host.createCursorTrack("ChildTrack1", "Child Track 1", 0, 0, true);
```

### Remote Control Pages
```javascript
// Pin to specific pages - prevent automatic page switching
childTrack0RemotePage0.selectedPageIndex().set(0);
childTrack0RemotePage1.selectedPageIndex().set(1);
childTrack0RemotePage2.selectedPageIndex().set(2);
// ... similar for childTrack1 and groupTrack
```

### MIDI Clip Launchers
```javascript
// Clip launcher for Layer B functionality
const childTrack0ClipLauncher = childTrack0.clipLauncherSlotBank();
const childTrack1ClipLauncher = childTrack1.clipLauncherSlotBank();
```

## Error Handling

### Track Validation
- Verify pinned track exists and is a Group track
- Check that child tracks exist within the group
- Graceful fallback if tracks are missing

### Parameter Validation
- Check parameter existence before mapping
- Handle missing remote control pages
- Provide debug logging for troubleshooting

### MIDI Validation
- Validate MIDI channel configuration
- Handle missing MIDI ports gracefully
- Provide clear error messages

## Logging and Debugging

### Debug Mode
```javascript
const DEBUG = true; // Enable detailed logging
```

### Log Categories
- **Initialization**: Track setup, parameter mapping
- **MIDI Events**: Incoming MIDI messages and routing
- **Parameter Changes**: Remote control parameter updates
- **LED Updates**: Visual feedback changes
- **Error Conditions**: Missing tracks, parameters, or MIDI issues

## Performance Considerations

### Observer Management
- Efficient observer setup for parameters that need LED feedback
- Proper cleanup on script exit
- Minimal observer overhead for unused parameters

### MIDI Optimization
- Batch LED updates when possible
- Avoid redundant MIDI messages
- Efficient message filtering

## Extensibility

### Future Enhancements
- Support for additional child tracks (beyond 2)
- Configurable layer behavior
- User-defined control mappings
- Integration with Bitwig's device parameter mapping

### Modular Design
- Separate modules for different functionality areas
- Clean interfaces between components
- Easy configuration updates

## Testing Strategy

The implementation should be tested in phases:

1. **Basic MIDI I/O**: Verify MIDI communication
2. **Track Pinning**: Ensure correct track targeting
3. **Encoder Control**: Test parameter mapping and LED feedback
4. **Button Control**: Test both layer modes and LED feedback
5. **Clip Launching**: Test Layer B MIDI clip functionality
6. **Edge Cases**: Missing tracks, parameters, error conditions

## Compatibility

- **Bitwig Studio Version**: 6.x
- **API Version**: 25
- **Controller Firmware**: Standard Mode configuration required
- **Operating System**: Cross-platform (Windows, macOS, Linux)
