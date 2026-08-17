# X-Touch Mini Sampler

Controller script for the Behringer X-Touch Mini in **MC mode**. Targets two pinned tracks (A/B) and exposes tagged remote control pages on each track's primary device.

## Bindings

| Target | Track name |
| --- | --- |
| A | `Track 1/1` |
| B | `Track 2/3` |

Track names are matched case-insensitively at any nesting depth.

## Remote page tags

`xtm-perf`, `xtm-vols`, `xtm-pans`, `xtm-eq`, `xtm-mutes`, `xtm-all-vols`, `xtm-1` … `xtm-8`.

Tagged pages are picked up live — no script restart needed when you add a matching page in the project.

## Encoder mapping

- **Default**: page tagged `xtm-perf`.
- **Encoder push 1**: `xtm-perf`.
- **Encoder push 2**: toggle `xtm-vols` (press again → `xtm-perf`).
- **Encoder push 3**: toggle `xtm-pans` (press again → `xtm-perf`).
- **Encoder push 4**: toggle `xtm-eq` (press again → `xtm-perf`).
- **Encoder push 5–6**: unused.
- **Encoder push 7**: target A.
- **Encoder push 8**: target B.

Encoder LED rings reflect parameter values.

## Bottom row modes

Default is **page selector**. Buttons **A** and **B** toggle clip launcher and chain selector modes (press the active mode button again to return to page selector).

- **Page selector**: buttons 1–8 select `xtm-1` … `xtm-8`. Press the active page button again to return to `xtm-perf`.
- **Clip launcher (A)**: bank size is `BANK_SIZE` (default `3`, max `8`). Clips offset by active instrument chain. Short press launches; long press (>0.5s) stops the track.
- **Chain selector (B)**: buttons 1–8 set active chain index. Inactive chains go to −∞ dB; active chain resets to 0 dB.

## Buttons and fader

- **Top row 1–8**: `xtm-mutes` page. LEDs on when parameter > 0.5.
- **Main fader**: first parameter on `xtm-all-vols`.

## Hardware

Ensure the X-Touch Mini is in **MC mode** (hold **MC** while plugging in).

## Debugging

Set `DEBUG = true` in the script to log status to the Bitwig Script Console.
