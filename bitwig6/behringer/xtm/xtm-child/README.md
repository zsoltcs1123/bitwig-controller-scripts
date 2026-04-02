# X-Touch Mini Child

This script is designed for the Behringer X-Touch Mini to control child tracks within a pinned group track in Bitwig Studio.

## Setup

- The script is pinned to the track at index 1 (default). You can change `PINNED_TRACK_INDEX` in the script if needed.
- Ensure your group track has child tracks.
- Remote control pages should be tagged as follows on the first device of each child track:
    - `1`: Default encoder page.
    - `1a`: Default alternative encoder page.
    - `2`: Layer A encoder page.
    - `2a`: Layer A alternative encoder page.
    - `3`: Layer B encoder page.
    - `3a`: Layer B alternative encoder page.
    - `b1`: Button toggle page for default layer.
    - `b2`: Button toggle page for Layer A.
    - `b3`: Button toggle page for Layer B.

## Controls

### Lower Buttons (1-8)
- Selects the active child track (1-8).
- LED: The selected track button is lit.

### Upper Buttons (1-7)
- Toggles parameters on the active button page (`b1`, `b2`, or `b3` depending on the current layer).
- LED: Reflects the toggle state of the parameter.

### Upper Button 8 (Alt Toggle)
- Toggles the encoder page between primary and alternative for the current layer.
- Each layer remembers its own alt state independently. Switching layers and back preserves the previous alt choice.
- LED: Lit when the current layer is in alternative mode.

### Encoders (1-8)
- Controls parameters on the active remote control page.
- **Modes** (primary / alternative, toggled by upper button 8):
    - **Default (No Layer active)**: Maps to `1` or `1a`.
    - **Layer A active**: Maps to `2` or `2a`.
    - **Layer B active**: Maps to `3` or `3a`.
- LED Rings: Show the current parameter value.

### Layer Buttons
- **Layer A**: Toggles Layer A mode for encoders and buttons.
- **Layer B**: Toggles Layer B mode for encoders and buttons.
- Note: Activating one layer deactivates the other. Deactivating an active layer returns to default mode. Alt state is remembered per layer.

### Fader
- Does nothing (by design).

## Debugging
- Set `DEBUG = true` in the script to see MIDI and state information in the Bitwig Script Console.
