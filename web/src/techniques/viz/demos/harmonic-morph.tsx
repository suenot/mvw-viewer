import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { contour, dft, frameStack, mix, normalize, pathOf, resampleClosed, selectLargest, type Pt } from "./harmonics";

// A closed outline as complex harmonics. Morphing is interpolating the coefficients of two shapes
// that share a fixed set of harmonics; the budget (how many harmonics are kept) trades detail for
// smoothness. Computed here from two polygons with a real DFT.

const star: Pt[] = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? 0.45 : 1;
  return [Math.cos(a) * r, Math.sin(a) * r] as Pt;
});
const house: Pt[] = [[0, -1], [0.9, -0.2], [0.9, 0.9], [-0.9, 0.9], [-0.9, -0.2]];
const N = 96;
const A = dft(resampleClosed(normalize(star), N));
const B = dft(resampleClosed(normalize(house), N));
const A12 = selectLargest(A, 12);
const B12 = selectLargest(B, 12);
const FRAMES = 14;
const frames = Array.from({ length: FRAMES }, (_, i) => contour(mix(A12, B12, i / (FRAMES - 1)), 120));
const ghostA = contour(A, 120);
const ghostB = contour(B, 120);
const budgets = [2, 6, 24].map((b) => ({ b, pts: contour(selectLargest(A, b), 120) }));

function Morph({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  return (
    <g>
      <path d={pathOf(ghostA, cx, cy, s)} fill="none" style={{ stroke: C.line, "stroke-dasharray": "3 4" }} />
      <path d={pathOf(ghostB, cx, cy, s)} fill="none" style={{ stroke: C.line, "stroke-dasharray": "3 4" }} />
      {frames.map((pts, i) => (
        <path d={pathOf(pts, cx, cy, s)} {...motion(frameStack(i, FRAMES, 500, 2600))} style={{ fill: C.accentSoft, stroke: C.accent, "stroke-width": 2, "stroke-linejoin": "round", opacity: i === FRAMES - 1 ? 1 : 0 }} />
      ))}
    </g>
  );
}

function Budget({ xs, cy, s, labelY }: { xs: number[]; cy: number; s: number; labelY: number }) {
  return (
    <g>
      {budgets.map(({ b, pts }, i) => (
        <g {...motion(popIn(300 + i * 350, 480, 0.9))}>
          <g transform={`translate(${xs[i]} ${cy})`}>
            <path d={pathOf(pts, 0, 0, s)} style={{ fill: C.wash, stroke: C.accent2, "stroke-width": 2, "stroke-linejoin": "round" }} />
          </g>
          <text class="t-sub" x={xs[i]} y={labelY} text-anchor="middle">
            {b} harmonics
          </text>
        </g>
      ))}
    </g>
  );
}

export default function HarmonicMorph({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <g {...motion(fadeIn(80, 400))}>
              <text class="t-sub t-strong" x={20} y={24}>Morph: mix 12 harmonics, alpha 0 to 1</text>
              <text class="t-sub t-strong" x={350} y={24}>Budget: detail against smoothness</text>
            </g>
            <Morph cx={165} cy={120} s={78} />
            <Budget xs={[395, 485, 575]} cy={112} s={38} labelY={176} />
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub" x={350} y={196}>Few harmonics: a soft blob. Many: the corners return.</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            <g {...motion(fadeIn(80, 400))}>
              <text class="t-sub t-strong" x={12} y={22}>Morph: mix 12 harmonics, alpha 0 to 1</text>
            </g>
            <Morph cx={168} cy={108} s={72} />
            <g {...motion(fadeIn(120, 400))}>
              <text class="t-sub t-strong" x={12} y={212}>Budget: detail against smoothness</text>
            </g>
            <Budget xs={[56, 168, 280]} cy={262} s={36} labelY={314} />
          </g>
        )}
      />
    </VizStage>
  );
}
