#!/usr/bin/env python3
"""Clone `template-deck-filter.syx` and patch mode name, LED colours, and OLED labels.

Mode layout: `mode-map.md`.
"""

from __future__ import annotations

from pathlib import Path

TEMPLATE = Path(__file__).with_name("template-deck-filter.syx")
OUT_DIR = Path(__file__).parent

RESERVED_GREY = 1  # placeholder modes (dim grey ring)
LED_PALETTE_OFF = 0  # unused encoders/buttons — see `7-Parametric EQ-fix.syx` and syx notes
# Components Toggle export: byte +4 = 0x03. Byte +5 = behaviour (not only MIDI ch−1).
# Modes 1–8: +5 = mode − 1. Modes 9–16: +5 = 0x20 + (mode − 1). See `15-EQ-DJ-fixed.syx`.
LCXL3_BUTTON_TOGGLE_LED_BYTE = 0x03
LCXL3_BUTTON_TOGGLE_HIGH_MODE = 9
LCXL3_BUTTON_TOGGLE_HIGH_FLAG = 0x20

CHANNEL_IDENTITY = [5, 9, 37, 53, 45, 45, 45, 3]
# EQ cols 1–5: bands 4–5 use dimmer indices (same hue, less ring brightness).
MODE8_EQ_COMP_EQ_BANDS = [7, 15, 19, 43, 116]
# Mode 7 encoder cols 1–5 (Components export `7-Parametric EQ-fix.syx`).
MODE7_PARAMETRIC_EQ_BANDS = [5, 17, 25, 29, 3]
MODE8_EQ_COMP_COMP = 82
MODE8_EQ_COMP_SC = 9  # vibrant orange — bottom row cols 6–8 (sidechain)

TRACK_IDENTITY = {
    "XTM1": 5,
    "XTM2": 9,
    "NANO": 37,
    "MASCHINE": 53,
}

# Util (mode 6): one hue per encoder row (all columns). Gain / sidechain / width.
DECK_UTIL_ROW_COLOURS = [5, 9, 13]  # vibrant red, orange, yellow (bright)

# Performance modes: top button row 1–8 (`0x30`–`0x37`), bottom row 9–16 (`0x38`–`0x3f`).
PERF_BUTTON_TOP_ORANGE = 9
PERF_BUTTON_BOTTOM_YELLOW = 13
PERFORMANCE_MODES = {3, 4, 5, 9, 10, 11, 12, 13}

PARAMETRIC_EQ_GROUP_BUTTON_COLOURS = [
    TRACK_IDENTITY["XTM1"],
    TRACK_IDENTITY["XTM2"],
    TRACK_IDENTITY["NANO"],
    TRACK_IDENTITY["MASCHINE"],
]

# EQ-DJ (mode 15): Lo / Mid / Hi rows — vibrant red, green, white.
EQ_DJ_ROW_COLOURS = [5, 19, 3]
# Pan (mode 8): top row only — vibrant orange; rows 2–3 off.
PAN_ENCODER_ORANGE = 9


def syx_filename(mode: int, title: str) -> str:
    return f"{mode} - {title}.syx"


def mode_display_name(mode: int, title: str) -> str:
    """On-device / Components name: `N-Title` (matches `N - Title.syx` without spaces around `-`)."""
    return f"{mode}-{title.strip()}"


def load_msg0(template: Path) -> bytearray:
    data = template.read_bytes()
    end = data.index(0xF7) + 1
    return bytearray(data[:end])


def load_msg1(template: Path) -> bytes:
    data = template.read_bytes()
    first_end = data.index(0xF7) + 1
    rest = data[first_end:]
    start = rest.index(0xF0)
    end = rest.index(0xF7, start) + 1
    return rest[start:end]


def set_mode_name(msg: bytearray, mode: int, title: str) -> None:
    name = mode_display_name(mode, title).encode("ascii")
    if len(name) > 127:
        raise ValueError(f"mode name too long: {name!r}")
    old_end = 13 + msg[12]
    msg[12:old_end] = bytes([len(name)]) + name


def restore_components_header(msg: bytearray) -> None:
    if len(msg) > 12 and msg[8] == 0x45 and msg[11] == 0x20:
        msg[10] = 0x7F


def patch_encoder_midi_channel(msg: bytearray, block: int, channel: int) -> None:
    """Components encoding (see `2-DECK Sends CH2.syx` vs CH 1 export).

    Channel 1: bytes +4…+7 `00 00 00 00`, byte +9 = `0x01`.
    Channels 2–16: bytes +4…+7 `00 (ch-1) 00 00`, byte +9 = `0x7F` (global).
    """
    if channel == 1:
        msg[block + 4 : block + 8] = b"\x00\x00\x00\x00"
        msg[block + 9] = 1
    else:
        msg[block + 4 : block + 8] = bytes([0, channel - 1, 0, 0])
        msg[block + 9] = 0x7F


BUTTON_MIDI_GLOBAL = 0x50  # Components shows “global channel”
BUTTON_MIDI_PER_CHANNEL = 0x10  # fixed slot channel (see `3-NANO Filter-fixed.syx`)


def patch_button_midi_channel(msg: bytearray, block: int, channel: int) -> None:
    """Buttons in message 1: +9 = channel (1-based); +5/+6 select global vs per-channel."""
    if not 1 <= channel <= 16:
        raise ValueError(f"MIDI channel must be 1–16, got {channel}")
    msg[block + 9] = channel
    if channel == 1:
        msg[block + 5] = 1
        msg[block + 6] = BUTTON_MIDI_GLOBAL
    else:
        msg[block + 5] = channel - 1
        msg[block + 6] = BUTTON_MIDI_PER_CHANNEL
        msg[block + 7] = 0


def set_button_midi_channel(msg: bytearray, control_id: int, channel: int) -> None:
    if not 0x30 <= control_id <= 0x3F:
        raise ValueError(f"not a button control id: {control_id:#x}")
    marker = bytes([0x49, control_id])
    idx = msg.find(marker)
    if idx < 0:
        raise ValueError(f"missing button I block for id {control_id:#x}")
    patch_button_midi_channel(msg, idx, channel)


def apply_button_midi_channels(msg: bytearray, custom_mode: int) -> None:
    for cid in range(0x30, 0x40):
        set_button_midi_channel(msg, cid, custom_mode)


def apply_midi_channel(msg: bytearray, custom_mode: int) -> None:
    if not 1 <= custom_mode <= 16:
        raise ValueError(f"custom mode must be 1–16, got {custom_mode}")
    ch = custom_mode
    i = 0
    while i < len(msg) - 10:
        if msg[i] == 0x49:
            control_id = msg[i + 1]
            if 0x10 <= control_id <= 0x27:
                patch_encoder_midi_channel(msg, i, ch)
            elif 0x30 <= control_id <= 0x3F:
                patch_button_midi_channel(msg, i, ch)
            i += 11
        else:
            i += 1


def set_control_colour(msg0: bytearray, control_id: int, palette: int) -> None:
    marker = bytes([0x49, control_id])
    idx = msg0.find(marker)
    if idx < 0:
        raise ValueError(f"missing I block for id {control_id:#x}")
    msg0[idx + 3] = palette & 0x7F


def set_button_off(msg1: bytearray, control_id: int) -> None:
    marker = bytes([0x49, control_id])
    idx = msg1.find(marker)
    if idx < 0:
        raise ValueError(f"missing button I block for id {control_id:#x}")
    msg1[idx + 3] = LED_PALETTE_OFF
    msg1[idx + 4] = LED_PALETTE_OFF


def set_button_toggle_on_colour(msg1: bytearray, control_id: int, on_palette: int) -> None:
    """Toggle: +3 = Components “Colour” (off / LED off = 0); +4 = 0x03. On hue may be +3 or UI on-colour."""
    marker = bytes([0x49, control_id])
    idx = msg1.find(marker)
    if idx < 0:
        raise ValueError(f"missing button I block for id {control_id:#x}")
    msg1[idx + 3] = on_palette & 0x7F
    msg1[idx + 4] = LCXL3_BUTTON_TOGGLE_LED_BYTE


def apply_toggle_button_behaviour_bytes(msg1: bytearray, custom_mode: int) -> None:
    """After MIDI channel patch: fix +5 so Components Toggle is not stored as Momentary (mode 15: 0x2e)."""
    if custom_mode < LCXL3_BUTTON_TOGGLE_HIGH_MODE:
        behaviour = custom_mode - 1 if custom_mode > 1 else 1
    else:
        behaviour = LCXL3_BUTTON_TOGGLE_HIGH_FLAG + (custom_mode - 1)
    for cid in range(0x30, 0x40):
        marker = bytes([0x49, cid])
        idx = msg1.find(marker)
        if idx < 0:
            raise ValueError(f"missing button I block for id {cid:#x}")
        msg1[idx + 5] = behaviour & 0x7F


def set_encoder_colour(msg0: bytearray, control_id: int, palette: int) -> None:
    set_control_colour(msg0, control_id, palette)


def apply_performance_button_colours(msg1: bytearray) -> None:
    for i in range(8):
        set_control_colour(msg1, 0x30 + i, PERF_BUTTON_TOP_ORANGE)
    for i in range(8):
        set_control_colour(msg1, 0x38 + i, PERF_BUTTON_BOTTOM_YELLOW)


def apply_performance_buttons(msg1: bytearray, custom_mode: int) -> None:
    set_button_labels(msg1)
    apply_performance_button_colours(msg1)
    apply_button_midi_channels(msg1, custom_mode)


def apply_column_colours(msg0: bytearray, palette: list[int]) -> None:
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            set_encoder_colour(msg0, cid, palette[col])


def apply_uniform_colour(msg0: bytearray, palette_index: int) -> None:
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            set_encoder_colour(msg0, cid, palette_index)


def apply_row_colours(msg0: bytearray, row_colours: list[int]) -> None:
    if len(row_colours) != 3:
        raise ValueError("row_colours must have 3 entries (top, middle, bottom row)")
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            set_encoder_colour(msg0, cid, row_colours[row])


def apply_mode7_group_control_colours(msg0: bytearray) -> None:
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            if col < 5:
                set_encoder_colour(msg0, cid, MODE7_PARAMETRIC_EQ_BANDS[col])
            elif row == 0:
                set_encoder_colour(msg0, cid, DECK_UTIL_ROW_COLOURS[col - 5])
            else:
                set_encoder_colour(msg0, cid, LED_PALETTE_OFF)


def apply_script_led_button_colours_off(msg1: bytearray) -> None:
    """Unused assignable buttons: +3 and +4 zero."""
    for i in range(16):
        set_button_off(msg1, 0x30 + i)


def apply_parametric_eq_button_colours(msg1: bytearray) -> None:
    for i in range(4):
        set_button_toggle_on_colour(
            msg1, 0x30 + i, PARAMETRIC_EQ_GROUP_BUTTON_COLOURS[i]
        )
    for i in range(4, 16):
        set_button_off(msg1, 0x30 + i)


def set_parametric_eq_button_labels(msg1: bytearray) -> None:
    start = msg1.rfind(bytes([0x60, 0x30]))
    if start < 0:
        start = msg1.rfind(bytes([0x63, 0x30]))
    if start < 0:
        raise ValueError("button label block not found in message 1")
    end = msg1.rindex(0xF7)
    out = bytearray()
    for i in range(4):
        out.extend(button_label_entry(0x30 + i, f"{i + 1}  ".encode("ascii")))
    for i in range(4, 8):
        out.extend(button_label_entry(0x30 + i, b"   "))
    for i in range(8):
        out.extend(button_label_entry(0x38 + i, b"   "))
    if len(out) != 80:
        raise ValueError(f"expected 80 button label bytes, got {len(out)}")
    msg1[start:end] = out


def apply_parametric_eq_buttons(msg1: bytearray, custom_mode: int) -> None:
    set_parametric_eq_button_labels(msg1)
    apply_parametric_eq_button_colours(msg1)
    apply_button_midi_channels(msg1, custom_mode)
    apply_toggle_button_behaviour_bytes(msg1, custom_mode)


def apply_eq_dj_button_colours(msg1: bytearray) -> None:
    # `15-EQ-DJ-fixed.syx`: all buttons Toggle, Colour off (0), on colour white in Components.
    for i in range(16):
        set_button_toggle_on_colour(msg1, 0x30 + i, LED_PALETTE_OFF)


def set_eq_dj_button_labels(msg1: bytearray) -> None:
    start = msg1.rfind(bytes([0x60, 0x30]))
    if start < 0:
        start = msg1.rfind(bytes([0x63, 0x30]))
    if start < 0:
        raise ValueError("button label block not found in message 1")
    end = msg1.rindex(0xF7)
    out = bytearray()
    for i in range(4):
        out.extend(button_label_entry(0x30 + i, f"{i + 1}  ".encode("ascii")))
    for i in range(4, 8):
        out.extend(button_label_entry(0x30 + i, b"   "))
    for i in range(8):
        out.extend(button_label_entry(0x38 + i, f"{i + 1}  ".encode("ascii")))
    if len(out) != 80:
        raise ValueError(f"expected 80 button label bytes, got {len(out)}")
    msg1[start:end] = out


def apply_eq_dj_buttons(msg1: bytearray, custom_mode: int) -> None:
    set_eq_dj_button_labels(msg1)
    apply_eq_dj_button_colours(msg1)
    apply_button_midi_channels(msg1, custom_mode)
    apply_toggle_button_behaviour_bytes(msg1, custom_mode)


def apply_mode8_eq_comp_colours(msg0: bytearray) -> None:
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            if col < 5:
                set_encoder_colour(msg0, cid, MODE8_EQ_COMP_EQ_BANDS[col])
            elif row < 2:
                set_encoder_colour(msg0, cid, MODE8_EQ_COMP_COMP)
            else:
                set_encoder_colour(msg0, cid, MODE8_EQ_COMP_SC)


def label_triplet(control_id: int, text: bytes) -> bytes:
    if len(text) != 3:
        raise ValueError(f"label must be 3 bytes: {text!r}")
    return bytes([0x63, control_id]) + text


def button_label_entry(control_id: int, text: bytes) -> bytes:
    return label_triplet(control_id, text)


def perf_button_label_text(index_1_to_8: int, kind: str) -> bytes:
    if not 1 <= index_1_to_8 <= 8:
        raise ValueError(f"button index must be 1–8, got {index_1_to_8}")
    if kind == "mute":
        return f"M{index_1_to_8} ".encode("ascii")
    if kind == "solo":
        return f"S{index_1_to_8} ".encode("ascii")
    raise ValueError(f"unknown button label kind: {kind}")


def set_button_labels(msg1: bytearray) -> None:
    """Replace trailing `60 id` placeholders with `63 id` + 3-char names (80 bytes)."""
    start = msg1.rfind(bytes([0x60, 0x30]))
    if start < 0:
        start = msg1.rfind(bytes([0x63, 0x30]))
    if start < 0:
        raise ValueError("button label block not found in message 1")
    end = msg1.rindex(0xF7)
    out = bytearray()
    for i in range(8):
        out.extend(button_label_entry(0x30 + i, perf_button_label_text(i + 1, "mute")))
    for i in range(8):
        out.extend(button_label_entry(0x38 + i, perf_button_label_text(i + 1, "solo")))
    if len(out) != 80:
        raise ValueError(f"expected 80 button label bytes, got {len(out)}")
    msg1[start:end] = out


def set_labels(msg0: bytearray, rows: list[list[bytes | None]]) -> None:
    if len(rows) != 3 or any(len(r) != 8 for r in rows):
        raise ValueError("rows must be 3 x 8")
    lab_start = msg0.find(bytes([0x63, 0x10]))
    if lab_start < 0:
        raise ValueError("label block not found")
    out = bytearray()
    for row in range(3):
        for col in range(8):
            cid = 0x10 + row * 8 + col
            cell = rows[row][col]
            if cell is None:
                out.extend(label_triplet(cid, b"   "))
            else:
                out.extend(label_triplet(cid, cell))
    if len(out) != 120:
        raise ValueError(f"expected 120 label bytes, got {len(out)}")
    msg0[lab_start : lab_start + 120] = out


def rows_blank() -> list[list[bytes | None]]:
    return [[None] * 8, [None] * 8, [None] * 8]


def rows_hpf_lpf_res() -> list[list[bytes | None]]:
    return [[b"HPF"] * 8, [b"LPF"] * 8, [b"RES"] * 8]


def rows_low_mid_high() -> list[list[bytes | None]]:
    return [[b"Lo "] * 8, [b"Mid"] * 8, [b"Hi "] * 8]


def rows_p1_p8() -> list[list[bytes | None]]:
    top = [f"P{n} ".encode("ascii") for n in range(1, 9)]
    return [top, [None] * 8, [None] * 8]


def apply_pan_colours(msg0: bytearray) -> None:
    for col in range(8):
        set_encoder_colour(msg0, 0x10 + col, PAN_ENCODER_ORANGE)
    for row in range(1, 3):
        for col in range(8):
            set_encoder_colour(msg0, 0x10 + row * 8 + col, LED_PALETTE_OFF)


def rows_m1_m2_m3() -> list[list[bytes | None]]:
    return [[b"M1 "] * 8, [b"M2 "] * 8, [b"M3 "] * 8]


def rows_gn_sc_st() -> list[list[bytes | None]]:
    return [[b"GN "] * 8, [b"SC "] * 8, [b"ST "] * 8]


def rows_fx_sends() -> list[list[bytes | None]]:
    return [[b"FX1"] * 8, [b"FX2"] * 8, [b"FX3"] * 8]


def rows_group_control() -> list[list[bytes | None]]:
    util_top = [b"GN ", b"SC ", b"ST "]
    rows: list[list[bytes | None]] = []
    for row in range(3):
        line: list[bytes | None] = []
        for col in range(8):
            n = col + 1
            if row == 0:
                if col < 5:
                    line.append(f"G{n} ".encode("ascii"))
                else:
                    line.append(util_top[col - 5])
            elif row == 1:
                line.append(f"F{n} ".encode("ascii"))
            else:
                line.append(f"Q{n} ".encode("ascii"))
        rows.append(line)
    return rows


def rows_mode8_eq_comp() -> list[list[bytes | None]]:
    rows: list[list[bytes | None]] = []
    for row in range(3):
        line: list[bytes | None] = []
        for col in range(8):
            if col < 5:
                n = col + 1
                if row == 0:
                    line.append(f"G{n} ".encode("ascii"))
                elif row == 1:
                    line.append(f"F{n} ".encode("ascii"))
                else:
                    line.append(f"Q{n} ".encode("ascii"))
            elif row < 2:
                comp = [[b"Inp", b"Thr", b"Rat"], [b"Atk", b"Rel", b"Out"]][row][col - 5]
                line.append(comp)
            else:
                sc = [b"RS ", b"FL ", b"GN "]
                line.append(sc[col - 5])
        rows.append(line)
    return rows


def write_mode(
    custom_mode: int,
    filename: str,
    title: str,
    colour_fn,
    label_rows: list[list[bytes | None]],
) -> None:
    msg0 = load_msg0(TEMPLATE)
    msg1 = bytearray(load_msg1(TEMPLATE))
    restore_components_header(msg0)
    restore_components_header(msg1)
    set_mode_name(msg0, custom_mode, title)
    set_mode_name(msg1, custom_mode, title)
    colour_fn(msg0)
    set_labels(msg0, label_rows)
    apply_midi_channel(msg0, custom_mode)
    apply_midi_channel(msg1, custom_mode)
    if custom_mode in PERFORMANCE_MODES:
        apply_performance_buttons(msg1, custom_mode)
    elif custom_mode == 7:
        apply_parametric_eq_buttons(msg1, custom_mode)
    elif custom_mode in (6, 8, 15):
        apply_eq_dj_buttons(msg1, custom_mode)
    else:
        apply_button_midi_channels(msg1, custom_mode)
    out = OUT_DIR / filename
    out.write_bytes(bytes(msg0) + msg1)
    print("wrote", out.name, mode_display_name(custom_mode, title), f"MIDI ch {custom_mode}")


def remove_stale_syx(keep: set[str]) -> None:
    keep_always = {TEMPLATE.name}
    for path in OUT_DIR.glob("*.syx"):
        if path.name in keep_always:
            continue
        if (
            path.name.endswith("-fixed.syx")
            or path.name.endswith("-fix.syx")
            or path.name.endswith("-fix-mom.syx")
            or path.name == "15-EQ-DJ-fixed.syx"
        ):
            continue
        if path.name not in keep:
            path.unlink()
            print("removed stale", path.name)


def main() -> None:
    written: set[str] = set()

    def w(mode: int, title: str, colour_fn, labels: list[list[bytes | None]]) -> None:
        fn = syx_filename(mode, title)
        written.add(fn)
        write_mode(mode, fn, title, colour_fn, labels)

    grey = lambda m: apply_uniform_colour(m, RESERVED_GREY)

    w(1, "Unmapped", grey, rows_blank())
    w(2, "Unmapped", grey, rows_blank())
    w(3, "NANO Filter", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["NANO"]), rows_hpf_lpf_res())
    w(4, "MASCHINE Filter", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["MASCHINE"]), rows_low_mid_high())
    w(5, "DECK Filter", lambda m: apply_column_colours(m, CHANNEL_IDENTITY), rows_hpf_lpf_res())
    w(6, "Util", lambda m: apply_row_colours(m, DECK_UTIL_ROW_COLOURS), rows_gn_sc_st())
    w(7, "Group Control", apply_mode7_group_control_colours, rows_group_control())
    w(8, "Pan", apply_pan_colours, rows_p1_p8())
    w(9, "XTM1 Sends", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["XTM1"]), rows_fx_sends())
    w(10, "XTM2 Sends", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["XTM2"]), rows_fx_sends())
    w(11, "NANO Sends", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["NANO"]), rows_fx_sends())
    w(12, "MASCHINE Sends", lambda m: apply_uniform_colour(m, TRACK_IDENTITY["MASCHINE"]), rows_fx_sends())
    w(13, "DECK Sends", lambda m: apply_column_colours(m, CHANNEL_IDENTITY), rows_fx_sends())
    w(14, "Sends Edit", grey, rows_blank())
    w(15, "EQ-DJ", lambda m: apply_row_colours(m, EQ_DJ_ROW_COLOURS), rows_low_mid_high())
    w(16, "DECK Master", apply_mode8_eq_comp_colours, rows_mode8_eq_comp())

    remove_stale_syx(written)


if __name__ == "__main__":
    main()
