import { C } from "../colors";
import { EASE_IN_OUT, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Miniature faking: a small town seen from above, blurred everywhere except one sharp horizontal
// band. The band moves (here down, then back to rest) and the picture reads as a small model.
// Two copies of the scene: a sharp one, and a blurred one that a mask hides inside the band.

function Scene({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = 5;
  const items: any[] = [];
  for (let r = 0; r < rows; r += 1) {
    const ry = y + 14 + (r / (rows - 1)) * (h - 40);
    const k = 0.7 + r * 0.16;
    const n = 9;
    for (let i = 0; i < n; i += 1) {
      const cx = x + ((i + 0.5 + (r % 2) * 0.35) / (n + 0.4)) * w;
      const tree = (i * 3 + r * 5) % 4 === 0;
      if (tree) items.push(<circle cx={cx} cy={ry - 6 * k} r={7 * k} style={{ fill: C.accent3 }} />);
      else {
        const hh = (12 + ((i * 7 + r * 3) % 3) * 4) * k;
        items.push(
          <g>
            <rect x={cx - 9 * k} y={ry - hh} width={18 * k} height={hh} style={{ fill: (i + r) % 2 ? C.accentSoft : C.node, stroke: C.line }} />
            <path d={`M${cx - 11 * k} ${ry - hh}L${cx} ${ry - hh - 8 * k}L${cx + 11 * k} ${ry - hh}Z`} style={{ fill: C.accent2 }} />
          </g>,
        );
      }
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} style={{ fill: C.wash }} />
      {items}
    </g>
  );
}

function Town({ id, x, y, w, h }: { id: string; x: number; y: number; w: number; h: number }) {
  const bandH = 70;
  const rest = y + h / 2 - bandH / 2;
  const move = (a: number, b: number) => ({
    k: [{ transform: `translate(0px, ${a}px)` }, { transform: `translate(0px, ${b}px)`, offset: 0.5 }, { transform: "translate(0px, 0px)" }],
    t: 400,
    d: 3600,
    e: EASE_IN_OUT,
  });
  return (
    <g>
      <defs>
        <filter id={`${id}-blur`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="3.2" /></filter>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" /><stop offset="0.3" stop-color="#000" /><stop offset="0.7" stop-color="#000" /><stop offset="1" stop-color="#fff" />
        </linearGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>
          <rect x={x} y={y} width={w} height={h} fill="#fff" />
          <rect x={x} y={rest} width={w} height={bandH} fill={`url(#${id}-grad)`} {...motion(move(-(rest - y) + 4, y + h - bandH - rest - 4))} />
        </mask>
      </defs>
      <Scene x={x} y={y} w={w} h={h} />
      <g filter={`url(#${id}-blur)`} mask={`url(#${id}-mask)`}>
        <Scene x={x} y={y} w={w} h={h} />
      </g>
      <g {...motion(move(-(rest - y) + 4, y + h - bandH - rest - 4))}>
        <rect x={x + 2} y={rest + 14} width={w - 4} height={bandH - 28} fill="none" style={{ stroke: C.accent, "stroke-width": 1.5, "stroke-dasharray": "5 4" }} />
        <text class="t-sub t-strong" x={x + 8} y={rest + 28} style={{ fill: C.accentText }}>sharp band</text>
      </g>
    </g>
  );
}

export default function TiltShift({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Town id="tw" x={20} y={14} w={600} h={150} />
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub" x={20} y={186}>Blur grows with the distance from the band; the focus plane is a function of time too.</text>
            </g>
          </g>
        )}
        narrow={() => (
          <g>
            <Town id="tn" x={10} y={12} w={316} h={160} />
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub" x={12} y={196}>Blur grows with the distance from the band.</text>
            </g>
          </g>
        )}
      />
    </VizStage>
  );
}
