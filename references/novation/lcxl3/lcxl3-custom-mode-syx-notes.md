# LCXL3 Custom Mode `.syx` notes

Novation Components **Download / Upload** saves a slot as one or more SysEx messages (`F0 00 20 29 02 15 … F7`). Layout is not fully documented; these notes come from inspecting the ZSAUDIO-MASCHINE preset `1 - DECK Filter.syx` in [`bitwig6/suites/zsaudio-maschine/lcxl3/`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/).

## File layout

- Often **two messages** per Custom Mode slot (e.g. encoders + faders/buttons).
- Mode name: byte **12** = length; bytes **13…** = ASCII (e.g. `1-DECK Filter`). Not fixed at 11 characters.
- Each control has an **`I` + id** block (`0x49`, 11 bytes); encoder CCs for deck layout: row1 **13–20**, row2 **21–28**, row3 **29–36** (ids `0x10`–`0x27`).

**LED colour:** byte at offset **+3** in each 11-byte `I` block (after `49 id 02`) is the Novation **palette index** (0–127). Full index list: [`lcxl3-palette-map.md`](lcxl3-palette-map.md) (calibrated with `Colors.syx`). Swatch chart: `palette-page12.png`. Apply per **column** on all three encoder rows (`palette[col % 8]` for ids `0x10`–`0x27`).

**Toggle fader buttons (Components):** **Colour** = LED off, **On colour** = lit hue, behaviour **Toggle**. In the **11-byte `I` block**: byte **+3** = **Colour** (often **`0`**); byte **+4** = **`0x03`**; byte **+5** = **behaviour** — for Custom Mode **N**, modes **1–8** use **`N − 1`** (mode **7** → **`0x06`**), modes **9–16** use **`0x20 + (N − 1)`** (mode **15** → **`0x2e`**). Setting **+5** to **`N − 1`** only (e.g. **`0x0e`** on mode **15**) exports as **Momentary**. References: [`7-Parametric EQ-fix-mom.syx`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/7-Parametric%20EQ-fix-mom.syx), [`15-EQ-DJ-fixed.syx`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/15-EQ-DJ-fixed.syx). Generator: `apply_toggle_button_behaviour_bytes()` in [`build_modes.py`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/build_modes.py). Host LED: CC **127** / **0** (deck script: all 16 MIDI channels, `lcxl3-ar` style).

**LED off (unused controls):** use palette index **`0`** at **+3**, not **`1`**. Components exports unused encoders/buttons as `49 … 02 00 …` (e.g. Parametric EQ cols 6–8 and buttons 5–16 in [`7-Parametric EQ-fix.syx`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/7-Parametric%20EQ-fix.syx)). Index **1** is a dim grey ring and still reads as “lit”; **0** is off/black in the palette map. Suite constant: `LED_PALETTE_OFF = 0` in [`build_modes.py`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/build_modes.py).

**MIDI channel** (11-byte `I` blocks, verified against `2-DECK Send CH 1.syx` and `2-DECK Sends CH2.syx`):

| Control | Channel 1 | Channels 2–16 |
| --- | --- | --- |
| Encoders `0x10`–`0x27` | bytes **+4…+7** = `00 00 00 00`, byte **+9** = `0x01` | bytes **+4…+7** = `00 (N−1) 00 00`, byte **+9** = `0x7F` (global) |
| Buttons `0x30`–`0x3f` | byte **+9** = `0x01`, bytes **+5** = `0x01`, **+6** = `0x50` | byte **+9** = `N`, **+5** = `N−1`, **+6** = `0x10`, **+7** = `0x00` |

Components treats **+6** = `0x50` as **global channel**; per Custom Mode slot use **+6** = `0x10` (verified against `3-NANO Filter-fixed.syx` in the maschine suite).

Do **not** put the channel number in encoder byte **+9** when N ≥ 2; the hardware stays on channel 1 and Components may show a bogus value. Suite generator: [`build_modes.py`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/build_modes.py) (Custom Mode **N** → MIDI channel **N**). Message header byte before `20 0B` stays **0x7F**. Faders (`0x28`–`0x2f`) unchanged (`00 01 40 00`, **+9** = `0x7F`).

### DECK Filter column colours (Components-verified)

Exported from Components after setting colours in the UI (2026-03). Use these indices when patching other modes or regenerating `.syx` files.

| Col | Index (dec) | Index (hex) | UI name |
| --- | --- | --- | --- |
| 1 | 5 | 0x05 | vibrant red |
| 2 | 9 | 0x09 | vibrant orange |
| 3 | 37 | 0x25 | vibrant cyan |
| 4 | 53 | 0x35 | fuchsia (not purple 51/54) |
| 5 | 45 | 0x2d | vibrant dark blue |
| 6 | 45 | 0x2d | vibrant dark blue |
| 7 | 45 | 0x2d | vibrant dark blue |
| 8 | 3 | 0x03 | white |

```text
DECK_FILTER_COLUMN_PALETTE = [5, 9, 37, 53, 45, 45, 45, 3]
```

**Note:** Orange **9** and fuchsia **53** match the hardware; guesses **10** / **51** / **54** did not.

## Encoder OLED row labels (message 0)

Trailing block before `F7`: one entry per encoder, **8 per row × 3 rows**.

**Full label (per column):** `63` + *control id* + 3 ASCII chars (e.g. `63 10 HPF`).

Components’ shorthand (column 1 only named, rest `60` + id) shows CC-style placeholders on cols 2–8. For **HPF / LPF / RES on every column**, repeat the 5-byte triplet for each id `0x10`–`0x27`.

Example generator (Python):

```python
def encoder_row_labels():
    out = bytearray()
    for row, name in enumerate([b"HPF", b"LPF", b"RES"]):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            out.extend([0x63, cid])
            out.extend(name)
    return out  # 120 bytes; replace bytes from 0x120 in message 0 up to F7
```

Re-upload via Components → **Upload Custom Mode** and send to the hardware to verify.

### Button OLED labels (message 1)

Factory exports end with sixteen **`60` + id** placeholders (`0x30`–`0x3f`). Named buttons use **`63` + id + 3 ASCII** (same as encoders, 80 bytes total), replacing that block before `F7`. Performance presets in the maschine suite use **`M1`…`M8`** (top row) and **`S1`…`S8`** (bottom row).

### DECK Sends OLED labels

Same layout as DECK Filter, but row tags **`FX1`**, **`FX2`**, **`FX3`** (all eight columns). Suite file: `2 - DECK Sends.syx`. Colours: same as DECK Filter (`DECK_FILTER_COLUMN_PALETTE`). Assign to **Custom Mode 2** (MIDI channel 2) in Components to match `zsaudio-maschine-deck`. Colour strategy: [`lcxl3/colors.md`](../../../../bitwig6/suites/zsaudio-maschine/lcxl3/colors.md).

## References

- [SysEx header](https://userguides.novationmusic.com/hc/en-gb/articles/27840466455314-SysEx-message-format-used-by-Launch-Control-XL-3)
- [Components guide](https://support.novationmusic.com/hc/en-gb/articles/27203903097362-Launch-Control-XL-3-Components-guide)
