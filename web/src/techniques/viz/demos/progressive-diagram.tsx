import { C } from "../colors";
import { EASE_SETTLE, LINEAR, fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Reveal order for a flow diagram: nodes first, then the edges between them, then the labels; last,
// the active node keeps full strength and the rest dim (focus and context). The resting picture is
// that final state.

const NAMES = ["Request", "Queue", "Worker"];
const DIM = 0.35;
const DIM_AT = 3000;

/** One animation: appear from `from`, then (unless `full`) fade to the dim level at DIM_AT. */
function appear(tIn: number, dIn: number, from: string, to: string, ease: string, full: boolean) {
  const total = DIM_AT + 400 - tIn;
  return {
    k: [
      { offset: 0, opacity: 0, transform: from, easing: ease },
      { offset: dIn / total, opacity: 1, transform: to },
      { offset: (DIM_AT - tIn) / total, opacity: 1, transform: to },
      { offset: 1, opacity: full ? 1 : DIM, transform: to },
    ],
    t: tIn,
    d: total,
    e: LINEAR,
  };
}

function Flow({ xs, y, r, gap, narrow }: { xs: number[]; y: number; r: number; gap: number; narrow: boolean }) {
  const dim = DIM;
  return (
    <g>
      {xs.slice(0, -1).map((x, i) => {
        const x0 = x + r + gap;
        const len = xs[i + 1] - x - 2 * r - 2 * gap;
        return (
          <g>
            <g transform={`translate(${x0} ${y})`} {...motion(growX(1100 + i * 350, 520), { k: [{ opacity: 1 }, { opacity: dim }], t: DIM_AT, d: 400, e: "ease" })} style={{ opacity: dim }}>
              <line x1={0} y1={0} x2={len} y2={0} style={{ stroke: C.edge, "stroke-width": 3 }} />
            </g>
            <g {...motion({ k: [{ transform: "translate(0px, 0px)", opacity: 0 }, { transform: "translate(0px, 0px)", opacity: 1, offset: 0.1 }, { transform: `translate(${len}px, 0px)`, opacity: 1, offset: 0.9 }, { transform: `translate(${len}px, 0px)`, opacity: 0 }], t: 2000 + i * 500, d: 700, e: LINEAR })} style={{ opacity: 0 }}>
              <circle cx={x0} cy={y} r={4} style={{ fill: C.accent2 }} />
            </g>
          </g>
        );
      })}
      {xs.map((x, i) => (
        <g>
          <g transform={`translate(${x} ${y})`} {...motion(appear(150 + i * 350, 500, "scale(0.8)", "scale(1)", EASE_SETTLE, i === 1))} style={{ opacity: i === 1 ? 1 : dim }}>
            <circle cx={0} cy={0} r={r} style={{ fill: i === 1 ? C.accent : C.node, stroke: C.line, "stroke-width": 2 }} />
          </g>
          <g {...motion(appear(1900 + i * 150, 400, "translate(0px, 3px)", "translate(0px, 0px)", "cubic-bezier(0.23, 1, 0.32, 1)", i === 1))} style={{ opacity: i === 1 ? 1 : dim }}>
            <text class="t-sub t-strong" x={x} y={y + r + 18} text-anchor="middle">{NAMES[i]}</text>
          </g>
        </g>
      ))}
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub" x={xs[0] - r} y={y - r - 26} style={{ fill: C.muted }}>{narrow ? "1 nodes, 2 edges, 3 labels, 4 focus" : "1 nodes, 2 edges, 3 labels, 4 focus on one, dim the rest"}</text>
      </g>
      <g {...motion(fadeUp(3200, 420, 3))}>
        <text class="t-sub" x={xs[0] - r} y={y + r + 46} style={{ fill: C.muted }}>{narrow ? "Hold each step 0.5 to 1.5 s." : "Hold each step 0.5 to 1.5 s so it lands."}</text>
      </g>
    </g>
  );
}

export default function ProgressiveDiagram({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Flow xs={[110, 320, 530]} y={96} r={30} gap={6} narrow={false} />}
        narrow={() => <Flow xs={[52, 168, 284]} y={110} r={26} gap={5} narrow />}
      />
    </VizStage>
  );
}
