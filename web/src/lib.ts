// Production: VITE_MEDIA_BASE = media host (items.json + /media/*). Local: same origin, /api/items.
export const BASE: string = (import.meta.env.VITE_MEDIA_BASE || "").replace(/\/$/, "");
export const url = (p?: string | null) => (p ? BASE + p : p || "");

// VITE_ITEMS_URL lets the catalog come from a CDN-cached path (Vercel rewrite) while media stays on the media host.
const ITEMS: string = import.meta.env.VITE_ITEMS_URL || (BASE ? `${BASE}/items.json` : "/api/items");

export async function loadItems() {
  const r = await fetch(ITEMS);
  if (!r.ok) throw new Error(`items: HTTP ${r.status}`);
  return r.json();
}

export const loadText = async (p: string) => {
  const r = await fetch(url(p));
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};
