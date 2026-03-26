# Launch Control XL 3 Firmware Changelog

## 1.1

### Expanded MIDI routing
- MIDI sent to the DIN input can now be filtered by channel and output on a specified channel, on a per-custom mode basis.
- The Ext MIDI In setting has been renamed to Merge to reflect this new behaviour.
- Added two additional USB MIDI output ports so that USB MIDI data can be sent from a computer to either Launch Control XL 3's MIDI outputs.

### New features
- Preview Fader assignments by holding Shift.
- Fader pickup option for Faders in Custom Modes.
- Mode button can now be held to function as a momentary button, allowing faster Custom Mode switching.
- Mackie HUI protocol support, allowing Mixer and Playback control of DAWs such as Reaper, Pro Tools, and Studio One.
- Encoder acceleration options: Slow, Medium (the original curve), and Fast. Configured from Launch Control XL 3's Settings menu. Affects encoders in Custom Modes.

### Refinements and bug fixes
- Improved the Custom Mode Settings saving mechanism so that the correct data is shown and it is not possible to interrupt the procedure.
- Resolved an issue where LEDs would flicker when a high density of MIDI data was received in the MIDI DIN input.
- Resolved an issue where the preview value was sent for encoders when the value was not 0.
- Resolved an issue where the Shift button wasn't responsive after leaving the Settings menu.
- Improved the MIDI DIN I/O processing when handling high levels of MIDI data.
