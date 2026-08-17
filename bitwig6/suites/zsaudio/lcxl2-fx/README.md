# lcxl2-fx for Novation Launch Control XL

**lcxl2-fx** transforms the Novation Launch Control XL into a dedicated performance controller for a 4-track FX setup in Bitwig Studio. It focuses on Chain Switching, Performance Remote Controls, and Feedback routing.

## Bitwig Project Setup

For this script to function correctly, your project needs a specific Effect Track structure:

1.  **Effect Tracks 1, 2, & 3**: The script targets the first three Effect Tracks in your project.
2.  **Last Effect Track**: The script also targets the *absolute last* Effect Track in your project (often used for Master FX or Bus processing).
3.  **Devices & Chains**: 
    *   The primary device on each of these tracks should be a container (e.g., **FX Selector**, **Chain Selector**) with up to 4 chains.
    *   Remote Control Pages should be tagged **`perf`** on these devices.

## Controller Usage

### 1. Chain Selection (Bottom Buttons)
The bottom 16 buttons provide exclusive chain switching for the primary device on each track.
*   **Columns 1-2 (Green)**: FX Track 1 (Chains 1-4)
*   **Columns 3-4 (Orange)**: FX Track 2 (Chains 1-4)
*   **Columns 5-6 (Amber)**: FX Track 3 (Chains 1-4)
*   **Columns 7-8 (Red)**: Last FX Track (Chains 1-4)

**LED Feedback:**
*   **High Brightness**: Currently selected chain.
*   **Low Brightness**: Chain exists/available.
*   **Off**: Empty slot.

### 2. Performance Knobs (Left Side)
The first 4 knobs of each row control the **`perf`** Remote Control page of the respective track's device.

*   **Top Row (1-4)**: FX Track 1 `perf` controls.
*   **Middle Row (1-4)**: FX Track 2 `perf` controls.
*   **Bottom Row (1-4)**: FX Track 3 `perf` controls.

### 3. Sends & Feedback (Right Side)
The last 3 knobs of each row control Sends for the FX tracks themselves (useful for dub delays or feedback loops).

*   **Knobs 6, 7, 8 (Top)**: Send 1 Level for FX Tracks 1, 2, 3.
*   **Knobs 6, 7, 8 (Mid)**: Send 2 Level for FX Tracks 1, 2, 3.
*   **Knobs 6, 7, 8 (Bot)**: Send 3 Level for FX Tracks 1, 2, 3.

### 4. Faders
*   **Faders 1-5**: Control parameters 1-5 on the **Last FX Track's** primary device `perf` page.
*   **Faders 6-8**: Volume control for FX Tracks 1, 2, and 3.
