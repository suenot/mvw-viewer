import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Per-glyph kinetic type: every letter is its own element with its own spring, started 125 ms
// (a 1/16 note at 120 BPM) after the one before it. Below, one tick per letter shows the stagger.

const WORD = "STEAL";
const STAGGER = 125;

function Word({ w, size, y }: { w: number; size: number; y: number }) {
  const step = size * 0.72;
  const x0 = w / 2 - (WORD.length * step) / 2 + step / 2;
  const tickX = (i: number) => w / 2 - ((WORD.length - 1) * 30) / 2 + i * 30;
  return (
    <g>
      {WORD.split("").map((ch, i) => (
        <g {...motion(fadeUp(300 + i * STAGGER, 620, size * 0.45))}>
          <text x={x0 + i * step} y={y} text-anchor="middle" style={{ "font-size": `${size}px`, "font-weight": 800, "letter-spacing": "-0.04em" }}>{ch}</text>
        </g>
      ))}
      <g {...motion(fadeIn(1300, 420))}>
        {WORD.split("").map((_, i) => (
          <g>
            <line x1={tickX(i)} y1={y + 22} x2={tickX(i)} y2={y + 34} style={{ stroke: C.accent, "stroke-width": 2 }} />
            <text class="t-sub" x={tickX(i)} y={y + 48} text-anchor="middle">{i * STAGGER}</text>
          </g>
        ))}
        <text class="t-sub t-strong" x={w / 2} y={y + 68} text-anchor="middle">start offset in ms: 125 ms = a 1/16 note at 120 BPM</text>
      </g>
    </g>
  );
}

export default function KineticType({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Word w={w} size={64} y={84} />} narrow={(w) => <Word w={w} size={52} y={76} />} />
    </VizStage>
  );
}
