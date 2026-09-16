# LCXL3 encoder LED palette (0–127)

Novation Launch Control XL 3 Custom Modes store ring colour as a **palette index** (byte **+3** in each 11-byte `I` block). The same index is used for MIDI `B0 <cc> <index>` colouring (programmer’s reference guide, p.12). Full swatch chart: `palette-page12.png`.

**Hardware calibration:** `Colors.syx` — first **12** encoders (top row, CC 13–24) show indices **5, 9, 13, 17, 25, 29, 33, 37, 41, 45, 49, 53** (one sample per hue band). Load that mode on the controller to compare rings to this table.

**Suite default (DECK columns 1–8):** `[5, 9, 37, 53, 45, 45, 45, 3]` — see `lcxl3-custom-mode-syx-notes.md`.

Grid layout below: **row** `floor(index / 8)`, **column** `index % 8` (matches the decimal table in the programmer guide).

| Dec | Hex | Row | Col | Name | Notes |
| --- | --- | --- | --- | --- | --- |
| 0 | 00 | 0 | 0 | off / black | |
| 1 | 01 | 0 | 1 | dark grey | |
| 2 | 02 | 0 | 2 | mid grey | |
| 3 | 03 | 0 | 3 | white | DECK col 8 |
| 4 | 04 | 0 | 4 | red (dim) | |
| 5 | 05 | 0 | 5 | red (bright) | Colors enc 1 · DECK col 1 |
| 6 | 06 | 0 | 6 | red | |
| 7 | 07 | 0 | 7 | red (dark) | |
| 8 | 08 | 1 | 0 | brown | |
| 9 | 09 | 1 | 1 | orange (bright) | Colors enc 2 · DECK col 2 |
| 10 | 0A | 1 | 2 | orange | |
| 11 | 0B | 1 | 3 | orange / yellow | |
| 12 | 0C | 1 | 4 | yellow | |
| 13 | 0D | 1 | 5 | yellow (bright) | Colors enc 3 |
| 14 | 0E | 1 | 6 | yellow-green | |
| 15 | 0F | 1 | 7 | lime | |
| 16 | 10 | 2 | 0 | green (dark) | |
| 17 | 11 | 2 | 1 | green | Colors enc 4 |
| 18 | 12 | 2 | 2 | green | |
| 19 | 13 | 2 | 3 | green (bright) | |
| 20 | 14 | 2 | 4 | green (vivid) | |
| 21 | 15 | 2 | 5 | spring green | |
| 22 | 16 | 2 | 6 | mint | |
| 23 | 17 | 2 | 7 | aqua green | |
| 24 | 18 | 3 | 0 | teal (dark) | |
| 25 | 19 | 3 | 1 | teal | Colors enc 5 |
| 26 | 1A | 3 | 2 | teal (bright) | |
| 27 | 1B | 3 | 3 | cyan (dim) | |
| 28 | 1C | 3 | 4 | cyan | |
| 29 | 1D | 3 | 5 | cyan (bright) | Colors enc 6 |
| 30 | 1E | 3 | 6 | sky | |
| 31 | 1F | 3 | 7 | sky (bright) | |
| 32 | 20 | 4 | 0 | blue (dim) | |
| 33 | 21 | 4 | 1 | blue | Colors enc 7 |
| 34 | 22 | 4 | 2 | blue (bright) | |
| 35 | 23 | 4 | 3 | blue (vivid) | |
| 36 | 24 | 4 | 4 | blue | |
| 37 | 25 | 4 | 5 | cyan (vivid) | Colors enc 8 · DECK col 3 |
| 38 | 26 | 4 | 6 | blue | |
| 39 | 27 | 4 | 7 | blue | |
| 40 | 28 | 5 | 0 | indigo (dim) | |
| 41 | 29 | 5 | 1 | indigo | Colors enc 9 |
| 42 | 2A | 5 | 2 | indigo (bright) | |
| 43 | 2B | 5 | 3 | blue (deep) | |
| 44 | 2C | 5 | 4 | blue (deep) | |
| 45 | 2D | 5 | 5 | blue (dark / vivid) | Colors enc 10 · DECK col 5–7 |
| 46 | 2E | 5 | 6 | blue (dark) | |
| 47 | 2F | 5 | 7 | navy | |
| 48 | 30 | 6 | 0 | purple (dim) | |
| 49 | 31 | 6 | 1 | purple | Colors enc 11 |
| 50 | 32 | 6 | 2 | purple (bright) | |
| 51 | 33 | 6 | 3 | purple (vivid) | poor on DECK (use 53) |
| 52 | 34 | 6 | 4 | magenta (dim) | |
| 53 | 35 | 6 | 5 | fuchsia | Colors enc 12 · DECK col 4 |
| 54 | 36 | 6 | 6 | magenta | |
| 55 | 37 | 6 | 7 | magenta (bright) | |
| 56 | 38 | 7 | 0 | pink (dim) | |
| 57 | 39 | 7 | 1 | pink | Colors enc 13 |
| 58 | 3A | 7 | 2 | pink | |
| 59 | 3B | 7 | 3 | pink (bright) | |
| 60 | 3C | 7 | 4 | rose | |
| 61 | 3D | 7 | 5 | rose (bright) | |
| 62 | 3E | 7 | 6 | salmon | |
| 63 | 3F | 7 | 7 | coral | |
| 64 | 40 | 8 | 0 | red (muted) | |
| 65 | 41 | 8 | 1 | red | |
| 66 | 42 | 8 | 2 | red (bright) | |
| 67 | 43 | 8 | 3 | red-orange | |
| 68 | 44 | 8 | 4 | orange (muted) | |
| 69 | 45 | 8 | 5 | orange | |
| 70 | 46 | 8 | 6 | orange (bright) | |
| 71 | 47 | 8 | 7 | amber | |
| 72 | 48 | 9 | 0 | yellow (muted) | |
| 73 | 49 | 9 | 1 | yellow | |
| 74 | 4A | 9 | 2 | yellow (bright) | |
| 75 | 4B | 9 | 3 | yellow-green | |
| 76 | 4C | 9 | 4 | green (muted) | |
| 77 | 4D | 9 | 5 | green | |
| 78 | 4E | 9 | 6 | green (bright) | |
| 79 | 4F | 9 | 7 | green (vivid) | |
| 80 | 50 | 10 | 0 | magenta (deep) | |
| 81 | 51 | 10 | 1 | magenta (vivid) | |
| 82 | 52 | 10 | 2 | purple (hot) | |
| 83 | 53 | 10 | 3 | purple | |
| 84 | 54 | 10 | 4 | orange (vivid) | alt orange |
| 85 | 55 | 10 | 5 | orange | |
| 86 | 56 | 10 | 6 | gold | |
| 87 | 57 | 10 | 7 | gold (bright) | |
| 88 | 58 | 11 | 0 | yellow (deep) | |
| 89 | 59 | 11 | 1 | yellow | |
| 90 | 5A | 11 | 2 | chartreuse | |
| 91 | 5B | 11 | 3 | green | |
| 92 | 5C | 11 | 4 | green (bright) | |
| 93 | 5D | 11 | 5 | teal | |
| 94 | 5E | 11 | 6 | cyan | |
| 95 | 5F | 11 | 7 | cyan (bright) | |
| 96 | 60 | 12 | 0 | orange (deep) | |
| 97 | 61 | 12 | 1 | orange | |
| 98 | 62 | 12 | 2 | tangerine | |
| 99 | 63 | 12 | 3 | amber | |
| 100 | 64 | 12 | 4 | amber (bright) | |
| 101 | 65 | 12 | 5 | yellow | |
| 102 | 66 | 12 | 6 | yellow (bright) | |
| 103 | 67 | 12 | 7 | yellow (pale) | |
| 104 | 68 | 13 | 0 | blue (muted) | |
| 105 | 69 | 13 | 1 | blue | |
| 106 | 6A | 13 | 2 | blue (bright) | |
| 107 | 6B | 13 | 3 | violet | |
| 108 | 6C | 13 | 4 | violet (bright) | |
| 109 | 6D | 13 | 5 | purple | |
| 110 | 6E | 13 | 6 | purple (bright) | |
| 111 | 6F | 13 | 7 | magenta | |
| 112 | 70 | 14 | 0 | grey (dim) | |
| 113 | 71 | 14 | 1 | grey | |
| 114 | 72 | 14 | 2 | grey (mid) | |
| 115 | 73 | 14 | 3 | grey (light) | |
| 116 | 74 | 14 | 4 | white (dim) | |
| 117 | 75 | 14 | 5 | white | |
| 118 | 76 | 14 | 6 | white (bright) | |
| 119 | 77 | 14 | 7 | white (full) | alt white |
| 120 | 78 | 15 | 0 | red (pastel) | |
| 121 | 79 | 15 | 1 | red (bright) | |
| 122 | 7A | 15 | 2 | red | |
| 123 | 7B | 15 | 3 | pink-red | |
| 124 | 7C | 15 | 4 | pink | |
| 125 | 7D | 15 | 5 | pink (bright) | |
| 126 | 7E | 15 | 6 | pink (pale) | |
| 127 | 7F | 15 | 7 | pink (white) | |

## Colors.syx — encoder 1–12 reference

| Encoder | CC | Palette index | Hex |
| --- | --- | --- | --- |
| 1 | 13 | 5 | 05 |
| 2 | 14 | 9 | 09 |
| 3 | 15 | 13 | 0D |
| 4 | 16 | 17 | 11 |
| 5 | 17 | 25 | 19 |
| 6 | 18 | 29 | 1D |
| 7 | 19 | 33 | 21 |
| 8 | 20 | 37 | 25 |
| 9 | 21 | 41 | 29 |
| 10 | 22 | 45 | 2D |
| 11 | 23 | 49 | 31 |
| 12 | 24 | 53 | 35 |

Custom RGB (outside palette): SysEx `F0 00 20 29 02 15 01 53 <control index> <R> <G> <B> F7` (programmer guide).
