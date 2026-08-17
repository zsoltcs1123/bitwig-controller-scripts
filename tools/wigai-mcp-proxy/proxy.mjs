#!/usr/bin/env node

/**
 * Stdio MCP proxy for WigAI.
 *
 * Cursor sends capabilities.elicitation.form (MCP 2025-11-25), but WigAI 0.10.1
 * uses MCP Java SDK 0.11.0 and rejects that field with HTTP 400. This proxy
 * strips unsupported client capabilities before forwarding to WigAI.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const WIGAI_URL = process.env.WIGAI_URL ?? "http://localhost:61169/mcp";

function sanitizeClientMessage(message) {
  if (message?.method !== "initialize" || !message.params?.capabilities) {
    return message;
  }

  const capabilities = { ...message.params.capabilities };
  delete capabilities.elicitation;

  return {
    ...message,
    params: {
      ...message.params,
      capabilities,
    },
  };
}

function logError(prefix, error) {
  console.error(`[wigai-mcp-proxy] ${prefix}:`, error);
}

async function main() {
  const local = new StdioServerTransport();
  const remote = new StreamableHTTPClientTransport(new URL(WIGAI_URL));

  let localClosed = false;
  let remoteClosed = false;

  local.onmessage = (message) => {
    remote.send(sanitizeClientMessage(message)).catch((error) => {
      logError("local → remote", error);
    });
  };

  remote.onmessage = (message) => {
    local.send(message).catch((error) => {
      logError("remote → local", error);
    });
  };

  local.onclose = () => {
    if (remoteClosed) {
      return;
    }
    localClosed = true;
    remote.close().catch((error) => logError("remote close", error));
  };

  remote.onclose = () => {
    if (localClosed) {
      return;
    }
    remoteClosed = true;
    local.close().catch((error) => logError("local close", error));
  };

  local.onerror = (error) => logError("local transport", error);
  remote.onerror = (error) => logError("remote transport", error);

  await remote.start();
  await local.start();
}

main().catch((error) => {
  logError("fatal", error);
  process.exit(1);
});
