# Template: ZSAUDIO-MASCHINE

Bitwig project layout this suite targets. Track order is top to bottom.

## Scenes

16 scenes: `Scene 1` … `Scene 16`.

## Tracks

| # | Name | Type | Device(s) |
|---|------|------|-----------|
| 0 | DECK A | group | Drum Machine |
| 1 | Main Drums | instrument | Instrument Selector |
| 2 | Groove Drums | instrument | Instrument Selector |

## Main Drums track layout

The **Main Drums** track uses an **Instrument Selector** as its primary device.

- **8 chains** (drum racks 1–8). Active chain is selected in Bitwig or on the hardware.
- **64 clip slots** on the Main Drums track: 8 MIDI clips per chain (8 × 8 grid).
- **Clip banks** follow the active Instrument Selector chain:

| Chain (rack) | Clip slots (1-based) | Clip slots (0-based) |
| --- | --- | --- |
| 1 | 1–8 | 0–7 |
| 2 | 9–16 | 8–15 |
| 3 | 17–24 | 16–23 |
| 4 | 25–32 | 24–31 |
| 5 | 33–40 | 32–39 |
| 6 | 41–48 | 40–47 |
| 7 | 49–56 | 48–55 |
| 8 | 57–64 | 56–63 |

Clips launch on the **Main Drums track only** (not scene launch, not the parent group).

**Remote controls:**

- Instrument Selector `kill` (slot 1): active chain kill, driven by the main fader.
- Main Drums track `chainkill` (slots 1–8): one kill per drum rack chain. Mode B uses these on chain swap. Track remotes stay stable when the Instrument Selector switches chains.

## Groove Drums track layout

The **Groove Drums** track mirrors Main Drums: **Instrument Selector**, 8 chains, 64 clip slots (8 × 8 grid), same clip-bank mapping and remote control tags (`kill`, `chainkill`, `mutes`, `m0`, `faders`, `vols`, `pans`, `eq`, `d1`–`d8`).

Clips launch on the **Groove Drums track only**.

## Other tracks

| # | Name | Type | Device(s) |
|---|------|------|-----------|
| 3 | Loops | group | Drum Machine |
| 4 | DM | instrument | Drum Machine |
| 5 | 5 | audio | — |
| 6 | 6 | audio | — |
| 7 | 7 | audio | — |
| 8 | 8 | audio | — |
| 9 | Maschine | instrument | Maschine 3 |
| 10 | Reverb | effect | FX Selector, FX Layer |
| 11 | Filter Delay | effect | FX Selector, FX Layer, mvMeter2 |
| 12 | Delay | effect | FX Selector, FX Layer |
| 13 | Premaster | effect | FX Selector |
| 14 | Master | master | Compressor, mvMeter2, Tool, MONO BASS, Peak Limiter |

## Project parameters

`R1`, `R2`, `R3`
