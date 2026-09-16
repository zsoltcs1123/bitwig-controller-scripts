# WigAI MCP proxy

Stdio bridge between Cursor and WigAI's HTTP MCP endpoint.

Cursor advertises `capabilities.elicitation.form` during MCP initialize. WigAI / wigai-full can reject that field on a direct HTTP connection. This proxy strips unsupported client capabilities before forwarding.

## Setup

```bash
npm install
```

Configured from `.cursor/mcp.json` in the repo root.

## Environment

| Variable | Default |
|----------|---------|
| `WIGAI_URL` | `http://localhost:61169/mcp` |
