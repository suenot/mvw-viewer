import { LINEAR, type MotionSpec, type Point } from "../motion";

// Shared helpers of the motion-techniques visualizations: a seeded random generator, wobbly
// contours and a "stepped" animation that shows one drawing at a time.

/** A small deterministic generator (mulberry32): the same seed gives the same sequence. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (value: number) => Math.round(value * 10) / 10;

export function circlePoints(cx: number, cy: number, r: number, n = 36): Point[] {
  return Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r] as Point);
}

/** Move every point by up to `amp` in a seeded direction: one "drawing" of a contour. */
export function jitter(points: Point[], seed: number, amp: number): Point[] {
  const next = rng(seed);
  return points.map(([x, y]) => [x + (next() - 0.5) * 2 * amp, y + (next() - 0.5) * 2 * amp] as Point);
}

export function pathOf(points: Point[], close = true) {
  if (!points.length) return "";
  return `M${points.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")}${close ? "Z" : ""}`;
}

/** A closed wobbly circle, one drawing per seed. */
export function boilCircle(cx: number, cy: number, r: number, seed: number, amp: number, n = 36) {
  return pathOf(jitter(circlePoints(cx, cy, r, n), seed, amp));
}

/** A contour cut into short strokes with small gaps (as a path with several subpaths). */
export function brokenCircle(cx: number, cy: number, r: number, seed: number, amp: number, strokes = 7) {
  const next = rng(seed);
  const parts: string[] = [];
  const gap = 0.16;
  for (let s = 0; s < strokes; s += 1) {
    const a0 = (s / strokes) * Math.PI * 2 + gap * 0.5 * (next() + 0.4);
    const a1 = ((s + 1) / strokes) * Math.PI * 2 - gap * 0.5 * (next() + 0.4);
    const steps = 6;
    const pts: Point[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const a = a0 + ((a1 - a0) * i) / steps;
      pts.push([cx + Math.cos(a) * r + (next() - 0.5) * amp * 2, cy + Math.sin(a) * r + (next() - 0.5) * amp * 2]);
    }
    parts.push(pathOf(pts, false));
  }
  return parts.join("");
}

/**
 * Show one of `count` drawings at a time, `stepMs` each, looping. Drawing 0 is the resting
 * state (visible), the others rest hidden, so reduced motion shows a single clean drawing.
 */
export function stepped(index: number, count: number, stepMs: number, start = 0): MotionSpec {
  const eps = 0.00001;
  const lo = index / count;
  const hi = (index + 1) / count;
  const k: Keyframe[] = [];
  if (index > 0) k.push({ offset: 0, opacity: 0 }, { offset: lo - eps, opacity: 0 });
  k.push({ offset: lo, opacity: 1 });
  k.push({ offset: hi - eps, opacity: 1 });
  if (index < count - 1) k.push({ offset: hi, opacity: 0 }, { offset: 1, opacity: 0 });
  else k[k.length - 1] = { offset: 1, opacity: 1 };
  return { k, t: start, d: stepMs * count, e: LINEAR, i: Infinity };
}

export const hiddenStyle = { opacity: 0 } as const;
