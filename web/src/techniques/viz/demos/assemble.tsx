import { C } from "../colors";
import { fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Long work from short pieces: four 5 s scenes are built and approved one by one (each a
// block with a tick), slide together into one 20 s strip, and the three seams between them
// get a review flag (palette, audio, pacing).

const SCENES = ["Scene 1", "Scene 2", "Scene 3", "Scene 4"];

function Strip({ x0, x1, y, h, spread }: { x0: number; x1: number; y: number; h: number; spread: number }) {
  const w = (x1 - x0) / SCENES.length;
  return (
    <g>
      {SCENES.map((name, i) => {
        const x = x0 + i * w;
        const dx = (i - 1.5) * spread; // where the block rests before it slides home
        return (
          <g>
            <g {...motion({ k: [{ opacity: 0, transform: "translate(0px, -14px)" }, { opacity: 1, transform: "translate(0px, 0px)" }], t: 150 + i * 520, d: 460 })}>
              <g {...motion({ k: [{ transform: `translate(${dx}px, 0px)` }, { transform: "translate(0px, 0px)" }], t: 2500, d: 800 })}>
                <rect x={x + 1.5} y={y} width={w - 3} height={h} rx={5} style={{ fill: C.accent, stroke: C.line }} />
                <text class="t-sub t-strong" x={x + w / 2} y={y + h / 2 + 1} text-anchor="middle" style={{ fill: C.onAccent }}>
                  {name}
                </text>
                <text class="t-sub" x={x + w / 2} y={y + h / 2 + 15} text-anchor="middle" style={{ fill: C.onAccent }}>
                  5 s ✓
                </text>
              </g>
            </g>
          </g>
        );
      })}
      {[1, 2, 3].map((i) => (
        <g {...motion(fadeUp(3500 + i * 220, 360, 4))}>
          <line x1={x0 + i * w} y1={y - 8} x2={x0 + i * w} y2={y + h + 8} style={{ stroke: C.accent2, "stroke-width": 2, "stroke-dasharray": "3 3" }} />
          <circle cx={x0 + i * w} cy={y + h + 20} r={8} style={{ fill: C.accent2 }} />
          <text class="t-sub t-strong" x={x0 + i * w} y={y + h + 24} text-anchor="middle" style={{ fill: C.onAccent2 }}>
            {i}
          </text>
        </g>
      ))}
      <g {...motion(fadeIn(4300, 400))}>
        <text class="t-sub t-strong" x={x0} y={y + h + 52}>
          20 s in one render: check the 3 seams
        </text>
        <text class="t-sub" x={x0} y={y + h + 70}>
          Seams: palette, audio and pacing
        </text>
      </g>
    </g>
  );
}

export default function Assemble({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => <Strip x0={30} x1={610} y={40} h={72} spread={26} />}
        narrow={() => <Strip x0={12} x1={324} y={28} h={64} spread={10} />}
      />
    </VizStage>
  );
}
