import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A 1080 x 1920 vertical frame with the platform clearances of the short-form reference: about 120 px
// at the top, 320 px at the bottom and 120 px on the right. The dashed box is the 900 x 1400 box the
// reference centres on the frame. Two caption pills: one in the bottom band (hidden by the app), one
// above it (safe).

const W = 1080;
const H = 1920;

function Phone({ x, y, h }: { x: number; y: number; h: number }) {
  const s = h / H;
  const w = W * s;
  const band = { fill: C.accent2, opacity: 0.28 } as const;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} style={{ fill: C.node, stroke: C.ink, "stroke-width": 1.5 }} />
      <g {...motion(fadeIn(200, 400))}>
        <rect x={x} y={y} width={w} height={120 * s} style={band} />
        <rect x={x} y={y + (H - 320) * s} width={w} height={320 * s} style={band} />
        <rect x={x + (W - 120) * s} y={y + 120 * s} width={120 * s} height={(H - 440) * s} style={band} />
      </g>
      <g {...motion(fadeIn(500, 400))}>
        <rect x={x + 90 * s} y={y + 260 * s} width={900 * s} height={1400 * s} fill="none" style={{ stroke: C.accent, "stroke-width": 1.5, "stroke-dasharray": "4 3" }} />
      </g>
      <g {...motion(popIn(900, 420, 0.9))}>
        <rect x={x + 150 * s} y={y + 1380 * s} width={600 * s} height={90 * s} rx={4} style={{ fill: C.accent3 }} />
      </g>
      <g {...motion(popIn(1100, 420, 0.9))}>
        <rect x={x + 150 * s} y={y + 1700 * s} width={600 * s} height={90 * s} rx={4} style={{ fill: C.faint }} />
      </g>
    </g>
  );
}

function Notes({ x, y, step, narrow }: { x: number; y: number; step: number; narrow: boolean }) {
  const lines: Array<[string, string, string]> = [
    ["Top clear: about 120 px", "", C.ink],
    ["Bottom clear: about 320 px", "", C.ink],
    ["Right clear: about 120 px", "", C.ink],
    ["Dashed: the 900 x 1400 box", narrow ? "" : "it dips 60 px into the bottom band", C.accentText],
    ["Green pill: inside, readable", "", C.accent3Text],
    ["Grey pill: under the app UI", "", C.muted],
  ];
  return (
    <g {...motion(fadeUp(700, 420, 3))}>
      {lines.map(([a, b, col], i) => (
        <g>
          <text class="t-sub t-strong" x={x} y={y + i * step} style={{ fill: col }}>{a}</text>
          {b ? <text class="t-sub" x={x} y={y + i * step + 14} style={{ fill: C.muted }}>{b}</text> : null}
        </g>
      ))}
    </g>
  );
}

export default function VerticalSafeBox({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Phone x={60} y={10} h={190} />
            <Notes x={230} y={40} step={26} narrow={false} />
          </g>
        )}
        narrow={() => (
          <g>
            <Phone x={14} y={10} h={300} />
            <Notes x={150} y={60} step={30} narrow />
          </g>
        )}
      />
    </VizStage>
  );
}
