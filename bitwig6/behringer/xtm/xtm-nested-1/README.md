# X-Touch Mini Nested Controller Script

This script is designed for the Behringer X-Touch Mini in **MC Mode**. It targets a specific nested track structure in Bitwig and provides access to the primary device's parameters via tagged remote control pages.

## Target Track
The script pins itself to the **first track within the first track** in Bitwig.
- The first track in your project must be a Group Track.
- The script will control the first track inside that group.

## Features

### Encoder Mapping (Tagged Pages)
The 8 encoders map to specific tagged pages on the primary device of the target track.
- **Bottom Row Buttons 1-8**: Select between pages tagged `n1`, `n2`, `n3`, `n4`, `n5`, `n6`, `n7`, and `n8`.
- **Button A**: Activates the perform layer, mapping encoders to the page tagged `n-perform`.
- **Button B**: Activates the volumes layer, mapping encoders to the page tagged `n-vols`.
- Selection is mutually exclusive: selecting a page or a layer will update the LEDs and encoder rings accordingly.
- Pressing a bottom row button while in Layer A or B exits back to the default page view.
- **Encoder Push**: Resets the parameter to its default value.

### Button Mapping
- **Top Row Buttons 1-8**: Map to the page tagged `n-mutes`. These are typically used for toggle parameters like mutes or bypasses.
- LED feedback shows the state of the mapped parameters.

### Fader Mapping
- **Main Fader**: Maps to the first parameter of the page tagged `n-all-vols`.

## Hardware Configuration
Ensure your X-Touch Mini is in **MC Mode**:
1. Unplug the device.
2. Press and hold the **MC** button (bottom right) while plugging the device back in.
3. The MC button should light up.

## Debugging
The script logs its status to the Bitwig Script Console. It will report if it successfully finds the target track and device.
