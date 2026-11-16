import { C } from "../colors";
import { fadeIn, fadeUp, growY, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Eight beats, each with an importance of 1, 2 or 3. Only two of the eight (25 %) are 3; those get
// the scale, the camera move and the sound. The rest stay small and quick, so the 3s can arrive.

const LEVELS = [1, 2, 1, 3, 2, 1, 3, 2];
const HEIGHT: Record<number, number> = { 1: 22, 2: 46, 3: 78 };

function Beats({ x0, step, bw, base, narrow }: { x0: number; step: number; bw: number; base: number; narrow: boolean }) {
  return (
    <g>
      <line x1={x0 - 8} y1={base} x2={x0 + LEVELS.length * step} y2={base} style={{ stroke: C.line }} />
      {LEVELS.map((lv, i) => (
        <g>
          <g transform={`translate(${x0 + i * step} ${base})`} {...motion({ ...growY(150 + i * 110, 480), })}>
            <rect x={0} y={-HEIGHT[lv]} width={bw} height={HEIGHT[lv]} rx={3} style={{ fill: lv === 3 ? C.accent2 : lv === 2 ? C.accentSoft : C.node, stroke: C.line }} />
          </g>
          <g {...motion(fadeIn(500 + i * 110, 300))}>
            <text class="t-sub t-strong" x={x0 + i * step + bw / 2} y={base + 16} text-anchor="middle">{lv}</text>
          </g>
        </g>
      ))}
      <g {...motion(fadeUp(1500, 420, 3))}>
        <text class="t-sub t-strong" x={x0 - 8} y={base + 40} style={{ fill: C.accent2Text }}>Importance 3: 2 of 8 beats, 25 %</text>
        <text class="t-sub" x={x0 - 8} y={base + 56} style={{ fill: C.muted }}>{narrow ? "Gets the scale, camera move and sound." : "Gets the scale, the camera move, the sound and the hardest work."}</text>
        <text class="t-sub" x={x0 - 8} y={base + 72} style={{ fill: C.muted }}>{narrow ? "Level 1 stays small and quick." : "Level 1 stays small and quick, so the 3s can arrive."}</text>
      </g>
    </g>
  );
}

export default function ImportanceBudget({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Beats x0={70} step={64} bw={44} base={110} narrow={false} />}
        narrow={() => <Beats x0={22} step={38} bw={26} base={112} narrow />}
      />
    </VizStage>
  );
}
