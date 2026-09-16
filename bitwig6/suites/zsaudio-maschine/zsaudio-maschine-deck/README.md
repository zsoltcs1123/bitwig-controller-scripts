# ZSAudio Maschine Deck

Novation Launch Control XL 3 script for **DECK A**, **Main Drums**, **Loops**, **Groove Drums**, and **Maschine** in the ZSAUDIO-MASCHINE template.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. Add the script in **Preferences → Controllers** (device: Launch Control XL 3).
2. Configure the LCXL3 in **Custom Mode** with the CC layout below.
3. Tag remote control pages:
   - **DECK A** (primary device): `volumes` — physical faders (all modes); `p0` — Mode 15 (8 parameters); `p1`–`p8` — Modes 7 and 8 (at least 7 parameters each)
   - **Main Drums** and **Groove Drums** (primary device): `m1`–`m8` — columnar modes (at least 7 parameters each); `faders`, `eq`, `pans` — horizontal mixer mode (8 parameters each)
   - **Loops** group (primary device / Drum Machine): `p1`–`p8` — columnar modes (at least 7 parameters each); `faders`, `eq`, `pans` — horizontal mixer mode (8 parameters each)
   - **Loops** group **child tracks** (1–8, primary device): `perf` — Mode 16 (3 parameters each, slots 1–3)
   - **Maschine** track (primary device): same tags as Loops (`p1`–`p8`, `faders`, `eq`, `pans`). `p7`/`p8` and mixer slots 7–8 are optional — unmapped controls are ignored.

Pinned to **DECK A**, **Main Drums**, **Loops**, **Groove Drums**, and **Maschine**. Track names matched case-insensitively in the flat track list.

Tagged pages are picked up live — no script restart needed.

Encoder ring LEDs follow remote parameter values (echo the same CC and MIDI channel as each encoder).

**Why this differs from the XTM scripts:** XTM uses **relative** encoder CCs and `param.inc()` plus **separate** LED-ring CCs. LCXL3 Custom Modes only support **absolute** encoder CC (see [`references/novation/lcxl3/lcxl3-custom-mode-encoders.md`](../../../references/novation/lcxl3/lcxl3-custom-mode-encoders.md)). The deck script therefore drives parameters with **increments from successive absolute CCs** (and only uses `param.set` when the first reading after a mode change already matches Bitwig). That avoids wiping a parameter when you return to another Custom Mode with the knob in a different position. Rings are refreshed on mode (channel) change and when remotes change in Bitwig.

**Physical faders** (`volumes` on DECK A) stay absolute. Custom Mode **16** is Novation’s fixed Default mode (not editable in Components); this script maps it on MIDI channel 16. Mode **15** uses only the **top** encoder row; middle and bottom rows are ignored.

## Encoder layout (columnar modes)

Eight columns × three encoder rows. Each **column** is one remote page (`m*` or `p*`); each **row** is a parameter slot on that page.

| Row | Encoder CCs | First bank (slots 1–3) | Second bank (slots 5–7) |
| --- | --- | --- | --- |
| Top | 13–20 | 1 | 5 |
| Middle | 21–28 | 2 | 6 |
| Bottom | 29–36 | 3 | 7 |

Slot 4 is unused on the second bank (same on DECK and drum/loop tracks).

## Modes

Modes are selected on the LCXL3 by MIDI channel in Custom Mode.

### Modes 1–3 — Main Drums

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 1 | 1 | Columnar: `m1`–`m8`, slots 1–3 |
| 2 | 2 | Columnar: `m1`–`m8`, slots 5–7 |
| 3 | 3 | Horizontal: top `faders`, middle `eq`, bottom `pans` (columns = slots 1–8) |

### Modes 4–6 — Loops

Same layout as Modes 1–3 on the **Loops** group track, with `p1`–`p8` instead of `m1`–`m8`.

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 4 | 4 | Columnar: `p1`–`p8`, slots 1–3 |
| 5 | 5 | Columnar: `p1`–`p8`, slots 5–7 |
| 6 | 6 | Horizontal: `faders`, `eq`, `pans` |

### Modes 7–8 — DECK A filter

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 7 | 7 | Columnar: `p1`–`p8`, slots 1–3 |
| 8 | 8 | Columnar: `p1`–`p8`, slots 5–7 |

### Modes 9–11 — Groove Drums

Same mapping as Modes 1–3 on **Groove Drums**.

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 9 | 9 | Columnar: `m1`–`m8`, slots 1–3 |
| 10 | 10 | Columnar: `m1`–`m8`, slots 5–7 |
| 11 | 11 | Horizontal: `faders`, `eq`, `pans` |

### Modes 12–14 — Maschine

Same layout as Modes 4–6 on **Loops** (`p1`–`p8`, `faders`, `eq`, `pans`) on the **Maschine** track. Missing remotes on the last columns or mixer slots are skipped safely.

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 12 | 12 | Columnar: `p1`–`p8`, slots 1–3 |
| 13 | 13 | Columnar: `p1`–`p8`, slots 5–7 |
| 14 | 14 | Horizontal: `faders`, `eq`, `pans` |

### Mode 15 — DECK A `p0`

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 15 | 15 | Horizontal top row only: DECK A `p0` slots 1–8 (columns 1–8) |

### Mode 16 — Loops child `perf`

Columnar: each encoder **column** is one **Loops** child track (1–8, in group order). Each **row** is a parameter on that child’s **primary device** remote page `perf` (slots 1–3).

| Mode | MIDI channel | Layout |
| --- | --- | --- |
| 16 | 16 | Columnar: child 1–8 × `perf` slots 1–3 |

### Faders (all modes)

| Control | Remote page |
| --- | --- |
| Faders 1–8 (CC 5–12) | DECK A `volumes` slots 1–8 |

Physical faders respond on every MIDI channel.

## Hardware CC reference

| Control | CC |
| --- | --- |
| Encoders top row | 13–20 |
| Encoders middle row | 21–28 |
| Encoders bottom row | 29–36 |
| Faders | 5–12 |

## Debugging

Set `DEBUG = true` at the top of the script for verbose Script Console logging.
