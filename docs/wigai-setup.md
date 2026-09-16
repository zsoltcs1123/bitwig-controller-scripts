# WigAI setup (this project)

WigAI exposes live Bitwig project structure and editing to Cursor via MCP. Primary uses here: document suite templates from an open project, validate remote mappings, and (with care) create or change clips, tracks, and parameters.

## What is installed

| Item | Location |
|------|----------|
| Bitwig extension (wigai-full **0.16.0**) | `%USERPROFILE%\Documents\Bitwig Studio\Extensions\WigAI.bwextension` |
| Local release copy (gitignored) | `./references/bitwig/wigai/WigAI-0.16.0.bwextension` |
| Project MCP config | `./.cursor/mcp.json` |

**Source:** [glassdimly/wigai-full](https://github.com/glassdimly/wigai-full) — drop-in fork of [fabb/WigAI](https://github.com/fabb/WigAI) with project-editing tools ([PR #21](https://github.com/fabb/WigAI/pull/21)). Upstream is archived; releases come from the fork until merge.

After replacing the extension, **restart Bitwig** and toggle WigAI off/on in **Settings → Controllers**.

## Enable in Bitwig

1. Open Bitwig Studio with a project loaded.
2. Go to **Settings → Controllers → + Add** (or re-enable existing WigAI).
3. Select **fabb → WigAI MCP Server** and enable it.
4. Confirm the controller console shows something like `WigAI Extension Loaded`.
5. Default MCP endpoint: `http://localhost:61169/mcp` (configurable under WigAI **Network Settings** in preferences).

WigAI only serves MCP while Bitwig is running and the extension is enabled.

Confirm version from MCP: call `status` and check `wigai_version` (expect **0.16.0** or newer fork release).

## Cursor MCP

Project-local config in `.cursor/mcp.json` uses a small stdio proxy because Cursor may send MCP client capabilities (`elicitation.form`) that the extension’s MCP stack still rejects on direct HTTP.

```json
{
  "mcpServers": {
    "wigai": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}${/}tools${/}wigai-mcp-proxy${/}proxy.mjs"],
      "env": {
        "WIGAI_URL": "http://localhost:61169/mcp"
      }
    }
  }
}
```

`type: "stdio"` is required. Without it, Cursor may connect directly to WigAI and hit initialize errors.

First-time setup for the proxy:

```bash
cd tools/wigai-mcp-proxy
npm install
```

After saving `.cursor/mcp.json`, reload Cursor or toggle the server under **Settings → Tools & MCP**. Bitwig must be open first.

If the port was changed in WigAI preferences, update `WIGAI_URL` in `.cursor/mcp.json`.

## Tools (overview)

Roughly **90+** tools. Legacy read/transport tools from stock WigAI still exist; wigai-full adds editing and discovery. Full workflows: [wigai-full AGENT-GUIDE](https://github.com/glassdimly/wigai-full/blob/main/docs/AGENT-GUIDE.md).

### Documentation and inspection (safe on real templates)

| Tool | Purpose |
|------|---------|
| `status` | Version, project name, transport, selection |
| `list_tracks` | All tracks (optional type filter) |
| `get_track_details` | One track by index/name/selection |
| `get_track_mixer` | Volume, pan, sends, mute/solo/arm |
| `list_devices_on_track` | Device chain on a track |
| `get_device_details` | Device state, remote pages (when applicable) |
| `get_device_parameters` | All remote-control pages on a device **without** changing selection |
| `get_device_chains` | Chains/slots (Vocoder, layers, etc.) |
| `list_scenes` / `get_clips_in_scene` | Scene and clip layout |
| `list_installed_devices` | Bitwig devices + scanned plugins |
| `describe_device` / `fetch_device_docs` | Device knowledge catalog |
| `project_state` | Project-wide solo/mute/arm state |

### Playback and light control

| Tool | Purpose |
|------|---------|
| `transport_start` / `transport_stop` | Transport |
| `set_transport` / `set_transport_options` | Tempo, loop, metronome, record modes, etc. |
| `session_launchSceneByIndex` / `session_launchSceneByName` | Launch scene |
| `launch_clip` | Launch clip on a track |
| `next_project` / `previous_project` | Cycle open project tabs |

### Editing (use on copies or empty projects)

Tracks and mixer: `create_track`, `delete_track`, `duplicate_track`, `set_track`, `set_send`, …

Devices: `insert_device`, `copy_device`, `move_device`, `delete_device`, `set_device_parameters`, browser/preset tools, drum pads and layers.

Clips and notes: `create_clip`, `write_notes`, `read_notes`, `edit_notes`, `insert_file`, scene/clip copy/move/duplicate, …

Actions: `list_actions`, `invoke_action`, `undo`, `redo`.

Live change: `get_events`, `watch` (stream changes while a call runs).

**API gaps:** no audio/MIDI routing or sidechain setup, no arranger timeline placement, no read/write of remote-control **page tags** (filter-by-tag only in Bitwig API). See fork [ROADMAP.md](https://github.com/glassdimly/wigai-full/blob/main/ROADMAP.md).

### Example agent workflows

1. **Suite doc:** Open template → read tracks, devices, remotes → update `./bitwig6/suites/<suite-name>/project-structure.md`.
2. **Mapping check:** `get_device_parameters` on `DECK A` / `XTM1` without touching UI selection.
3. **Experiment:** Duplicate the `.bwproject` file → agent edits clips or devices → you validate → merge ideas manually into the template.

## Troubleshooting

**Cursor shows WigAI as disconnected**

- Bitwig is not running, or WigAI is not enabled.
- Proxy dependencies not installed — run `npm install` in `tools/wigai-mcp-proxy/`.
- Wrong port in `WIGAI_URL`.
- Windows Firewall blocked Bitwig on first run — allow private network access.

**HTTP 400 / `Unrecognized field "form"` / SSE error**

- Cursor is connecting directly to WigAI instead of the stdio proxy.
- Check `.cursor/mcp.json` includes `"type": "stdio"`.
- Disable or remove any global `wigAi` URL entry in `%USERPROFILE%\.cursor\mcp.json` if you added one.
- Toggle WigAI off/on in **Settings → Tools & MCP**, or restart Cursor.

**`status` still shows 0.10.1**

- Extension file not replaced, or Bitwig not restarted after copy.
- Confirm `%USERPROFILE%\Documents\Bitwig Studio\Extensions\WigAI.bwextension` size ~8.5 MB (0.16.0).

**Tools return errors about selection**

- Older tools (`get_selected_device_parameters`, `set_selected_device_parameter`) still target the **selected** device only. Prefer `get_device_parameters` / `set_device_parameters` with track + device context.

**Bitwig 6 beta**

- Fork tested on Bitwig 6.1.3 (Linux) for live scripts; extension API 19. Report fork issues on [wigai-full](https://github.com/glassdimly/wigai-full/issues).

## Updating wigai-full

1. Download `WigAI.bwextension` from [wigai-full releases](https://github.com/glassdimly/wigai-full/releases).
2. Replace `%USERPROFILE%\Documents\Bitwig Studio\Extensions\WigAI.bwextension`.
3. Optionally save a versioned copy as `./references/bitwig/wigai/WigAI-<version>.bwextension` (gitignored).
4. Update this doc and `references/bitwig/wigai/README.md` pinned version.
5. Restart Bitwig; confirm `status.wigai_version`.
