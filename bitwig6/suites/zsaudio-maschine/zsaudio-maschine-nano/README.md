# ZSAudio Maschine NANO

Korg nanoKONTROL2 script for the **NANO** group in the ZSAUDIO-MASCHINE template. Based on the standalone `nano-launch` script, adapted for this suite.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. Add the script in **Preferences → Controllers** (device: nanoKONTROL2).
2. Tag remote control pages on the **NANO** group track: `faders` — faders 1–8; `vols` — knobs 1–8.
3. Ensure the **NANO** group contains **8 child tracks** (`1` … `8`), in order. Each child should have an **Instrument Selector** (or other chain device) when you use chain/bank link.

Pinned to **NANO**. Track name matched case-insensitively in the flat track list.

Tagged pages are picked up live — no script restart needed.

## Clip launch grid (S, M, R)

The NANO group has **8 child tracks**. Korg columns map 1:1 to children 1–8.

| Row | Clips |
| --- | --- |
| **S** | Row 1 of current bank/page |
| **M** | Row 2 |
| **R** | Row 3 |

- **Short press**: launch or re-trigger clip.
- **Long press** (>0.5 s) on a playing clip: stop the child track.
- **LED on**: clip is playing.

## Banks, pages, and chain link

| Control | Function |
| --- | --- |
| **Rew, FF, Stop, Play, Rec** | Select clip bank 1–5 |
| **NEXT TRACK (>>)** | Toggle clip page 2 (clips 4–6 of current bank) |
| **CYCLE** | Toggle chain/bank link |

With `BANK_SIZE = 6` (default): 5 banks × 6 clips. S/M/R show clips 1–3 or 4–6 depending on page toggle.

### Chain / bank link (CYCLE)

When link is **on**, bank *N* sets chain *N* on the **Instrument Selector** (or matched instrument device) on each of the eight NANO children. This applies on bank change, clip launch, and scene launch.

## Scene launch (marker buttons)

| Button | Scene |
| --- | --- |
| **SET** | Scene 1 of current bank/page |
| **PREV** | Scene 2 |
| **NEXT** | Scene 3 |

Scenes launch within the NANO group scope. Chain link applies when CYCLE is enabled.

## Parameter control

| Control | Remote page |
| --- | --- |
| **Knobs 1–8** | `vols` on **NANO** group track |
| **Faders 1–8** | `faders` on **NANO** group track |

## Configuration

At the top of the script:

```javascript
const BANK_SIZE = 6; // 3 or 6
const NUM_CHILD_TRACKS = 8;
```

## Debugging

Set `DEBUG = true` for verbose Script Console logging. Default is off.

The script runs with `setShouldFailOnDeprecatedUse(true)` (API 25).
