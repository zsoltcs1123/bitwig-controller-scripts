# ZSAudio Maschine Loops

Korg nanoKONTROL2 script for the **Loops** group in the ZSAUDIO-MASCHINE template. Based on the standalone `nano-launch` script, adapted for this suite.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. Add the script in **Preferences → Controllers** (device: nanoKONTROL2).
2. Tag remote control pages on the **Loops** group Drum Machine (primary device):
   - `p0` — knobs 1–8
   - `vols` — faders 1–8
3. Ensure the **Loops** group contains the **DM** child track (first child) with a 4-slot Drum Machine. Each slot should hold an Instrument Selector routed to channels 1–4 on the parent Loops Drum Machine.

Pinned to the **Loops** group track. Matched case-insensitively in the flat track list.

Tagged pages are picked up live — no script restart needed.

## Clip launch grid (S, M, R)

The Loops group has **5 child tracks**. Korg columns map to children like this:

| Korg column | Loops child |
| --- | --- |
| 1 | child 1 |
| 2–4 | inactive |
| 5 | child 2 |
| 6 | child 3 |
| 7 | child 4 |
| 8 | child 5 |

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

When link is **on**, bank *N* sets chain *N* on all four Instrument Selectors in child 1's Drum Machine slots. This applies on bank change, clip launch, and scene launch.

## Scene launch (marker buttons)

| Button | Scene |
| --- | --- |
| **SET** | Scene 1 of current bank/page |
| **PREV** | Scene 2 |
| **NEXT** | Scene 3 |

Scenes launch within the Loops group scope. Chain link applies when CYCLE is enabled.

## Parameter control

| Control | Remote page |
| --- | --- |
| **Knobs 1–8** | `p0` on Loops group Drum Machine |
| **Faders 1–8** | `vols` on Loops group Drum Machine |

## Configuration

At the top of the script:

```javascript
const BANK_SIZE = 6; // 3 or 6
const NUM_CHILD_TRACKS = 5;
const KORG_TO_CHILD = [0, -1, -1, -1, 1, 2, 3, 4];
const NUM_DM_SLOTS = 4;
```

## Debugging

Set `DEBUG = true` for verbose Script Console logging. Default is off.

The script runs with `setShouldFailOnDeprecatedUse(true)` (API 25).
