import { C } from "../colors";
import { fadeIn, fadeUp, growX, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Top: a 26 s talk planned as A (speaker alone), B (overlay on the speaker) and C (cover, the speaker
// hidden while the voice goes on). It opens and closes on A, no A runs past 8 s, each C is 3 to 8 s.
// Bottom: three timing choices for what appears, against the spoken words "revenue grew 30 %".

const PLAN: Array<["A" | "B" | "C", number]> = [["A", 4], ["B", 5], ["A", 5], ["C", 5], ["A", 3], ["B", 2], ["A", 2]];
const TOTAL = PLAN.reduce((a, [, s]) => a + s, 0);
const FILL = { A: C.node, B: C.accentSoft, C: C.accent } as const;
const TEXT = { A: C.onLight, B: C.onLight, C: C.onAccent } as const;

function Plan({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  let acc = 0;
  return (
    <g>
      {PLAN.map(([k, s], i) => {
        const x0 = x + (acc / TOTAL) * w;
        const sw = (s / TOTAL) * w;
        acc += s;
        return (
          <g transform={`translate(${x0} ${y})`} {...motion(growX(120 + i * 110, 420))}>
            <rect x={1} y={0} width={sw - 2} height={h} rx={3} style={{ fill: FILL[k], stroke: C.line }} />
            <text class="t-sub t-strong" x={sw / 2} y={h / 2 + 4} text-anchor="middle" style={{ fill: TEXT[k] }}>{k}</text>
          </g>
        );
      })}
      <g {...motion(fadeIn(900, 300))}>
        <text class="t-sub" x={x} y={y + h + 16} style={{ fill: C.muted }}>A speaker alone, B overlay, C cover. Opens and closes on A.</text>
      </g>
    </g>
  );
}

function Timing({ x, y, w, narrow }: { x: number; y: number; w: number; narrow: boolean }) {
  const wordW = w / 3;
  const words = ["revenue", "grew", "30 %"];
  const lead = 14; // about 6 frames, drawn to scale of the words
  const rows: Array<[string, number, number, string]> = [
    [narrow ? "Axes: lead" : "Axes: lead by about 6 frames", wordW * 0 - lead, wordW * 1.4, C.accentSoft],
    [narrow ? "Value: on the word" : "Value: lands on the word 30 %", wordW * 1.45, wordW * 2.0 - wordW * 1.45 + wordW * 0.02, C.accent],
    [narrow ? "Answer: waits" : "Answer: waits for the word", wordW * 2.0, wordW * 0.9, C.accent2],
  ];
  return (
    <g>
      <g {...motion(fadeIn(1000, 300))}>
        {words.map((t, i) => (
          <g>
            <rect x={x + i * wordW + 1} y={y} width={wordW - 2} height={22} rx={3} style={{ fill: C.node, stroke: C.line }} />
            <text class="t-sub t-strong" x={x + i * wordW + wordW / 2} y={y + 15} text-anchor="middle">{t}</text>
          </g>
        ))}
      </g>
      {rows.map(([label, start, len, fill], i) => (
        <g>
          <g {...motion(fadeIn(1200 + i * 160, 300))}>
            <text class="t-sub" x={x} y={y + 52 + i * 34 - 5} style={{ fill: C.muted }}>{label}</text>
          </g>
          <g transform={`translate(${x + Math.max(start, -lead)} ${y + 52 + i * 34})`} {...motion(growX(1300 + i * 160, 480))}>
            <rect x={0} y={0} width={len} height={10} rx={3} style={{ fill }} />
          </g>
        </g>
      ))}
    </g>
  );
}

export default function BrollTreatments({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Plan x={36} y={14} w={568} h={34} />
            <Timing x={150} y={92} w={450} narrow={false} />
          </g>
        )}
        narrow={() => (
          <g>
            <Plan x={12} y={14} w={312} h={30} />
            <Timing x={40} y={96} w={270} narrow />
          </g>
        )}
      />
    </VizStage>
  );
}
