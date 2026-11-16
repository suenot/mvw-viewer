import { C } from "../colors";
import { fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Measured defaults at 30 fps, shortest to longest: one bar per move, its length in frames.
// Numbers: the motionmaxxing motion reference (R1.1, measured on reference films).

const ROWS: Array<[string, number, boolean]> = [
  ["Opacity in", 6, false],
  ["Supporting move on a CTA", 6, false],
  ["Blur in", 7, false],
  ["Scale out", 10, false],
  ["Translate or scale in", 12, true],
  ["Translate out", 13, false],
];
const ms = (f: number) => Math.round((f * 1000) / 30);

function Bars({ lx, bx, unit, y0, step, narrow }: { lx: number; bx: number; unit: number; y0: number; step: number; narrow: boolean }) {
  return (
    <g>
      {ROWS.map(([label, f, key], i) => {
        const y = y0 + i * step;
        const t = 120 + i * 140;
        return (
          <g>
            <g {...motion(fadeIn(t, 300))}>
              <text class="t-sub t-strong" x={lx} y={y + 12}>{label}</text>
            </g>
            <g transform={`translate(${bx} ${y})`} {...motion(growX(t + 100, 520))}>
              <rect x={0} y={0} width={f * unit} height={16} rx={3} style={{ fill: key ? C.accent : C.accentSoft }} />
            </g>
            <g {...motion(fadeUp(t + 500, 360, 3))}>
              <text class="t-sub" x={bx + f * unit + 8} y={y + 12} style={{ fill: C.muted }}>{narrow ? `${f} f, ${ms(f)} ms` : `${f} frames, ${ms(f)} ms`}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

export default function MotionDefaults({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Bars lx={36} bx={230} unit={16} y0={20} step={28} narrow={false} />}
        narrow={() => <Bars lx={12} bx={130} unit={8.5} y0={16} step={34} narrow />}
      />
    </VizStage>
  );
}
