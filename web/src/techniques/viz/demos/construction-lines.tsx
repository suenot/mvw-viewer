import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { boilCircle, brokenCircle } from "./pencil";

// Construction lines and broken strokes: three stages of one drawing. Light guides first (a
// box, a cross, a looser circle), then a contour in short strokes with gaps, then both
// together with the guides left faint.

function Guides({ x, y, r, faint }: { x: number; y: number; r: number; faint: boolean }) {
  const o = faint ? 0.45 : 0.9;
  return (
    <g style={{ stroke: C.accent2, "stroke-width": 1, opacity: o }} fill="none">
      <rect x={x - r - 6} y={y - r - 6} width={(r + 6) * 2} height={(r + 6) * 2} stroke-dasharray="3 4" />
      <line x1={x - r - 14} y1={y} x2={x + r + 14} y2={y} />
      <line x1={x} y1={y - r - 14} x2={x} y2={y + r + 14} />
      <path d={boilCircle(x + 3, y - 2, r + 5, 77, 1.2)} stroke-dasharray="2 5" />
    </g>
  );
}

function Stage({ x, y, r, title, guides, strokes, t }: { x: number; y: number; r: number; title: string; guides: boolean; strokes: boolean; t: number }) {
  return (
    <g>
      <text class="t-sub t-strong" x={x} y={y - r - 24} text-anchor="middle" {...motion(fadeUp(t, 420, 3))}>
        {title}
      </text>
      {guides && (
        <g {...motion(fadeIn(t + 120, 500))}>
          <Guides x={x} y={y} r={r} faint={strokes} />
        </g>
      )}
      {strokes && (
        <path d={brokenCircle(x, y, r, 13, 1.6)} fill="none" stroke-linecap="round" style={{ stroke: C.accent, "stroke-width": 2.6 }} {...motion(popIn(t + (guides ? 500 : 120), 520, 0.96))} />
      )}
    </g>
  );
}

export default function ConstructionLines({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Stage x={110} y={118} r={50} title="1. Guides" guides strokes={false} t={100} />
            <Stage x={320} y={118} r={50} title="2. Broken strokes" guides={false} strokes t={900} />
            <Stage x={530} y={118} r={50} title="3. Together" guides strokes t={1700} />
          </g>
        )}
        narrow={() => (
          <g>
            <Stage x={90} y={86} r={38} title="1. Guides" guides strokes={false} t={100} />
            <Stage x={246} y={86} r={38} title="2. Broken strokes" guides={false} strokes t={900} />
            <Stage x={168} y={228} r={44} title="3. Together" guides strokes t={1700} />
          </g>
        )}
      />
    </VizStage>
  );
}
