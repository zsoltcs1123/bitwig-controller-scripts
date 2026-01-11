# Important concepts

This file contains important know-how about how the Bitwig API works that was discovered while writing scripts.
It also contains user-defined concepts, like track pinning.

## Track pinning

Generally, controller scripts are following the active track/device the user is selecting on the Bitwig GUI. 
However, in most of our cases this behaviour is undesired.
Instead we 'pin' the controller to a specific track in the script. 
An example of how this works can be found in the script `@./bitwig6/novation/lcxl3/lcxl3-ar.control.js`
Always assume track pinning in new scripts, unless explicitly told otherwise.

## Accessing remote control pages via tags

Tags are a great little trick I found to access more than 8 parameters without relying on page switching which is unreliable. We create the remote control pages in the script with specific tags and then I mark the pages with those tags on the GUI.
An example of how this works can be found in the script `@./bitwig6/novation/lcxl3/lcxl3-ar.control.js`

## Clip/Scene launching

Clip/Scene launching is a bit tricky with the Bitwig APi.
You can find a working example in the script `@./bitwig6/novation/lcxl3/lcxl3-ar.control.js`.