import { C } from "../colors";
import { fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A locked message and a ban list. Left: six lines in a fixed order, the only words allowed on
// screen. Right: the clichés the brief rules out, each struck through.

const LINES = ["STOP SCROLLING", "AI VIDEO ISN'T EXPENSIVE", "BAD PROMPTING IS", "WORKFLOWS > WISHES", "STEAL THE PROMPT", "@ TECHHALLA"];
const BANNED = ["brains and robots", "sparkles", "soft gradients", "bouncy easing", "particle explosions", "glassmorphism"];

function Lists({ w, narrow }: { w: number; narrow: boolean }) {
  const colW = narrow ? w - 24 : (w - 36) / 2;
  const rx = narrow ? 12 : 24 + colW;
  const rowH = 22;
  const ry0 = narrow ? 20 + LINES.length * rowH + 34 : 20;
  return (
    <g>
      <g {...motion(fadeUp(80, 420, 3))}>
        <text class="t-sub t-strong" x={12} y={14}>Locked message (this order, nothing added)</text>
      </g>
      {LINES.map((l, i) => (
        <g {...motion(fadeUp(250 + i * 240, 380, 4))}>
          <rect x={12} y={22 + i * rowH} width={colW} height={rowH - 4} rx={4} style={{ fill: C.wash, stroke: C.accent }} />
          <text class="t-sub t-strong" x={20} y={22 + i * rowH + 13} style={{ fill: C.accentText }}>{i + 1}</text>
          <text class="t-sub t-strong" x={38} y={22 + i * rowH + 13}>{l}</text>
        </g>
      ))}
      <g {...motion(fadeUp(1700, 420, 3))}>
        <text class="t-sub t-strong" x={rx} y={ry0 - 6}>Banned</text>
      </g>
      {BANNED.map((b, i) => {
        const y = ry0 + i * rowH;
        return (
          <g>
            <g {...motion(fadeUp(1800 + i * 200, 380, 4))}>
              <rect x={rx} y={y} width={colW} height={rowH - 4} rx={4} style={{ fill: C.node, stroke: C.line }} />
              <text class="t-sub" x={rx + 10} y={y + 13}>{b}</text>
            </g>
            <g transform={`translate(${rx + 6} ${y + 9})`}>
              <g {...motion(growX(2100 + i * 200, 360))}>
                <line x1={0} y1={0} x2={colW - 12} y2={0} style={{ stroke: C.accent2, "stroke-width": 2 }} />
              </g>
            </g>
          </g>
        );
      })}
      
    </g>
  );
}

export default function LockedMessage({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Lists w={w} narrow={false} />} narrow={(w) => <Lists w={w} narrow />} />
    </VizStage>
  );
}
