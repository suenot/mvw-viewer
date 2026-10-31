import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...a) => twMerge(clsx(a));

// Production: VITE_MEDIA_BASE = media host (items.json + /media/*). Local: same origin, /api/items.
export const BASE = (import.meta.env.VITE_MEDIA_BASE || "").replace(/\/$/, "");
export const url = (p) => (p ? BASE + p : p);

export async function loadItems() {
  const r = BASE ? await fetch(`${BASE}/items.json`) : await fetch("/api/items");
  if (!r.ok) throw new Error(`items: HTTP ${r.status}`);
  return r.json();
}
