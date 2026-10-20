# ZSAUDIO-MASCHINE — LCXL3 ring colours

Encoder LED colours use the Novation **0–127 palette** (byte **+3** in each Custom Mode `.syx` control block). Components only shows 12 swatches; the full palette works via `.syx` — see [`lcxl3-palette-map.md`](../../../../references/novation/lcxl3/lcxl3-palette-map.md). Upload presets in this folder with Novation Components.

Ring **brightness** while playing comes from the deck script (parameter value on the encoder CC). **Hue** is fixed per mode in the `.syx` file.

Mode numbers and performance/edit split: [`mode-map.md`](mode-map.md).

## Design rules

1. **Channel identity** — One hue per logical track/bus. Same index on that **column** in DECK **Filter** (5) and **Sends** (13). Instrument **Filter and Sends** modes for a track use that track’s identity colour on **all eight columns**.
2. **Functional modes** — **DECK Master** (mode **16**) uses a **frequency spectrum** on EQ cols 1–5. Comp + `sidechain` cols 6–8 use their own colours.
3. **Placeholders** — Modes **1**, **2**, **8**, **14**, **15** use grey **1** until mapping is final.
4. **Performance buttons** — Modes **3**, **4**, **5**, **9**, **10**, **11**, **12**, **13**: buttons **1–8** (top row) palette **9** (vibrant orange); buttons **9–16** (bottom row) palette **13** (bright yellow). Button MIDI channel **N**: message 1, bytes **+9** = `N`; for **N ≥ 2** also **+5** = `N−1`, **+6** = `0x10` (not `0x50` global). OLED (message 1): top row **`M1`…`M8`**, bottom **`S1`…`S8`** (3 ASCII chars per button, same as encoders).

Apply colours **per encoder** (all three rows in a column share one index in columnar modes). DECK Master: **one colour per EQ column** (gain, freq, and Q match); comp block is uniform.

---

## Channel identity (DECK columns 1–8)

Used in Custom Modes **5** and **13**, and as the uniform ring colour in instrument Filter/Sends modes.

| Col | Track / bus | Index | Hex | Role |
| --- | --- | --- | --- | --- |
| 1 | XTM1 | 5 | 05 | vibrant red |
| 2 | XTM2 | 9 | 09 | vibrant orange |
| 3 | NANO | 37 | 25 | vibrant cyan |
| 4 | MASCHINE | 53 | 35 | fuchsia |
| 5 | FX1 | 45 | 2D | vibrant dark blue |
| 6 | FX2 | 45 | 2D | same as FX1 |
| 7 | FX3 | 45 | 2D | same as FX1 |
| 8 | Master | 3 | 03 | white |

```text
CHANNEL_IDENTITY = [5, 9, 37, 53, 45, 45, 45, 3]

TRACK_IDENTITY = { XTM1: 5, XTM2: 9, NANO: 37, MASCHINE: 53 }
```

| Mode | LCXL3 # | Colour source |
| --- | --- | --- |
| Unmapped | 1, 2 | grey **1** |
| NANO Filter | 3 | **37** all columns |
| MASCHINE Filter | 4 | **53** all columns |
| DECK Filter | 5 | `CHANNEL_IDENTITY` per column |
| Util | 6 | row **5 / 9 / 13** (red, orange, yellow). Buttons **off** in `.syx` (same Toggle setup as EQ-DJ). Script lights one of top **3** (NANO) or **4** (MASCHINE). Buttons **1–2** (XTM1, XTM2) and the bottom row stay off |
| Group Control | 7 | EQ cols **1–5**: `MODE7_PARAMETRIC_EQ_BANDS`; top row cols **6–8**: `DECK_UTIL_ROW_COLOURS` **5 / 9 / 13**; middle/bottom cols **6–8** off **0**. Buttons **1–4** identity in `.syx`; script LED CC like Util / EQ-DJ |
| Pan | 8 | top row **9** (vibrant orange); rows 2–3 off **0**. Buttons same Toggle block as EQ-DJ; script LED CC like EQ-DJ |
| XTM1 Sends | 9 | **5** all columns |
| XTM2 Sends | 10 | **9** all columns |
| NANO Sends | 11 | **37** all columns |
| MASCHINE Sends | 12 | **53** all columns |
| DECK Sends | 13 | `CHANNEL_IDENTITY` per column |
| Sends Edit | 14 | grey **1** (TBD) |
| EQ-DJ | 15 | row **5 / 19 / 3** (red, green, white). Buttons **off** in `.syx`; script: top **5 / 9 / 37 / 53**, bottom **3** (white) |
| DECK Master | 16 | `MODE8_EQ_COMP_*` (functional) |

---

## DECK Master (mode 16) — functional colours

Same indices as the former DECK EQ + comp mode 8.

| EQ col | Band (DECK remote) | Index | Hex | Palette name | Bitwig EQ feel |
| --- | --- | --- | --- | --- | --- |
| 1 | lowest | **7** | 07 | red (dark) | red — not identity **5** (XTM1 bright red) |
| 2 | | **15** | 0F | lime | light green / lime |
| 3 | | **19** | 13 | green (bright) | stronger green |
| 4 | | **43** | 2B | blue (deep) | darker step from **32** / **33** |
| 5 | highest | **116** | 74 | white (dim) | same role as **3**, lower brightness |

```text
MODE8_EQ_COMP_EQ_BANDS = [7, 15, 19, 43, 116]
```

## Group Control (mode 7) — encoder colours

EQ cols **1–5**: one index per column on all three rows (G / F / Q share the band hue). Top row cols **6–8**: gain / sidechain / width hues (**5 / 9 / 13**).

| EQ col | Index (dec) | Index (hex) |
| --- | --- | --- |
| 1 | 5 | 05 |
| 2 | 17 | 11 |
| 3 | 25 | 19 |
| 4 | 29 | 1D |
| 5 | 3 | 03 |

```text
MODE7_PARAMETRIC_EQ_BANDS = [5, 17, 25, 29, 3]
```

| Region | Encoders | Index | Hex | Intent |
| --- | --- | --- | --- | --- |
| Comp (row 1–2, cols 6–8) | CC 18–20, 26–28 | **82** | 52 | purple hot — one shade for all six comp knobs |
| `sidechain` (row 3, cols 6–8) | CC 34–36 | **9** | 09 | vibrant orange (**RS / FL / GN**) |

```text
MODE8_EQ_COMP_COMP = 82
MODE8_EQ_COMP_SC   = 9
```

---

## Mode → `.syx` files

Regenerate with [`build_modes.py`](build_modes.py) (clones `template-deck-filter.syx`). File name = Custom Mode slot to upload; encoders/buttons are patched to **MIDI channel N** (byte `N` at `I` block offset +9, 1-based). On-device mode name: **`N-Title`** (from `N - Title.syx`; variable length in sysex, byte 12 = length).

| Custom mode | File | OLED rows | Colour rule |
| --- | --- | --- | --- |
| 1 | `1 - Unmapped.syx` | blank | grey **1** |
| 2 | `2 - Unmapped.syx` | blank | grey **1** |
| 3 | `3 - NANO Filter.syx` | HPF / LPF / RES | uniform **37** |
| 4 | `4 - MASCHINE Filter.syx` | Lo / Mid / Hi | uniform **53** |
| 5 | `5 - DECK Filter.syx` | HPF / LPF / RES | `CHANNEL_IDENTITY` |
| 6 | `6 - Util.syx` | GN / SC / ST | `DECK_UTIL_ROW_COLOURS` **5 / 9 / 13**; buttons same Toggle block as EQ-DJ (`+4=03`, `+3=0`, `+5=0x05`) + script LED CC |
| 7 | `7 - Group Control.syx` | G*n* / GN SC ST / F*n* / Q*n*; buttons **1–4** | EQ cols **1–5** `MODE7_PARAMETRIC_EQ_BANDS`; top **6–8** `DECK_UTIL_ROW_COLOURS`; buttons **1–4** identity + script LED CC |
| 8 | `8 - Pan.syx` | P1…P8 (top row) | top row **9**; rows 2–3 off; buttons Toggle like EQ-DJ + script LED CC |
| 9 | `9 - XTM1 Sends.syx` | FX1 / FX2 / FX3 | uniform **5** |
| 10 | `10 - XTM2 Sends.syx` | FX1 / FX2 / FX3 | uniform **9** |
| 11 | `11 - NANO Sends.syx` | FX1 / FX2 / FX3 | uniform **37** |
| 12 | `12 - MASCHINE Sends.syx` | FX1 / FX2 / FX3 | uniform **53** |
| 13 | `13 - DECK Sends.syx` | FX1 / FX2 / FX3 | `CHANNEL_IDENTITY` |
| 14 | `14 - Sends Edit.syx` | blank | grey **1** |
| 15 | `15 - EQ-DJ.syx` | Lo / Mid / Hi | `EQ_DJ_ROW_COLOURS`; all buttons Toggle **+4=03**, **+3=0**, **+5=0x2e** (see `15-EQ-DJ-fixed.syx`) + script LED CC |
| 16 | `16 - DECK Master.syx` | G*n* / F*n* / Q*n*; comp; **RS FL GN** | `MODE8_EQ_COMP_*` |

---

## References

- [`lcxl3-custom-mode-syx-notes.md`](../../../../references/novation/lcxl3/lcxl3-custom-mode-syx-notes.md) — `.syx` layout, label bytes
- [`../zsaudio-maschine-deck/README.md`](../zsaudio-maschine-deck/README.md) — MIDI mode ↔ script mapping
