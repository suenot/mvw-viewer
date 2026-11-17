---
title: "Use the warehouse from an AI: MCP and JSON"
label: "For AI"
order: 10
parent: "guides/ai-access"
summary: "Connect an AI assistant to the catalog of motion videos and prompts and to the technique articles through a read-only MCP server, or read the same data as plain JSON."
---

# Use the warehouse from an AI

An assistant can search the catalog (about 800 motion videos with the prompts that made them) and read the technique articles without opening this site. Everything is read-only and public: no sign-in, nothing to install for the remote server.

## Connect with MCP

The server speaks MCP over HTTP at one address:

```
https://production-warehouse.suenot.com/mcp
```

In Claude Code:

```bash
claude mcp add --transport http warehouse https://production-warehouse.suenot.com/mcp
```

Other clients that accept a server URL take the same address. A local server over stdio is also available (see below).

## What it can do

| Tool | Use it to |
| --- | --- |
| `search_videos` | Find videos by words, category, tag, source or whether a remake exists. Returns short summaries and pages through the results |
| `get_video` | Get one video: the full generation prompt, author, tags, and links to the original, the remake, the poster and the how and style documents |
| `get_video_doc` | Read the how or style document of a video as markdown |
| `list_filters` | List the categories, sources and tags, with counts |
| `list_techniques` | List the technique articles, the hub and the skills list |
| `get_technique` | Read one of those pages as markdown |
| `search_techniques` | Search the articles by words and get a snippet around each hit |

Questions that work well: "Find three.js shader videos and show me the prompt of the best one", "Which technique explains a speed ramp, and what are its numbers?", "List the categories in the video catalog".

## Plain JSON

If you would rather fetch the data yourself:

| Address | Contains |
| --- | --- |
| [/items.json](https://production-warehouse.suenot.com/items.json) | The catalog: one object per video with title, author, category, tags, the prompt and links to the videos and poster |
| [/techniques.json](https://production-warehouse.suenot.com/techniques.json) | Every technique article, the hub and the skills list, with a markdown body |
| [/llms.txt](https://production-warehouse.suenot.com/llms.txt) | A short guide for AI clients with these addresses and the page list |

A quick check from a terminal:

```bash
curl -s https://production-warehouse.suenot.com/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_videos","arguments":{"query":"shader","limit":3}}}'
```

## Run it locally

The same tools run as a local stdio server from the `mcp` folder of the [viewer repository](https://github.com/suenot/mvw-viewer/tree/main/mcp). It needs Node 18 or newer and can read your own copy of the warehouse instead of the public data.

```bash
claude mcp add warehouse -- node /path/to/mvw-viewer/mcp/stdio.mjs
```

## Limits

- Read-only: no tool changes data.
- A request body is capped at 100 KB and a list at 50 rows.
- Video files are not returned, only links to them.
