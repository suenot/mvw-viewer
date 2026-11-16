import { C } from "../colors";
import { EASE_OUT, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Reduced motion in three tiers instead of off. Tier 1 (vestibular triggers) is removed, tier 2 keeps
// the fact of a change but swaps the movement for a short fade, tier 3 (colour and opacity, focus,
// progress) stays. Each row shows the normal version and the reduced version.

type Row = { tier: string; name: string; normal: string; reduced: string };
const ROWS: Row[] = [
  { tier: "Tier 1", name: "Remove", normal: "big slide, 600 ms", reduced: "static" },
  { tier: "Tier 2", name: "Soften", normal: "slide, 600 ms", reduced: "fade, 150 ms" },
  { tier: "Tier 3", name: "Keep", normal: "colour fade", reduced: "colour fade" },
];

function Cell({ x, y, w, row, reduced }: { x: number; y: number; w: number; row: number; reduced: boolean }) {
  const bw = 34;
  const x1 = x + w - bw - 4;
  const slide = (d: number, dist: number) => motion({ k: [{ transform: `translate(${-dist}px, 0px)` }, { transform: "translate(0px, 0px)" }], t: 500, d, e: EASE_OUT });
  const fade = (d: number) => motion({ k: [{ opacity: 0 }, { opacity: 1 }], t: 500, d, e: "ease" });
  let spec: Record<string, string> = {};
  if (row === 0) spec = reduced ? {} : slide(600, w - bw - 8);
  if (row === 1) spec = reduced ? fade(150) : slide(600, 70);
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={4} style={{ fill: C.node, stroke: C.line }} />
      {row === 2 ? (
        <g>
          <rect x={x1} y={y + 4} width={bw} height={18} rx={3} style={{ fill: C.accent2 }} />
          <g {...motion({ k: [{ opacity: 0 }, { opacity: 1 }], t: 500, d: 300, e: "ease" })}>
            <rect x={x1} y={y + 4} width={bw} height={18} rx={3} style={{ fill: C.accent }} />
          </g>
        </g>
      ) : (
        <g {...spec}>
          <rect x={x1} y={y + 4} width={bw} height={18} rx={3} style={{ fill: C.accent }} />
        </g>
      )}
    </g>
  );
}

export default function ReducedMotionTiers({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <g {...motion(fadeIn(80, 300))}>
              <text class="t-sub t-strong" x={250} y={24}>Normal</text>
              <text class="t-sub t-strong" x={440} y={24}>prefers-reduced-motion</text>
            </g>
            {ROWS.map((r, i) => {
              const y = 40 + i * 50;
              return (
                <g>
                  <g {...motion(fadeIn(150 + i * 120, 300))}>
                    <text class="t-sub t-strong" x={36} y={y + 11}>{r.tier}: {r.name}</text>
                  </g>
                  <Cell x={250} y={y} w={150} row={i} reduced={false} />
                  <Cell x={440} y={y} w={150} row={i} reduced />
                  <g {...motion(fadeUp(1000 + i * 120, 360, 3))}>
                    <text class="t-sub" x={250} y={y + 42} style={{ fill: C.muted }}>{r.normal}</text>
                    <text class="t-sub" x={440} y={y + 42} style={{ fill: C.muted }}>{r.reduced}</text>
                  </g>
                </g>
              );
            })}
          </g>
        )}
        narrow={() => (
          <g>
            {ROWS.map((r, i) => {
              const y = 40 + i * 92;
              return (
                <g>
                  <g {...motion(fadeIn(150 + i * 120, 300))}>
                    <text class="t-sub t-strong" x={12} y={y - 10}>{r.tier}: {r.name}</text>
                  </g>
                  <Cell x={12} y={y} w={145} row={i} reduced={false} />
                  <Cell x={179} y={y} w={145} row={i} reduced />
                  <g {...motion(fadeUp(1000 + i * 120, 360, 3))}>
                    <text class="t-sub" x={12} y={y + 42} style={{ fill: C.muted }}>{r.normal}</text>
                    <text class="t-sub" x={179} y={y + 42} style={{ fill: C.muted }}>{r.reduced}</text>
                  </g>
                </g>
              );
            })}
            <g {...motion(fadeIn(80, 300))}>
              <text class="t-sub t-strong" x={12} y={18}>Normal</text>
              <text class="t-sub t-strong" x={179} y={18}>Reduced motion</text>
            </g>
          </g>
        )}
      />
    </VizStage>
  );
}
