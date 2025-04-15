Architecture:
This LCXL script controls a Group Track with up to 8 child tracks. The Group Track always contains a Drum Machine and the child tracks are routed to this Drum Machine using Bitwig's Audio Receiver. This gives control over the child tracks.

The LCXL supports user modes. I want this script to be usable in User Mode 6. That means it should only work through Midi Channel 6.

An important concept in this script is Track Fixing. This means that our controls don't follow the cursor as it usually does in scripts. We are fixing the control tracks independent of the cursor.


Functionality:

2nd row of buttons in: 

'DEVICE MODE' = Set FIXED Child track 1 - 8
'SOLO MODE' = Set REMOVE CONTROL PAGE 1-8
'RECORD ARM' = SET FIXED GROUP track 1-8 OR Maybe Track sle

These modes are called like so on the device but we used them for different purposes.

1st row of buttons: DRUM PAD MUTES
SLIDERS: Always fixed to remote control page index 10 of the GROUP TRACK (main mixer)

1st row of knobs: always fixed to Remote Control Page 0 of the Group Track's Drum Machine
2nd row of knobs: fixed to page 0 of the current fixed track
3nd row of knobs: set to page 11 (sends) OR selected page

Device button goes back page 10 from selection
