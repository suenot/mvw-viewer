import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { boilCircle, jitter, pathOf } from "./pencil";

// A style contract: the same three shapes drawn twice. Row 1 follows one set of tokens (line
// weight 3, redraw amplitude 2, one colour); row 2 has no contract, so each shape picks its
// own weight, wobble and colour.

type Shape = "circle" | "square" | "triangle";
const SHAPES: Shape[] = ["circle", "square", "triangle"];

function outline(shape: Shape, cx: number, cy: number, s: number, seed: number, amp: number) {
  if (shape === "circle") return boilCircle(cx, cy, s, seed, amp, 30);
  const pts: Array<[number, number]> =
    shape === "square"
      ? [[cx - s, cy - s], [cx + s, cy - s], [cx + s, cy + s], [cx - s, cy + s]]
      : [[cx, cy - s], [cx + s, cy + s * 0.85], [cx - s, cy + s * 0.85]];
  // add midpoints so the wobble bends the sides
  const dense: Array<[number, number]> = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    for (let k = 0; k < 6; k += 1) dense.push([p[0] + ((q[0] - p[0]) * k) / 6, p[1] + ((q[1] - p[1]) * k) / 6]);
  });
  return pathOf(jitter(dense, seed, amp));
}

const LOOSE = [
  { w: 1.2, amp: 0.4, c: C.accent2 },
  { w: 5, amp: 4.4, c: C.accent3 },
  { w: 2.4, amp: 1.2, c: C.accentSoft },
];

function Row({ y, x0, x1, s, title, contract, t }: { y: number; x0: number; x1: number; s: number; title: string; contract: boolean; t: number }) {
  const gap = (x1 - x0) / 3;
  return (
    <g>
      <text class="t-sub t-strong" x={x0} y={y - s - 16} {...motion(fadeUp(t, 420, 3))}>
        {title}
      </text>
      {SHAPES.map((shape, i) => {
        const cx = x0 + gap * i + gap / 2;
        const look = contract ? { w: 3, amp: 2, c: C.accent } : LOOSE[i];
        return (
          <path
           
            d={outline(shape, cx, y, s, 40 + i * 7, look.amp)}
            fill="none"
            stroke-linejoin="round"
            stroke-linecap="round"
            style={{ stroke: look.c, "stroke-width": look.w }}
            {...motion(popIn(t + 200 + i * 220, 420, 0.85))}
          />
        );
      })}
    </g>
  );
}

function Tokens({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tokens = ["line 3 px", "redraw 2 px", "one blue", "12 / second"];
  const gap = (x1 - x0) / tokens.length;
  return (
    <g {...motion(fadeIn(50, 400))}>
      {tokens.map((token, i) => (
        <g>
          <rect x={x0 + gap * i + 2} y={y} width={gap - 4} height={22} rx={11} style={{ fill: C.wash, stroke: C.accent }} />
          <text class="t-sub" x={x0 + gap * i + gap / 2} y={y + 15} text-anchor="middle" style={{ fill: C.accentText }}>
            {token}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function StyleDna({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Tokens x0={20} x1={620} y={10} />
            <Row y={108} x0={20} x1={620} s={30} title="With a style contract: the same tokens on every shape" contract t={400} />
            <Row y={214} x0={20} x1={620} s={30} title="Without one: each shape picks its own weight, wobble and colour" contract={false} t={1400} />
          </g>
        )}
        narrow={() => (
          <g>
            <Tokens x0={6} x1={330} y={8} />
            <Row y={118} x0={10} x1={326} s={28} title="With a contract: one set of tokens" contract t={400} />
            <Row y={238} x0={10} x1={326} s={28} title="Without one: every shape differs" contract={false} t={1400} />
          </g>
        )}
      />
    </VizStage>
  );
}
