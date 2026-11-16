import { C } from "../colors";
import { EASE_OUT, LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { catmull, linearThrough, monotone } from "./harmonics";

// One camera channel (the azimuth of an orbit camera) keyed at four stations with two holds in
// between. Linear gives corners, a Catmull-Rom spline overshoots next to the holds (the camera
// backs up before it moves), a monotone cubic Hermite curve stays between its keys and is flat on a
// hold. The top-down view shows the monotone curve driving the camera around the table.

const XS = [0, 1, 2, 3, 4];
const YS = [0, 0, 70, 70, 120];
const lin = linearThrough(XS, YS);
const cat = catmull(XS, YS);
const mon = monotone(XS, YS);
const T = 4;
const DUR = 4000;

const curve = (fn: (x: number) => number, px: (t: number) => number, py: (v: number) => number) => {
  let d = "";
  for (let i = 0; i <= 80; i += 1) {
    const t = (i / 80) * T;
    d += `${i ? "L" : "M"}${px(t).toFixed(1)} ${py(fn(t)).toFixed(1)}`;
  }
  return d;
};

function Graph({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const px = (t: number) => x + (t / T) * w;
  const py = (v: number) => y + h - ((v + 14) / 148) * h;
  return (
    <g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub t-strong" x={x} y={y - 10}>One channel: azimuth against time</text>
        <line x1={x} y1={py(0)} x2={x + w} y2={py(0)} style={{ stroke: C.line }} />
        <line x1={x} y1={py(70)} x2={x + w} y2={py(70)} style={{ stroke: C.line, "stroke-dasharray": "2 4" }} />
      </g>
      <g {...motion(fadeIn(300, 500))}>
        <path d={curve(lin, px, py)} fill="none" style={{ stroke: C.faint, "stroke-width": 1.5, "stroke-dasharray": "5 4" }} />
        <path d={curve(cat, px, py)} fill="none" style={{ stroke: C.accent2, "stroke-width": 2 }} />
        <path d={curve(mon, px, py)} fill="none" style={{ stroke: C.accent, "stroke-width": 2.5 }} />
        {XS.map((t, i) => <circle cx={px(t)} cy={py(YS[i])} r={3.5} style={{ fill: C.ink }} />)}
      </g>
      <g {...motion(fadeUp(700, 420, 3))}>
        <text class="t-sub t-strong" x={px(2.1)} y={py(-8)} style={{ fill: C.accent2Text }}>Spline: dips below 0</text>
        <text class="t-sub t-strong" x={px(2.35)} y={py(92)} style={{ fill: C.accent2Text }}>and above 70</text>
        <text class="t-sub t-strong" x={px(0.1)} y={py(112)} style={{ fill: C.accentText }}>Monotone: no overshoot</text>
        <text class="t-sub" x={px(0.1)} y={py(98)} style={{ fill: C.muted }}>Dashed: linear, with corners</text>
      </g>
      <g transform={`translate(${px(T)} 0)`}>
        <g {...motion({ k: [{ transform: `translate(${-w}px, 0px)` }, { transform: "translate(0px, 0px)" }], t: 800, d: DUR, e: LINEAR })}>
          <line x1={0} y1={y - 2} x2={0} y2={y + h + 2} style={{ stroke: C.ink, "stroke-width": 1.2 }} />
        </g>
      </g>
    </g>
  );
}

function Orbit({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pos = (v: number): [number, number] => {
    const a = ((v - 90) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const end = pos(mon(T));
  const keys: Keyframe[] = [];
  for (let i = 0; i <= 64; i += 1) {
    const p = pos(mon((i / 64) * T));
    keys.push({ offset: i / 64, transform: `translate(${(p[0] - end[0]).toFixed(2)}px, ${(p[1] - end[1]).toFixed(2)}px)` });
  }
  return (
    <g>
      <g {...motion(fadeIn(120, 400))}>
        <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: C.line, "stroke-dasharray": "3 4" }} />
        <rect x={cx - 16} y={cy - 16} width={32} height={32} rx={5} style={{ fill: C.wash, stroke: C.accent }} />
        <text class="t-sub t-strong" x={cx} y={cy + 4} text-anchor="middle">model</text>
        {[0, 70, 120].map((v, i) => {
          const p = pos(v);
          return <g><circle cx={p[0]} cy={p[1]} r={9} style={{ fill: C.node, stroke: C.ink }} /><text class="t-sub t-strong" x={p[0]} y={p[1] + 4} text-anchor="middle">{i + 1}</text></g>;
        })}
      </g>
      <g {...motion({ k: keys, t: 800, d: DUR, e: LINEAR })}>
        <circle cx={end[0]} cy={end[1]} r={6} style={{ fill: C.accent }} />
      </g>
    </g>
  );
}

export default function CameraCurves({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Graph x={24} y={36} w={380} h={132} />
            <g {...motion(fadeIn(80, 400))}><text class="t-sub t-strong" x={440} y={26}>Top view: camera on the table</text></g>
            <Orbit cx={530} cy={104} r={58} />
          </g>
        )}
        narrow={() => (
          <g>
            <Graph x={20} y={34} w={296} h={124} />
            <g {...motion(fadeIn(80, 400))}><text class="t-sub t-strong" x={12} y={196}>Top view: camera on the table</text></g>
            <Orbit cx={168} cy={262} r={52} />
          </g>
        )}
      />
    </VizStage>
  );
}
