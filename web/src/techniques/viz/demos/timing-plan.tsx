import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A timing plan as data: four rows on one 5 s axis. A playhead sweeps the plan, then one
// number is edited (the fact enters at 2.4 s instead of 2.0 s) and only that bar moves.

const ROWS = [
  { name: "Coastline", from: 0, to: 4.5, detail: "draws 0 to 1 s" },
  { name: "Location dot", from: 1.0, to: 4.5, detail: "enters 1.0 s" },
  { name: "Fact label", from: 2.4, to: 4.5, detail: "enters 2.4 s (was 2.0)" },
  { name: "Clear", from: 4.5, to: 5.0, detail: "from 4.5 s" },
];
const TOTAL = 5;
const SWEEP = 3200;

function Plan({ x0, x1, y0, rowH, labelW, short }: { x0: number; x1: number; y0: number; rowH: number; labelW: number; short: boolean }) {
  const ax = x0 + labelW;
  const px = (s: number) => ax + (s / TOTAL) * (x1 - ax);
  const bottom = y0 + ROWS.length * rowH;
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <g {...motion(fadeIn(100, 300))}>
          <line x1={px(s)} y1={y0 - 4} x2={px(s)} y2={bottom} style={{ stroke: C.grid }} />
          <text class="t-sub" x={px(s)} y={bottom + 15} text-anchor="middle">
            {s} s
          </text>
        </g>
      ))}
      {ROWS.map((row, i) => {
        const y = y0 + i * rowH;
        const edited = i === 2;
        return (
          <g {...motion(fadeUp(200 + i * 140, 420, 4))}>
            <text class="t-sub t-strong" x={x0} y={y + rowH / 2 + 4}>
              {row.name}
            </text>
            {edited && (
              <rect x={px(2.0)} y={y + 5} width={px(4.5) - px(2.0)} height={rowH - 10} rx={4} style={{ fill: "none", stroke: C.muted, "stroke-dasharray": "3 3" }} />
            )}
            <rect
              x={px(row.from)}
              y={y + 5}
              width={px(row.to) - px(row.from)}
              height={rowH - 10}
              rx={4}
              style={{ fill: edited ? C.accent2 : C.accent }}
              {...(edited
                ? motion({
                    k: [{ transform: `translate(${px(2.0) - px(2.4)}px, 0px)` }, { transform: "translate(0px, 0px)" }],
                    t: 3600,
                    d: 700,
                  })
                : {})}
            />
            {!short && (
              <text class="t-sub" x={px(row.from) + 8} y={y + rowH / 2 + 4} style={{ fill: edited ? C.onAccent2 : C.onAccent }}>
                {row.detail}
              </text>
            )}
          </g>
        );
      })}
      <g transform={`translate(${ax} 0)`}>
        <g
          {...motion({
            k: [
              { opacity: 0, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.04, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.96, transform: `translate(${x1 - ax}px, 0px)` },
              { opacity: 0, transform: `translate(${x1 - ax}px, 0px)` },
            ],
            t: 700,
            d: SWEEP,
            e: LINEAR,
          })}
          opacity={0}
        >
          <line x1={0} y1={y0 - 8} x2={0} y2={bottom} style={{ stroke: C.ink, "stroke-width": 1.5 }} />
        </g>
      </g>
    </g>
  );
}

export default function TimingPlan({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Plan x0={20} x1={620} y0={20} rowH={44} labelW={120} short={false} />}
        narrow={() => <Plan x0={10} x1={326} y0={20} rowH={40} labelW={96} short />}
      />
    </VizStage>
  );
}
