# ZSAudio Maschine Deck

Novation Launch Control XL 3 script for **DECK A**, **XTM1**, **XTM2**, **MASCHINE**, and **NANO** in the ZSAUDIO-MASCHINE template.

See [`../project-structure.md`](../project-structure.md) for the project layout.

## Setup

1. Add the script in **Preferences → Controllers** (device: Launch Control XL 3).
2. Configure the LCXL3 in **Custom Mode** with the CC layout below. Upload `.syx` from [`../lcxl3/`](../lcxl3/) (see [`../lcxl3/mode-map.md`](../lcxl3/mode-map.md) and `colors.md`; run `build_modes.py` to regenerate). `.syx` layout: [`references/novation/lcxl3/lcxl3-custom-mode-syx-notes.md`](../../../references/novation/lcxl3/lcxl3-custom-mode-syx-notes.md).
3. Tag remote control pages (see [`../project-structure.md`](../project-structure.md) — **Remote control placement**):
   - **DECK A** (**group track** remotes only): `faders` — physical faders (all modes). Mix — `xtm1-mix`, `xtm2-mix`, `nano-mix`, `maschine-mix`, `fx1-mix`, `fx2-mix`, `fx3-mix`, `master-mix` (7 parameters each). Util — same stems with `-util` suffix (edit **Util** mode, later). Set 3 — `eq-gain`, `eq-freq`, `eq-q`, `comp`, `sc` on the **track** (8 parameters each; **Master EQ** edit mode 16 uses subsets as below; `sc` uses slots 1–3). `p1` / `p2` for X-Touch Mini (XTM scripts), not LCXL3.
   - **NANO** (**group track** remotes): `m1`–`m8` — modes 3 and 11 (slots 1–3 filter, 5–7 sends). `u1`–`u8` — mode 15 EQ-DJ (slots 1–3). Do not put these tags on NANO’s FX Layer device.
   - **XTM1**, **XTM2**, **MASCHINE** (**primary device**): `m1`–`m8` (7 parameters each). Filter performance modes: slots 1–3; Sends modes: slots 5–7. **EQ-DJ** (mode 15): XTM1/2 use `m1`–`m8` slots 1–3; MASCHINE also uses `u1`–`u8` slots 1–3 on the primary device.
   - **Parametric EQ** (mode 7): `eq-gain`, `eq-freq`, `eq-q` on the **last device** on **XTM1**, **XTM2**, **NANO**, and **MASCHINE** (typically **FX Layer** — Channel Strip Group / FX / Deck). Bands 1–5 use slots 0–4 on each row. Not on the group track for NANO.

Pinned to **DECK A**, **XTM1**, **XTM2**, **MASCHINE**, and **NANO**. Track names matched case-insensitively in the flat track list.

Tagged pages are picked up live — no script restart needed.

Encoder ring LEDs follow remote parameter values (echo the same CC and MIDI channel as each encoder).

**Why this differs from the XTM scripts:** XTM uses **relative** encoder CCs and `param.inc()` plus **separate** LED-ring CCs. LCXL3 Custom Modes use **absolute** encoder CC (see [`references/novation/lcxl3/lcxl3-custom-mode-encoders.md`](../../../references/novation/lcxl3/lcxl3-custom-mode-encoders.md)). The deck script never `param.set`s from encoder position (pickup): the first CC after a mode change only records knob position and pushes Bitwig’s value to the ring; further turns use `param.inc()` from successive absolute CCs. Custom Mode is inferred from the **MIDI channel** on encoder (and button) CCs only — faders are usually on a fixed channel and carry no ring feedback, so they do not refresh encoder LEDs. After you change mode on the hardware, the first encoder turn or button press on that mode’s channel refreshes all rings for that mode from Bitwig.

**Physical faders** (`faders` on **DECK A**) stay absolute on every MIDI channel.

## Encoder layout (columnar modes)

Eight columns × three encoder rows. Each **column** is one remote page; each **row** is a parameter slot on that page.

| Row | Encoder CCs | First bank (slots 1–3) | Second bank (slots 5–7) |
| --- | --- | --- | --- |
| Top | 13–20 | 1 | 5 |
| Middle | 21–28 | 2 | 6 |
| Bottom | 29–36 | 3 | 7 |

Slot 4 is unused on the second bank.

## Mode map

Canonical list (performance vs edit, button indirection): [`../lcxl3/mode-map.md`](../lcxl3/mode-map.md).

Modes are selected on the LCXL3 by MIDI channel in Custom Mode (**mode number = MIDI channel**). **LCXL3 name** matches the `.syx` filename in [`../lcxl3/`](../lcxl3/).

### Performance (mapped in script today)

| Mode | MIDI ch | LCXL3 name | Target | Layout |
| --- | --- | --- | --- | --- |
| 3 | 3 | NANO Filter | NANO | Columnar: `m1`–`m8`, slots 1–3 |
| 4 | 4 | MASCHINE Filter | MASCHINE | Columnar: `m1`–`m8`, slots 1–3 |
| 5 | 5 | DECK Filter | DECK A mix | Columnar: slots 1–3 (`*-mix`) |
| 9 | 9 | XTM1 Sends | XTM1 | Columnar: `m1`–`m8`, slots 5–7 |
| 10 | 10 | XTM2 Sends | XTM2 | Columnar: `m1`–`m8`, slots 5–7 |
| 11 | 11 | NANO Sends | NANO | Columnar: `m1`–`m8`, slots 5–7 |
| 12 | 12 | MASCHINE Sends | MASCHINE | Columnar: `m1`–`m8`, slots 5–7 |
| 13 | 13 | DECK Sends | DECK A mix | Columnar: slots 5–7 (`*-mix`) |

### Edit (`.syx` only until later steps)

| Mode | LCXL3 name | Notes |
| --- | --- | --- |
| 6 | Util | Gain / SC / width on sub-channels |
| 7 | Parametric EQ | Yes — see below |
| 8 | Mix | Pan (rest TBD) |
| 14 | Sends Edit | TBD |
| 15 | EQ-DJ | Yes — see below |
| 16 | Master EQ | Same encoder layout as **DECK EQ Cmp** (set 3) |

Modes **1** and **2** are unmapped placeholders.

Upload the matching `.syx` from [`../lcxl3/`](../lcxl3/) into each Custom Mode slot (filename prefix = mode number).

### Parametric EQ (edit mode 7)

**Groups:** **XTM1**, **XTM2**, **NANO**, **MASCHINE** (FX tracks ignored). Tags on the **last device** on that track (FX Layer), not on group **track** remotes for NANO.

Top row buttons **1–4** select the group (default **1** when you enter the mode). Buttons 5–7 are unused (LEDs off). In Components use **Toggle** with **off** = LED off and **on** colour per group (see `7-Parametric EQ-fix-mom.syx`). The script keeps one button lit by sending CC **127** / **0** on the mode MIDI channel. Encoder ring hues come from the mode **7** `.syx`.

| Row | Cols 1–5 | Cols 6–8 |
| --- | --- | --- |
| Top | `eq-gain` bands 1–5 (G1–G5) | LEDs off |
| Middle | `eq-freq` bands 1–5 (F1–F5) | LEDs off |
| Bottom | `eq-q` bands 1–5 (Q1–Q5) | LEDs off |

### EQ-DJ (edit mode 15)

**Groups:** **XTM1**, **XTM2**, **NANO**, **MASCHINE**. Eight columns = sub-channels `m1`–`m8` or `u1`–`u8`; three rows = remote parameters **1–3** (Lo / Mid / Hi).

| Group | Remote host | Page tags |
| --- | --- | --- |
| XTM1, XTM2 | Primary device | `m1`–`m8` |
| NANO | Group track | `u1`–`u8` |
| MASCHINE | Primary device | `u1`–`u8` |

**Buttons:** top row **1–4** = group (default **1** on enter, one LED). Bottom row and top buttons **5–8** are unused (script turns them back off). Selecting a group maps columns **1–8** to that group’s `m1`–`m8` or `u1`–`u8`, three rows = params **1–3**.

**`.syx`:** encoder rows **Lo / Mid / Hi**; ring colours **red / green / white** by row.

### Master EQ (edit mode 16) — layout reference

Same as former **Mode 8 — DECK EQ + comp**. Columns 1–5: `eq-gain`, `eq-freq`, `eq-q`. Columns 6–8 top/middle: `comp`. Bottom row cols 6–8: `sc` (RS, FL, GN). Not wired in the deck script yet.

| Row | Cols 1–5 | Cols 6–8 |
| --- | --- | --- |
| Top | `eq-gain` 1–5 | `comp` 1–3 |
| Middle | `eq-freq` 1–5 | `comp` 4–6 |
| Bottom | `eq-q` 1–5 | `sc` 1–3 (RS, FL, GN) |

### Faders (all modes)

| Control | Remote page |
| --- | --- |
| Faders 1–8 (CC 5–12) | DECK A `faders` slots 1–8 |

## Hardware CC reference

| Control | CC |
| --- | --- |
| Encoders top row | 13–20 |
| Encoders middle row | 21–28 |
| Encoders bottom row | 29–36 |
| Faders | 5–12 |

## Debugging

Set `DEBUG = true` at the top of the script for verbose Script Console logging.
