# Launch Control XL 3 AR Controller Script

This script is designed for the Novation Launch Control XL 3 in **Custom Mode**. It uses MIDI channels to switch between multiple mapping layers, all targeting a single pinned group track and its nested child tracks.

## Target Track Structure

The script auto-detects its target group track by name (`TRACKS`). It searches up to 2 levels deep in the track hierarchy, plus the parent scope, so it works regardless of whether you've drilled into a group in the Bitwig UI. The expected structure is:

```
TRACKS (pinned group track)
  ├── TRACK 1 (sub-group)
  │     ├── Track 1/1    → Channel 1
  │     ├── Track 1/2    → Channel 2
  │     ├── Track 1/3    → Channel 3
  │     └── Track 1/4    → Channel 4
  └── TRACK 2 (sub-group)
        ├── Track 2/1    → Channel 5
        ├── Track 2/2    → Channel 6
        ├── Track 2/3    → Channel 7
        └── Track 2/4    → Channel 8
```

The target track name, number of sub-groups, and tracks per sub-group are configurable via the `TARGET_TRACK_NAME`, `NUM_SUB_GROUPS`, and `TRACKS_PER_SUB_GROUP` constants.

## Mapping Overview

### Channels 1-8: Child Track Remote Controls

Each MIDI channel maps to one child track (flattened across sub-groups as shown above). Encoders map to 8 tagged remote control pages (`c1` through `c8`) on each child track's primary device — each encoder column maps to a separate page.

- **Top encoder row**: Parameter 0 of each page
- **Middle encoder row**: Parameter 1 of each page
- **Bottom encoder row**: Parameter 2 of each page

### Channel 9: Primary Device Parameters (Group 1)

Encoders map to the pinned group track's primary device. Each encoder column maps to a separate tagged page (`p1` through `p8`).

- **Top encoder row**: Parameter 0 of each page
- **Middle encoder row**: Parameter 1 of each page
- **Bottom encoder row**: Parameter 2 of each page

### Channel 10: Primary Device Parameters (Group 2)

Same as Channel 9 but offset by 4, accessing parameters 4, 5, 6 of each page.

- **Top encoder row**: Parameter 4 of each page
- **Middle encoder row**: Parameter 5 of each page
- **Bottom encoder row**: Parameter 6 of each page

### Channel 11: Sends

Encoders control sends 1-3 on each child track (columns 1-8 correspond to child tracks 1-8).

- **Top encoder row**: Send 1
- **Middle encoder row**: Send 2
- **Bottom encoder row**: Send 3

### Channel 12: TRACK 1/2 Remote Controls

Finds track **`TRACK 1/2`** anywhere in the project (case-insensitive nested path). Each encoder column maps to remote page **`c1`**–**`c8`** on that track's primary device.

- **Top encoder row**: Parameter 4 of each page (`c1`–`c8`)
- **Middle encoder row**: Parameter 5 of each page
- **Bottom encoder row**: Parameter 6 of each page

### Channel 13: TRACK 1/2 Child Remote Controls

Children of **`TRACK 1/2`** (up to 8). Each encoder column maps to one child track's primary device.

Three paged remote control pages per child: **`c-perf-1`**, **`c-perf-2`**, **`c-perf-3`** (params 1–3 on each page = 9 params total).

- **Column 1–8**: Child tracks 1–8 inside `TRACK 1/2`
- **Top / middle / bottom encoder rows**: remote control slots **1 / 2 / 3** on **`c-perf-1`**

`c-perf-2` and `c-perf-3` are set up per child but not reachable from the LCXL3 in Custom Mode (hardware page buttons send no MIDI).

### Faders (All Channels)

The 8 faders map to the page tagged `volumes` on the pinned group track's primary device (parameters 0-7).

### Upper Buttons (All Channels)

Toggle **mute** on child tracks 1-8. LED reflects mute state.

### Bottom Buttons (All Channels)

Toggle **record arm** on child tracks 1-8. LED reflects arm state.

## Hardware Configuration

The LCXL3 must be configured in a Custom Mode that sends on the appropriate MIDI channels. The script expects absolute CC values (0-127) with the following CC assignments:

| Control | CC Range |
|---|---|
| Encoders Top Row | CC 13-20 |
| Encoders Middle Row | CC 21-28 |
| Encoders Bottom Row | CC 29-36 |
| Faders | CC 5-12 |
| Upper Buttons | CC 37-44 |
| Bottom Buttons | CC 45-52 |

## Debugging

The script logs detailed status information to the Bitwig Script Console on startup, including the state of the pinned track, primary device pages, volumes page, and all child track remote control pages.
