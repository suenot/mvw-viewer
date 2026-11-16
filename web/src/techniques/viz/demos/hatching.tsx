import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { boilCircle, rng } from "./pencil";

// Hatching instead of a flat fill: the same ball, flat on the left, shaded with strokes on
// the right. Light comes from the upper left, so strokes sit on the lower right. A first
// pass of diagonal lines, then a second pass crosses the darkest part.

type Line = [number, number, number, number];

/** Diagonal chords x + y = k of a circle, kept where k is above `from` (the shadow side). */
function hatch(cx: number, cy: number, r: number, from: number, to: number, gap: number, seed: number): Line[] {
  const next = rng(seed);
  const out: Line[] = [];
  const base = cx + cy;
  for (let k = base + from * r; k <= base + to * r; k += gap) {
    const dist = Math.abs(base - k) / Math.SQRT2;
    if (dist >= r - 1) continue;
    const half = Math.sqrt(r * r - dist * dist);
    // the chord runs along (1, -1)/sqrt2 through the foot of the perpendicular from the centre
    const fx = cx + (k - base) / 2;
    const fy = cy + (k - base) / 2;
    const ux = Math.SQRT1_2;
    const j = () => (next() - 0.5) * 1.6;
    out.push([fx - ux * half + j(), fy + ux * half + j(), fx + ux * half + j(), fy - ux * half + j()]);
  }
  return out;
}

/** Second pass: chords along (1, 1), only on the darkest part (x + y above base + from * r). */
function cross(cx: number, cy: number, r: number, from: number, gap: number, seed: number): Line[] {
  const next = rng(seed);
  const out: Line[] = [];
  const t0 = (from * r) / Math.SQRT2;
  const u = Math.SQRT1_2;
  for (let d = -r; d <= r; d += gap) {
    if (Math.abs(d) >= r - 1) continue;
    const t1 = Math.sqrt(r * r - d * d);
    if (t1 <= t0 + 2) continue;
    // point = centre + d * (1, -1)/sqrt2 + t * (1, 1)/sqrt2
    const px = (t: number) => cx + u * d + u * t;
    const py = (t: number) => cy - u * d + u * t;
    const j = () => (next() - 0.5) * 1.6;
    out.push([px(t0) + j(), py(t0) + j(), px(t1) + j(), py(t1) + j()]);
  }
  return out;
}

function Ball({ x, y, r, hatched, label }: { x: number; y: number; r: number; hatched: boolean; label: string }) {
  const first = hatched ? hatch(x, y, r, 0.05, 1.5, 6, 5) : [];
  const second = hatched ? cross(x, y, r, 0.85, 6, 9) : [];
  return (
    <g>
      <text class="t-sub t-strong" x={x} y={y - r - 14} text-anchor="middle" {...motion(fadeUp(100, 420, 3))}>
        {label}
      </text>
      {!hatched && <circle cx={x} cy={y} r={r} style={{ fill: C.accentSoft, stroke: C.accent, "stroke-width": 2 }} {...motion(popIn(200, 500, 0.9))} />}
      {hatched && (
        <g>
          <path d={boilCircle(x, y, r, 31, 1.6)} fill="none" style={{ stroke: C.accent, "stroke-width": 2 }} stroke-linejoin="round" {...motion(fadeIn(200, 400))} />
          {first.map(([x1, y1, x2, y2], i) => (
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: C.accent, "stroke-width": 1.3 }} stroke-linecap="round" {...motion(fadeIn(500 + i * 70, 220))} />
          ))}
          {second.map(([x1, y1, x2, y2], i) => (
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: C.accent, "stroke-width": 1.3 }} stroke-linecap="round" {...motion(fadeIn(1500 + i * 70, 220))} />
          ))}
        </g>
      )}
    </g>
  );
}

export default function Hatching({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Ball x={170} y={112} r={64} hatched={false} label="Flat fill" />
            <Ball x={470} y={112} r={64} hatched label="Hatching: lines, then a second pass" />
          </g>
        )}
        narrow={() => (
          <g>
            <Ball x={168} y={92} r={54} hatched={false} label="Flat fill" />
            <Ball x={168} y={250} r={54} hatched label="Hatching: lines, then a second pass" />
          </g>
        )}
      />
    </VizStage>
  );
}
