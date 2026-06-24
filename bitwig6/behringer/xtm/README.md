# X-Touch Mini Sampler Scripts

This folder contains a family of controller scripts for the Behringer X-Touch Mini (in **MC Mode**):

- `xtm-sampler-1`
- `xtm-sampler-2`
- `xtm-sampler-3`
- `xtm-sampler-4`

> **IMPORTANT:** All `xtm-sampler-*` scripts are functionally identical. They share the exact same code and behavior and differ **only** in:
> - the two target track names they bind to (`TARGET_TRACK_A` / `TARGET_TRACK_B`),
> - their identity (`defineController` name + uid, `CURSOR_ID` / `CURSOR_NAME`, `package.json`).
>
> When the functionality is edited, the change **must be applied to all variants** so they stay in sync. The only per-script differences allowed are the binding and identity blocks at the top of each `.control.js`.

## Bindings

| Script | Target A | Target B |
| ------ | -------- | -------- |
| 1      | `Track 1/1` | `Track 2/3` |
| 2      | `Track 2/4` | `Track 1/4` |
| 3      | `Track 1/2` | `Track 2/3` |
| 4      | `Track 2/3` | `Track 1/3` |

## Shared Functionality

Each script targets a single track's primary device, switchable between its two bound tracks (A/B), and exposes a set of tagged remote control pages. Track detection is by name (case-insensitive) over a flat list of all project tracks, at any nesting depth. The two cursor tracks are pinned, so they stay attached to their bound tracks regardless of UI navigation / zoom.

### Encoder Mapping

The 8 encoders map to the primary device's remote control pages of the active target. Page selection rules:

- Default (no selection): page tagged `xtm-perf`.
- **Bottom Row Buttons 1-8**: select pages tagged `xtm-1` .. `xtm-8`.
- Pressing the currently selected bottom button again clears the selection and returns to `xtm-perf`.
- **Encoder Push 1**: select `xtm-perf`.
- **Encoder Push 2**: toggle `xtm-vols` (press again to return to `xtm-perf`).
- **Encoder Push 3**: toggle `xtm-pans` (press again to return to `xtm-perf`).
- **Encoder Push 4-8**: unused.

Encoder LED rings reflect the current parameter values.

### A/B Target

- **Button A**: switch encoder/button/fader focus to target A.
- **Button B**: switch focus to target B.
- A and B are mutually exclusive; the active target's LED is lit.

### Button Mapping

- **Top Row Buttons 1-8**: map to the page tagged `xtm-mutes`. LEDs reflect parameter state (>0.5 = on).

### Fader Mapping

- **Main Fader**: maps to the first parameter of the page tagged `xtm-all-vols`.

## Hardware Configuration

Ensure your X-Touch Mini is in **MC Mode**:

1. Unplug the device.
2. Press and hold the **MC** button (bottom right) while plugging the device back in.
3. The MC button should light up.

## Debugging

Each script logs status to the Bitwig Script Console when its `DEBUG` constant is set to `true`.
