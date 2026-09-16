# ZSAudio Maschine suite

Controller scripts for the **ZSAUDIO-MASCHINE** Bitwig template: one deck (DECK A), shared Maschine, NANO loop channels, and three send FX tracks.

## Bitwig template

- Layout and remote tagging rules: [`project-structure.md`](project-structure.md)
- Open the template project (e.g. `zsaudio-maschine-3`) before loading scripts.

## Scripts

| Folder | Hardware | Bitwig tracks |
| --- | --- | --- |
| [`zsaudio-maschine-deck/`](zsaudio-maschine-deck/) | Launch Control XL 3 (Custom Mode) | DECK A, XTM1, XTM2, MASCHINE, NANO |
| [`zsaudio-maschine-xtm1/`](zsaudio-maschine-xtm1/) | X-Touch Mini (MC mode) | XTM1, DECK A (`p1`) |
| [`zsaudio-maschine-xtm2/`](zsaudio-maschine-xtm2/) | X-Touch Mini (MC mode) | XTM2, DECK A (`p2`) |
| [`zsaudio-maschine-nano/`](zsaudio-maschine-nano/) | nanoKONTROL2 | NANO group + children `1`–`8` |

LCXL3 Custom Mode `.syx` files and mode list: [`lcxl3/`](lcxl3/) ([`mode-map.md`](lcxl3/mode-map.md)).

## Setup order

1. Tag remote pages in Bitwig per **Remote control placement** in `project-structure.md` (group **track** vs **last device** matters).
2. Upload LCXL3 modes from `lcxl3/` (run `build_modes.py` after edits).
3. Add each script under **Preferences → Controllers**.

## Premaster / LCXL2

This suite does **not** include a Premaster or Master LCXL2 script. The separate [`zsaudio` suite `lcxl2-fx`](../../zsaudio/lcxl2-fx/) targets a different FX layout. Wire Premaster later or reuse ideas from that script.

## MCP documentation

With [wigai-full](../../../docs/wigai-setup.md) enabled, an agent can read track/device layout from an open project to refresh `project-structure.md`. MCP does not expose remote **tags** or group hierarchy; verify tagging in Bitwig.
