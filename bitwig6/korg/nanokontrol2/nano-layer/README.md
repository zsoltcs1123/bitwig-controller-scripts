# nano-layer for Korg nanoKONTROL2

**nano-layer** is a simple parameter controller for the Korg nanoKONTROL2, pinned to a group track with up to 8 child tracks.

## Bitwig Project Setup

1. **Group Track**: Must be the **first track** (Track 1) in your project.
2. **Child Tracks**: Place up to 8 tracks inside the group.
3. **Remote Control Pages**:
   - On the **Group Track**: create two pages tagged **`perform`** (8 params) and **`fx`** (8 params).
   - On each **child track's primary device**: create a page tagged **`layers`** (3 params).

## Controls

| Control | Target |
|---|---|
| **Knobs 1-8** | Group track `perform` page (params 1-8) |
| **Faders 1-8** | Group track `fx` page (params 1-8) |
| **S button (per track)** | Child track device `layers` param 1 |
| **M button (per track)** | Child track device `layers` param 2 |
| **R button (per track)** | Child track device `layers` param 3 |

All other buttons are unassigned.
