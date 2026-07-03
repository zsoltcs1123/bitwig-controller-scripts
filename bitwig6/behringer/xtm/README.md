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

Tagged remote pages are picked up **live**: if you create a matching page mid-set (e.g. add `xtm-perf` on the target device), the script binds to it immediately with no script restart. This works because each tagged cursor page auto-selects its first matching page as soon as one appears.

Remote page tags: `xtm-perf`, `xtm-vols`, `xtm-pans`, `xtm-eq`, `xtm-mutes`, `xtm-all-vols`, `xtm-1` … `xtm-8`.

### Encoder Mapping

The 8 encoders map to the primary device's remote control pages of the active target. Encoder-page selection:

- Default (no selection): page tagged `xtm-perf`.
- **Encoder Push 1**: select `xtm-perf`.
- **Encoder Push 2**: toggle `xtm-vols` (press again to return to `xtm-perf`).
- **Encoder Push 3**: toggle `xtm-pans` (press again to return to `xtm-perf`).
- **Encoder Push 4**: toggle `xtm-eq` (press again to return to `xtm-perf`).
- **Encoder Push 5-6**: unused.

Encoder LED rings reflect the current parameter values.

### A/B Target Switch (Encoder Push 7/8)

- **Encoder Push 7**: switch encoder/button/fader focus to target A.
- **Encoder Push 8**: switch focus to target B.
- No dedicated LED for target selection.

### Bottom Row Modes (Buttons A / B)

The bottom button row has three modes. Default is **page selector**; the A and B buttons toggle the other two (press the active mode's button again to return to page selector). The A/B button LEDs light for the active mode.

- **Page selector (default)**: bottom buttons 1-8 select pages tagged `xtm-1` .. `xtm-8`. Pressing the currently selected button again returns to `xtm-perf`.
- **Button A → Clip launcher**: bottom buttons launch clips. Bank size is `BANK_SIZE` (default `3`, max `8`); only the first `BANK_SIZE` buttons are active. Clips are offset by the active instrument chain (chain 1 → clips 1..N, chain 2 → clips N+1.., etc.). Short press launches / re-triggers; long press (>0.5s) stops the track. LEDs reflect the playing clip.
- **Button B → Chain selector**: bottom buttons 1-8 set the active chain index on the target's primary device. On chain switch, inactive chains go to −∞ dB and the active chain resets to 0 dB. LED shows the active chain.

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
