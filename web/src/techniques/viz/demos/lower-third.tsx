import { C } from "../colors";
import { EASE_OUT, fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A 16:9 frame with a dashed 6 % title-safe line. The strap builds in under a second from empty and
// then stands still. Below, the clip as a strip: empty lead, build-in, still hold, build-out,
// empty tail. The first and last frames carry nothing, so the clip never pops on or off in the edit.

const SEGS: Array<[string, number, string]> = [
  ["lead", 0.2, C.line],
  ["in 0.8 s", 0.8, C.accent],
  ["still hold 5.5 s", 5.5, C.accentSoft],
  ["out 0.5", 0.5, C.accent2],
  ["tail", 0.2, C.line],
];
const TOTAL = SEGS.reduce((a, [, s]) => a + s, 0);

function Frame({ x, y, w }: { x: number; y: number; w: number }) {
  const h = (w * 9) / 16;
  const safe = w * 0.06;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} style={{ fill: C.grid, stroke: C.line }} />
      <rect x={x + safe} y={y + safe * 1.6} width={w - 2 * safe} height={h - 3.2 * safe} fill="none" style={{ stroke: C.faint, "stroke-dasharray": "3 4" }} />
      <g {...motion({ k: [{ opacity: 0, transform: "translate(-22px, 0px)" }, { opacity: 1, transform: "translate(0px, 0px)" }], t: 600, d: 800, e: EASE_OUT })}>
        <rect x={x + safe + 4} y={y + h - safe * 1.6 - 38} width={w * 0.5} height={36} rx={3} style={{ fill: C.ink }} />
        <rect x={x + safe + 4} y={y + h - safe * 1.6 - 38} width={4} height={36} style={{ fill: C.accent2 }} />
        <text class="t-sub t-strong" x={x + safe + 16} y={y + h - safe * 1.6 - 22} style={{ fill: C.bg }}>Maya Chen</text>
        <text class="t-sub" x={x + safe + 16} y={y + h - safe * 1.6 - 8} style={{ fill: C.bg }}>Host</text>
      </g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub" x={x} y={y - 6} style={{ fill: C.muted }}>Frame with title-safe line</text>
      </g>
    </g>
  );
}

function Strip({ x, y, w, narrow }: { x: number; y: number; w: number; narrow: boolean }) {
  let acc = 0;
  return (
    <g>
      {SEGS.map(([label, s, fill], i) => {
        const x0 = x + (acc / TOTAL) * w;
        const sw = (s / TOTAL) * w;
        acc += s;
        return (
          <g transform={`translate(${x0} ${y})`} {...motion(growX(300 + i * 160, 420))}>
            <rect x={0.5} y={0} width={Math.max(sw - 1, 2)} height={22} style={{ fill, stroke: C.line }} />
            {sw > 50 ? <text class="t-sub t-strong" x={sw / 2} y={15} text-anchor="middle" style={{ fill: C.onLight }}>{label}</text> : null}
          </g>
        );
      })}
      <g {...motion(fadeUp(1200, 420, 3))}>
        <text class="t-sub" x={x} y={y + 40} style={{ fill: C.muted }}>{narrow ? "Empty, build in, hold still, build out, empty." : "Empty first and last frame;"}</text>
        <text class="t-sub" x={x} y={y + 56} style={{ fill: C.muted }}>{narrow ? "Alpha: WebM or .mov; an MP4 needs a ground." : "the hold does not move."}</text>
        {narrow ? null : <text class="t-sub" x={x} y={y + 72} style={{ fill: C.muted }}>Alpha: WebM or .mov; an MP4 needs a ground.</text>}
      </g>
    </g>
  );
}

export default function LowerThird({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Frame x={36} y={24} w={260} />
            <Strip x={330} y={64} w={274} narrow={false} />
          </g>
        )}
        narrow={() => (
          <g>
            <Frame x={38} y={24} w={260} />
            <Strip x={12} y={212} w={312} narrow />
          </g>
        )}
      />
    </VizStage>
  );
}
