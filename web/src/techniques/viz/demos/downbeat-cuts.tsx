import { C } from "../colors";
import { fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Top: three scenes of 2, 2 and 4 whole bars, so every cut falls on a downbeat. Below: the loudness
// jump into a cut for four ways of marking it. The soundtrack skill flags a jump over +6 dB as a
// startle; the figures are the ones it reports (+7 to +10, +11, +3.5, +3 to +5).

const SCENES = [2, 2, 4];
const ROWS: Array<[string, number, string, boolean]> = [
  ["Loud accent on the cut", 8.5, "+7 to +10 dB", true],
  ["Kick and bass enter together", 11, "+11 dB", true],
  ["Layers enter a bar apart", 3.5, "+3.5 dB", false],
  ["Chord change on the downbeat", 4, "+3 to +5 dB", false],
];
const MAX = 12;
const LIMIT = 6;

function Strip({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const total = SCENES.reduce((a, b) => a + b, 0);
  let acc = 0;
  return (
    <g {...motion(fadeIn(80, 400))}>
      {SCENES.map((bars, i) => {
        const x0 = x + (acc / total) * w;
        const sw = (bars / total) * w;
        acc += bars;
        return (
          <g>
            <rect x={x0 + 1} y={y} width={sw - 2} height={h} rx={4} style={{ fill: i === 2 ? C.accent : C.accentSoft, stroke: C.line }} />
            <text class="t-sub t-strong" x={x0 + sw / 2} y={y + h / 2 + 4} text-anchor="middle" style={{ fill: i === 2 ? C.onAccent : C.onLight }}>{bars} bars</text>
          </g>
        );
      })}
    </g>
  );
}

function Rows({ lx, bx, bw, y0, step, narrow }: { lx: number; bx: number; bw: number; y0: number; step: number; narrow: boolean }) {
  const px = (db: number) => bx + (db / MAX) * bw;
  return (
    <g>
      <g {...motion(fadeIn(500, 300))}>
        <line x1={px(LIMIT)} y1={y0 - 8} x2={px(LIMIT)} y2={y0 + ROWS.length * step - 6} style={{ stroke: C.accent2, "stroke-dasharray": "3 4" }} />
        <text class="t-sub" x={px(LIMIT)} y={y0 - 12} text-anchor="middle" style={{ fill: C.accent2Text }}>+6 dB: startle</text>
      </g>
      {ROWS.map(([label, db, text, bad], i) => {
        const y = y0 + i * step;
        const t = 600 + i * 160;
        return (
          <g>
            <g {...motion(fadeIn(t, 300))}>
              <text class="t-sub t-strong" x={lx} y={y + (narrow ? 0 : 13)}>{label}</text>
            </g>
            <g transform={`translate(${bx} ${y + (narrow ? 6 : 0)})`} {...motion(growX(t + 100, 520))}>
              <rect x={0} y={0} width={(db / MAX) * bw} height={16} rx={3} style={{ fill: bad ? C.accent2 : C.accent3 }} />
            </g>
            <g {...motion(fadeUp(t + 500, 360, 3))}>
              <text class="t-sub" x={px(db) + 8} y={y + (narrow ? 6 : 0) + 12} style={{ fill: C.muted }}>{text}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

export default function DownbeatCuts({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Strip x={36} y={14} w={568} h={30} />
            <Rows lx={36} bx={250} bw={250} y0={84} step={32} narrow={false} />
          </g>
        )}
        narrow={() => (
          <g>
            <Strip x={12} y={12} w={312} h={28} />
            <Rows lx={12} bx={12} bw={200} y0={84} step={48} narrow />
          </g>
        )}
      />
    </VizStage>
  );
}
