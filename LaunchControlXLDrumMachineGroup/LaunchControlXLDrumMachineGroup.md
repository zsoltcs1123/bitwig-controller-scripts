Architecture:
This LCXL script controls a Group Track with up to 8 child tracks. The Group Track always contains a Drum Machine and the child tracks are routed to this Drum Machine using Bitwig's Audio Receiver. This gives control over the child tracks.

The LCXL supports user modes. I want this script to be usable in User Mode 6. That means it is only working through Midi Channel 6.

An important concept in this script is Track Fixing. This means that our controls don't follow the cursor as it usually does in scripts. We are fixing to tracks independent of the cursor.


Functionality:

2nd row of buttons: Set FIXED Child track 1 - 8
1st row of buttons: Select Remote Control Page of the current track index 1-9 (this works if also if the fixed track is the group track)
SLIDERS: Always fixed to remote control page index 10 of the GROUP TRACK

1st row of knobs: always fixed to Remote Control Page 0 of the Group Track's Drum Machine
2nd row of knobs: fixed to page 0 of the current fixed track
3nd row of knobs: corresponds to the selection made by the 1st row buttons
