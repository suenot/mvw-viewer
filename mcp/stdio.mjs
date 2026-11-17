#!/usr/bin/env node
// Local MCP server over stdio (newline-delimited JSON-RPC). Read-only.
//   claude mcp add warehouse -- node /path/to/mvw-viewer/mcp/stdio.mjs
// Env: MVW_ITEMS (URL or file, default the public items.json), MVW_PAGES (URL or file, default the public techniques.json).
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { createServer, fetchTextLimited, makeLoaders } from "./core.mjs";

const SITE = process.env.MVW_SITE || "https://production-warehouse.suenot.com";
const MEDIA = process.env.MVW_MEDIA || "https://media.production-warehouse.suenot.com";
const { loadItems, loadPages } = makeLoaders({
  itemsSrc: process.env.MVW_ITEMS || `${MEDIA}/items.json`,
  pagesSrc: process.env.MVW_PAGES || `${SITE}/techniques.json`,
  readFile,
});
const mcp = createServer({ loadItems, loadPages, mediaBase: MEDIA, siteBase: SITE, fetchText: fetchTextLimited });

const send = (m) => process.stdout.write(JSON.stringify(m) + "\n");
const rl = createInterface({ input: process.stdin });
rl.on("line", async (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }); }
  const reply = await mcp.handle(msg);
  if (reply !== undefined) send(reply);
});
