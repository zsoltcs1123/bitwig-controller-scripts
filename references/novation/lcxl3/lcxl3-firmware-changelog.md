# Launch Control XL 3 Firmware Changelog

Source: Novation firmware release notes (transcribed for offline reference).

## 1.2

Fixes and improvements:

### Features

- **Relative encoders** — Option to set encoders to relative behavior in Custom Modes.
- **DAW Connection** — Setting for whether DAWs force Launch Control XL 3 into DAW Mixer mode:
  - **Switch** (default) — DAWs can force mode change (current behavior).
  - **Connect Only** — Controller stays in Custom Mode while DAW modes are available.
  - May require latest DAW scripts for Cubase, Logic, and FL Studio. Bitwig: **6.1+**.
- **Fader scanning** — Faster gestures captured more accurately.
- **USB** — Low-level descriptor fixes for WebUSB and broader USB compatibility.

### Bug fixes

- Play button not lit or outputting when Shift was held.
- Easy Start prompt not shown correctly on screen.

## 1.1

### Expanded MIDI routing

- MIDI on the DIN input can be filtered by channel and output on a specified channel, per Custom Mode.
- **Ext MIDI In** renamed to **Merge**.
- Two additional USB MIDI output ports so a computer can route USB MIDI to either of the unit’s MIDI outputs. Mac users may need to refresh MIDI Studio; see Novation’s support article for details.

### New features

- Preview fader assignments by holding Shift.
- Fader pickup option for faders in Custom Modes.
- Mode button can be held as a momentary control for faster Custom Mode switching.
- Mackie HUI support for mixer and transport in Reaper, Pro Tools, Studio One, and similar.
- Encoder acceleration: Slow, Medium (original curve), Fast — in Settings; affects Custom Mode encoders.

### Refinements and bug fixes

- Custom Mode settings save flow: correct data shown; save cannot be interrupted mid-write.
- LED flicker on DIN input under heavy MIDI traffic.
- Encoder preview value sent when value was not 0.
- Shift button unresponsive after leaving Settings.
- MIDI DIN I/O under high MIDI load.
