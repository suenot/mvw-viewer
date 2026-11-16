import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Storyboard before code. Six beat cards are written out and approved; only then does code start,
// and the first render is one still per beat, checked and fixed before the full render.

const CARDS = [
  { t: "0.0", text: "mascot idles" },
  { t: "1.0", text: "squash to play" },
  { t: "2.0", text: "check draws" },
  { t: "5.0", text: "bezier editor" },
  { t: "8.5", text: "render bar fills" },
  { t: "12.0", text: "toast, back to start" },
];
const FLOW = ["Storyboard", "You approve", "Code", "One still per beat", "Fix, then render"];

function Board({ w, cols }: { w: number; cols: number }) {
  const gap = 8;
  const cw = (w - 20 - gap * (cols - 1)) / cols;
  const ch = 46;
  const rows = Math.ceil(CARDS.length / cols);
  const flowY = 20 + rows * (ch + gap) + 22;
  const fw = (w - 20 - gap * (FLOW.length - 1)) / FLOW.length;
  const vertical = cols === 2;
  return (
    <g>
      {CARDS.map((c, i) => {
        const x = 10 + (i % cols) * (cw + gap);
        const y = 14 + Math.floor(i / cols) * (ch + gap);
        return (
          <g {...motion(fadeUp(100 + i * 170, 420, 4))}>
            <rect x={x} y={y} width={cw} height={ch} rx={5} style={{ fill: C.node, stroke: C.line }} />
            <text class="t-sub t-strong" x={x + 8} y={y + 18} style={{ fill: C.accentText }}>{c.t} s</text>
            <text class="t-sub" x={x + 8} y={y + 34}>{c.text}</text>
          </g>
        );
      })}
      {FLOW.map((f, i) => {
        const x = vertical ? 10 : 10 + i * (fw + gap);
        const y = vertical ? flowY + i * 28 : flowY;
        const bw = vertical ? w - 20 : fw;
        const done = i === 1;
        return (
          <g {...motion(fadeUp(1300 + i * 260, 420, 4))}>
            <rect x={x} y={y} width={bw} height={vertical ? 22 : 34} rx={5} style={{ fill: done ? C.accent3 : C.wash, stroke: done ? C.accent3 : C.accent }} />
            <text class="t-sub t-strong" x={x + bw / 2} y={y + (vertical ? 15 : 21)} text-anchor="middle" style={{ fill: done ? C.onAccent3 : C.accentText }}>{f}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function StoryboardFirst({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Board w={w} cols={3} />} narrow={(w) => <Board w={w} cols={2} />} />
    </VizStage>
  );
}
