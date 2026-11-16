import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// An error log that becomes checks: each concrete failure (left) turns into a rule that the
// next prompt or script enforces (right). The log stays short: three lines, not a transcript.

const ROWS = [
  { fail: "Label collides with phone crop at 3.2 s", rule: "Keep labels 90 px inside safe area" },
  { fail: "Hatching flips direction between frames", rule: "One hatch angle per object, fixed seed" },
  { fail: "Text flickers as the contour redraws", rule: "Labels follow continuous time" },
];

function Table({ x0, x1, y0, rowH, stacked }: { x0: number; x1: number; y0: number; rowH: number; stacked: boolean }) {
  const half = (x1 - x0 - 36) / 2;
  return (
    <g>
      <g {...motion(fadeUp(100, 420, 3))}>
        <text class="t-sub t-strong" x={x0} y={y0 - 12}>
          Error log (what went wrong)
        </text>
        {!stacked && (
          <text class="t-sub t-strong" x={x0 + half + 36} y={y0 - 12}>
            Check for the next scene
          </text>
        )}
      </g>
      {ROWS.map((row, i) => {
        const y = y0 + i * (stacked ? rowH * 2 + 10 : rowH);
        const t = 400 + i * 900;
        return (
          <g>
            <g {...motion(fadeUp(t, 420, 4))}>
              <rect x={x0} y={y} width={stacked ? x1 - x0 : half} height={rowH - 8} rx={6} style={{ fill: C.node, stroke: C.accent2 }} />
              <text class="t-sub" x={x0 + 10} y={y + (rowH - 8) / 2 + 4}>
                {row.fail}
              </text>
            </g>
            <g {...motion(fadeIn(t + 420, 300))}>
              <text class="t-sub t-strong" x={stacked ? x0 + 8 : x0 + half + 10} y={stacked ? y + rowH + 4 : y + (rowH - 8) / 2 + 5} style={{ fill: C.accent3Text }}>
                {stacked ? "↓" : "→"}
              </text>
            </g>
            <g {...motion(fadeUp(t + 520, 420, 4))}>
              <rect x={stacked ? x0 : x0 + half + 36} y={stacked ? y + rowH + 6 : y} width={stacked ? x1 - x0 : half} height={rowH - 8} rx={6} style={{ fill: C.wash, stroke: C.accent3 }} />
              <text class="t-sub" x={(stacked ? x0 : x0 + half + 36) + 10} y={(stacked ? y + rowH + 6 : y) + (rowH - 8) / 2 + 4}>
                {row.rule}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

export default function ErrorLog({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Table x0={20} x1={620} y0={40} rowH={52} stacked={false} />}
        narrow={() => <Table x0={8} x1={328} y0={32} rowH={44} stacked />}
      />
    </VizStage>
  );
}
