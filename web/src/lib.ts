// Production: VITE_MEDIA_BASE = media host (items.json + /media/*). Local: same origin, /api/items.
export const BASE: string = (import.meta.env.VITE_MEDIA_BASE || "").replace(/\/$/, "");
export const url = (p?: string | null) => (p ? BASE + p : p || "");

// VITE_ITEMS_URL lets the catalog come from a CDN-cached path (Vercel rewrite) while media stays on the media host.
const ITEMS: string = import.meta.env.VITE_ITEMS_URL || (BASE ? `${BASE}/items.json` : "/api/items");

// VITE_CATALOG_URL is the slim list (no prompts, about 23 KB gzipped) with ?id=<id> for one full item. Without it
// (local dev) the full items.json is the list.
export const CATALOG: string = import.meta.env.VITE_CATALOG_URL || "";

// A slow or flaky network is the usual failure, so try up to three times with a timeout instead of showing the first error.
async function getJson(src: string, ms: number) {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(src, { signal: ctl.signal });
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

export const loadItems = () => getJson(CATALOG || ITEMS, 25000);
// The full catalog (prompts included, 1 MB), fetched in the background when the user starts to search.
export const loadFull = () => getJson(ITEMS, 60000);
const full = new Map<string, any>();
// One item with its prompt and links. A slim item has the p flag; a full one is returned as it is.
export async function loadItem(item: any) {
  if (!CATALOG || !("p" in item)) return item;
  let f = full.get(item.id);
  if (!f) { f = await getJson(`${CATALOG}?id=${encodeURIComponent(item.id)}`, 20000); full.set(item.id, f); }
  return f;
}

export const loadText = async (p: string) => {
  const r = await fetch(url(p));
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};
