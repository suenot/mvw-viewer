import { C } from "../colors";
import { fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Feedback in passes. Each pass adds one thing and the version grows: v1 picture, v2 plus sound,
// v3 plus music cut to the beat. One sentence of feedback per pass.

const PASSES = [
  { v: "v1", say: "Scenes are too fast: slow them down", layers: [{ n: "picture", c: "a" }] },
  { v: "v2", say: "Add sound to every movement", layers: [{ n: "picture", c: "a" }, { n: "sound", c: "b" }] },
  { v: "v3", say: "Pick a track and cut to its beat", layers: [{ n: "picture", c: "a" }, { n: "sound", c: "b" }, { n: "music", c: "c" }] },
];
const FILL = { a: C.accent, b: C.accent2, c: C.accent3 };
const ON = { a: C.onAccent, b: C.onAccent2, c: C.onAccent3 };

function Passes({ w, narrow }: { w: number; narrow: boolean }) {
  const x0 = 12;
  const labelW = narrow ? 0 : 200;
  const rowH = narrow ? 78 : 66;
  const barX = x0 + 28 + labelW;
  const barW = w - barX - 12;
  return (
    <g>
      {PASSES.map((p, i) => {
        const y = 16 + i * (rowH + 8);
        const t = 150 + i * 1000;
        return (
          <g>
            <g {...motion(fadeUp(t, 420, 4))}>
              <rect x={x0} y={y} width={w - 24} height={rowH} rx={6} style={{ fill: C.node, stroke: C.line }} />
              <text class="t-sub t-strong" x={x0 + 10} y={y + 22} style={{ fill: C.accentText }}>{p.v}</text>
              {!narrow && <text class="t-sub" x={x0 + 36} y={y + 22} style={{ "font-size": "10px" }}>{p.say}</text>}
            </g>
            {narrow && (
              <g {...motion(fadeUp(t, 420, 4))}>
                <text class="t-sub" x={x0 + 34} y={y + 22}>{p.say}</text>
              </g>
            )}
            {p.layers.map((l, j) => {
              const ly = narrow ? y + 34 + j * 14 : y + 12 + j * 16;
              return (
                <g transform={`translate(${narrow ? x0 + 10 : barX} ${ly})`}>
                  <g {...motion(growX(t + 300 + j * 80, 520))}>
                    <rect x={0} y={0} width={narrow ? w - 44 : barW} height={11} rx={3} style={{ fill: FILL[l.c as "a"] }} />
                  </g>
                  <g {...motion(fadeIn(t + 500 + j * 80, 300))}>
                    <text class="t-sub t-strong" x={6} y={9} style={{ fill: ON[l.c as "a"], "font-size": "9px" }}>{l.n}</text>
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

export default function FeedbackPasses({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Passes w={w} narrow={false} />} narrow={(w) => <Passes w={w} narrow />} />
    </VizStage>
  );
}
