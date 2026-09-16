# ZSAudio Maschine XTM2

Behringer X-Touch Mini script for the **XTM2** track in the ZSAUDIO-MASCHINE template. Targets the track's **Instrument Selector** device via tagged remote control pages.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. X-Touch Mini in **MC mode** (hold **MC** while plugging in).
2. Add the script in **Preferences → Controllers**.
3. Tag remote control pages on the Instrument Selector, XTM2 track, and DECK A (see below).

Pinned to **XTM2** and **DECK A**. Track names matched case-insensitively in the flat track list.

## Remote page tags

On the **XTM2** Instrument Selector:

| Tag | Role |
| --- | --- |
| `mutes` | Top row buttons 1–8 |
| `kill` | Main fader (slot 1, active chain only) |
| `m0` | Default encoder page |
| `faders` | Encoder push 1 |
| `vols` | Encoder push 2 |
| `d1` … `d8` | Bottom row buttons 1–8 (mode zero) |

On the **XTM2 track** (track remote controls, not the device):

| Tag | Role |
| --- | --- |
| `chainkill` | Per-chain kill switches (slots 1–8, mode B) |

On **DECK A** (primary device):

| Tag | Role |
| --- | --- |
| `p2` | Encoders 1–3 on the default `m0` page (3 parameters) |

Tagged pages are picked up live — no script restart needed.

## Controls

### Top row (always)

Buttons 1–8 toggle parameters on the `mutes` page. LED on when value > 0.5.

### Encoders

- **Default (`m0`)**: no bottom-row selection, or encoder push 8, or re-press active bottom button. Encoders **1–3** control DECK A `p2` (parameters 1–3). Encoders **4–8** control `m0` on the Instrument Selector (parameters 1–5).
- **Encoder push 1–2**: `faders`, `vols`.
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

1. Stop all clips on the XTM2 track.
2. Set **chainkill** on for the chain being left (track remote slot matching that chain).
3. Switch to the new chain.
4. Set **chainkill** off for the chain being entered.

Re-pressing the active chain only clears its chainkill (and stops clips).

Map track remote page `chainkill` slots 1–8 to each drum rack's kill control. These stay on the track when the Instrument Selector switches chains.

### Mode A (clip launchers)

Bottom row launches clips on the **XTM2** track for the active Instrument Selector chain (drum rack).

- **Button N** → clip N in the current bank (rack 1 → slots 1–8, rack 2 → slots 9–16, etc.).
- **Short press**: launch / re-trigger clip.
- **Long press** (>0.5 s) on a playing clip: stop the XTM2 track.
- **LED on**: clip is playing.

Change the active drum rack in Bitwig; bottom buttons follow that chain's 8-clip bank.

## Configuration

`ENCODER_SENSITIVITY` at the top of the script controls encoder step size. `1` is default; `2` is twice as fast; `0.5` is half.

## Debugging

Set `DEBUG = true` at the top of the script for verbose Script Console logging. Default is off.

The script runs with `setShouldFailOnDeprecatedUse(true)` (API 25).
