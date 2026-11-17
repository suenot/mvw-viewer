# mvw-viewer

Local viewer over the warehouse (stdlib server, no build). Hover = preview, click = original/remake + prompt copy. Items sharing an id across `*-opus55` sources are merged.

```bash
PYTHONPATH=../mvw-core python3 -m mvw_viewer --port 8765
```

UI: SolidJS + Bun (`web/`). Rebuild into the Python package: `cd web && bun install && bun run build`. Dev server: `bun run dev` (proxies to the Python server on :8765).

Techniques and Skills pages: articles live in `web/content/*.md`, rendered by `scripts/build-content.mjs` (run by `bun run build`); demos are in `web/src/techniques/viz/`.
Static build for production-warehouse.suenot.com (the catalog needs these two variables, otherwise it requests `/api/items`):
`VITE_MEDIA_BASE=https://media.production-warehouse.suenot.com VITE_ITEMS_URL=/items.json bun run build`, then copy `mvw_viewer/static/{index.html,assets}` into the `production-warehouse` repo.

## AI access

Read-only MCP server (remote and stdio) and plain JSON: see [`mcp/README.md`](mcp/README.md).
