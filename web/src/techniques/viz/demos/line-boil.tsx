import { C } from "../colors";
import { fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { boilCircle, hiddenStyle, stepped } from "./pencil";

// Line boil: one contour redrawn at 12 drawings a second. Left, the contour in motion (one
// drawing every 83 ms); right, the six drawings of half a second laid over each other.

const COUNT = 6;
const STEP = 1000 / 12;
const SEEDS = [11, 23, 37, 41, 59, 67];

function Panel({ x, y, r, label, stacked }: { x: number; y: number; r: number; label: string; stacked: boolean }) {
  return (
    <g>
      <text class="t-sub t-strong" x={x} y={y - r - 14} text-anchor="middle" {...motion(fadeUp(100, 420, 3))}>
        {label}
      </text>
      {SEEDS.map((seed, i) => (
        <path
         
          d={boilCircle(x, y, r, seed, 2.6)}
          fill="none"
          stroke-linejoin="round"
          style={stacked ? { stroke: C.accent, "stroke-width": 1.2, opacity: 0.55 } : { stroke: C.accent, "stroke-width": 2.6, ...(i === 0 ? {} : hiddenStyle) }}
          {...(stacked ? motion(fadeUp(300 + i * 120, 360, 0)) : motion(stepped(i, COUNT, STEP, 500)))}
        />
      ))}
      <circle cx={x} cy={y} r={2.2} style={{ fill: C.muted }} />
    </g>
  );
}

export default function LineBoil({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Panel x={170} y={108} r={62} label="In motion: one drawing every 83 ms" stacked={false} />
            <Panel x={470} y={108} r={62} label="Six drawings of half a second, overlaid" stacked />
          </g>
        )}
        narrow={() => (
          <g>
            <Panel x={168} y={96} r={54} label="In motion: a new drawing every 83 ms" stacked={false} />
            <Panel x={168} y={252} r={54} label="Six drawings of half a second, overlaid" stacked />
          </g>
        )}
      />
    </VizStage>
  );
}
