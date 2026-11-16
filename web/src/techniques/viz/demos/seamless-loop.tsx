import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { px1, sampleKeys } from "./curves";

// Two 14 s loops drawn as rings. Left: the last frame is not the first, so the dot snaps back at the
// seam. Right: t - 14 * floor(t / 14) wraps time and the last frame equals the first, so the dot
// closes the ring and starts again with no jump.

const SPAN = 2400;

function Ring({ cx, cy, r, sweep, bad, title, note }: { cx: number; cy: number; r: number; sweep: number; bad: boolean; title: string; note: string }) {
  const at = (deg: number) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
  const [endX, endY] = at(sweep);
  const [sx, sy] = at(0);
  return (
    <g>
      <g {...motion(fadeIn(80, 360))}>
        <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: C.grid, "stroke-width": 2 }} />
        <line x1={sx} y1={sy - 8} x2={sx} y2={sy + 8} style={{ stroke: C.ink, "stroke-width": 2 }} />
        <text class="t-sub" x={cx} y={cy + 4} text-anchor="middle">14 s</text>
        <text class="t-sub" x={sx} y={sy - 14} text-anchor="middle">0 s</text>
      </g>
      <circle cx={endX} cy={endY} r={6} style={{ fill: bad ? C.accent2 : C.accent }}
        {...motion({
          k: sampleKeys(48, (u) => {
            const [x, y] = at(u * sweep);
            return { transform: `translate(${px1(x - endX)}px, ${px1(y - endY)}px)` };
          }),
          t: 400, d: SPAN, e: LINEAR, i: 2,
        })} />
      <g {...motion(fadeUp(600, 420, 3))}>
        <text class="t-sub t-strong" x={cx} y={cy + r + 22} text-anchor="middle" style={{ fill: bad ? C.accent2Text : C.accent3Text }}>{title}</text>
        <text class="t-sub" x={cx} y={cy + r + 38} text-anchor="middle">{note}</text>
      </g>
    </g>
  );
}

export default function SeamlessLoop({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Ring cx={170} cy={92} r={52} sweep={318} bad title="Last frame is not the first" note="the dot jumps back at the seam" />
            <Ring cx={470} cy={92} r={52} sweep={360} bad={false} title="t - 14 * floor(t / 14)" note="last frame equals the first: no jump" />
          </g>
        )}
        narrow={() => (
          <g>
            <Ring cx={168} cy={68} r={46} sweep={318} bad title="Last frame is not the first" note="the dot jumps back at the seam" />
            <Ring cx={168} cy={206} r={46} sweep={360} bad={false} title="t - 14 * floor(t / 14)" note="last frame equals the first: no jump" />
          </g>
        )}
      />
    </VizStage>
  );
}
