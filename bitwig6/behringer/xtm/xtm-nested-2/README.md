# X-Touch Mini Nested Controller Script

This script is designed for the Behringer X-Touch Mini in **MC Mode**. It targets a specific nested track structure in Bitwig and provides access to the primary device's parameters via tagged remote control pages.

## Target Track

The script auto-detects the target track by name (`TRACK 1/1`), searching up to 3 levels deep plus the parent scope. It works regardless of the current drill-down state in the Bitwig UI.

## Features

### Encoder Mapping

The target track has 8 child tracks. When a bottom row button selects a child (1-8), all 8 encoders map to the selected child's primary device, page tagged `c-perf` (params 0-7).

- **Bottom Row Buttons 1-8**: Select child 1-8.
- **Button A**: Activates the perform layer — all 8 encoders map to the target track's primary device, page tagged `n-perform`.
- **Button B**: Activates the volumes layer — all 8 encoders map to the target track's primary device, page tagged `n-vols`.
- Selection is mutually exclusive. Pressing a bottom row button while in Layer A or B exits back to per-child mode.
- **Encoder Push**: Resets the parameter to its default value.

### Button Mapping
- **Top Row Buttons 1-8**: Map to the page tagged `n-mutes`. Typically used for toggle parameters.
- LED feedback shows the state of the mapped parameters.

### Fader Mapping
- **Main Fader**: Maps to the first parameter of the page tagged `n-all-vols`.

## Hardware Configuration
Ensure your X-Touch Mini is in **MC Mode**:
1. Unplug the device.
2. Press and hold the **MC** button (bottom right) while plugging the device back in.
3. The MC button should light up.

## Debugging
The script logs its status to the Bitwig Script Console, reporting the state of all candidate depth levels and which one is currently active.
