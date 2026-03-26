# X-Touch Mini Child

This script is designed for the Behringer X-Touch Mini to control child tracks within a pinned group track in Bitwig Studio.

## Setup

- The script is pinned to the track at index 1 (default). You can change `PINNED_TRACK_INDEX` in the script if needed.
- Ensure your group track has child tracks.
- Remote control pages should be tagged as follows on the first device of each child track:
    - `1`: Main performance controls (default encoder mode).
    - `2`: Layer A controls.
    - `3`: Layer B controls.
    - `buttons`: Toggle controls for the upper buttons.

## Controls

### Lower Buttons (1-8)
- Selects the active child track (1-8).
- LED: The selected track button is lit.

### Upper Buttons (1-8)
- Toggles parameters on the remote control page tagged `buttons` of the first device on the selected child track.
- LED: Reflects the toggle state of the parameter.

### Encoders (1-8)
- Controls parameters on the active remote control page.
- **Modes**:
    - **Default (No Layer active)**: Maps to `1` tagged page.
    - **Layer A active**: Maps to `2` tagged page.
    - **Layer B active**: Maps to `3` tagged page.
- LED Rings: Show the current parameter value.

### Layer Buttons
- **Layer A**: Toggles Layer A mode for encoders.
- **Layer B**: Toggles Layer B mode for encoders.
- Note: Activating one layer deactivates the other. Deactivating an active layer returns to `1` mode.

### Fader
- Does nothing (by design).

## Debugging
- Set `DEBUG = true` in the script to see MIDI and state information in the Bitwig Script Console.
