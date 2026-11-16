import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Two ways to draw frame t. Top row: renderAt(t) is a pure function, so any time can be sought and
// the frame is always the same. Bottom row: a frame depends on the previous one, so after a jump to
// 3.6 s the picture is wrong, it still shows the last position that was played.

const TS = [0, 1.2, 2.4, 3.6, 4.8];
const TOTAL = 4.8;
const ease = (u: number) => u * u * (3 - 2 * u);

function Rows({ w, narrow }: { w: number; narrow: boolean }) {
  const x0 = 12;
  const gap = 6;
  const bw = (w - 2 * x0 - gap * 4) / 5;
  const bh = narrow ? 50 : 60;
  const rows = [
    { y: narrow ? 40 : 44, title: "renderAt(t): a pure function of time", good: true },
    { y: narrow ? 172 : 176, title: "state += step: a frame depends on the last one", good: false },
  ];
  return (
    <g>
      {rows.map((row, r) => (
        <g>
          <g {...motion(fadeUp(80 + r * 300, 420, 3))}>
            <text class="t-sub t-strong" x={x0} y={row.y - 12}>
              {row.title}
            </text>
          </g>
          {TS.map((t, i) => {
            const bx = x0 + i * (bw + gap);
            const shown = row.good || i < 3 ? t : 2.4; // after the jump the stateful frame keeps the old position
            const wrong = !row.good && i >= 3;
            const cx = bx + 12 + ease(shown / TOTAL) * (bw - 24);
            return (
              <g {...motion(fadeUp(300 + i * 220 + r * 500, 420, 4))}>
                <rect x={bx} y={row.y} width={bw} height={bh} rx={5} style={{ fill: C.node, stroke: wrong ? C.accent2 : C.line, "stroke-width": wrong ? 2 : 1 }} />
                <circle cx={cx} cy={row.y + bh / 2} r={8} style={{ fill: wrong ? C.accent2 : C.accent }} />
                <text class="t-sub" x={bx + bw / 2} y={row.y + bh + 14} text-anchor="middle">
                  {t.toFixed(1)} s
                </text>
              </g>
            );
          })}
          <g {...motion(fadeIn(1900 + r * 300, 420))}>
            <text class="t-sub t-strong" x={x0} y={row.y + bh + 34} style={{ fill: row.good ? C.accent3Text : C.accent2Text }}>
              {row.good ? "Seek to 3.6 s: always the same frame" : "Seek to 3.6 s: wrong frame (orange)"}
            </text>
          </g>
        </g>
      ))}
    </g>
  );
}

export default function SeekableFrame({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Rows w={w} narrow={false} />} narrow={(w) => <Rows w={w} narrow />} />
    </VizStage>
  );
}
