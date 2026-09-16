# Template: ZSAUDIO-MASCHINE

Bitwig project layout this suite targets. Track order is top to bottom.

Verified against the live project via MCP (2026-10-15). Project name: `Template: ZSAUDIO-MASCHINE-1`.

## Idea

One project holds multiple **songs** as vertical layers: linked **Instrument Selector** chains and clip banks across the deck tracks. Arranger view is not used. **Deck A** is the working deck; **Deck B** is planned.

Track **names** match the **hardware** that controls them (`XTM1`, `XTM2`, `NANO`, `MASCHINE`). What you put on each track (XO, Playbeat, Maschine kits, etc.) stays swappable; **shape** (selector + 8 chains, 8 loop channels, 8 Maschine outs) is what scripts assume.

## Deck vs project

**DECK A** is a **group track** (not a Drum Machine). It wraps the performance tracks and the deck’s send FX. All **deck-level** remote control pages (mixer faders, filters, sends UI) sit on **DECK A** itself.

| Scope | Tracks |
| --- | --- |
| **Deck A** | `DECK A` (group), `XTM1`, `XTM2`, `MASCHINE`, `FX1`, `FX2`, `FX3` |
| **NANO** | `NANO` (group), children `1` … `8` |
| **Project** | `Sidechain`, `Premaster`, `Master` |

**MASCHINE** stays one shared instance across future decks. **Premaster** and **Master** stay at project level (LCXL2 premaster, then master chain).

## Hardware

| Track | Controller |
| --- | --- |
| `XTM1`, `XTM2` | Behringer XTM (each track) |
| `NANO` | Korg nanoKONTROL2 |
| `DECK A` | Novation Launch Control XL 3 |
| `MASCHINE` | Maschine |
| `Premaster` (+ shared FX control where used) | Novation Launch Control XL 2 |

Controllers have no displays except Bitwig; sample/clip-based tracks keep a stable surface. Maschine is the live pattern editor; XTM/NANO tracks use Bitwig clips and chain switching, not in-clip editing from those controllers.

## Vertical layering

`XTM1` and `XTM2` each have an **Instrument Selector** with **8 chains**. Chain index is shared across the deck:

- Chain *n* on `XTM1` = chain *n* on `XTM2` = chain *n* on each **NANO** child’s Instrument Selector (when chain/bank link is used).

Up to **8 songs** per deck (one per chain/bank). Maschine layering is via Maschine project/instance switching (TBD).

## Routing

- **3 sends** per deck: `FX1`, `FX2`, `FX3` — each an **FX Selector** (swap FX mid-set).
- **Per-channel sends**: every channel on `XTM1`, `XTM2`, NANO children (`1`–`8`), and `MASCHINE` can hit sends individually (LCXL3 modes).
- **Deck mixer**: drums + groove + loops + 8 Maschine channels via LCXL3 on **DECK A** group remotes.

## Scenes

16 scenes: `Scene 1` … `Scene 16`.

## Tracks (MCP flat list)

| # | Name | Type | Primary device(s) |
| --- | --- | --- | --- |
| 0 | DECK A | group | FX Layer |
| 1 | XTM1 | instrument | Instrument Selector |
| 2 | XTM2 | instrument | Instrument Selector |
| 3 | MASCHINE | instrument | Drum Machine |
| 4 | Sidechain | audio | FX Layer |
| 5 | NANO | group | FX Layer |
| 6–13 | 1 … 8 | hybrid / audio | per track (often Instrument Selector among devices) |
| 14 | FX1 | effect | FX Selector |
| 15 | FX2 | effect | FX Selector |
| 16 | FX3 | effect | FX Selector |
| 17 | Premaster | effect | FX Selector |
| 18 | Master | master | metering, limiting |

(`FX Layer` appears after the primary device on several tracks; scripts target primaries, instrument matchers, or track remotes as documented per script.)

## XTM1 / XTM2 (was Main / Groove Drums)

Same layout on both tracks:

- **Instrument Selector** → active chain is an **8-channel sampler** (or equivalent rack).
- **8 chains**, **64 clip slots** (8 MIDI clips per chain).
- Clip bank follows the active chain:

| Chain | Clip slots (1-based) | Clip slots (0-based) |
| --- | --- | --- |
| 1 | 1–8 | 0–7 |
| 2 | 9–16 | 8–15 |
| … | … | … |
| 8 | 57–64 | 56–63 |

Clips launch on the **instrument track only** (not scene launch, not the parent group).

**Remote controls** (unchanged semantics):

- Instrument Selector `kill` (slot 1): active chain kill, tied to main fader behavior.
- Track `chainkill` (slots 1–8): per-chain kill; stable when the selector switches chains.
- Column/mixer inner tags (`mutes`, `m0`, `faders`, `vols`, `pans`, `eq`, `d1`–`d8`, etc.) as before on the selector and track.

## NANO (was Loops)

**Group track** with **FX Layer** only on the parent (no Drum Machine on the group). **8 flat child tracks** named `1` … `8`. Each child is a free channel: selector, sampler, VST, or audio.

**Remote controls** on the **NANO group track** (track remotes, not a device):

| Tag | Role (nanoKONTROL2) |
| --- | --- |
| `faders` | Faders 1–8 |
| `vols` | Knobs 1–8 |

Clip launcher grid and scenes are scoped to the NANO group’s children (`zsaudio-maschine-nano` README). Chain/bank link sets the active chain on each child’s instrument device (Instrument Selector when present).

XTM1 / XTM2 performance control: `zsaudio-maschine-xtm1` and `zsaudio-maschine-xtm2` READMEs (Behringer X-Touch Mini, tracks **XTM1** / **XTM2**).

## MASCHINE

**Drum Machine** primary for **8 outputs** from the Maschine plug-in. Patterns are played/edited on Maschine; Bitwig holds the multi-out mixer and deck routing. Same send/mixer treatment as the other 8-channel tracks.

## DECK A remotes

Deck mixer/filter/send/EQ pages are on the **DECK A group track** (track remotes, not a nested Drum Machine). Tag sets and LCXL3 mode mapping: `zsaudio-maschine-deck` README.
