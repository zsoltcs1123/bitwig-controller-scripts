# APC Launch

A Bitwig controller script for the Akai APC Mini MK2, designed for live performance with multi-song sets.

## Project Setup

The script expects **Track 1** to be a group track containing exactly **8 child tracks**. Each child track can optionally have an Instrument Selector as its primary device.

Clips are organized in the launcher as **song banks**: each song occupies 8 consecutive rows across all 8 tracks (64 clips per song). Up to 8 songs are supported (64 rows total).

```
Track 1 (Group)
├── Child 1    rows 1-8: Song 1 | rows 9-16: Song 2 | ... | rows 57-64: Song 8
├── Child 2    ...
├── ...
└── Child 8    ...
```

## Controls

### Default Mode

| Control | Function |
|---|---|
| **8x8 Pad Grid** | Launch/stop clips. Press to launch, press playing clip to stop that track. |
| **Bottom Buttons 1-8** | Song bank select. Shifts the pad grid to the corresponding 8-row bank. |
| **Right Buttons 1-8** | Scene launch. Launches all clips in that row of the current bank. |
| **Shift** | Toggle instrument mode (see below). |
| **Fader 9** | Bank-chain lock toggle. Above 50% = locked. |

### Instrument Mode (Shift)

Press **Shift** to toggle instrument mode. All blinking LEDs indicate you're in this mode.

| Control | Function |
|---|---|
| **Bottom Buttons 1-8** | Select a child track for individual chain switching. Long-press the selected button to deselect (switches back to all-tracks mode). |
| **Right Buttons 1-8** | Switch the active chain (instrument) on the selected child track, or on all tracks if none is selected. |

### Bank-Chain Lock (Fader 9)

When the lock is active (fader 9 above 50%), launching any clip or scene automatically switches all instrument selectors to match the current song bank (bank 1 = chain 1, bank 2 = chain 2, etc.). This is useful when each song uses a different instrument preset across all tracks.

## LED Feedback

| LED | Meaning |
|---|---|
| **Pad dim** | Clip exists (color matches Bitwig clip color) |
| **Pad bright** | Clip is playing |
| **Pad pulsing** | Clip is queued to launch or stop |
| **Pad off** | Empty slot |
| **Bottom solid red** | Active song bank (default mode) |
| **Bottom blinking red** | Selected child track (instrument mode) |
| **Right solid green** | Active scene row (default mode) |
| **Right blinking green** | Active chain/instrument (instrument mode) |
