import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Speed 1x until 2 s, then 3x. Left: phase = speed(t) * t, so at the change the whole past is
// re-scaled and the phase jumps from 2 to 6. Right: phase += speed * dt (the integral of speed), so
// the phase only bends.

const T_CHANGE = 2;
const T_END = 4;
const wrong = (t: number) => (t < T_CHANGE ? 1 : 3) * t;
const right = (t: number) => (t < T_CHANGE ? t : T_CHANGE + 3 * (t - T_CHANGE));
const PMAX = 12;

function Panel({ x, y, w, h, title, fn, bad, note }: { x: number; y: number; w: number; h: number; title: string; fn: (t: number) => number; bad: boolean; note: string }) {
  const px = (t: number) => x + (t / T_END) * w;
  const py = (p: number) => y + h - (p / PMAX) * h;
  const segs = bad
    ? [`M${px(0)} ${py(0)}L${px(T_CHANGE)} ${py(2)}`, `M${px(T_CHANGE)} ${py(6)}L${px(T_END)} ${py(12)}`]
    : [`M${px(0)} ${py(0)}L${px(T_CHANGE)} ${py(2)}L${px(T_END)} ${py(8)}`];
  const col = bad ? C.accent2 : C.accent;
  // the dot replays along the curve; the jump is two keyframes at the same offset
  const keys: Keyframe[] = [];
  const f = (t: number) => `translate(${px(t) - px(T_END)}px, ${py(fn(t)) - py(fn(T_END))}px)`;
  const n = 24;
  for (let i = 0; i <= n; i += 1) {
    const t = (i / n) * T_END;
    if (bad && Math.abs(t - T_CHANGE) < 1e-9) {
      keys.push({ offset: t / T_END, transform: f(t - 1e-6) }, { offset: t / T_END, transform: f(t + 1e-6) });
    } else keys.push({ offset: t / T_END, transform: f(t) });
  }
  return (
    <g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub t-strong" x={x} y={y - 12}>{title}</text>
        <line x1={x} y1={y + h} x2={x + w} y2={y + h} style={{ stroke: C.line }} />
        <line x1={x} y1={y} x2={x} y2={y + h} style={{ stroke: C.line }} />
        <line x1={px(T_CHANGE)} y1={y} x2={px(T_CHANGE)} y2={y + h} style={{ stroke: C.line, "stroke-dasharray": "3 4" }} />
        <text class="t-sub" x={px(T_CHANGE)} y={y + h + 14} text-anchor="middle">speed 1x to 3x</text>
        <text class="t-sub" x={x + w} y={y + h + 14} text-anchor="end">time</text>
        <text class="t-sub" x={x + 4} y={y + 11}>phase</text>
      </g>
      <g {...motion(fadeIn(300, 500))}>
        {segs.map((d) => <path d={d} fill="none" style={{ stroke: col, "stroke-width": 2.5 }} stroke-linecap="round" />)}
      </g>
      <g {...motion({ k: keys, t: 700, d: 3000, e: LINEAR })}>
        <circle cx={px(T_END)} cy={py(fn(T_END))} r={5} style={{ fill: col }} />
      </g>
      <g {...motion(fadeUp(1500, 420, 3))}>
        <text class="t-sub t-strong" x={x} y={y + h + 32} style={{ fill: bad ? C.accent2Text : C.accent3Text }}>{note}</text>
      </g>
    </g>
  );
}

export default function IndependentClocks({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Panel x={36} y={40} w={240} h={110} title="phase = speed(t) * t" fn={wrong} bad note="Jumps from 2 to 6" />
            <Panel x={356} y={40} w={240} h={110} title="phase += speed * dt" fn={right} bad={false} note="Only the slope changes" />
          </g>
        )}
        narrow={() => (
          <g>
            <Panel x={30} y={34} w={270} h={100} title="phase = speed(t) * t" fn={wrong} bad note="Jumps from 2 to 6" />
            <Panel x={30} y={192} w={270} h={100} title="phase += speed * dt" fn={right} bad={false} note="Only the slope changes" />
          </g>
        )}
      />
    </VizStage>
  );
}
