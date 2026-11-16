import { C } from "../colors";
import { EASE_SETTLE, LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// One shape, never cut: the same element passes through four states. A ring outline travels from
// card to card to show that nothing is replaced. Each card shows the state at its beat; the
// text inside swaps with a short blur (here shown as a fade).

type State = { t: string; name: string; draw: (cx: number, cy: number) => any };

const STATES: State[] = [
  { t: "0.0 s", name: "mascot", draw: (cx, cy) => <circle cx={cx} cy={cy} r={14} style={{ fill: C.accent }} /> },
  { t: "1.0 s", name: "play button", draw: (cx, cy) => (
    <g>
      <rect x={cx - 22} y={cy - 22} width={44} height={44} rx={12} style={{ fill: C.accent }} />
      <path d={`M${cx - 6} ${cy - 10} L${cx + 11} ${cy} L${cx - 6} ${cy + 10} Z`} style={{ fill: C.onAccent }} />
    </g>
  ) },
  { t: "2.0 s", name: "loader", draw: (cx, cy) => (
    <g>
      <circle cx={cx} cy={cy} r={18} fill="none" style={{ stroke: C.wash, "stroke-width": 6 }} />
      <path d={`M${cx} ${cy - 18} A18 18 0 0 1 ${cx + 18} ${cy}`} fill="none" style={{ stroke: C.accent, "stroke-width": 6 }} stroke-linecap="round" />
    </g>
  ) },
  { t: "2.5 s", name: "timeline", draw: (cx, cy) => (
    <g>
      <rect x={cx - 34} y={cy - 10} width={68} height={20} rx={10} style={{ fill: C.accent }} />
      <circle cx={cx + 8} cy={cy} r={6} style={{ fill: C.onAccent }} />
    </g>
  ) },
];

function Strip({ w, cols, cardH, y0 }: { w: number; cols: number; cardH: number; y0: number }) {
  const gap = 10;
  const cw = (w - 20 - gap * (cols - 1)) / cols;
  const pos = (i: number) => ({ x: 10 + (i % cols) * (cw + gap), y: y0 + Math.floor(i / cols) * (cardH + gap) });
  const center = (i: number) => ({ x: pos(i).x + cw / 2, y: pos(i).y + cardH / 2 - 8 });
  const last = center(STATES.length - 1);
  const rel = (i: number) => `translate(${center(i).x - last.x}px, ${center(i).y - last.y}px)`;
  // dwell on each state, then spring to the next; the final keyframe is the resting state
  const keys: Keyframe[] = [];
  STATES.forEach((_, i) => {
    const start = i * 0.3;
    keys.push({ offset: start, transform: rel(i) });
    keys.push({ offset: Math.min(1, start + 0.1), transform: rel(i), easing: EASE_SETTLE });
  });
  keys[keys.length - 1].offset = 1;
  return (
    <g>
      {STATES.map((s, i) => {
        const p = pos(i);
        const c = center(i);
        return (
          <g {...motion(fadeUp(120 + i * 160, 420, 4))}>
            <rect x={p.x} y={p.y} width={cw} height={cardH} rx={6} style={{ fill: C.node, stroke: C.line }} />
            {s.draw(c.x, c.y)}
            <text class="t-sub t-strong" x={p.x + cw / 2} y={p.y + cardH - 18} text-anchor="middle">{s.name}</text>
            <text class="t-sub" x={p.x + cw / 2} y={p.y + cardH - 6} text-anchor="middle">{s.t}</text>
          </g>
        );
      })}
      <g {...motion({ k: keys, t: 900, d: 3600, e: LINEAR })}>
        <g transform={`translate(${last.x} ${last.y})`}>
          <circle cx={0} cy={0} r={31} fill="none" style={{ stroke: C.accent2, "stroke-width": 2, "stroke-dasharray": "4 3" }} />
        </g>
      </g>
      <g {...motion(fadeIn(1600, 420))}>
        <text class="t-sub" x={10} y={y0 + (STATES.length > cols ? 2 : 1) * (cardH + gap) + 6}>One element; springs on size, radius, colour.</text>
      </g>
    </g>
  );
}

export default function OneShape({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={(w) => <Strip w={w} cols={4} cardH={108} y0={20} />}
        narrow={(w) => <Strip w={w} cols={2} cardH={100} y0={16} />}
      />
    </VizStage>
  );
}
