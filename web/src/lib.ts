// Production: VITE_MEDIA_BASE = media host (items.json + /media/*). Local: same origin, /api/items.
export const BASE: string = (import.meta.env.VITE_MEDIA_BASE || "").replace(/\/$/, "");
export const url = (p?: string | null) => (p ? BASE + p : p || "");

// VITE_ITEMS_URL lets the catalog come from a CDN-cached path (Vercel rewrite) while media stays on the media host.
const ITEMS: string = import.meta.env.VITE_ITEMS_URL || (BASE ? `${BASE}/items.json` : "/api/items");

// The catalog is one ~1 MB JSON (360 KB gzipped). A slow or flaky network is the usual failure, so try up to
// three times with a timeout instead of showing the first error.
export async function loadItems() {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 25000);
    try {
      const r = await fetch(ITEMS, { signal: ctl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      last = e;
      await new Promise((ok) => setTimeout(ok, 700 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw last instanceof Error ? last : new Error("network error");
}

export const loadText = async (p: string) => {
  const r = await fetch(url(p));
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};
