import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A pen draws a stroke by sampling the path at the draw progress k: the stroke up to k is visible
// (stroke-dashoffset = length * (1 - k) in the real recipe) and the nib sits on the point at k. Here the
// stroke is cut into short pieces that appear in order, so only opacity and transform move. Between
// the two strokes the pen lifts, travels hidden, and lands on the start of the next one.

type P = [number, number];
const N = 30;
const stroke1 = (u: number): P => [40 + 220 * u, 72 + 34 * Math.sin(u * Math.PI * 3) * (1 - 0.25 * u)];
const stroke2 = (u: number): P => [60 + 170 * u, 128 + 3 * Math.sin(u * 8)];
const T1 = 1800;
const T2 = 900;
const START1 = 300;
const LIFT = 250;
const START2 = START1 + T1 + LIFT + 200;

function Pieces({ f, t0, dur, col }: { f: (u: number) => P; t0: number; dur: number; col: string }) {
  return (
    <g>
      {Array.from({ length: N }, (_, i) => {
        const a = f(i / N);
        const b = f((i + 1) / N);
        return (
          <g {...motion({ k: [{ opacity: 0 }, { opacity: 1 }], t: t0 + (i / N) * dur, d: 40, e: LINEAR })}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke-linecap="round" style={{ stroke: col, "stroke-width": 3 }} />
          </g>
        );
      })}
    </g>
  );
}

function Board({ dx, dy, scale }: { dx: number; dy: number; scale: number }) {
  // pen keyframes relative to its resting point (the end of stroke 2), offsets over one timeline
  const total = START2 + T2 + 200;
  const rest = stroke2(1);
  const rel = (p: P) => `translate(${(p[0] - rest[0]).toFixed(1)}px, ${(p[1] - rest[1]).toFixed(1)}px)`;
  const keys: Keyframe[] = [];
  const at = (ms: number) => ms / total;
  keys.push({ offset: 0, opacity: 0, transform: rel(stroke1(0)) });
  keys.push({ offset: at(START1), opacity: 1, transform: rel(stroke1(0)) });
  for (let i = 1; i <= 12; i += 1) keys.push({ offset: at(START1 + (i / 12) * T1), opacity: 1, transform: rel(stroke1(i / 12)) });
  keys.push({ offset: at(START1 + T1 + LIFT), opacity: 0, transform: rel(stroke1(1)) });
  keys.push({ offset: at(START2 - 40), opacity: 0, transform: rel(stroke2(0)) });
  keys.push({ offset: at(START2), opacity: 1, transform: rel(stroke2(0)) });
  for (let i = 1; i <= 6; i += 1) keys.push({ offset: at(START2 + (i / 6) * T2), opacity: 1, transform: rel(stroke2(i / 6)) });
  keys.push({ offset: 1, opacity: 0, transform: rel(stroke2(1)) });
  return (
    <g transform={`translate(${dx} ${dy}) scale(${scale})`}>
      <rect x={10} y={30} width={290} height={130} rx={6} style={{ fill: C.node, stroke: C.line }} />
      <Pieces f={stroke1} t0={START1} dur={T1} col={C.accent} />
      <Pieces f={stroke2} t0={START2} dur={T2} col={C.accent2} />
      <g {...motion({ k: keys, t: 0, d: total, e: LINEAR })} style={{ opacity: 0 }}>
        <g transform={`translate(${rest[0]} ${rest[1]})`}>
          <line x1={0} y1={0} x2={16} y2={-22} stroke-linecap="round" style={{ stroke: C.ink, "stroke-width": 5 }} />
          <circle cx={0} cy={0} r={3} style={{ fill: C.ink }} />
        </g>
      </g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub" x={10} y={22} style={{ fill: C.muted }}>Two strokes, one pen</text>
      </g>
    </g>
  );
}

export default function HandDrawOn({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Board dx={26} dy={0} scale={1} />
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub t-strong" x={356} y={60}>One number drives both</text>
              <text class="t-sub" x={356} y={80} style={{ fill: C.muted }}>k runs 0 to 1 along the stroke.</text>
              <text class="t-sub" x={356} y={100} style={{ fill: C.muted }}>Stroke shown up to k,</text>
              <text class="t-sub" x={356} y={116} style={{ fill: C.muted }}>nib at the point at k.</text>
              <text class="t-sub" x={356} y={140} style={{ fill: C.muted }}>Between strokes: lift, move, land.</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            <Board dx={0} dy={0} scale={1.05} />
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub t-strong" x={12} y={200}>One number k drives both</text>
              <text class="t-sub" x={12} y={218} style={{ fill: C.muted }}>Stroke shown up to k, nib at the point at k.</text>
              <text class="t-sub" x={12} y={236} style={{ fill: C.muted }}>Between strokes: lift, move, land.</text>
            </g>
          </g>
        )}
      />
    </VizStage>
  );
}
