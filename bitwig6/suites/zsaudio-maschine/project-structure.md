# Template: ZSAUDIO-MASCHINE

Bitwig project layout this suite targets. Track order is top to bottom.

Verified against the live project via MCP (2026-09-30).

## Overview

A hybrid production and live-performance template built around **vertical layering**: multiple songs coexist in one project, selected by Instrument Selector chains and clip banks across linked tracks. A **two-deck** layout is planned; only **Deck A** exists while the template is still in experimentation.

A **song** here means a set of MIDI patterns and instruments in Instrument Selector chains, plus the corresponding Maschine instance or project. The Arranger view is not used.

### Naming (current template, not a contract)

Track names (**Main Drums**, **Groove Drums**, **Loops**, **Maschine**) describe how *this* drum-heavy template is set up today. They do not define a permanent taxonomy; names may be generalized later.

What is fixed is **shape**, not **content**:

| Track | Shape in Bitwig | Typical content today (swappable) |
| --- | --- | --- |
| **Main Drums** | 8-channel sampler (Instrument Selector + 8 chains) | e.g. XLN XO |
| **Groove Drums** | 8-channel sampler (same layout) | e.g. XO, Playbeat, Loopmix, Bitwig DM |
| **Loops** | 8 Bitwig channels (Loops group + 8 children) | samplers, selectors, VSTs, audio |
| **Maschine** | 8-channel output (Drum Machine on track; Maschine as the instrument) | Maschine patterns and kits |

## Workflows

### Production

For a single song, use one deck and one vertical layer: chain *X* across Main Drums, Groove Drums, Loops, and Maschine. A project can hold one song or several, prepared on either deck by layering.

### Live

Two decks can each hold up to **8 songs** (one per chain/bank). Mix between decks like a traditional DJ setup, but with full control over every element of each song.

### Vertical layering

Main Drums and Groove Drums use Instrument Selectors with **8 chains** each. The chains are **connected across tracks**:

- Chain 1 on Main Drums = chain 1 on Groove Drums = bank 1 on those tracks = channel 1 on the Loops group.

This shared indexing lets you compose one song, several songs, or arrange a full set in one project. Maschine handles its own vertical layering via project or instance switching (TBD).

## Track roles

The control surface must stay **stable** during performance. None of the hardware controllers provide visual feedback except Bitwig itself, so you always need to know what a knob or fader controls. Sample-based tracks keep the same surface regardless of sound; VSTs and Bitwig instruments do not.

### Bitwig-owned vs Maschine

| | **Main Drums, Groove Drums, Loops** | **Maschine** |
| --- | --- | --- |
| Patterns | Predefined **MIDI clips** in Bitwig (launch/switch between patterns) | Maschine **patterns** (play, switch, record, edit on hardware) |
| Edit in performance | Pattern **content is not edited** from the suite; you switch clips/chains, not rewrite MIDI in the clip launcher | Full pattern workflow on Maschine (editable, switchable, etc.) |
| Role in the stack | Stable, layerable drum/loop foundation | Dynamic synths, kits, and the only track where pattern authoring happens live |

| Track | Role | Controller | Notes |
| --- | --- | --- | --- |
| **Main Drums** | Stable drum foundation (8 channels) | Behringer XTM | Bitwig MIDI patterns + 8-channel sampler chains. Deep drum shaping via XTM when needed; primary use is clip/chain switching. |
| **Groove Drums** | Groove and atmosphere (8 channels) | Behringer XTM | Same pattern model as Main Drums. Group/XTM interface for mix and tone; patterns stay in Bitwig clips. |
| **Loops** | Loops, oneshots, risers, glue (8 channels) | Korg nanoKONTROL2 | Eight Bitwig child channels; clip content is Bitwig-owned (switch, not edit from controllers). Faders and group remotes; no deep per-plugin UI on the nano by design. |
| **Maschine** | Dynamic instruments and patterns (8 channels) | Maschine | LED feedback. Patterns are playable, editable, and switchable on Maschine; highest dynamic range in the template. |
| **DECK A** | Deck-level mixing | Launch Control XL 3 | Faders, sends, filters for the deck group. |

Roles are documented here so future project ideas can be generated around them.

## Hardware

### Per deck (Deck A exists; Deck B planned)

| Function | Hardware |
| --- | --- |
| Main Drums | Behringer XTM |
| Groove Drums | Behringer XTM |
| Loops group | Korg nanoKONTROL2 |
| Mixer (faders, sends, filters) | Novation Launch Control XL 3 |

### Shared (across decks)

| Function | Hardware |
| --- | --- |
| Maschine | 1× Maschine |
| Send and master FX | 1× Novation Launch Control XL 2 |

## Routing

### Sends and premaster

- **3 sends** on the project, each an **FX Selector** so FX flavors can be swapped mid-performance.
- **Premaster**: all audio passes through before Master. Controlled via LCXL2 faders (5 parameters).

### Per-channel sends

**Main Drums**, **Groove Drums**, **Loops** (8 children), and **Maschine** each expose **8 channels**. Every channel can be sent individually to the 3 sends (e.g. kick only to a send). Controlled via LCXL3 modes.

### Deck mixer

A main mixer per deck is controlled via an LCXL3 mode plus faders: **drums + groove + loops + 8 Maschine channels**. Maschine channels can also be driven to sends from this mixer.

## Scenes

16 scenes: `Scene 1` … `Scene 16`.

## Tracks

Top-level track list (MCP-verified):

| # | Name | Type | Device(s) |
| --- | --- | --- | --- |
| 0 | DECK A | group | Drum Machine |
| 1 | Main Drums | instrument | Instrument Selector |
| 2 | Groove Drums | instrument | Instrument Selector |
| 3 | Loops | group | Drum Machine |
| 4 | Maschine | instrument | Drum Machine (8-out; Maschine as source) |
| 5 | Reverb | effect | FX Selector, FX Layer |
| 6 | Filter Delay | effect | FX Selector, FX Layer, mvMeter2 |
| 7 | Delay | effect | FX Selector, FX Layer |
| 8 | Premaster | effect | FX Selector |
| 9 | Master | master | Compressor, mvMeter2, Tool, MONO BASS, Peak Limiter |

## Main Drums track layout

The **Main Drums** track uses an **Instrument Selector** as its primary device. Each active chain is an **8-channel sampler** (drum rack / equivalent).

- **8 chains** (racks 1–8). Active chain is selected in Bitwig or on the hardware.
- **64 clip slots**: 8 MIDI clips per chain (8 × 8 grid).
- **Clip banks** follow the active Instrument Selector chain:

| Chain (rack) | Clip slots (1-based) | Clip slots (0-based) |
| --- | --- | --- |
| 1 | 1–8 | 0–7 |
| 2 | 9–16 | 8–15 |
| 3 | 17–24 | 16–23 |
| 4 | 25–32 | 24–31 |
| 5 | 33–40 | 32–39 |
| 6 | 41–48 | 40–47 |
| 7 | 49–56 | 48–55 |
| 8 | 57–64 | 56–63 |

Clips launch on the **Main Drums track only** (not scene launch, not the parent group).

**Remote controls:**

- Instrument Selector `kill` (slot 1): active chain kill, driven by the main fader.
- Main Drums track `chainkill` (slots 1–8): one kill per drum rack chain. Mode B uses these on chain swap. Track remotes stay stable when the Instrument Selector switches chains.

## Groove Drums track layout

The **Groove Drums** track mirrors Main Drums: **Instrument Selector**, **8-channel sampler** per chain, 8 chains, 64 clip slots (8 × 8 grid), same clip-bank mapping and remote control tags (`kill`, `chainkill`, `mutes`, `m0`, `faders`, `vols`, `pans`, `eq`, `d1`–`d8`).

Clips launch on the **Groove Drums track only**.

## Loops group layout

The **Loops** group uses a **Drum Machine** as its primary device with **8 output channels**.

**8 flat child tracks** (no nested Drum Machine). Each child is a free Bitwig channel: Instrument Selector, sampler, VST, audio loop, or any other content. All 8 channels are used.

**Remote controls** on the **Loops** group Drum Machine (primary device):

| Tag | Role |
| --- | --- |
| `p0` | Knobs 1–8 |
| `vols` | Faders 1–8 |

### Script note

The `zsaudio-maschine-loops` script (nanoKONTROL2) still targets the old layout: 5 children, nested DM Drum Machine, and non-linear Korg column mapping. **Update pending** for the flat 8-child structure.

## Maschine track layout

The **Maschine** track uses a **Drum Machine** as its primary Bitwig device for **8 output channels**, fed by the Maschine plug-in (routing as configured in the project). Pattern play, switch, and edit happen on **Maschine**; Bitwig holds the multi-out mixer surface and deck routing.

Per-channel sends and deck mixer treat Maschine like the other 8-channel drum tracks (see **Per-channel sends** and **Deck mixer**).

## Project parameters

`R1`, `R2`, `R3`
