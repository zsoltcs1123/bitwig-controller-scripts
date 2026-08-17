# WigAI setup (this project)

WigAI exposes live Bitwig project structure to Cursor via MCP. Primary use here: pull track, device, scene, and clip information from an open project so the agent can document setup and link it to a suite in `./bitwig6/suites/`.

## What is installed

| Item | Location |
|------|----------|
| Bitwig extension (v0.10.1) | `%USERPROFILE%\Documents\Bitwig Studio\Extensions\WigAI.bwextension` |
| Pinned release copy | `./references/bitwig/wigai/WigAI-0.10.1.bwextension` |
| Project MCP config | `./.cursor/mcp.json` |

Upstream: https://github.com/fabb/WigAI/releases/tag/0.10.1

## Enable in Bitwig

1. Open Bitwig Studio with a project loaded.
2. Go to **Settings → Controllers → + Add**.
3. Select **fabb → WigAI MCP Server** and enable it.
4. Confirm the controller console shows something like `WigAI Extension Loaded`.
5. Default MCP endpoint: `http://localhost:61169/mcp` (configurable under WigAI **Network Settings** in preferences).

WigAI only serves MCP while Bitwig is running and the extension is enabled.

## Cursor MCP

Project-local config in `.cursor/mcp.json` uses a small stdio proxy because Cursor sends newer MCP client capabilities (`elicitation.form`) that WigAI 0.10.1 rejects.

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

`type: "stdio"` is required. Without it, Cursor may treat the server as HTTP and connect directly to WigAI, which triggers the `elicitation.form` error.

First-time setup for the proxy:

```bash
cd tools/wigai-mcp-proxy
npm install
```

After saving `.cursor/mcp.json`, reload Cursor or toggle the server under **Settings → Tools & MCP**. Bitwig must be open first.

If the port was changed in WigAI preferences, update `WIGAI_URL` in `.cursor/mcp.json`.

## Tools useful for project documentation

Read-only tools to describe project structure:

| Tool | Purpose |
|------|---------|
| `status` | Project overview, tempo, transport state |
| `list_tracks` | All tracks |
| `get_track_details` | One track: name, color, type, mute/solo, etc. |
| `list_devices_on_track` | Device chain on a track |
| `get_device_details` | Device name, type, parameters |
| `list_scenes` | Scene list |
| `get_clips_in_scene` | Clips in a scene per track |

Example agent workflow:

1. Open the Bitwig project you want documented.
2. Ask the agent to use WigAI MCP to read project structure.
3. Generate a suite README or project setup doc under `./bitwig6/suites/<suite-name>/`.

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
- Upstream fix: WigAI needs MCP Java SDK newer than 0.11.0.

**Tools return errors about selection**
- Some device parameter tools target the *selected* device. Structure tools (`list_tracks`, `list_devices_on_track`, etc.) do not require selection.

**Bitwig 6 beta**
- WigAI targets 5.2.7+. Test with your beta build and report issues upstream if the extension fails to load.

## Updating WigAI

1. Download the latest `WigAI.bwextension` from [releases](https://github.com/fabb/WigAI/releases).
2. Replace the file in `%USERPROFILE%\Documents\Bitwig Studio\Extensions\`.
3. Update the pinned copy under `./references/bitwig/wigai/` if you keep one locally.
4. Restart Bitwig.
