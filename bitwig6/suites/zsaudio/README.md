# ZSAudio Suite

Controller scripts meant to run together in one Bitwig project.

## Hardware

| Script | Device | Role |
| --- | --- | --- |
| `apc-launch/` | Akai APC Mini MK2 | Clip launching and song banks for live sets |
| `xtm-sampler/` | Behringer X-Touch Mini (MC mode) | Sampler and instrument control across paired tracks |
| `lcxl2-fx/` | Novation Launch Control XL | FX chain switching and performance macros |
| `lcxl3-ar/` | Novation Launch Control XL 3 | Group track navigation and layered mixer control |

## Setup

1. Add all four controllers in **Preferences → Controllers**.
2. Open or create a project that matches the track layout expected by each script (see per-script READMEs).
3. Enable scripts in the order you prefer; they operate independently once loaded.

## Notes

- Device reference material lives under `references/` (MIDI maps, user guides).
