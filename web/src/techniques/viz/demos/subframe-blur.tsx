import { C } from "../colors";
import { LINEAR, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// The same fast ball, two ways. Left: one sample per frame, so it is a sharp disc that hops.
// Right: four subframes blended, so each frame holds a short streak and the motion reads as smooth.

const TRAVEL = 1500;

function Panel({ x, y, w, h, blur, title, note }: { x: number; y: number; w: number; h: number; blur: boolean; title: string; note: string }) {
  const run = w - 70;
  const ghosts = [
    { lag: 11, o: 0.5 },
    { lag: 22, o: 0.32 },
    { lag: 33, o: 0.18 },
  ];
  return (
    <g transform={`translate(${x} ${y})`}>
      <g {...motion(fadeUp(100, 420, 3))}>
        <text class="t-sub t-strong" x={0} y={-8}>{title}</text>
        <rect x={0} y={0} width={w} height={h} rx={6} style={{ fill: C.node, stroke: C.line }} />
      </g>
      <g transform={`translate(0 ${h / 2})`}>
        <g {...motion({ k: [{ transform: "translate(34px, 0px)" }, { transform: `translate(${34 + run}px, 0px)` }], t: 500, d: TRAVEL, e: LINEAR, i: 2 })}>
          {blur && ghosts.map((g) => <circle cx={-g.lag} cy={0} r={11} style={{ fill: C.accent, opacity: g.o }} />)}
          <circle cx={0} cy={0} r={11} style={{ fill: C.accent }} />
        </g>
      </g>
      <g {...motion(fadeUp(800, 420, 3))}>
        <text class="t-sub" x={0} y={h + 16}>{note}</text>
      </g>
    </g>
  );
}

export default function SubframeBlur({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Panel x={14} y={30} w={296} h={92} blur={false} title="1 sample per frame" note="sharp, steps from frame to frame" />
            <Panel x={330} y={30} w={296} h={92} blur title="4 subframes blended" note="t, t + 1/4, t + 1/2, t + 3/4 of 1/60 s" />
          </g>
        )}
        narrow={() => (
          <g>
            <Panel x={10} y={28} w={316} h={84} blur={false} title="1 sample per frame" note="sharp, steps from frame to frame" />
            <Panel x={10} y={160} w={316} h={84} blur title="4 subframes blended" note="t, t + 1/4, t + 1/2, t + 3/4 of 1/60 s" />
          </g>
        )}
      />
    </VizStage>
  );
}
