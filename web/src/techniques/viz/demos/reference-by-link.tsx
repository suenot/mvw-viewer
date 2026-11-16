import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Reference by link: a post link goes in, a short style read comes out (palette, type, camera,
// beat grid, cursor), and the style is applied to a different story.

function Chain({ w, vertical }: { w: number; vertical: boolean }) {
  const bw = vertical ? w - 24 : (w - 24 - 2 * 34) / 3;
  const bh = vertical ? 78 : 112;
  const pos = (i: number) => (vertical ? { x: 12, y: 14 + i * (bh + 28) } : { x: 12 + i * (bw + 34), y: 28 });
  const boxes = [
    { title: "1  A post you like", lines: ["x.com/…/status/…", "link only, no file path"] },
    { title: "2  The style, read out", lines: ["palette, type, camera", "beat grid, cursor, springs"] },
    { title: "3  Your story, that style", lines: ["new words and facts", "same grammar of motion"] },
  ];
  return (
    <g>
      {boxes.map((b, i) => {
        const { x, y } = pos(i);
        return (
          <g>
            <g {...motion(fadeUp(120 + i * 700, 460, 4))}>
              <rect x={x} y={y} width={bw} height={bh} rx={8} style={{ fill: i === 1 ? C.wash : C.node, stroke: i === 1 ? C.accent : C.line }} />
              <text class="t-sub t-strong" x={x + 12} y={y + 24}>{b.title}</text>
              <text class="t-sub t-mono" x={x + 12} y={y + 46}>{b.lines[0]}</text>
              <text class="t-sub" x={x + 12} y={y + 64}>{b.lines[1]}</text>
            </g>
            {i < 2 && (
              <g {...motion(fadeIn(450 + i * 700, 320))}>
                {vertical ? (
                  <text class="t-strong" x={w / 2} y={y + bh + 20} text-anchor="middle" style={{ "font-size": "16px", fill: C.accent }}>↓</text>
                ) : (
                  <text class="t-strong" x={x + bw + 17} y={y + bh / 2 + 6} text-anchor="middle" style={{ "font-size": "18px", fill: C.accent }}>→</text>
                )}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function ReferenceByLink({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Chain w={w} vertical={false} />} narrow={(w) => <Chain w={w} vertical />} />
    </VizStage>
  );
}
