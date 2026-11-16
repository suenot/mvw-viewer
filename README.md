# mvw-viewer

Local viewer over the warehouse (stdlib server, no build). Hover = preview, click = original/remake + prompt copy. Items sharing an id across `*-opus55` sources are merged.

```bash
PYTHONPATH=../mvw-core python3 -m mvw_viewer --port 8765
```

UI: SolidJS + Bun (`web/`). Rebuild into the Python package: `cd web && bun install && bun run build`. Dev server: `bun run dev` (proxies to the Python server on :8765).
