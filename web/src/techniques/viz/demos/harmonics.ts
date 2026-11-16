// Small helpers for the harmonic-shape, clock and camera demos. The harmonic part follows the
// package in suenot/curves (packages/harmonic-shapes): a closed contour is a list of complex
// coefficients c_k, point(t) = sum c_k * exp(i 2 pi k t), t in [0, 1).

import type { MotionSpec } from "../motion";

export type Pt = [number, number];
export type Harmonic = { k: number; re: number; im: number };
const TAU = 2 * Math.PI;

/** Resample a closed polygon to n points spaced evenly by arc length. */
export function resampleClosed(poly: Pt[], n: number): Pt[] {
  const pts = [...poly, poly[0]];
  const lens = [0];
  for (let i = 1; i < pts.length; i += 1) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = lens[lens.length - 1];
  const out: Pt[] = [];
  let seg = 1;
  for (let i = 0; i < n; i += 1) {
    const d = (i / n) * total;
    while (seg < lens.length - 1 && lens[seg] < d) seg += 1;
    const u = (d - lens[seg - 1]) / (lens[seg] - lens[seg - 1] || 1);
    out.push([pts[seg - 1][0] + (pts[seg][0] - pts[seg - 1][0]) * u, pts[seg - 1][1] + (pts[seg][1] - pts[seg - 1][1]) * u]);
  }
  return out;
}

/** Complex DFT of uniformly sampled contour points, signed frequencies -n/2 .. n/2-1. */
export function dft(points: Pt[]): Harmonic[] {
  const n = points.length;
  const out: Harmonic[] = [];
  for (let q = 0; q < n; q += 1) {
    const k = q <= Math.floor((n - 1) / 2) ? q : q - n;
    let re = 0;
    let im = 0;
    for (let i = 0; i < n; i += 1) {
      const a = (TAU * k * i) / n;
      const c = Math.cos(a);
      const s = Math.sin(a);
      re += points[i][0] * c + points[i][1] * s;
      im += points[i][1] * c - points[i][0] * s;
    }
    out.push({ k, re: re / n, im: im / n });
  }
  return out;
}

/** Keep the DC term plus the `budget` non-DC terms with the largest magnitude. */
export function selectLargest(h: Harmonic[], budget: number): Harmonic[] {
  const rest = h.filter((x) => x.k !== 0).sort((a, b) => b.re * b.re + b.im * b.im - (a.re * a.re + a.im * a.im) || Math.abs(a.k) - Math.abs(b.k));
  return [...h.filter((x) => x.k === 0), ...rest.slice(0, budget)];
}

/** Interpolate matching frequencies; a frequency missing on one side counts as zero. */
export function mix(a: Harmonic[], b: Harmonic[], alpha: number): Harmonic[] {
  const left = new Map(a.map((x) => [x.k, x]));
  const right = new Map(b.map((x) => [x.k, x]));
  const ks = [...new Set([...left.keys(), ...right.keys()])].sort((p, q) => p - q);
  return ks.map((k) => {
    const s = left.get(k) ?? { k, re: 0, im: 0 };
    const e = right.get(k) ?? { k, re: 0, im: 0 };
    return { k, re: s.re + (e.re - s.re) * alpha, im: s.im + (e.im - s.im) * alpha };
  });
}

/** Reconstruct m contour points from the harmonics. */
export function contour(h: Harmonic[], m: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < m; i += 1) {
    let x = 0;
    let y = 0;
    const t = i / m;
    for (const { k, re, im } of h) {
      const c = Math.cos(TAU * k * t);
      const s = Math.sin(TAU * k * t);
      x += re * c - im * s;
      y += re * s + im * c;
    }
    out.push([x, y]);
  }
  return out;
}

/** SVG path of points scaled by `s` around (cx, cy). */
export function pathOf(points: Pt[], cx: number, cy: number, s: number, close = true): string {
  const f = (v: number) => Math.round(v * 100) / 100;
  return points.map(([x, y], i) => `${i ? "L" : "M"}${f(cx + x * s)} ${f(cy + y * s)}`).join("") + (close ? "Z" : "");
}

/** Move a polygon so its centroid is the origin and its largest radius is 1. */
export function normalize(poly: Pt[]): Pt[] {
  const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
  const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
  const r = Math.max(...poly.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
  return poly.map((p) => [(p[0] - cx) / r, (p[1] - cy) / r] as Pt);
}

/**
 * Frame i of n shown one after another: opacity is 1 only inside its slice of the clip. Use with the
 * element's base style `opacity: 1` for the last frame and 0 for the others, so the resting state is
 * the final picture.
 */
export function frameStack(i: number, n: number, t: number, d: number): MotionSpec {
  const s = i / n;
  const e = (i + 1) / n;
  const eps = 0.0001;
  const k: Keyframe[] = [];
  if (i > 0) k.push({ opacity: 0, offset: 0 }, { opacity: 0, offset: s - eps });
  k.push({ opacity: 1, offset: s });
  if (i < n - 1) k.push({ opacity: 1, offset: e - eps }, { opacity: 0, offset: e });
  else k.push({ opacity: 1, offset: 1 });
  return { k, t, d, e: "linear" };
}

/** Monotone cubic Hermite (Fritsch-Carlson) through (xs, ys): no overshoot, flat on holds. */
export function monotone(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i += 1) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i += 1) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i += 1) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return hermite(xs, ys, m);
}

/** Catmull-Rom style tangents: smooth, but it overshoots next to a hold. */
export function catmull(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  const m = ys.map((_, i) => {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    return (ys[b] - ys[a]) / (xs[b] - xs[a]);
  });
  return hermite(xs, ys, m);
}

function hermite(xs: number[], ys: number[], m: number[]): (x: number) => number {
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
    let i = 0;
    while (x > xs[i + 1]) i += 1;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

export const linearThrough = (xs: number[], ys: number[]) => (x: number) => {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  let i = 0;
  while (x > xs[i + 1]) i += 1;
  return ys[i] + ((ys[i + 1] - ys[i]) * (x - xs[i])) / (xs[i + 1] - xs[i]);
};
