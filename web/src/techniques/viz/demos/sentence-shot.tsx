import { C } from "../colors";
import { LINEAR, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// One sentence, one shot: four sentences of narration on a 10 s axis and, under them, the shot
// that goes with each. Every cut lands 0.14 s before its sentence's first word; the longest gap
// (0.8 s) sits before the punch line.

const SENTENCES = [
  { from: 0.3, to: 2.3, label: "Setup" },
  { from: 2.9, to: 4.9, label: "Detail" },
  { from: 5.5, to: 7.4, label: "Expected" },
  { from: 8.2, to: 9.6, label: "Punch line" },
];
const LEAD = 0.14;
const TOTAL = 10;
const SWEEP = 4200;

function Timeline({ x0, x1, yVoice, yShot, h, short }: { x0: number; x1: number; yVoice: number; yShot: number; h: number; short: boolean }) {
  const px = (s: number) => x0 + (s / TOTAL) * (x1 - x0);
  const bottom = yShot + h;
  return (
    <g>
      <text class="t-sub t-strong" x={x0} y={yVoice - 8}>
        Narration
      </text>
      <text class="t-sub t-strong" x={x0} y={yShot - 8}>
        Shots
      </text>
      {SENTENCES.map((sentence, i) => {
        const cut = sentence.from - LEAD;
        const nextCut = i < SENTENCES.length - 1 ? SENTENCES[i + 1].from - LEAD : TOTAL;
        const t = 300 + i * 700;
        return (
          <g>
            <g {...motion(fadeUp(t, 420, 4))}>
              <rect x={px(sentence.from)} y={yVoice} width={px(sentence.to) - px(sentence.from)} height={h} rx={4} style={{ fill: C.wash, stroke: C.accent }} />
              {!short && (
                <text class="t-sub" x={px(sentence.from) + 6} y={yVoice + h / 2 + 4} style={{ fill: C.accentText }}>
                  {sentence.label}
                </text>
              )}
            </g>
            <g {...motion(popIn(t + 220, 420, 0.97))}>
              <rect x={px(cut) + 1} y={yShot} width={px(nextCut) - px(cut) - 2} height={h} rx={4} style={{ fill: i % 2 ? C.accent2 : C.accent }} />
              <text class="t-sub t-strong" x={px(cut) + 8} y={yShot + h / 2 + 4} style={{ fill: i % 2 ? C.onAccent2 : C.onAccent }}>
                {short ? i + 1 : `Shot ${i + 1}`}
              </text>
            </g>
          </g>
        );
      })}
      {/* the lead of the first cut that is easy to see: 0.14 s before sentence 3 */}
      <g {...motion(fadeUp(3400, 420, 3))}>
        <line x1={px(SENTENCES[2].from - LEAD)} y1={yVoice - 4} x2={px(SENTENCES[2].from - LEAD)} y2={bottom + 4} style={{ stroke: C.ink, "stroke-dasharray": "2 3" }} />
        <text class="t-sub t-strong" x={px(SENTENCES[2].from - LEAD)} y={bottom + 20} text-anchor="middle">
          cut 0.14 s early
        </text>
      </g>
      <g {...motion(fadeUp(3900, 420, 3))}>
        <line x1={px(SENTENCES[2].to)} y1={bottom + 38} x2={px(SENTENCES[3].from)} y2={bottom + 38} style={{ stroke: C.accent2, "stroke-width": 2 }} />
        <text class="t-sub t-strong" x={px(SENTENCES[3].from)} y={bottom + 54} text-anchor="end" style={{ fill: C.accent2Text }}>
          0.8 s: the longest pause
        </text>
      </g>
      <g transform={`translate(${x0} 0)`}>
        <g
          {...motion({
            k: [
              { opacity: 0, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.04, transform: "translate(0px, 0px)" },
              { opacity: 1, offset: 0.96, transform: `translate(${x1 - x0}px, 0px)` },
              { opacity: 0, transform: `translate(${x1 - x0}px, 0px)` },
            ],
            t: 400,
            d: SWEEP,
            e: LINEAR,
          })}
          opacity={0}
        >
          <line x1={0} y1={yVoice - 6} x2={0} y2={bottom + 2} style={{ stroke: C.ink, "stroke-width": 1.5 }} />
        </g>
      </g>
    </g>
  );
}

export default function SentenceShot({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Timeline x0={20} x1={620} yVoice={36} yShot={108} h={44} short={false} />}
        narrow={() => <Timeline x0={8} x1={328} yVoice={32} yShot={96} h={40} short />}
      />
    </VizStage>
  );
}
