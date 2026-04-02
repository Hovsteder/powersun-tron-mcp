#!/usr/bin/env node
/**
 * Stdio-to-HTTP proxy for Glama server inspection.
 * Maintains a session with the remote PowerSun MCP server (Streamable HTTP).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const REMOTE_URL = process.env.MCP_REMOTE_URL || "https://powersun.vip/mcp";
let sessionId = null;

function parseSSE(text) {
  const lines = text.split("\n").filter(l => l.startsWith("data: "));
  if (lines.length > 0) {
    return JSON.parse(lines[lines.length - 1].slice(6));
  }
  return JSON.parse(text);
}

async function fetchRemote(method, params = {}, id = 1) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  const res = await fetch(REMOTE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;

  const text = await res.text();
  const json = parseSSE(text);
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function main() {
  // Initialize remote session
  await fetchRemote("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "powersun-proxy", version: "1.0.0" },
  });

  // Send initialized notification
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  await fetch(REMOTE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
  });

  // Fetch tools to cache them
  const remoteTools = await fetchRemote("tools/list", {}, 2);
  console.error(`Fetched ${(remoteTools.tools || []).length} tools from remote`);

  // Create local stdio server
  const server = new Server(
    { name: "powersun", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return remoteTools;
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await fetchRemote("tools/call", {
      name: request.params.name,
      arguments: request.params.arguments,
    }, 3);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
