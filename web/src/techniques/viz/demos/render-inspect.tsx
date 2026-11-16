import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Render and inspect: four frames pulled from a render at 0.5, 1.0, 2.0 and 4.5 s. A scan
// bar checks them one after another; frame 3 has a defect (the label touches the edge), the
// defect is written down with its time, the source is fixed and the frame is clean.

const FRAMES = [
  { t: "0.5 s", bad: false },
  { t: "1.0 s", bad: false },
  { t: "2.0 s", bad: true },
  { t: "4.5 s", bad: false },
];

function Frame({ x, y, w, h, t, bad, i }: { x: number; y: number; w: number; h: number; t: string; bad: boolean; i: number }) {
  const at = 500 + i * 650;
  return (
    <g>
      <g {...motion(popIn(150 + i * 120, 420, 0.92))}>
        <rect x={x} y={y} width={w} height={h} rx={4} style={{ fill: C.node, stroke: C.line }} />
        <path d={`M${x + 8} ${y + h * 0.7}Q${x + w * 0.4} ${y + h * 0.35} ${x + w - 8} ${y + h * 0.6}`} fill="none" style={{ stroke: C.accent, "stroke-width": 2 }} />
        {i > 0 && <circle cx={x + w * 0.45} cy={y + h * 0.48} r={3} style={{ fill: C.accent2 }} />}
        {i > 1 && <rect x={x + (bad ? w - 22 : w * 0.5)} y={y + 8} width={26} height={8} rx={2} style={{ fill: C.muted }} />}
        <text class="t-sub t-strong" x={x + w / 2} y={y + h + 15} text-anchor="middle">
          {t}
        </text>
      </g>
      <g {...motion({ k: [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0.0001 }], t: at, d: 600, e: LINEAR })} opacity={0}>
        <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={5} fill="none" style={{ stroke: bad ? C.accent2 : C.accent3, "stroke-width": 2 }} />
      </g>
      <g {...motion(fadeIn(500 + i * 650 + 450, 300))}>
        <text class="t-sub t-strong" x={x + w / 2} y={y - 8} text-anchor="middle" style={{ fill: bad ? C.accent2Text : C.accent3Text }}>
          {bad ? "label at the edge" : "ok"}
        </text>
      </g>
    </g>
  );
}

function Note({ x, y, w, narrow }: { x: number; y: number; w: number; narrow: boolean }) {
  return (
    <g {...motion(fadeUp(3400, 480, 4))}>
      <rect x={x} y={y} width={w} height={narrow ? 46 : 30} rx={6} style={{ fill: C.wash, stroke: C.accent }} />
      <text class="t-sub" x={x + 10} y={y + 19} style={{ fill: C.accentText }}>
        {narrow ? "Defect logged with its time (2.0 s)," : "Defect logged with its time (2.0 s); fixed in the source, re-rendered."}
      </text>
      {narrow && (
        <text class="t-sub" x={x + 10} y={y + 35} style={{ fill: C.accentText }}>
          fixed in the source, re-rendered.
        </text>
      )}
    </g>
  );
}

export default function RenderInspect({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            {FRAMES.map((f, i) => (
              <Frame x={24 + i * 152} y={40} w={136} h={96} t={f.t} bad={f.bad} i={i} />
            ))}
            <Note x={24} y={172} w={592} narrow={false} />
          </g>
        )}
        narrow={() => (
          <g>
            {FRAMES.map((f, i) => (
              <Frame x={20 + (i % 2) * 160} y={36 + Math.floor(i / 2) * 122} w={136} h={84} t={f.t} bad={f.bad} i={i} />
            ))}
            <Note x={12} y={288} w={312} narrow />
          </g>
        )}
      />
    </VizStage>
  );
}
