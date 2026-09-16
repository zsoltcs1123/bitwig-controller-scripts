# LCXL3 Custom Mode encoders (script notes)

## XTM vs LCXL3

**Behringer X-Touch Mini (MC mode)** — used by `xtm-sampler` and maschine XTM scripts:

- Encoders send **relative** CC (typical pattern: values 1–63 = one direction, 65–127 = other).
- Script calls `param.inc()` from that CC; it does **not** use `param.set(cc/127)`.
- LED rings use **separate** CC numbers (48–55), updated from parameter observers and on page change.

**Launch Control XL 3 Custom Modes** (Novation Components):

- Encoders output **absolute** CC or NRPN only — not relative (confirmed by Novation support, 2026).
- Ring brightness uses **the same CC** echoed back on the same MIDI channel (bidirectional feedback).
- DAW mode supports relative rows via separate programmer CCs; that path is **not** available in user Custom Modes.

## Implication for multi-mode scripts

With absolute CC, the hardware keeps a **knob position** across Custom Mode switches. Bitwig parameters are **per mode / per mapping**. If the script maps incoming CC directly with `param.set(value/127)`, returning to a mode can **overwrite** the stored parameter with a stale knob position.

Firmware also had a bug (fixed) where a **preview** CC could be sent when the encoder value was not zero on mode change.

## Approach in `zsaudio-maschine-deck`

1. **Inbound**: After each mode (MIDI channel) change, the first CC per encoder only **syncs the LED** from Bitwig; it applies `param.set` only if it already matches within a small tolerance. Further movement uses **`param.inc(delta/127)`** from successive absolute CCs (with 127 wrap), matching the XTM *relative* behaviour without relative MIDI.
2. **Outbound**: Parameter value observers + `refreshChannelEncoderLeds()` on channel change push CC feedback for rings.

Physical faders stay absolute `param.set` (DECK `volumes`).

## References

- [LCXL3 Components guide](https://support.novationmusic.com/hc/en-gb/articles/27203903097362) — Custom Mode CC/NRPN encoders
- [LCXL3 programmer's DAW mode](https://userguides.novationmusic.com/hc/en-gb/articles/27840466544402) — relative rows (DAW mode only)
- `./lcxl3-firmware-changelog.md` — encoder preview CC fix
