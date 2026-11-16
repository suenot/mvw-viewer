import { C } from "../colors";
import { EASE_IN_OUT, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// One camera pan, three depth layers. The camera moves 100 units; the background follows at 0.2x,
// the midground at 0.6x and the foreground at 1.2x, so the depth is read from the speed difference.
// Role of each layer: ambient (background), supporting (midground), primary (foreground).

const PAN = 100;
const LAYERS: Array<[string, number, string]> = [
  ["Background 0.2x", 0.2, "ambient: low contrast, soft"],
  ["Midground 0.6x", 0.6, "supports the subject"],
  ["Foreground 1.2x", 1.2, "primary: sharp, fastest"],
];

function Scene({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const slide = (k: number) => motion({ k: [{ transform: `translate(${PAN * k}px, 0px)` }, { transform: "translate(0px, 0px)" }], t: 400, d: 2800, e: EASE_IN_OUT });
  return (
    <g>
      <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x={0} y={0} width={w} height={h} style={{ fill: C.wash }} />
        <g {...slide(0.2)}>
          <circle cx={w * 0.7} cy={h * 0.3} r={h * 0.14} style={{ fill: C.accentSoft }} />
          <path d={`M-40 ${h * 0.62} Q${w * 0.2} ${h * 0.4} ${w * 0.45} ${h * 0.6} T${w + 60} ${h * 0.55} V${h} H-40Z`} style={{ fill: C.accentSoft, opacity: 0.55 }} />
        </g>
        <g {...slide(0.6)}>
          <path d={`M-60 ${h * 0.78} Q${w * 0.15} ${h * 0.55} ${w * 0.38} ${h * 0.76} T${w * 0.8} ${h * 0.72} T${w + 80} ${h * 0.74} V${h} H-60Z`} style={{ fill: C.accent, opacity: 0.8 }} />
        </g>
        <g {...slide(1.2)}>
          {Array.from({ length: 9 }, (_, i) => (
            <rect x={-30 + i * (w / 5)} y={h * 0.82} width={7} height={h * 0.2} rx={2} style={{ fill: C.ink }} />
          ))}
        </g>
      </svg>
      <rect x={x} y={y} width={w} height={h} fill="none" style={{ stroke: C.line }} />
    </g>
  );
}

function Legend({ x, y, step }: { x: number; y: number; step: number }) {
  return (
    <g {...motion(fadeUp(900, 420, 3))}>
      {LAYERS.map(([name, , role], i) => (
        <g>
          <text class="t-sub t-strong" x={x} y={y + i * step}>{name}</text>
          <text class="t-sub" x={x} y={y + i * step + 15} style={{ fill: C.muted }}>{role}</text>
        </g>
      ))}
    </g>
  );
}

export default function ParallaxLayers({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <g {...motion(fadeIn(60, 300))}><text class="t-sub" x={36} y={16} style={{ fill: C.muted }}>Camera pans 100 units</text></g>
            <Scene x={36} y={24} w={340} h={150} />
            <Legend x={404} y={64} step={42} />
          </g>
        )}
        narrow={() => (
          <g>
            <g {...motion(fadeIn(60, 300))}><text class="t-sub" x={12} y={16} style={{ fill: C.muted }}>Camera pans 100 units</text></g>
            <Scene x={12} y={24} w={312} h={150} />
            <Legend x={12} y={208} step={40} />
          </g>
        )}
      />
    </VizStage>
  );
}
