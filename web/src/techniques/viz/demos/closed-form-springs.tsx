import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { px1, sampleKeys, springAt } from "./curves";

// Two closed-form springs on one time axis (0 to 0.8 s): the shape (damping 0.72, settle 0.35 s)
// and the camera (damping 1.0, settle 0.6 s). The dots replay the curves in slow motion.

const SHAPE = { zeta: 0.72, settle: 0.35 };
const CAM = { zeta: 1, settle: 0.6 };
const T_END = 0.8;
const SLOW = 2600;

function Graph({ w, h, narrow }: { w: number; h: number; narrow: boolean }) {
  const x0 = 34;
  const x1 = w - (narrow ? 14 : 214);
  const top = 28;
  const bottom = h - (narrow ? 70 : 34);
  const X = (t: number) => x0 + (t / T_END) * (x1 - x0);
  const Y = (v: number) => bottom - (v / 1.12) * (bottom - top);
  const curve = (c: { zeta: number; settle: number }) => {
    let d = "";
    for (let i = 0; i <= 64; i += 1) {
      const t = (i / 64) * T_END;
      d += `${i ? "L" : "M"}${px1(X(t))} ${px1(Y(springAt(t, c.zeta, c.settle)))} `;
    }
    return d;
  };
  const dot = (c: { zeta: number; settle: number }, fill: string, at: number) => {
    const endX = X(T_END);
    const endY = Y(springAt(T_END, c.zeta, c.settle));
    return (
      <circle cx={endX} cy={endY} r={5} style={{ fill }}
        {...motion({
          k: sampleKeys(40, (u) => ({ transform: `translate(${px1(X(u * T_END) - endX)}px, ${px1(Y(springAt(u * T_END, c.zeta, c.settle)) - endY)}px)` })),
          t: at, d: SLOW, e: LINEAR,
        })} />
    );
  };
  return (
    <g>
      <g {...motion(fadeIn(80, 360))}>
        <line x1={x0} y1={Y(1)} x2={x1} y2={Y(1)} style={{ stroke: C.muted, "stroke-dasharray": "3 3" }} />
        <line x1={x0} y1={bottom} x2={x1} y2={bottom} style={{ stroke: C.grid }} />
        <text class="t-sub" x={x0 - 6} y={Y(1) + 4} text-anchor="end">1</text>
        <text class="t-sub" x={x0 - 6} y={bottom + 4} text-anchor="end">0</text>
        {[0, 0.2, 0.4, 0.6, 0.8].map((s) => (
          <text class="t-sub" x={X(s)} y={bottom + 16} text-anchor="middle">{s.toFixed(1)} s</text>
        ))}
      </g>
      <g {...motion(fadeIn(200, 500))}>
        <path d={curve(SHAPE)} fill="none" style={{ stroke: C.accent, "stroke-width": 2 }} />
        <path d={curve(CAM)} fill="none" style={{ stroke: C.accent2, "stroke-width": 2 }} />
      </g>
      {dot(SHAPE, C.accent, 700)}
      {dot(CAM, C.accent2, 700)}
      <g {...motion(fadeUp(900, 420, 3))}>
        <text class="t-sub t-strong" x={narrow ? x0 : x1 + 12} y={narrow ? bottom + 36 : top + 14} style={{ fill: C.accentText }}>
          Shape: damping 0.72, settle 0.35 s
        </text>
        <text class="t-sub" x={narrow ? x0 : x1 + 12} y={narrow ? bottom + 50 : top + 30}>
          overshoots by 3.8 % and returns
        </text>
        <text class="t-sub t-strong" x={narrow ? x0 : x1 + 12} y={narrow ? bottom + 64 : top + 62} style={{ fill: C.accent2Text }}>
          Camera: damping 1.0, settle 0.6 s
        </text>
        <text class="t-sub" x={narrow ? x0 : x1 + 12} y={narrow ? bottom + 78 : top + 78}>
          no overshoot, arrives later
        </text>
      </g>
    </g>
  );
}

export default function ClosedFormSprings({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w, h) => <Graph w={w} h={h} narrow={false} />} narrow={(w, h) => <Graph w={w} h={h} narrow />} />
    </VizStage>
  );
}
