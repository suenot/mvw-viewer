import { C } from "../colors";
import { LINEAR, fadeIn, fadeUp, motion } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Print misregistration: on an impact frame two colour copies of the text show for a moment,
// offset by 2 to 4 px at 40 % opacity, then vanish. Outside impacts the text is clean.

const TOTAL = 3200;
const IMPACTS = [900, 2200];

function Word({ w, size, y }: { w: number; size: number; y: number }) {
  const cx = w / 2;
  const style = { "font-size": `${size}px`, "font-weight": 900, "letter-spacing": "-0.05em" };
  // one spec per layer covering both impacts (two specs on one element would conflict)
  const layer = (dx: number, dy: number) => {
    const k: Keyframe[] = [{ offset: 0, opacity: 0, transform: "translate(0px, 0px)" }];
    for (const t of IMPACTS) {
      const o = t / TOTAL;
      k.push(
        { offset: o - 0.001, opacity: 0, transform: "translate(0px, 0px)" },
        { offset: o, opacity: 0.45, transform: `translate(${dx}px, ${dy}px)` },
        { offset: o + 0.07, opacity: 0.45, transform: `translate(${dx}px, ${dy}px)` },
        { offset: o + 0.075, opacity: 0, transform: "translate(0px, 0px)" },
      );
    }
    k.push({ offset: 1, opacity: 0, transform: "translate(0px, 0px)" });
    return motion({ k, d: TOTAL, t: 200, e: LINEAR });
  };
  const gx = cx - 150;
  const gx2 = cx + 150;
  return (
    <g>
      <g opacity={0} {...layer(-4, 0)}>
        <text x={cx} y={y} text-anchor="middle" style={{ ...style, fill: C.accent }}>IMPACT</text>
      </g>
      <g opacity={0} {...layer(4, 2)}>
        <text x={cx} y={y} text-anchor="middle" style={{ ...style, fill: C.accent2 }}>IMPACT</text>
      </g>
      <text x={cx} y={y} text-anchor="middle" style={style}>IMPACT</text>
      <g {...motion(fadeIn(300, 420))}>
        <line x1={gx} y1={y + 34} x2={gx2} y2={y + 34} style={{ stroke: C.grid, "stroke-width": 2 }} />
        {IMPACTS.map((t) => {
          const x = gx + ((t + 200) / (TOTAL + 200)) * (gx2 - gx);
          return <circle cx={x} cy={y + 34} r={5} style={{ fill: C.accent2 }} />;
        })}
      </g>
      <g {...motion(fadeUp(500, 420, 3))}>
        <text class="t-sub t-strong" x={cx} y={y + 58} text-anchor="middle">Blue and orange copies, 4 px, 45 %, only on impacts</text>
      </g>
    </g>
  );
}

export default function Misregistration({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts wide={(w) => <Word w={w} size={78} y={86} />} narrow={(w) => <Word w={w} size={58} y={80} />} />
    </VizStage>
  );
}
