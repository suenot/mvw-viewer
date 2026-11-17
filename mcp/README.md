# Warehouse MCP (read-only)

Lets an AI client search the video catalog (about 800 videos with the prompts that made them) and read the
motion-design technique articles. Nothing here writes data.

## Remote (nothing to install)

```bash
claude mcp add --transport http warehouse https://production-warehouse.suenot.com/mcp
```

Streamable HTTP, stateless, JSON replies. No sign-in; the data is public. Body is capped at 100 KB, lists at 50 rows.

## Local (stdio)

```bash
claude mcp add warehouse -- node /path/to/mvw-viewer/mcp/stdio.mjs
```

Needs Node 18+. Defaults to the public data. To use your own warehouse instead, build the index and point at it:

```bash
PYTHONPATH=../mvw-core python3 -m mvw_viewer --index /tmp/items.json
MVW_ITEMS=/tmp/items.json MVW_PAGES=web/public/techniques.json node mcp/stdio.mjs
```

`MVW_ITEMS` and `MVW_PAGES` accept a URL or a file path. `MVW_SITE` and `MVW_MEDIA` change the base URLs of the links.

## Tools

| Tool | Does |
| --- | --- |
| `search_videos` | words, category, tag, source, has_remake, paging; returns summaries |
| `get_video` | one video: full prompt, links to original, remake, poster, how and style docs |
| `get_video_doc` | the how or style markdown of a video |
| `list_filters` | categories, sources and tags with counts |
| `list_techniques` | all technique pages, the hub and the skills list |
| `get_technique` | one page as markdown |
| `search_techniques` | words over the articles, with a snippet |

## Plain JSON (no MCP)

- `https://production-warehouse.suenot.com/items.json` the catalog
- `https://production-warehouse.suenot.com/techniques.json` the articles as markdown
- `https://production-warehouse.suenot.com/llms.txt` where to look

## Layout

- `core.mjs` protocol and tools, no dependencies, no I/O of its own (one source of truth for both entries)
- `stdio.mjs` local entry; `vercel.mjs` remote entry
- `../scripts/sync-production.sh` builds the site and copies the function into `production-warehouse/api/`
  (`core.mjs` becomes `api/_core.mjs`, `vercel.mjs` becomes `api/mcp.mjs`). `/mcp` is rewritten to it in `vercel.json`.
