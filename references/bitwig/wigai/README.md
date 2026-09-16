# WigAI reference

Bitwig extension that embeds an MCP server.

This project uses **[wigai-full](https://github.com/glassdimly/wigai-full)** (fork of [fabb/WigAI](https://github.com/fabb/WigAI)) until upstream [PR #21](https://github.com/fabb/WigAI/pull/21) merges. Same extension ID, name, and default MCP port as stock WigAI.

- **Fork:** https://github.com/glassdimly/wigai-full
- **Pinned version:** 0.16.0
- **Release:** https://github.com/glassdimly/wigai-full/releases/tag/0.16.0
- **Agent workflows:** https://github.com/glassdimly/wigai-full/blob/main/docs/AGENT-GUIDE.md

## Install

Copy `WigAI-0.16.0.bwextension` (download from the release above) to:

```
%USERPROFILE%\Documents\Bitwig Studio\Extensions\WigAI.bwextension
```

Restart Bitwig, enable **fabb → WigAI MCP Server** under Controllers, then use `./.cursor/mcp.json`.

Setup details: [`../../../docs/wigai-setup.md`](../../../docs/wigai-setup.md)
