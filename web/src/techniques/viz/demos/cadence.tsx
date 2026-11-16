import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Drawing cadence against file frame rate, for half a second. The drawing index is
// floor(time * 12): at 24 fps every drawing holds two frames; at 30 fps the holds alternate
// three and two frames. A playhead runs the half second at one fifth of real speed and each
// frame cell lights as it passes; the resting state shows every cell with its drawing number.

const RATE = 12;
const SPAN = 0.5;
const PLAY = 2500; // ms for the half second
const T0 = 700;

function frames(fps: number) {
  return Array.from({ length: Math.round(fps * SPAN) }, (_, f) => ({ f, drawing: Math.floor((f / fps) * RATE + 1e-9) }));
}

function holds(fps: number) {
  const list = frames(fps);
  const out: Array<{ drawing: number; first: number; count: number }> = [];
  for (const cell of list) {
    const last = out[out.length - 1];
    if (last && last.drawing === cell.drawing) last.count += 1;
    else out.push({ drawing: cell.drawing, first: cell.f, count: 1 });
  }
  return out;
}

const DRAWING_FILL = [C.accent, C.accentSoft];

function Strip({ fps, x0, x1, y, label, labelX, labelY, t }: { fps: number; x0: number; x1: number; y: number; label: string; labelX: number; labelY: number; t: number }) {
  const cells = frames(fps);
  const w = (x1 - x0) / cells.length;
  const at = (f: number) => T0 + ((f / fps) / SPAN) * PLAY;
  return (
    <g>
      <text class="t-sub t-strong" x={labelX} y={labelY} {...motion(fadeUp(t, 420, 3))}>
        {label}
      </text>
      {cells.map((cell) => (
        <g transform={`translate(${x0 + cell.f * w + w / 2} ${y + 14})`}>
          <g {...motion(fadeIn(t + 100 + cell.f * 25, 260))}>
            <rect x={-w / 2 + 1} y={-14} width={w - 2} height={28} rx={3} style={{ fill: C.node, stroke: C.line }} />
          </g>
          <g {...motion(popIn(at(cell.f), 220, 0.7))}>
            <rect x={-w / 2 + 1} y={-14} width={w - 2} height={28} rx={3} style={{ fill: DRAWING_FILL[cell.drawing % 2] }} />
            <text class="t-sub t-strong" x={0} y={4} text-anchor="middle" style={{ fill: cell.drawing % 2 ? C.onLight : C.onAccent }}>
              {cell.drawing + 1}
            </text>
          </g>
        </g>
      ))}
      {holds(fps).map((hold) => (
        <g {...motion(fadeUp(at(hold.first + hold.count - 1) + 200, 300, 3))}>
          <line x1={x0 + hold.first * w + 3} y1={y + 34} x2={x0 + (hold.first + hold.count) * w - 3} y2={y + 34} style={{ stroke: C.muted, "stroke-width": 1 }} />
          <text class="t-sub" x={x0 + (hold.first + hold.count / 2) * w} y={y + 47} text-anchor="middle">
            {hold.count}
          </text>
        </g>
      ))}
    </g>
  );
}

function Drawing({ x0, x1, label, rows }: { x0: number; x1: number; label: "left" | "above"; rows: [number, number, number] }) {
  const px = (seconds: number) => x0 + (seconds / SPAN) * (x1 - x0);
  const labelX = label === "left" ? 18 : x0;
  const labelDy = label === "left" ? 18 : -8;
  const drawings = Array.from({ length: RATE * SPAN }, (_, i) => i);
  const [rowD, row24, row30] = rows;
  const bottom = row30 + 62;
  return (
    <g>
      {/* the drawings: one every 1/12 s */}
      <text class="t-sub t-strong" x={labelX} y={rowD + labelDy} {...motion(fadeUp(100, 420, 3))}>
        12 drawings a second
      </text>
      {drawings.map((i) => (
        <g transform={`translate(${px(i / RATE)} ${rowD})`}>
          <g {...motion(fadeIn(200 + i * 60, 300))}>
            <rect x={1} y={0} width={px(1 / RATE) - px(0) - 2} height={26} rx={3} style={{ fill: "transparent", stroke: DRAWING_FILL[i % 2], "stroke-width": 1.5 }} />
            <text class="t-sub t-strong" x={(px(1 / RATE) - px(0)) / 2} y={17} text-anchor="middle">
              {label === "left" ? `drawing ${i + 1}` : i + 1}
            </text>
          </g>
        </g>
      ))}
      <Strip fps={24} x0={x0} x1={x1} y={row24} label="24 fps file: 2 frames each" labelX={labelX} labelY={row24 + labelDy} t={300} />
      <Strip fps={30} x0={x0} x1={x1} y={row30} label="30 fps file: 3, 2, 3, 2..." labelX={labelX} labelY={row30 + labelDy} t={450} />

      {/* time axis and playhead */}
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((tick) => (
        <g {...motion(fadeIn(200, 300))}>
          <line x1={px(tick)} y1={bottom - 4} x2={px(tick)} y2={bottom + 2} style={{ stroke: C.edge }} />
          <text class="t-sub" x={px(tick)} y={bottom + 15} text-anchor="middle">
            {tick.toFixed(1)} s
          </text>
        </g>
      ))}
      <g transform={`translate(${x1} 0)`}>
        <g
          {...motion({
            k: [
              { opacity: 0, transform: `translate(${x0 - x1}px, 0px)` },
              { opacity: 1, offset: 0.03, transform: `translate(${x0 - x1}px, 0px)` },
              { opacity: 1, offset: 0.97, transform: "translate(0px, 0px)" },
              { opacity: 0, transform: "translate(0px, 0px)" },
            ],
            t: T0,
            d: PLAY + 200,
            e: LINEAR,
          })}
          opacity={0}
        >
          <line x1={0} y1={rowD - 4} x2={0} y2={bottom} style={{ stroke: C.ink, "stroke-width": 1.5 }} />
        </g>
      </g>
    </g>
  );
}

export default function Cadence({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Drawing x0={186} x1={620} label="left" rows={[22, 72, 142]} />}
        narrow={() => <Drawing x0={16} x1={320} label="above" rows={[34, 96, 178]} />}
      />
    </VizStage>
  );
}
