import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A 0.5 s beat grid (120 BPM) on a 4 s axis. Every event sits on a beat. One stray hit at 1.3 s
// slides to the grid line at 1.5 s. Faint ticks every 125 ms are the 1/16 notes used for staggers.

const HITS = [
  { t: 0, label: "pop" },
  { t: 0.5, label: "click" },
  { t: 1.0, label: "morph" },
  { t: 1.5, label: "chime" },
  { t: 2.5, label: "tick" },
  { t: 3.0, label: "swap" },
];
const TOTAL = 4;
const SWEEP = 3200;

function Grid({ w, narrow }: { w: number; narrow: boolean }) {
  const x0 = 18;
  const x1 = w - 18;
  const y0 = 56;
  const yHit = 96;
  const X = (s: number) => x0 + (s / TOTAL) * (x1 - x0);
  return (
    <g>
      <g {...motion(fadeIn(80, 360))}>
        {Array.from({ length: TOTAL * 8 + 1 }, (_, i) => (
          <line x1={X(i / 8)} y1={i % 4 === 0 ? y0 : y0 + 12} x2={X(i / 8)} y2={yHit + 26} style={{ stroke: C.grid, "stroke-width": i % 4 === 0 ? 1.4 : 0.6 }} />
        ))}
        {[0, 1, 2, 3, 4].map((s) => (
          <text class="t-sub" x={X(s)} y={y0 - 8} text-anchor="middle">{s} s</text>
        ))}
        <text class="t-sub" x={X(0.5)} y={yHit + 44} text-anchor="middle">0.5 s beat</text>
        <text class="t-sub" x={X(0.125) + 12} y={yHit + 44} text-anchor="middle">{narrow ? "" : "125 ms"}</text>
      </g>
      {HITS.map((h, i) => (
        <g transform={`translate(${X(h.t)} ${yHit})`} {...motion(popIn(250 + i * 330, 420, 0.4))}>
          <circle cx={0} cy={0} r={9} style={{ fill: C.accent }} />
          {!narrow && (
            <text class="t-sub t-strong" x={0} y={-16} text-anchor="middle">{h.label}</text>
          )}
        </g>
      ))}
      <g transform={`translate(${X(1.3)} ${yHit})`}
        {...motion({ k: [{ opacity: 0, transform: "translate(0px, 0px)" }, { opacity: 1, offset: 0.15, transform: "translate(0px, 0px)" }, { opacity: 1, offset: 0.3, transform: "translate(0px, 0px)" }, { opacity: 0, transform: `translate(${X(1.5) - X(1.3)}px, 0px)` }], t: 2400, d: 900 })}
        opacity={0}>
        <circle cx={0} cy={0} r={9} style={{ fill: "none", stroke: C.accent2, "stroke-width": 2, "stroke-dasharray": "3 2" }} />
      </g>
      <g {...motion(fadeUp(3300, 420, 3))}>
        <text class="t-sub t-strong" x={x0} y={yHit + 70} style={{ fill: C.accent2Text }}>
          A hit at 1.3 s snaps to the beat at 1.5 s
        </text>
        <text class="t-sub" x={x0} y={yHit + 86}>120 BPM: one beat is 0.5 s</text>
      </g>
      <g transform={`translate(${x0} 0)`}>
        <g
          {...motion({
            k: [
              { opacity: 0, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.04, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.96, transform: `translate(${x1 - x0}px, 0px)` },
              { opacity: 0, transform: `translate(${x1 - x0}px, 0px)` },
            ],
            t: 300, d: SWEEP, e: LINEAR,
          })}
          opacity={0}
        >
          <line x1={0} y1={y0 - 4} x2={0} y2={yHit + 28} style={{ stroke: C.ink, "stroke-width": 1.5 }} />
        </g>
      </g>
    </g>
  );
}

export default function BeatGrid({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Grid w={w} narrow={false} />} narrow={(w) => <Grid w={w} narrow />} />
    </VizStage>
  );
}
