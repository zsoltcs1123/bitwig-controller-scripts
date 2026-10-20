# Template: ZSAUDIO-MASCHINE

Bitwig project layout this suite targets. Track order in the mixer is top to bottom; MCP `list_tracks` returns a **flat** list (group parent/child nesting is not shown).

Verified against the live project via MCP (2026-10-20). Project name: `zsaudio-maschine-3`.

## Idea

One project holds multiple **songs** as vertical layers: linked **Instrument Selector** chains and clip banks across the deck tracks. Arranger view is not used. **Deck A** is the working deck; **Deck B** is planned.

Track **names** match the **hardware** that controls them (`XTM1`, `XTM2`, `NANO`, `MASCHINE`). Instruments on each track (XO, Playbeat, Maschine kits, Chordjam, etc.) stay swappable; **shape** (selector + 8 chains, 8 loop channels, 8 Maschine outs) is what scripts assume.

## Deck vs project

**DECK A** is a **group track** (not a Drum Machine). It wraps the performance tracks and the deck’s send FX. Deck-level mixer remotes sit on the **DECK A group track** itself.

| Scope | Tracks |
| --- | --- |
| **Deck A** | `DECK A` (group), `XTM1`, `XTM2`, `MASCHINE`, `FX1`, `FX2`, `FX3` |
| **NANO** | `NANO` (group), children `1` … `8` |
| **Project** | `Sidechain`, `Premaster`, `Master` |

**MASCHINE** stays one shared instance across future decks. **Premaster** and **Master** stay at project level.

## Hardware

| Track | Controller | Script in this suite |
| --- | --- | --- |
| `XTM1`, `XTM2` | Behringer X-Touch Mini | `zsaudio-maschine-xtm1`, `zsaudio-maschine-xtm2` |
| `NANO` | Korg nanoKONTROL2 | `zsaudio-maschine-nano` |
| `DECK A` | Novation Launch Control XL 3 | `zsaudio-maschine-deck` |
| `MASCHINE` | Maschine | (Maschine; deck LCXL3 modes only) |
| `Premaster`, `Master` | — | No dedicated script in this suite yet |

**Premaster / LCXL2:** The older **ZSAudio** suite has [`../../zsaudio/lcxl2-fx/`](../../zsaudio/lcxl2-fx/) for Launch Control XL (FX-focused). It is **not** wired to this template’s Premaster track out of the box. Add a maschine-suite LCXL2 script later if you want Premaster on hardware.

Controllers have no displays except Bitwig; sample/clip-based tracks keep a stable surface. Maschine is the live pattern editor; XTM/NANO tracks use Bitwig clips and chain switching, not in-clip editing from those controllers.

## Remote control placement

Scripts match pages by **tag** (Bitwig remote page tag), not by page display name. Page names in the UI can differ from tags.

### Group tracks (`DECK A`, `NANO`)

| Host | Tags | Used for |
| --- | --- | --- |
| **Track** remotes on the group | `faders` | LCXL3 physical faders (DECK A); nanoKONTROL2 faders (NANO) |
| **Track** remotes | `vols` | nanoKONTROL2 knobs (NANO) |
| **Track** remotes | `m1`–`m8` | LCXL3 NANO filter/sends (modes 3, 11) only on **NANO** |
| **Track** remotes | `u1`–`u8` | LCXL3 EQ-DJ (mode 15, slots 1–3) and Util (mode 6, slots 5–7) on **NANO** |
| **Track** remotes | `pans` | LCXL3 Pan (mode 8) on **NANO** and **MASCHINE** group tracks (8 parameters) |
| **Track** remotes | `xtm1-mix`, `xtm2-mix`, `nano-mix`, `maschine-mix`, `fx1-mix`–`fx3-mix`, `master-mix`, `*-util`, `eq-gain`, `eq-freq`, `eq-q`, `comp`, `sidechain` | LCXL3 on **DECK A** (see deck README) |
| **Track** remotes | `p1`, `p2` | X-Touch Mini encoders 1–3 on **DECK A** (XTM1 / XTM2 scripts) |
| **Last device** on the group (usually **FX Layer**: Channel Strip Group, Channel Strip FX, or Channel Strip Deck) | `eq-gain`, `eq-freq`, `eq-q` | LCXL3 Group Control (mode 7) for **NANO** |

Do **not** put `m1`–`m8`, `u1`–`u8`, `faders`, or `vols` on a group’s **FX Layer** device if a script expects **track** remotes (nano + deck).

### Instrument tracks (`XTM1`, `XTM2`, `MASCHINE`)

| Host | Tags | Used for |
| --- | --- | --- |
| **Primary device** (Instrument Selector or Drum Machine) | `m0`, `mutes`, `kill`, `faders`, `vols`, `d1`–`d8`, `m1`–`m8` | X-Touch Mini; LCXL3 filter/sends/EQ-DJ on XTM/MASCHINE |
| **Primary device** | `pans` | LCXL3 Pan (mode 8) on **XTM1** and **XTM2** (8 parameters) |
| **Primary device** | `u1`–`u8` | LCXL3 EQ-DJ (mode 15, slots 1–3) and Util (mode 6, slots 5–7) on **MASCHINE** |
| **Track** remotes | `chainkill` | X-Touch Mini chain kill (XTM1 / XTM2) |
| **Last device** on the track (**FX Layer**) | `eq-gain`, `eq-freq`, `eq-q` | LCXL3 Group Control (mode 7) |

### Effect tracks (`FX1`–`FX3`, `Premaster`, …)

Last device is typically **FX Layer** or **FX Selector** + **FX Layer**; deck **mix** remotes on **DECK A** point at send/return macros, not at FX track devices.

## Vertical layering

`XTM1` and `XTM2` each have an **Instrument Selector** with **8 chains**. Chain index is shared across the deck:

- Chain *n* on `XTM1` = chain *n* on `XTM2` = chain *n* on each **NANO** child’s Instrument Selector (when chain/bank link is used).

Up to **8 songs** per deck (one per chain/bank). Maschine layering is via Maschine project/instance switching (TBD).

## Routing

- **3 sends** per deck: `FX1`, `FX2`, `FX3` — each an **FX Selector** (swap FX mid-set).
- **Per-channel sends**: every channel on `XTM1`, `XTM2`, NANO children (`1`–`8`), and `MASCHINE` can hit sends individually (LCXL3 modes).
- **Deck mixer**: drums + groove + loops + 8 Maschine channels via LCXL3 on **DECK A** group track remotes.

## Scenes

16 scenes: `Scene 1` … `Scene 16`.

## Tracks (MCP flat list)

| # | Name | Type | Device chain (typical) |
| --- | --- | --- | --- |
| 0 | DECK A | group | FX Layer |
| 1 | XTM1 | instrument | Instrument Selector → FX Layer |
| 2 | XTM2 | instrument | Instrument Selector → FX Layer |
| 3 | NANO | group | FX Layer |
| 4–11 | 1 … 8 | hybrid / audio | per channel (content swappable) |
| 12 | MASCHINE | instrument | Drum Machine → FX Layer |
| 13 | Sidechain | audio | FX Layer |
| 14 | FX1 | effect | FX Selector → FX Layer |
| 15 | FX2 | effect | FX Selector → FX Layer |
| 16 | FX3 | effect | FX Selector → FX Layer |
| 17 | Premaster | effect | FX Selector → Looperator |
| 18 | Master | master | mvMeter2 → Tool → MONO BASS → Peak Limiter → TDR Limiter 6 GE |

Mixer order can change; scripts resolve tracks **by name**.

## XTM1 / XTM2

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

**Remote controls:** Instrument Selector tags (`kill`, `m0`, `mutes`, `faders`, `vols`, `d1`–`d8`, …). Track `chainkill` (slots 1–8). Group Control parametric EQ on **last device** (`eq-gain`, `eq-freq`, `eq-q`). Details: `zsaudio-maschine-xtm1` / `xtm2` READMEs.

## NANO

**Group track** with **FX Layer** on the parent. **8 child tracks** named `1` … `8` (content varies per song).

**Group track** remotes: `faders`, `vols` (nano script); `m1`–`m8`, `u1`–`u8` (deck LCXL3).

**Group Control** (mode 7): `eq-gain`, `eq-freq`, `eq-q` on **last device** (FX Layer) on the **NANO** group track; DECK A `nano-util` params **5–7** on top row cols **6–8** when NANO is selected.

Clip launcher grid and scenes: `zsaudio-maschine-nano` README.

## MASCHINE

**Drum Machine** → **FX Layer**. LCXL3 uses primary device `m1`–`m8` and `u1`–`u8`; parametric EQ on **FX Layer**.

## DECK A remotes

All **track** remotes on the **DECK A** group track. Tag sets and LCXL3 modes: `zsaudio-maschine-deck` README and [`lcxl3/mode-map.md`](lcxl3/mode-map.md).

Deck level and mute macros may show unusual mixer values in MCP; live control uses remotes/macros as designed.
