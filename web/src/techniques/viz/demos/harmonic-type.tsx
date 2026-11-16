import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { contour, dft, pathOf, resampleClosed, selectLargest, type Pt } from "./harmonics";

// A letter is several closed contours. Filled as one compound path with the even-odd rule the hole
// of the "O" and the "A" stays open; with the non-zero rule, when the contours run the same way,
// the hole is filled in. Both letters are rebuilt from 16 harmonics per contour.

const ring = (rx: number, ry: number, n = 64): Pt[] => Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2) * rx, Math.sin((i / n) * Math.PI * 2) * ry] as Pt);
const smooth = (poly: Pt[]) => contour(selectLargest(dft(resampleClosed(poly, 96)), 16), 96);

// Both contours of a glyph run the same way (clockwise on screen).
const O_OUT = smooth(ring(1, 1.25));
const O_IN = smooth(ring(0.48, 0.78));
const A_OUT = smooth([[0, -1.25], [1, 1.25], [0.62, 1.25], [0.5, 0.78], [-0.5, 0.78], [-0.62, 1.25], [-1, 1.25]]);
const A_IN = smooth([[0, -0.5], [0.32, 0.35], [-0.32, 0.35]]);

function Glyphs({ x, y, s, rule, label, bad }: { x: number; y: number; s: number; rule: "evenodd" | "nonzero"; label: string; bad: boolean }) {
  const d = (out: Pt[], inn: Pt[], cx: number) => pathOf(out, cx, y, s) + pathOf(inn, cx, y, s);
  return (
    <g>
      <g {...motion(fadeIn(100, 400))}>
        <text class="t-sub t-strong" x={x} y={y - s * 1.25 - 14}>{label}</text>
      </g>
      <g {...motion(fadeUp(400, 500, 4))}>
        <path d={d(O_OUT, O_IN, x + s * 1.1)} fill-rule={rule} style={{ fill: C.accent, stroke: C.line }} />
        <path d={d(A_OUT, A_IN, x + s * 3.5)} fill-rule={rule} style={{ fill: C.accent, stroke: C.line }} />
      </g>
      <g {...motion(fadeIn(1100, 420))}>
        <text class="t-sub t-strong" x={x} y={y + s * 1.25 + 22} style={{ fill: bad ? C.accent2Text : C.accent3Text }}>
          {bad ? "Holes filled in" : "Holes stay open"}
        </text>
      </g>
    </g>
  );
}

export default function HarmonicType({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Glyphs x={30} y={96} s={34} rule="nonzero" label="Non-zero fill" bad />
            <Glyphs x={350} y={96} s={34} rule="evenodd" label="Even-odd fill: one compound path" bad={false} />
          </g>
        )}
        narrow={() => (
          <g>
            <Glyphs x={20} y={78} s={30} rule="nonzero" label="Non-zero fill" bad />
            <Glyphs x={20} y={226} s={30} rule="evenodd" label="Even-odd fill: one compound path" bad={false} />
          </g>
        )}
      />
    </VizStage>
  );
}
