# Future: Gilligan + Skipper (programmatic MIDI sequencer)

Status: **not pursuing now** — reference for a later look.

## What it is (in one line)

**Gilligan** = Bitwig hub (Java extension + REST/MCP). **Skipper** = per-track CLAP plugin that plays staged MIDI loops on the beat. **AI or any script** drives it via CLI — not full DAW control.

## Architecture

```
AI / script / automation
        │
        ▼  python tools/gilligan.py  (preferred over MCP in upstream project)
Gilligan  REST API  http://localhost:61170/api
        │
        ├── transport, tracks, snapshot, stage programs
        │
        ▼
Skipper (one instance per track, before instrument)
        │
        ▼  MIDI note output
   Synth / drums / etc.
```

Skipper does **not** control Bitwig globally. It **generates MIDI** downstream, looped and grid-locked on the audio thread.

## What Skipper does

- Reads transport (tempo, position, play/stop, loop)
- Reads track name/color (CLAP `track-info`)
- Loads a **program** (JSON: up to 256 notes, bar length, pitch/velocity/timing)
- While playing: emits NoteOn/NoteOff sample-accurately, loops program to beat grid
- Registers with Gilligan on init (UUID ↔ track mapping)
- GUI tabs: Live / Program / Info (monitoring)

Programs usually come from **ABC notation** → validated → staged:

```bash
python tools/gilligan.py workflow --track Bass --abc 'C, G, E, G, |'
```

Staging writes `/tmp/skipper/{TrackName}.json` and notifies Gilligan REST API.

## What Gilligan does (beyond Skipper)

- Transport: play, stop, record, tempo, time signature
- Tracks: list, create, rename, project snapshot
- Program staging + commit timing (`next_bar`, etc.)
- Reload Skipper on a track (toggle enabled / program change)
- MCP server at `http://localhost:61170/sse` — **upstream prefers CLI over MCP**

Useful CLI commands (from upstream `tools/gilligan.py`):

| Command | Purpose |
|---------|---------|
| `play` / `stop` | Transport |
| `tracks` | List tracks (shows Skipper presence) |
| `snapshot` | Full project snapshot |
| `workflow --track X --abc '...'` | Validate ABC → stage program |
| `song <name>` | Load multi-track song from `songs/` library |
| `songs` | List available songs |

## Gilligan vs WigAI (for us)

| | WigAI | Gilligan + Skipper |
|--|-------|---------------------|
| Read project structure | Strong (MCP) | Snapshot via REST/CLI |
| Device / scene detail | Good | Minimal |
| Parameter control | Limited (see `future-wigai-param-fork.md`) | None |
| Write MIDI patterns on grid | No | **Yes** (Skipper) |
| Beat-accurate commits | No | **Yes** |

WigAI fits **documenting suite setup** and reading live project state. Gilligan/Skipper fits **generative / programmatic sequencing** driven by CLI.

## Interest for this repo

Not a replacement for controller scripts or WigAI introspection. Interesting as:

- CLI-driven MIDI loop engine per track
- “DJ mode” / genre cycling via staged programs
- Beat-synced multi-track program commits (thing extensions cannot do from main thread)

## If we try it later

Requirements (upstream):

- Bitwig 5.2.7+ (API 19)
- Java 21+, Maven (Gilligan)
- Rust + `cargo xtask` (Skipper)
- AGPL-3.0 license on both components

Build:

```bash
# Skipper — Bitwig loads from target/bundled/
cargo xtask bundle skipper

# Gilligan — installs to ~/Documents/Bitwig Studio/Extensions/
cd gilligan && mvn install
```

Enable: **Settings → Controllers → Audio Forge RS → Gilligan**

Cursor would need same MCP compatibility story as WigAI (SDK 0.11.0, `elicitation.form`) if connecting via MCP — or drive **`gilligan.py` CLI** from the agent instead (upstream’s preferred path).

## Maturity (as of early 2026)

- Early project (~Jan 2026), low stars, build-from-source only
- No Bitwig 6 claim
- Good docs: [Understanding Bitwig Development](https://github.com/audio-forge-rs/skipper/blob/main/docs/UNDERSTANDING-BITWIG-DEVELOPMENT.md)

## References

- [audio-forge-rs/skipper](https://github.com/audio-forge-rs/skipper) (Gilligan lives in `gilligan/` subfolder)
- [WigAI](https://github.com/fabb/WigAI) — inspired Gilligan’s MCP approach
- Local WigAI setup: `docs/wigai-setup.md`
- MCP comparison: `docs/bitwig-mcp-landscape.md`
