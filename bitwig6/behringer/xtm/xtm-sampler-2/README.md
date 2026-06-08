# X-Touch Mini Sampler 2 Controller Script

For the Behringer X-Touch Mini in **MC Mode**. Targets a single track's primary device, switchable between two tracks (A/B), and exposes a set of tagged remote control pages.

## Target Tracks

Two target track names are configured at the top of the script:

- **A**: `Track 2/4`
- **B**: `Track 1/4`

The script auto-detects each by name using a flat list of all project tracks (any nesting depth), regardless of drill-down state.

## Encoder Mapping

The 8 encoders map to the primary device's remote control pages of the active target. Page selection rules:

- Default (no selection): page tagged `xtm-perf`.
- **Bottom Row Buttons 1-8**: select pages tagged `xtm-1` .. `xtm-8`.
- Pressing the currently selected bottom button again clears the selection and returns to `xtm-perf`.
- **Encoder Push 1**: select `xtm-perf`.
- **Encoder Push 2**: toggle `xtm-vols` (press again to return to `xtm-perf`).
- **Encoder Push 3**: toggle `xtm-pans` (press again to return to `xtm-perf`).
- **Encoder Push 4-8**: unused.

Encoder LED rings reflect the current parameter values.

## A/B Target

- **Button A**: switch encoder/button/fader focus to target A (`Track 2/4`).
- **Button B**: switch focus to target B (`Track 1/4`).
- A and B are mutually exclusive; the active target's LED is lit.

## Button Mapping

- **Top Row Buttons 1-8**: map to the page tagged `xtm-mutes`. LEDs reflect parameter state (>0.5 = on).

## Fader Mapping

- **Main Fader**: maps to the first parameter of the page tagged `xtm-all-vols`.

## Hardware Configuration

Ensure your X-Touch Mini is in **MC Mode**:

1. Unplug the device.
2. Press and hold the **MC** button (bottom right) while plugging the device back in.
3. The MC button should light up.

## Debugging

The script logs status to the Bitwig Script Console: active candidate per target, currently selected page index, etc. Toggle with the `DEBUG` constant at the top of the script.
