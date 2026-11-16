import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A speed ramp into a hit, in output frames at 30 fps (the numbers of the beat-sync recipe): 100 %
// until frame 20, ease down to 25 % by frame 28 (the impact, on the beat), ease back to 100 % by
// frame 40. Left: the speed. Right: the source frame that each output frame shows, which is the
// running sum of the speed; it flattens near the impact, so the hit gets many output frames.

const END = 40;
const IMPACT = 28;
const smooth = (u: number) => u * u * (3 - 2 * u);
const speed = (f: number) => (f < 20 ? 1 : f < IMPACT ? 1 - 0.75 * smooth((f - 20) / 8) : f < END ? 0.25 + 0.75 * smooth((f - IMPACT) / 12) : 1);
const SRC: number[] = [0];
for (let i = 1; i <= END * 4; i += 1) SRC.push(SRC[i - 1] + speed((i - 0.5) / 4) / 4);
const src = (f: number) => SRC[Math.round(f * 4)];
const SMAX = src(END);

function Graph({ x, y, w, h, title, fn, ymax, label, dot }: { x: number; y: number; w: number; h: number; title: string; fn: (f: number) => number; ymax: number; label: string; dot?: boolean }) {
  const px = (f: number) => x + (f / END) * w;
  const py = (v: number) => y + h - (v / ymax) * h;
  let d = "";
  for (let i = 0; i <= END * 2; i += 1) d += `${i ? "L" : "M"}${px(i / 2).toFixed(1)} ${py(fn(i / 2)).toFixed(1)}`;
  const keys: Keyframe[] = [];
  for (let i = 0; i <= 40; i += 1) keys.push({ offset: i / 40, transform: `translate(${px(i) - px(END)}px, ${py(fn(i)) - py(fn(END))}px)` });
  return (
    <g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub t-strong" x={x} y={y - 12}>{title}</text>
        <line x1={x} y1={y + h} x2={x + w} y2={y + h} style={{ stroke: C.line }} />
        <line x1={x} y1={y} x2={x} y2={y + h} style={{ stroke: C.line }} />
        <line x1={px(IMPACT)} y1={y} x2={px(IMPACT)} y2={y + h} style={{ stroke: C.accent2, "stroke-dasharray": "3 4" }} />
        <text class="t-sub" x={px(IMPACT)} y={y + h + 14} text-anchor="middle" style={{ fill: C.accent2Text }}>impact, on the beat</text>
        <text class="t-sub" x={x + w} y={y - 12} text-anchor="end" style={{ fill: C.muted }}>{label}</text>
      </g>
      <g {...motion(fadeIn(300, 500))}>
        <path d={d} fill="none" style={{ stroke: C.accent, "stroke-width": 2.5 }} stroke-linecap="round" />
      </g>
      {dot ? (
        <g {...motion({ k: keys, t: 800, d: 3000, e: LINEAR })}>
          <circle cx={px(END)} cy={py(fn(END))} r={5} style={{ fill: C.accent }} />
        </g>
      ) : null}
    </g>
  );
}

export default function SpeedRamp({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Graph x={36} y={36} w={240} h={110} title="Speed" fn={speed} ymax={1.1} label="100 % to 25 % and back" />
            <Graph x={356} y={36} w={240} h={110} title="Source frame shown" fn={src} ymax={SMAX} label="slope = speed" dot />
            <g {...motion(fadeUp(1600, 420, 3))}>
              <text class="t-sub" x={36} y={186} style={{ fill: C.muted }}>Frames 20 to 28 ease down, 28 to 40 ease back. Keep the motion blur setting constant through it.</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            <Graph x={30} y={34} w={270} h={96} title="Speed" fn={speed} ymax={1.1} label="100 % to 25 % and back" />
            <Graph x={30} y={196} w={270} h={96} title="Source frame shown" fn={src} ymax={SMAX} label="slope = speed" dot />
          </g>
        )}
      />
    </VizStage>
  );
}
