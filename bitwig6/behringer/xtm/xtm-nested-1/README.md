# X-Touch Mini Nested Controller Script

This script is designed for the Behringer X-Touch Mini in **MC Mode**. It targets a specific nested track structure in Bitwig and provides access to the primary device's parameters via tagged remote control pages.

## Target Track

The script auto-detects the target track by walking up to 3 levels deep into the track hierarchy, starting from the first top-level track. It looks for the **first non-group track** in the chain.

Given a project structure like:

```
PROJECT (group)
  └── INSTRUMENTS (group)
        └── TARGET (instrument/audio track)
```

The script will find TARGET regardless of whether the Bitwig UI is at the top level, drilled into PROJECT, or drilled into INSTRUMENTS. When you navigate into a group in the UI, the track bank scope shifts — the script detects this and automatically re-routes to the correct depth level.

## Features

### Encoder Mapping (Tagged Pages)
The 8 encoders map to specific tagged pages on the primary device of the target track.
- **Bottom Row Buttons 1-8**: Select between pages tagged `n1` through `n8`.
- **Button A**: Activates the perform layer, mapping encoders to the page tagged `n-perform`.
- **Button B**: Activates the volumes layer, mapping encoders to the page tagged `n-vols`.
- Selection is mutually exclusive. Pressing a bottom row button while in Layer A or B exits back to the default page view.
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
