# ZSAudio Maschine Groove Drums

Behringer X-Touch Mini script for the **Groove Drums** track in the ZSAUDIO-MASCHINE template. Targets the track's **Instrument Selector** device via tagged remote control pages.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. X-Touch Mini in **MC mode** (hold **MC** while plugging in).
2. Add the script in **Preferences → Controllers**.
3. Tag remote control pages on the Instrument Selector and Groove Drums track (see below).

Pinned to the **Groove Drums** track. Matched case-insensitively in the flat track list.

## Remote page tags

On the **Groove Drums** Instrument Selector:

| Tag | Role |
| --- | --- |
| `mutes` | Top row buttons 1–8 |
| `kill` | Main fader (slot 1, active chain only) |
| `m0` | Default encoder page |
| `faders` | Encoder push 1 |
| `vols` | Encoder push 2 |
| `pans` | Encoder push 3 |
| `eq` | Encoder push 4 |
| `d1` … `d8` | Bottom row buttons 1–8 (mode zero) |

On the **Groove Drums track** (track remote controls, not the device):

| Tag | Role |
| --- | --- |
| `chainkill` | Per-chain kill switches (slots 1–8, mode B) |

Tagged pages are picked up live — no script restart needed.

## Controls

### Top row (always)

Buttons 1–8 toggle parameters on the `mutes` page. LED on when value > 0.5.

### Encoders

- **Default (`m0`)**: no bottom-row selection, or encoder push 8, or re-press active bottom button.
- **Encoder push 1–4**: `faders`, `vols`, `pans`, `eq`.
- **Encoder push 8**: back to `m0`.
- **Bottom button N selected (mode zero)**: `dN` (buttons 1–8 → `d1`–`d8`).
- Press the active bottom button again to clear selection and return to `m0`.
- LED rings show the active encoder page.

### Fader

Main fader controls parameter 1 on the Instrument Selector `kill` remote page (active chain only). Pitch bend on MIDI channel 9 in MC mode.

### Bottom row modes

Three-way switch via **A** and **B** buttons:

| Mode | A LED | B LED | Bottom row |
| --- | --- | --- | --- |
| **Zero** (default) | off | off | Page selectors (`d1`–`d8`) |
| **A** | on | off | Clip launchers (8 clips for active drum rack) |
| **B** | off | on | Chain selectors (1–8) |

Press **A** or **B** again to return to mode zero.

### Mode B (chain select)

Bottom row selects Instrument Selector chains 1–8. LED shows active chain.

On chain change (single synchronous pass, no timers):

1. Stop all clips on the Groove Drums track.
2. Set **chainkill** on for the chain being left (track remote slot matching that chain).
3. Switch to the new chain.
4. Set **chainkill** off for the chain being entered.

Re-pressing the active chain only clears its chainkill (and stops clips).

Map track remote page `chainkill` slots 1–8 to each drum rack's kill control. These stay on the track when the Instrument Selector switches chains.

### Mode A (clip launchers)

Bottom row launches clips on the **Groove Drums** track for the active Instrument Selector chain (drum rack).

- **Button N** → clip N in the current bank (rack 1 → slots 1–8, rack 2 → slots 9–16, etc.).
- **Short press**: launch / re-trigger clip.
- **Long press** (>0.5 s) on a playing clip: stop the Groove Drums track.
- **LED on**: clip is playing.

Change the active drum rack in Bitwig; bottom buttons follow that chain's 8-clip bank.

## Configuration

`ENCODER_SENSITIVITY` at the top of the script controls encoder step size. `1` is default; `2` is twice as fast; `0.5` is half.

## Debugging

Set `DEBUG = true` at the top of the script for verbose Script Console logging. Default is off.

The script runs with `setShouldFailOnDeprecatedUse(true)` (API 25).
