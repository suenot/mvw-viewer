#!/usr/bin/env bash
# Build the viewer for production and copy everything the live site needs into ../production-warehouse:
# the static site (index.html, assets, llms.txt, techniques.json) and the remote MCP function (api/mcp.mjs).
# Then commit and push mvw-viewer and production-warehouse yourself; Vercel deploys on push.
set -euo pipefail
cd "$(dirname "$0")/.."
PW="${PW:-../production-warehouse}"
[ -d "$PW" ] || { echo "no $PW"; exit 1; }

(cd web && VITE_MEDIA_BASE=https://media.production-warehouse.suenot.com VITE_ITEMS_URL=/items.json bun run build)

rm -rf "$PW/assets"
cp -R mvw_viewer/static/assets "$PW/assets"
cp mvw_viewer/static/index.html mvw_viewer/static/llms.txt mvw_viewer/static/techniques.json "$PW/"

mkdir -p "$PW/api"
cp mcp/core.mjs "$PW/api/_core.mjs"
sed 's#"./core.mjs"#"./_core.mjs"#' mcp/vercel.mjs > "$PW/api/mcp.mjs"
echo "synced to $PW"
