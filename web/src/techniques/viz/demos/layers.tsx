import { C } from "../colors";
import { EASE_IN_OUT, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// Layered assets: three image layers and one code layer shown apart, then composed into one
// picture where a slow sideways camera shifts the near layer more than the far one
// (parallax). The code layer (light, text) stays put so text never slides.

type LayerSpec = { name: string; src: "image" | "code"; shift: number };
const LAYERS: LayerSpec[] = [
  { name: "Background", src: "image", shift: 4 },
  { name: "Subject", src: "image", shift: 9 },
  { name: "Foreground", src: "image", shift: 18 },
  { name: "Light, text", src: "code", shift: 0 },
];

function art(i: number, x: number, y: number, w: number, h: number) {
  switch (i) {
    case 0:
      return <path d={`M${x - 24} ${y + h}L${x - 24} ${y + h * 0.5}Q${x + w * 0.3} ${y + h * 0.1} ${x + w * 0.55} ${y + h * 0.42}T${x + w + 24} ${y + h * 0.3}L${x + w + 24} ${y + h}Z`} style={{ fill: C.accentSoft }} />;
    case 1:
      return <circle cx={x + w * 0.5} cy={y + h * 0.58} r={h * 0.2} style={{ fill: C.accent }} />;
    case 2:
      return <path d={`M${x - 24} ${y + h}L${x - 24} ${y + h * 0.82}Q${x + w * 0.25} ${y + h * 0.64} ${x + w * 0.5} ${y + h * 0.84}T${x + w + 24} ${y + h * 0.78}L${x + w + 24} ${y + h}Z`} style={{ fill: C.accent3 }} />;
    default:
      return (
        <g>
          <circle cx={x + w * 0.8} cy={y + h * 0.2} r={h * 0.11} style={{ fill: C.accent2 }} />
          <rect x={x + 8} y={y + 8} width={w * 0.34} height={8} rx={3} style={{ fill: C.ink }} />
        </g>
      );
  }
}

function Card({ i, x, y, w, h, t }: { i: number; x: number; y: number; w: number; h: number; t: number }) {
  const id = `layers-card-${i}-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g {...motion(popIn(t, 420, 0.92))}>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={5} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx={5} style={{ fill: C.node }} />
      <g clip-path={`url(#${id})`}>{art(i, x, y, w, h)}</g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="none" style={{ stroke: C.line }} />
      <text class="t-sub" x={x + w / 2} y={y + h + 15} text-anchor="middle">
        {LAYERS[i].name}
      </text>
      <text class="t-sub" x={x + w / 2} y={y + h + 29} text-anchor="middle" style={{ fill: LAYERS[i].src === "code" ? C.accent2Text : C.accentText }}>
        {LAYERS[i].src}
      </text>
    </g>
  );
}

function Composite({ x, y, w, h, t, id }: { x: number; y: number; w: number; h: number; t: number; id: string }) {
  return (
    <g {...motion(popIn(t, 520, 0.94))}>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={6} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx={6} style={{ fill: C.node }} />
      <g clip-path={`url(#${id})`}>
        {LAYERS.map((layer, i) => (
          <g {...motion({ k: [{ transform: "translate(0px, 0px)" }, { transform: `translate(${-layer.shift}px, 0px)` }, { transform: "translate(0px, 0px)" }], t: t + 600, d: 3200, e: EASE_IN_OUT, i: Infinity })}>
            {art(i, x, y, w, h)}
          </g>
        ))}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" style={{ stroke: C.edge, "stroke-width": 1.5 }} />
      <text class="t-sub t-strong" x={x + w / 2} y={y + h + 15} text-anchor="middle">
        Composed, with parallax
      </text>
    </g>
  );
}

export default function Layers({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            {LAYERS.map((_, i) => (
              <Card i={i} x={20 + i * 112} y={36} w={96} h={72} t={150 + i * 160} />
            ))}
            <g {...motion(fadeUp(900, 420, 3))}>
              <text class="t-sub t-strong" x={478} y={78} text-anchor="middle">
                →
              </text>
            </g>
            <Composite x={494} y={20} w={130} h={104} t={1300} id="layers-composite-wide" />
          </g>
        )}
        narrow={() => (
          <g>
            {LAYERS.map((_, i) => (
              <Card i={i} x={20 + (i % 2) * 160} y={20 + Math.floor(i / 2) * 110} w={136} h={64} t={150 + i * 160} />
            ))}
            <Composite x={78} y={250} w={180} h={86} t={1300} id="layers-composite-narrow" />
          </g>
        )}
      />
    </VizStage>
  );
}
