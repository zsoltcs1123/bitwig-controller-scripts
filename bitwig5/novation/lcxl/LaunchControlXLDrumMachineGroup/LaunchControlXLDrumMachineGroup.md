Architecture:
This LCXL script controls a Track with a Device on it that has 12 pages of Remote controls.

The LCXL supports user modes. I want this script to be usable in User Mode 6. That means it should only work through Midi Channel 6.

An important concept in this script is Track Fixing. This means that our controls don't follow the cursor as it usually does in scripts. We are fixing the controlled Tracks independent of the cursor.

Another important concepts for the Remote control pages is Fixed mode or Selection. If I say 'Fixed' it means a set of controls always control that specific page it is fixed to, regardless of the current page selection.


Functionality:

1st row of buttons: DRUM PAD MUTES (if the Device is a Drum Machine)
2nd Row of Buttons: SELECT remote control page 1 - 8
SLIDERS: FIXED to remote control page 9

1st row of knobs: FIXED to Remote Control Page  0
2nd row of knobs: FIXED to Remote Control Page 11
3nd row of knobs: Follows the current selected page


