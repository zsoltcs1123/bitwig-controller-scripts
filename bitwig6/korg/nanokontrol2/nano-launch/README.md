# nano-launch for Korg nanoKONTROL2

**nano-launch** transforms your Korg nanoKONTROL2 into a powerful performance controller for Bitwig Studio, focusing on clip launching, instrument chain switching, and hands-on parameter control.

It is designed to work with a specific "Group Track" workflow, allowing you to perform with up to 8 child tracks simultaneously.

## Bitwig Project Setup

For this script to function correctly, your project must be set up as follows:

1.  **Group Track**: Create a Group Track named **`TRACK 1/2`** (nested path name as shown in Bitwig). The script finds it anywhere in the project hierarchy (case-insensitive).
2.  **Child Tracks**: Place up to 8 instrument/audio tracks *inside* this Group Track.
3.  **Instrument Selector**: Ideally, each child track should have an **Instrument Selector** (or any device with chains) as its primary device.
4.  **Remote Controls (Group Track)**:
    *   Create a Remote Control Page on the Group Track and tag it **`nano-perf`**. Map 8 parameters to it (controlled by **Knobs**).
    *   Create another Remote Control Page on the Group Track and tag it **`nano-vols`**. Map 8 parameters to it (controlled by **Faders**).
    *   These pages are picked up **live** — create or tag them mid-set and the script binds immediately, no restart needed.

## Controller Usage

### 1. Clip Launch Grid (S, M, R Buttons)
The Solo, Mute, and Rec buttons for tracks 1-8 form an 8x3 clip launching grid.
*   **S Buttons**: Launch Clip 1
*   **M Buttons**: Launch Clip 2
*   **R Buttons**: Launch Clip 3
*   **LED Feedback**: Indicates the currently playing clip.
*   **Stop Clip**: **Long-Press** (hold > 0.5s) any active clip button to stop that track.

### 2. Modes & Navigation (Transport Buttons)

The Transport section (Rewind, FF, Stop, Play, Rec) changes function based on the active mode.

#### Default Mode: Bank Selection
*   **Transport Buttons 1-5**: Switch between **Clip Banks 1-5**.
*   **NEXT TRACK Button**: Toggles **Page 2** (accesses clips 4-6 for the current bank).
    *   *Note: This only works if `BANK_SIZE` is set to 6 in the script.*

#### Instrument Switch Mode (PREV TRACK)
*   **Toggle**: Press **PREV TRACK** (<<) to enter/exit this mode.
*   **Transport Buttons 1-5**: Instantly switch the active **Instrument Chain** (1-5) on **ALL** child tracks and the Group Track simultaneously.

#### Lock Mode (CYCLE)
*   **Toggle**: Press **CYCLE** to enable/disable.
*   **Function**: Synchronizes Clip Banks with Instrument Chains.
    *   Launching a clip or scene from **Bank 1** auto-switches instruments to **Chain 1**.
    *   Launching from **Bank 2** switches to **Chain 2**, etc.

### 3. Scene Launching (Marker Buttons)
*   **SET**: Launch Scene 1 (of current bank/page)
*   **PREV**: Launch Scene 2
*   **NEXT**: Launch Scene 3
*   *Note: These launch scenes within the Group Track scope.*

### 4. Parameter Control
*   **Knobs 1-8**: Control parameters on the Group Track's **`nano-perf`** page.
*   **Faders 1-8**: Control parameters on the Group Track's **`nano-vols`** page.

## Configuration

Target group track name (edit `nano-launch.control.js`):

```javascript
const TARGET_GROUP_TRACK = "TRACK 1/2";
```

Bank size:

```javascript
const BANK_SIZE = 6; // Set to 3 or 6
```

*   **6 (Default)**: 5 Banks of 6 Clips. Use `NEXT TRACK` to toggle between clips 1-3 and 4-6.
*   **3**: 5 Banks of 3 Clips. `NEXT TRACK` is disabled.
