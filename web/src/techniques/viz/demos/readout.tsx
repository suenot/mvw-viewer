import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A number as a readout: two 9:16 frames of the same drop tower. Left, a slam: a large
// "50 M" over the picture (8 % of the frame height). Right, a readout: a thin measuring line
// and a small "50 M" beside the tower (about 3.5 %), arriving on the spoken number.

function Frame({ x, y, w, h, slam, label }: { x: number; y: number; w: number; h: number; slam: boolean; label: string }) {
  const towerX = x + w * 0.38;
  const towerW = w * 0.1;
  const top = y + h * 0.24;
  const base = y + h * 0.86;
  const fs = h * (slam ? 0.08 : 0.035);
  return (
    <g>
      <text class="t-sub t-strong" x={x + w / 2} y={y - 10} text-anchor="middle" {...motion(fadeUp(100, 420, 3))}>
        {label}
      </text>
      <g {...motion(fadeIn(150, 400))}>
        <rect x={x} y={y} width={w} height={h} rx={6} style={{ fill: C.node, stroke: C.line }} />
        <rect x={towerX} y={top} width={towerW} height={base - top} style={{ fill: C.accentSoft }} />
        <rect x={towerX - towerW * 0.7} y={top} width={towerW * 2.4} height={h * 0.03} style={{ fill: C.accent }} />
        <line x1={x + 6} y1={base} x2={x + w - 6} y2={base} style={{ stroke: C.edge }} />
      </g>
      {slam ? (
        <text x={x + w / 2} y={y + h * 0.58} text-anchor="middle" style={{ fill: C.accent2Text, "font-size": `${fs}px`, "font-weight": 800 }} {...motion(popIn(900, 380, 1.5))}>
          50 M
        </text>
      ) : (
        <g {...motion(fadeUp(1400, 420, 3))}>
          <line x1={towerX + towerW + 6} y1={top} x2={towerX + towerW + 6} y2={base} style={{ stroke: C.ink, "stroke-width": 1 }} />
          <line x1={towerX + towerW + 3} y1={top} x2={towerX + towerW + 9} y2={top} style={{ stroke: C.ink }} />
          <line x1={towerX + towerW + 3} y1={base} x2={towerX + towerW + 9} y2={base} style={{ stroke: C.ink }} />
          <text x={towerX + towerW + 14} y={(top + base) / 2 + fs / 3} style={{ fill: C.ink, "font-size": `${fs}px`, "font-weight": 700 }}>
            50 M
          </text>
        </g>
      )}
    </g>
  );
}

export default function Readout({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Frame x={104} y={30} w={190} h={338} slam label="Slam: large, over the picture" />
            <Frame x={346} y={30} w={190} h={338} slam={false} label="Readout: small, beside the tower" />
          </g>
        )}
        narrow={() => (
          <g>
            <Frame x={10} y={34} w={152} h={270} slam label="Slam: over the picture" />
            <Frame x={174} y={34} w={152} h={270} slam={false} label="Readout: beside the tower" />
          </g>
        )}
      />
    </VizStage>
  );
}
