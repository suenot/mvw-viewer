import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Built files go straight into the Python package so `python -m mvw_viewer` serves them.
export default defineConfig({
  plugins: [solid()],
  build: { outDir: "../mvw_viewer/static", emptyOutDir: true },
  server: { proxy: { "/api": "http://127.0.0.1:8765", "/media": "http://127.0.0.1:8765" } },
});
