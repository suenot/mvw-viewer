import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// A script that keys one cube from x = -2 to x = 2 over frames 1 to 48 in headless Blender
// (5.2.2 LTS): the values below are what fc.evaluate(frame) returned, the default Bezier
// interpolation against linear. Each frame is then a pure function of its number.

const FR = [1, 12, 24, 36, 48];
const BEZ = [-2, -1.445, -0.064, 1.351, 2];
const LIN = [-2, -1.064, -0.043, 0.979, 2];
const STEPS = ["bpy script", "keyframe_insert", "frame_set(n)", "render each frame"];
const SUB = ["no UI, -b -P", "frames 1 and 48", "value from n alone", "PNG per frame"];

function Pipeline({ x, y, w, cols, gap, bh }: { x: number; y: number; w: number; cols: number; gap: number; bh: number }) {
  const bw = (w - gap * (cols - 1)) / cols;
  return (
    <g>
      {STEPS.map((s, i) => {
        const bx = x + (i % cols) * (bw + gap);
        const by = y + Math.floor(i / cols) * (bh + gap);
        return (
          <g {...motion(fadeUp(150 + i * 280, 420, 4))}>
            <rect x={bx} y={by} width={bw} height={bh} rx={6} style={{ fill: C.node, stroke: C.line }} />
            <text class="t-sub t-strong t-mono" x={bx + bw / 2} y={by + bh / 2 - 2} text-anchor="middle">{s}</text>
            <text class="t-sub" x={bx + bw / 2} y={by + bh / 2 + 13} text-anchor="middle">{SUB[i]}</text>
          </g>
        );
      })}
    </g>
  );
}

function Plot({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const px = (f: number) => x + ((f - 1) / 47) * w;
  const py = (v: number) => y + h - ((v + 2.4) / 4.8) * h;
  const line = (vs: number[]) => vs.map((v, i) => `${i ? "L" : "M"}${px(FR[i]).toFixed(1)} ${py(v).toFixed(1)}`).join("");
  return (
    <g>
      <g {...motion(fadeIn(1000, 400))}>
        <text class="t-sub t-strong" x={x} y={y - 8}>cube x at frames 1, 12, 24, 36, 48</text>
        <line x1={x} y1={py(0)} x2={x + w} y2={py(0)} style={{ stroke: C.line }} />
        <text class="t-sub" x={x + w} y={y + h + 14} text-anchor="end">frame</text>
      </g>
      <g {...motion(fadeIn(1300, 500))}>
        <path d={line(LIN)} fill="none" style={{ stroke: C.faint, "stroke-width": 1.5, "stroke-dasharray": "5 4" }} />
        <path d={line(BEZ)} fill="none" style={{ stroke: C.accent, "stroke-width": 2.5 }} stroke-linejoin="round" />
      </g>
      {FR.map((f, i) => (
        <g {...motion(popIn(1500 + i * 150, 360, 0.5))}>
          <circle cx={px(f)} cy={py(BEZ[i])} r={4} style={{ fill: C.accent }} />
        </g>
      ))}
      <g {...motion(fadeUp(2400, 420, 3))}>
        <text class="t-sub t-strong" x={px(12) - 4} y={py(-1.445) - 10} text-anchor="end" style={{ fill: C.accentText }}>Bezier -1.445</text>
        <text class="t-sub" x={px(12) + 6} y={py(-1.064) + 18}>linear -1.064</text>
      </g>
    </g>
  );
}

export default function BlenderFrames({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Pipeline x={14} y={14} w={612} cols={4} gap={12} bh={46} />
            <Plot x={50} y={104} w={330} h={104} />
            <g {...motion(fadeUp(2600, 420, 3))}>
              <text class="t-sub t-strong" x={420} y={118}>Measured, Blender 5.2.2</text>
              <text class="t-sub" x={420} y={140}>frame_set(24) twice: x = -0.064 both</text>
              <text class="t-sub" x={420} y={160}>Frame 24 rendered twice: same file</text>
              <text class="t-sub" x={420} y={180}>48 frames, 320x180: 0.4 s</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            <Pipeline x={10} y={12} w={316} cols={2} gap={10} bh={46} />
            <Plot x={34} y={146} w={280} h={100} />
            <g {...motion(fadeUp(2600, 420, 3))}>
              <text class="t-sub t-strong" x={12} y={288}>Measured, Blender 5.2.2</text>
              <text class="t-sub" x={12} y={308}>frame_set(24) twice: x = -0.064 both</text>
              <text class="t-sub" x={12} y={326}>Frame 24 rendered twice: same file</text>
              <text class="t-sub" x={12} y={344}>48 frames, 320x180: 0.4 s</text>
            </g>
          </g>
        )}
      />
    </VizStage>
  );
}
