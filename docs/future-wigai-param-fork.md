# Future: WigAI parameter access fork / PR

Status: **not pursuing now** — reference for a later attempt.

## Problem

WigAI device parameter tools use the 1-arg remote controls page:

```java
cursorDevice.createCursorRemoteControlsPage(8)
```

That page **follows the remote page selected in Bitwig’s UI**. MCP tool calls can fight parallel UI use and only see the currently focused page.

Tracked upstream: [WigAI issue #15](https://github.com/fabb/WigAI/issues/15) (opened by us).

## Fix (medium effort)

Same Bitwig Controller API pattern we already use in suite scripts — see `docs/important-concepts.md` and `bitwig6/suites/zsaudio/lcxl3-ar/lcxl3-ar.control.js`.

### Core API change

Use the 3-arg overload so the page is **independent of UI selection**:

```java
device.createCursorRemoteControlsPage(numParams, tagFilter, sectionName)
```

Tag filter matches remote pages tagged in the Bitwig GUI.

### Scope for a useful fork / PR

| Scope | Effort | Goal |
|-------|--------|------|
| Selected device, page-independent via tag | Small–medium | Stop fighting focused remote page |
| Any device by track index/name + device index | Medium | No `FOLLOW_SELECTION` dependency |
| Rename remote control slot labels | Small | API supports it; WigAI MCP does not expose it today |
| All internal plugin params without remote mapping | — | **Not possible** via Controller API |

WigAI today also returns empty remote controls for non-selected devices (`getDeviceRemoteControlsFromDevice()` — explicit design choice, not API limit).

### Rename remote control params (not in WigAI today)

WigAI can **read** slot names (`get_selected_device_parameters`, `get_device_details`) and **set values**, but has no rename tool.

The Bitwig API supports renaming via `RemoteControl.name()` → `SettableStringValue.set(...)`:

```java
page.getParameter(index).name().set("My Label");
```

Do not confuse with `setLabel()` — that is the hardware-mapping label in Bitwig’s learn UI, not the remote slot name on the page.

Same page-targeting caveats as value access: needs tagged remote page (3-arg overload) to rename without fighting UI page selection. Natural add-on for the fork: e.g. `rename_remote_control` MCP tool with `track`, `device`, `page_tag`, `index`, `name`.

### Likely touch points in WigAI

- `src/main/java/io/github/fabb/wigai/bitwig/BitwigApiFacade.java` — page creation, param read/write
- `src/main/java/io/github/fabb/wigai/features/DeviceController.java` — MCP tool layer
- MCP tools: extend `get_device_details`, `set_selected_device_parameter`, etc. with optional `page_tag` or track/device targeting; add rename via `RemoteControl.name().set(...)`

### Cursor MCP compatibility

WigAI 0.10.1 uses MCP Java SDK 0.11.0. Cursor sends `capabilities.elicitation.form` and rejects on direct HTTP.

This repo already works around that with `tools/wigai-mcp-proxy/` + `.cursor/mcp.json` (`type: "stdio"`). Keep that when testing a local WigAI build.

## Proposed path

1. Fork or clone [fabb/WigAI](https://github.com/fabb/WigAI)
2. Implement medium scope: target device by track + device index; tagged remote pages where provided
3. Build `.bwextension`, drop into `%USERPROFILE%\Documents\Bitwig Studio\Extensions\`
4. Test against a zsaudio project with tagged remote pages
5. If solid, open PR upstream referencing #15

## Test checklist

- [ ] Read params on tagged page while UI shows a different remote page
- [ ] Set param on tagged page without UI jumping
- [ ] Rename remote control slot via MCP (`name().set(...)`) on tagged page
- [ ] Target device by track name + device index without selecting it in GUI
- [ ] `get_device_details` returns remote controls for non-selected device
- [ ] Existing WigAI tools still work (transport, list_tracks, scenes)
- [ ] Cursor connects via project stdio proxy

## References

- [WigAI repo](https://github.com/fabb/WigAI)
- [WigAI issue #15](https://github.com/fabb/WigAI/issues/15)
- Local setup: `docs/wigai-setup.md`
- MCP landscape: `docs/bitwig-mcp-landscape.md`
