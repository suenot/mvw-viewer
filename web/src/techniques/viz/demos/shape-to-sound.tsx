import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { dft, normalize, pathOf, resampleClosed, type Pt } from "./harmonics";

// The contour of a character becomes its voice: the magnitude of each harmonic, signed
// frequencies folded together, is the level of one audio partial (32 at most, the DC term dropped,
// then normalised). A round shape has one strong partial and sounds like a sine; a star has many.

const circle: Pt[] = Array.from({ length: 96 }, (_, i) => [Math.cos((i / 96) * Math.PI * 2), Math.sin((i / 96) * Math.PI * 2) * 0.92] as Pt);
const star: Pt[] = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? 0.45 : 1;
  return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
});
const BARS = 16;

function spectrum(poly: Pt[], resample: boolean): number[] {
  const pts = resample ? resampleClosed(normalize(poly), 96) : poly;
  const h = dft(pts);
  const mag = new Array(BARS + 1).fill(0);
  for (const { k, re, im } of h) {
    const a = Math.abs(k);
    if (a > 0 && a <= BARS) mag[a] += Math.hypot(re, im);
  }
  const energy = Math.hypot(...mag);
  return mag.slice(1).map((m) => m / (energy || 1));
}

const SHAPES = [
  { name: "Circle", poly: normalize(circle), spec: spectrum(circle, false) },
  { name: "Star", poly: normalize(star), spec: spectrum(star, true) },
];

/** One period of the sum of sines, scaled to peak 1. */
function wave(spec: number[], n = 64): number[] {
  const v = Array.from({ length: n }, (_, i) => spec.reduce((a, m, k) => a + m * Math.sin(((k + 1) * i * Math.PI * 2) / (n - 1)), 0));
  const peak = Math.max(...v.map(Math.abs)) || 1;
  return v.map((x) => x / peak);
}

function Row({ y, i, narrow, w }: { y: number; i: number; narrow: boolean; w: number }) {
  const shape = SHAPES[i];
  const t0 = 150 + i * 900;
  const cx = narrow ? 36 : 46;
  const bx = narrow ? 84 : 120;
  const bw = narrow ? w - 96 : 260;
  const bh = narrow ? 52 : 60;
  const bar = bw / BARS;
  const wx = narrow ? bx : 420;
  const wy = narrow ? y + bh + 38 : y + bh / 2;
  const ww = narrow ? bw : 200;
  const wh = narrow ? 18 : 24;
  const wv = wave(shape.spec);
  const line: Pt[] = wv.map((v, k) => [(k / (wv.length - 1)) * ww, -v * wh] as Pt);
  return (
    <g>
      <g {...motion(fadeUp(t0, 420, 3))}>
        <path d={pathOf(shape.poly, cx, y + bh / 2, narrow ? 24 : 30)} style={{ fill: C.accentSoft, stroke: C.accent, "stroke-width": 2, "stroke-linejoin": "round" }} />
        <text class="t-sub t-strong" x={cx} y={y + bh + 16} text-anchor="middle">{shape.name}</text>
      </g>
      {shape.spec.map((m, k) => {
        const h = Math.max(1, m * bh);
        return (
          <g transform={`translate(${bx + k * bar + 1} ${y + bh})`} {...motion({ k: [{ transform: "scale(1, 0.02)" }, { transform: "scale(1, 1)" }], t: t0 + 300 + k * 30, d: 500 })}>
            <rect x={0} y={-h} width={bar - 2} height={h} rx={2} style={{ fill: C.accent2 }} />
          </g>
        );
      })}
      <g {...motion(fadeIn(t0 + 300, 300))}>
        <line x1={bx} y1={y + bh} x2={bx + bw} y2={y + bh} style={{ stroke: C.line }} />
        <text class="t-sub" x={bx} y={y + bh + 14}>partial 1</text>
        <text class="t-sub" x={bx + bw} y={y + bh + 14} text-anchor="end">16</text>
      </g>
      <g {...motion(fadeIn(t0 + 900, 500))}>
        <path d={pathOf(line, wx, wy, 1, false)} fill="none" style={{ stroke: C.accent3, "stroke-width": 2 }} stroke-linejoin="round" />
        <text class="t-sub" x={wx} y={wy + wh + 14}>one period of the tone</text>
      </g>
    </g>
  );
}

export default function ShapeToSound({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={(w) => (
          <g>
            <Row y={22} i={0} narrow={false} w={w} />
            <Row y={128} i={1} narrow={false} w={w} />
          </g>
        )}
        narrow={(w) => (
          <g>
            <Row y={14} i={0} narrow w={w} />
            <Row y={158} i={1} narrow w={w} />
          </g>
        )}
      />
    </VizStage>
  );
}
