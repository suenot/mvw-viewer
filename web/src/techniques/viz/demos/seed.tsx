import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";
import { boilCircle } from "./pencil";

// Stable seed: the camera scrubs to 0.5 s, then 1.0 s, then back to 0.5 s. With a random
// number at every call the second visit to 0.5 s draws a different contour; with
// floor(time x 12) as the seed it is the same drawing.

const VISITS = [0.5, 1.0, 0.5];
const RANDOM_SEEDS = [101, 202, 303];
const R = 20;

function Row({ x0, x1, y, title, random, t }: { x0: number; x1: number; y: number; title: string; random: boolean; t: number }) {
  const gap = (x1 - x0) / VISITS.length;
  return (
    <g>
      <text class="t-sub t-strong" x={x0} y={y - 38} {...motion(fadeUp(t, 420, 3))}>
        {title}
      </text>
      {VISITS.map((time, i) => {
        const cx = x0 + gap * i + gap / 2;
        const drawing = Math.floor(time * 12 + 1e-9);
        const seed = random ? RANDOM_SEEDS[i] : 1000 + drawing;
        const repeat = i === 2;
        const same = !random;
        return (
          <g {...motion(popIn(t + 200 + i * 450, 420, 0.8))}>
            <path d={boilCircle(cx, y, R, seed, 2.4)} fill="none" style={{ stroke: C.accent, "stroke-width": 2.2 }} stroke-linejoin="round" />
            <text class="t-sub" x={cx} y={y + R + 16} text-anchor="middle">
              {time.toFixed(1)} s
            </text>
            {repeat && (
              <text class="t-sub t-strong" x={cx} y={y - R - 8} text-anchor="middle" style={{ fill: same ? C.accent3Text : C.accent2Text }}>
                {same ? "same drawing" : "different drawing"}
              </text>
            )}
          </g>
        );
      })}
      <g {...motion(fadeIn(t + 200, 300))}>
        <line x1={x0} y1={y + R + 28} x2={x1} y2={y + R + 28} style={{ stroke: C.edge, "stroke-dasharray": "2 4" }} />
      </g>
    </g>
  );
}

export default function Seed({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Row x0={24} x1={616} y={78} title="Random number at every call" random t={100} />
            <Row x0={24} x1={616} y={192} title="Seed = scene seed + floor(time x 12)" random={false} t={1500} />
          </g>
        )}
        narrow={() => (
          <g>
            <Row x0={12} x1={324} y={82} title="Random number at every call" random t={100} />
            <Row x0={12} x1={324} y={206} title="Seed = scene seed + floor(time x 12)" random={false} t={1500} />
          </g>
        )}
      />
    </VizStage>
  );
}
