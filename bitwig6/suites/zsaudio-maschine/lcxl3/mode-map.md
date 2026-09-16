# LCXL3 mode map (ZSAUDIO-MASCHINE)

Custom Mode slot **N** = MIDI channel **N** (1-based). On-device name: `N-Title` (from `N - Title.syx`).

Two groups:

- **Performance** — switch mode on the LCXL3; encoders map immediately. For live use.
- **Edit** — studio/setup; LCXL3 **buttons** pick track or sub-channel inside the mode (where noted). Encoder mapping TBD per mode.

Modes **1** and **2** are reserved/unmapped (grey `.syx`, no deck script).

## Performance modes

| Mode | LCXL3 name | Deck script |
| --- | --- | --- |
| 3 | NANO Filter | Yes — `nano` `m1`–`m8`, slots 1–3 |
| 4 | MASCHINE Filter | Yes — `m1`–`m8`, slots 1–3 |
| 5 | DECK Filter | Yes — DECK A `*-mix`, slots 1–3 |
| 9 | XTM1 Sends | Yes — slots 5–7 |
| 10 | XTM2 Sends | Yes — slots 5–7 |
| 11 | NANO Sends | Yes — slots 5–7 |
| 12 | MASCHINE Sends | Yes — slots 5–7 |
| 13 | DECK Sends | Yes — DECK A `*-mix`, slots 5–7 |

## Edit modes

| Mode | LCXL3 name | Notes | LCXL3 buttons | Deck script |
| --- | --- | --- | --- | --- |
| 6 | Util | Gain / sidechain / width on sub-channels | Same indirection as EQ-DJ | Later |
| 7 | Parametric EQ | 5-band on **XTM1**, **XTM2**, **NANO**, **MASCHINE** (last device: `eq-gain`, `eq-freq`, `eq-q`) | Buttons 1–4: group select (identity colours; default 1 on enter) | Yes |
| 8 | Mix | Pan (rest TBD) | Same indirection as EQ-DJ | Later |
| 14 | Sends Edit | TBD | TBD | Later |
| 15 | EQ-DJ | 3-band per sub-channel: XTM1/2 `m1`–`m8` device; NANO `u1`–`u8` track; MASCHINE `u1`–`u8` device (params 1–3) | Top **1–4**: group; bottom **1–8**: sub-channel | Yes |
| 16 | Master EQ | Same layout as **DECK EQ Cmp** (set 3) | None (not lit) | Later |

## Regenerate `.syx`

```bash
python bitwig6/suites/zsaudio-maschine/lcxl3/build_modes.py
```

Template: `template-deck-filter.syx` (not uploaded). Stale `*.syx` in this folder are removed automatically.
