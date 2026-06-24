# X-Touch Mini Sampler 1

One of the `xtm-sampler-*` scripts. See `../README.md` for the family overview.

## Bindings

- **A**: `Track 1/1`
- **B**: `Track 2/3`

## Bottom row modes

Default: page selector (`xtm-1` … `xtm-8`). Press the active page button again to return to `xtm-perf`.

- **Button A**: toggle clip launcher mode (A LED on). Press again to return to page selector.
- **Button B**: toggle chain selector mode (B LED on). Press again to return to page selector.

### Clip launcher (Mode A)

Bank size is set by `BANK_SIZE` in the script (default `3`, max `8`). Only the first `BANK_SIZE` bottom buttons are active.

Clips are offset by the active instrument chain on the target track:

| Chain | Buttons (bank size 3) |
| ----- | --------------------- |
| 1     | clips 1, 2, 3         |
| 2     | clips 4, 5, 6         |
| 3     | clips 7, 8, 9         |

Short press launches; short press on a playing clip re-triggers; long press (>0.5s) stops the track.

### Chain selector (Mode B)

Bottom buttons 1–8 set active chain index 0–7 on the target track's primary device.

On chain switch, inactive chains go to **−∞ dB**; the active chain resets to **0 dB**.

## Target switch

- **Encoder push 7**: target A
- **Encoder push 8**: target B

No LED feedback for target selection.
