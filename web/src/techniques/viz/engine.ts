// Motion engine: reads data-motion / data-count attributes of a subtree and drives them on the Web Animations timeline (paused, fill: both). Framework-agnostic.

export type SerialSpec = { k: Keyframe[]; t?: number; d: number; e?: string; i?: number };
type CountSpec = { v: Array<[number, number]>; d?: number; p?: number; pre?: string; suf?: string };

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function formatCount(value: number, spec: CountSpec) {
  const decimals = spec.p ?? 0;
  const text = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${spec.pre ?? ""}${text}${spec.suf ?? ""}`;
}

function countValueAt(spec: CountSpec, time: number) {
  const steps = spec.v;
  const duration = spec.d ?? 900;
  let value = steps[0][1];
  for (let i = 1; i < steps.length; i += 1) {
    const [start, target] = steps[i];
    if (time <= start) break;
    const progress = Math.min(1, (time - start) / duration);
    value = value + (target - value) * easeOutCubic(progress);
    if (progress < 1) break;
    value = target;
  }
  return value;
}

/**
 * The SVG `transform` attribute as a CSS transform list ("translate(10 20)" becomes
 * "translate(10px, 20px)"), or "" when it cannot be converted. A CSS animation of `transform`
 * replaces the attribute, so a group that is positioned by the attribute and also animated
 * would jump to the origin; the engine puts the attribute in front of every animated frame so
 * the group stays where it is drawn and the motion happens around that position.
 */
export function svgTransformToCss(value: string | null): string {
  if (!value) return "";
  const parts: string[] = [];
  for (const match of value.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (!args.length || args.some((arg) => Number.isNaN(arg))) return "";
    switch (match[1]) {
      case "translate":
        parts.push(`translate(${args[0]}px, ${args[1] ?? 0}px)`);
        break;
      case "scale":
        parts.push(`scale(${args[0]}, ${args[1] ?? args[0]})`);
        break;
      case "rotate":
        parts.push(
          args.length >= 3
            ? `translate(${args[1]}px, ${args[2]}px) rotate(${args[0]}deg) translate(${-args[1]}px, ${-args[2]}px)`
            : `rotate(${args[0]}deg)`,
        );
        break;
      case "skewX":
        parts.push(`skewX(${args[0]}deg)`);
        break;
      case "skewY":
        parts.push(`skewY(${args[0]}deg)`);
        break;
      case "matrix":
        if (args.length !== 6) return "";
        parts.push(`matrix(${args.join(", ")})`);
        break;
      default:
        return "";
    }
  }
  return parts.join(" ");
}

export class MotionEngine {
  private animations: Animation[] = [];
  private counters: Array<{ el: Element; spec: CountSpec; final: string }> = [];
  private clock: Animation | null = null;
  private frame = 0;
  private playing = false;

  constructor(private root: HTMLElement) {}

  build() {
    this.destroy();
    let horizon = 0;
    for (const el of this.root.querySelectorAll<HTMLElement | SVGElement>("[data-motion]")) {
      let specs: SerialSpec[];
      try {
        specs = JSON.parse(el.dataset.motion ?? "[]");
      } catch {
        continue;
      }
      const positioned = svgTransformToCss(el.getAttribute("transform"));
      for (const spec of specs) {
        const iterations = spec.i === -1 ? Infinity : (spec.i ?? 1);
        const frames =
          positioned && spec.k.some((frame) => frame.transform)
            ? spec.k.map((frame) => (frame.transform ? { ...frame, transform: `${positioned} ${frame.transform}` } : frame))
            : spec.k;
        const animation = el.animate(frames, {
          duration: spec.d,
          delay: spec.t ?? 0,
          easing: spec.e ?? EASE_OUT,
          iterations,
          fill: "both",
        });
        animation.pause();
        animation.currentTime = 0;
        this.animations.push(animation);
        if (Number.isFinite(iterations)) horizon = Math.max(horizon, (spec.t ?? 0) + spec.d * iterations);
      }
    }
    for (const el of this.root.querySelectorAll("[data-count]")) {
      try {
        const spec = JSON.parse((el as HTMLElement).dataset.count ?? "") as CountSpec;
        if (!Array.isArray(spec.v) || spec.v.length === 0) continue;
        const final = el.textContent ?? "";
        this.counters.push({ el, spec, final });
        const last = spec.v[spec.v.length - 1][0] + (spec.d ?? 900);
        horizon = Math.max(horizon, last);
        el.textContent = formatCount(spec.v[0][1], spec);
      } catch {
        /* a malformed counter keeps its final text */
      }
    }
    if (this.counters.length) {
      this.clock = new Animation(new KeyframeEffect(null, [], { duration: horizon + 50, fill: "forwards" }));
      this.clock.pause();
      this.clock.currentTime = 0;
    }
  }

  private tick = () => {
    this.frame = 0;
    const time = Number(this.clock?.currentTime ?? 0);
    let pending = false;
    for (const counter of this.counters) {
      const value = countValueAt(counter.spec, time);
      const last = counter.spec.v[counter.spec.v.length - 1];
      const done = time >= last[0] + (counter.spec.d ?? 900);
      counter.el.textContent = done ? counter.final : formatCount(value, counter.spec);
      if (!done) pending = true;
    }
    if (this.playing && pending) this.frame = requestAnimationFrame(this.tick);
  };

  play() {
    if (this.playing) return;
    this.playing = true;
    for (const animation of this.animations) animation.play();
    if (this.clock) {
      this.clock.play();
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    for (const animation of this.animations) animation.pause();
    this.clock?.pause();
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  destroy() {
    this.playing = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    for (const animation of this.animations) animation.cancel();
    this.animations = [];
    for (const counter of this.counters) counter.el.textContent = counter.final;
    this.counters = [];
    this.clock?.cancel();
    this.clock = null;
  }
}

