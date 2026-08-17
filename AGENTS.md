# AGENTS.md

This is a repository for custom made Bitwig Controller Scripts for hardware controllers made by various companies like Novation, Korg or Behringer.
All Controller Scripts are written using Javascript.
There is no runtime - this folder is scanned by Bitwig and I test script functionality directly in Bitwig.

## Bitwig API

Bitwig provides a powerful API to interact with from the scripts. 
You can find the full documentation in `./references/bitwig/bitwig-6-api-documentation.md`.
When you are developing scripts, always consult the documentation.

## Bitwig versions

Bitwig is currently transitioning to version 6 which is currently in Beta. 
The corresponding API version is 25.  
All new scripts are targeting this version. You can largely ignore the `bitwig5` folder - it will be removed upon the stable release.

## Bitwig documentation

Bitwig 6 (the DAW itself) doesn't have the full documentation yet. 
Until it is released we'll use the Bitwig 5 documentation at `./docs/bitwig-5-documentation`.
You can refer to this file when I ask something specific about the DAW itself and not the API.

## Coding style 

- Prefer clean, concise and simple code.

## Script files

A script consist of two files: a `.control.js` file which contains the code, and a `package.json` file.

## Folder structure

Scripts live under `./bitwig6/` in one of two layouts:

**Suites** — scripts for different devices used together in one Bitwig project:

```
./bitwig6/suites/<suite-name>/<script-name>/
```

For example, the ZSAudio suite:

```
./bitwig6/suites/zsaudio/
├── README.md
├── xtm-sampler/xtm-sampler-1/
├── lcxl2-fx/
└── lcxl3-ar/
```

**Standalone** — scripts for a single controller, no manufacturer grouping:

```
./bitwig6/standalone/<script-name>/
```

Device reference material (MIDI maps, user guides, manuals) lives under:

```
./references/<manufacturer>/<device>/
```

For example, Launch Control XL 3 reference docs are at `./references/novation/lcxl3/`.

## Commits

Light conventional commits. One line only — no body.

```
<type>(<scope>): <subject>
```

**Types** (what kind of change):

| type | use for |
|------|---------|
| `script` | controller scripts in `bitwig6/` or `bitwig5/` (`.control.js`, `package.json`, script README, suite README) |
| `ref` | reference material — MIDI maps, user guides, manuals under `references/<manufacturer>/<device>/` |
| `docs` | documentation — API docs, DAW docs, concepts, specs in `docs/`, `projects/`, `ideas.md` |
| `example` | third-party or sample scripts in `examples/` |
| `repo` | `AGENTS.md`, Cursor commands, folder layout |
| `fix` | bug fix in an existing script |
| `move` | rename or reorganize without editing content |

**Scope** (optional): manufacturer/controller or script name — e.g. `novation/lcxl3`, `lcxl3-ar`, `behringer/xtm`, `nano-launch`.

**Subject**: imperative, lowercase, no trailing period, under ~72 characters.

**Body**: never. Subject only.


