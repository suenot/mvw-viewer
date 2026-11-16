import { C } from "../colors";
import { fadeIn, fadeUp, motion, popIn } from "../motion";
import { VizLayouts, VizStage } from "../stage";
import type { VizProps } from "../types";

// The same two colours (blue 2b6cff, amber ffb02e) blended two ways in 40 stripes. Mixing the sRGB
// numbers passes through a grey; mixing in OKLCH (lightness, chroma, hue) keeps the middle vivid.
// Under each bar a thin line draws the chroma of every stripe, measured on the displayed colour.
// Conversions: Bjorn Ottosson's published OKLab matrices.

type RGB = [number, number, number];
const A: RGB = [0x2b, 0x6c, 0xff];
const B: RGB = [0xff, 0xb0, 0x2e];
const N = 40;

const toLin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLin = (v: number) => Math.round(255 * Math.min(1, Math.max(0, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)));

function toOklab([r, g, b]: RGB): [number, number, number] {
  const [lr, lg, lb] = [toLin(r), toLin(g), toLin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOklab([L, a, b]: [number, number, number]): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [fromLin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), fromLin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), fromLin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
const chroma = (c: RGB) => {
  const [, a, b] = toOklab(c);
  return Math.hypot(a, b);
};
const hex = (c: RGB) => `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

function srgbMix(u: number): RGB {
  return [0, 1, 2].map((i) => Math.round(A[i] + (B[i] - A[i]) * u)) as RGB;
}
function oklchMix(u: number): RGB {
  const [L1, a1, b1] = toOklab(A);
  const [L2, a2, b2] = toOklab(B);
  const c1 = Math.hypot(a1, b1);
  const c2 = Math.hypot(a2, b2);
  const h1 = Math.atan2(b1, a1);
  let dh = Math.atan2(b2, a2) - h1;
  if (dh > Math.PI) dh -= 2 * Math.PI;
  if (dh < -Math.PI) dh += 2 * Math.PI;
  const L = L1 + (L2 - L1) * u;
  const c = c1 + (c2 - c1) * u;
  const h = h1 + dh * u;
  return fromOklab([L, c * Math.cos(h), c * Math.sin(h)]);
}

const STRIPES = Array.from({ length: N }, (_, i) => (i + 0.5) / N);
const CMAX = 0.2;

function Bar({ x, y, w, h, mix, title, note, good }: { x: number; y: number; w: number; h: number; mix: (u: number) => RGB; title: string; note: string; good: boolean }) {
  const sw = w / N;
  let d = "";
  STRIPES.forEach((u, i) => {
    const px = x + (i + 0.5) * sw;
    const py = y + h + 8 + 20 - (chroma(mix(u)) / CMAX) * 20;
    d += `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
  });
  return (
    <g>
      <g {...motion(fadeIn(80, 400))}>
        <text class="t-sub t-strong" x={x} y={y - 8}>{title}</text>
      </g>
      <g {...motion(fadeIn(250, 600))}>
        {STRIPES.map((u, i) => <rect x={x + i * sw - 0.3} y={y} width={sw + 0.6} height={h} style={{ fill: hex(mix(u)) }} />)}
      </g>
      <g {...motion(fadeIn(700, 500))}>
        <path d={d} fill="none" style={{ stroke: good ? C.accent3 : C.accent2, "stroke-width": 2 }} />
        <text class="t-sub" x={x + w} y={y + h + 14} text-anchor="end" style={{ fill: C.muted }}>chroma</text>
      </g>
      <g {...motion(popIn(1000, 420))}>
        <circle cx={x + w / 2} cy={y + h / 2} r={5} style={{ fill: "none", stroke: "#ffffff", "stroke-width": 2 }} />
      </g>
      <g {...motion(fadeUp(1200, 420, 3))}>
        <text class="t-sub t-strong" x={x + w / 2 + 12} y={y + h / 2 + 4} style={{ fill: "#111111" }}>{note}</text>
      </g>
    </g>
  );
}

export default function OklchGradients({ size }: VizProps) {
  return (
    <VizStage size={size}>
      <VizLayouts
        wide={() => (
          <g>
            <Bar x={36} y={30} w={568} h={44} mix={srgbMix} title="Mixing the sRGB numbers" note="grey" good={false} />
            <Bar x={36} y={130} w={568} h={44} mix={oklchMix} title="Mixing in OKLCH" note="vivid" good />
          </g>
        )}
        narrow={() => (
          <g>
            <Bar x={12} y={30} w={312} h={52} mix={srgbMix} title="Mixing the sRGB numbers" note="grey" good={false} />
            <Bar x={12} y={150} w={312} h={52} mix={oklchMix} title="Mixing in OKLCH" note="vivid" good />
          </g>
        )}
      />
    </VizStage>
  );
}
