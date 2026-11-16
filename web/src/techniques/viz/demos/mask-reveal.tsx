import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A cut through the letters. The outgoing scene is a plate with the word BAD on it. In step two the
// word becomes a window: the next scene shows through the letterforms. In step three the window
// grows until the next scene fills the frame.

const STEPS = [
  { size: 0, title: "1  Outgoing word" },
  { size: 54, title: "2  The word is a window" },
  { size: 78, title: "3  The window grows" },
];

function Panel({ i, x, y, pw, ph }: { i: number; x: number; y: number; pw: number; ph: number }) {
  const s = STEPS[i];
  const id = `mr-${i}-${Math.round(x)}-${Math.round(y)}`;
  const cx = x + pw / 2;
  const cy = y + ph / 2;
  return (
    <g {...motion(fadeUp(150 + i * 600, 520, 4))}>
      <text class="t-sub t-strong" x={x} y={y - 8}>{s.title}</text>
      <rect x={x} y={y} width={pw} height={ph} rx={6} style={{ fill: C.accent2 }} />
      <text x={cx} y={cy + 6} text-anchor="middle" style={{ "font-size": "17px", "font-weight": 800, fill: C.onAccent2 }}>WORKFLOWS</text>
      <mask id={id} maskUnits="userSpaceOnUse" x={x} y={y} width={pw} height={ph}>
        <rect x={x} y={y} width={pw} height={ph} fill="#fff" />
        {s.size > 0 && (
          <text x={cx} y={cy + s.size * 0.34} text-anchor="middle" fill="#000" style={{ "font-size": `${s.size}px`, "font-weight": 900, "letter-spacing": "-0.04em" }}>BAD</text>
        )}
      </mask>
      <rect x={x} y={y} width={pw} height={ph} rx={6} mask={`url(#${id})`} style={{ fill: C.accent }} />
      {s.size === 0 && (
        <text x={cx} y={cy + 13} text-anchor="middle" style={{ "font-size": "38px", "font-weight": 900, "letter-spacing": "-0.04em", fill: C.onAccent }}>BAD</text>
      )}
    </g>
  );
}

export default function MaskReveal({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            {[0, 1, 2].map((i) => <Panel i={i} x={14 + i * 208} y={30} pw={198} ph={112} />)}
            <g {...motion(fadeIn(2300, 420))}>
              <text class="t-sub" x={14} y={166}>The destination is revealed through the outgoing word&apos;s own outlines, not faded in.</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            {[0, 1, 2].map((i) => <Panel i={i} x={34} y={26 + i * 134} pw={268} ph={104} />)}
          </g>
        )}
      />
    </VizStage>
  );
}
