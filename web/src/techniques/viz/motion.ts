// Motion vocabulary for the viz kit.
//
// Primitives describe their animation declaratively: an element carries a `data-motion`
// attribute (built with `motion(...)`) and, for numbers, a `data-count` attribute (built with
// `countUp(...)`). <VizStage> reads them when the visualization mounts and drives everything
// on one Web Animations timeline: it starts when the figure scrolls into view, pauses off
// screen, replays on request and is skipped entirely under prefers-reduced-motion.
//
// The base style of every element is its final, readable state. A keyframe list therefore
// always ends on the element's resting style, and motion only describes the way there.
// Only `transform` and `opacity` are animated.

export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
export const EASE_DRAW = "cubic-bezier(0.65, 0, 0.35, 1)";
/** A gentle overshoot for things that settle into place (nodes of a graph). */
export const EASE_SETTLE = "cubic-bezier(0.34, 1.32, 0.64, 1)";
export const LINEAR = "linear";

export type MotionSpec = {
  /** Keyframes; the last one should equal the resting style. */
  k: Keyframe[];
  /** Delay from the start of the timeline, ms. */
  t?: number;
  /** Duration, ms. */
  d: number;
  /** Easing. Defaults to EASE_OUT. */
  e?: string;
  /** Iterations; use Infinity (serialised as -1) for ambient loops. */
  i?: number;
};

type SerialSpec = Omit<MotionSpec, "i"> & { i?: number };

/** Spread onto an element: `<g {...motion(fadeUp(120))}>`. */
export function motion(...specs: Array<MotionSpec | null | undefined | false>) {
  const list: SerialSpec[] = [];
  for (const spec of specs) {
    if (!spec) continue;
    const serial: SerialSpec = { k: spec.k, d: Math.round(spec.d) };
    if (spec.t) serial.t = Math.round(spec.t);
    if (spec.e && spec.e !== EASE_OUT) serial.e = spec.e;
    if (spec.i !== undefined && spec.i !== 1) serial.i = spec.i === Infinity ? -1 : spec.i;
    list.push(serial);
  }
  return list.length ? { "data-motion": JSON.stringify(list) } : {};
}

export type CountSpec = {
  /** Values to pass through: [timeMs, value] pairs. The first value is shown at the start. */
  v: Array<[number, number]>;
  /** Duration of each change, ms. */
  d?: number;
  /** Decimal places. */
  p?: number;
  /** Text before and after the number. */
  pre?: string;
  suf?: string;
};

/** A number that counts to its value. The element's text must already be the final value. */
export function countUp(to: number, at = 0, duration = 900, options: { decimals?: number; prefix?: string; suffix?: string; from?: number } = {}) {
  const spec: CountSpec = { v: [[at, options.from ?? 0], [at, to]], d: duration };
  if (options.decimals) spec.p = options.decimals;
  if (options.prefix) spec.pre = options.prefix;
  if (options.suffix) spec.suf = options.suffix;
  return { "data-count": JSON.stringify(spec) };
}

/** A number that steps through several values, each change starting at its own time. */
export function countSteps(steps: Array<[number, number]>, duration = 700, options: { decimals?: number; prefix?: string; suffix?: string } = {}) {
  const spec: CountSpec = { v: steps, d: duration };
  if (options.decimals) spec.p = options.decimals;
  if (options.prefix) spec.pre = options.prefix;
  if (options.suffix) spec.suf = options.suffix;
  return { "data-count": JSON.stringify(spec) };
}

export function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// ---------------------------------------------------------------- common keyframe sets

export function fadeUp(t = 0, d = 520, distance = 6): MotionSpec {
  return {
    k: [
      { opacity: 0, transform: `translate(0px, ${distance}px)` },
      { opacity: 1, transform: "translate(0px, 0px)" },
    ],
    t,
    d,
  };
}

export function fadeIn(t = 0, d = 360): MotionSpec {
  return { k: [{ opacity: 0 }, { opacity: 1 }], t, d, e: "ease" };
}

/** Scale in around the element's local origin, which primitives place at the shape's centre. */
export function popIn(t = 0, d = 520, from = 0.92): MotionSpec {
  return {
    k: [
      { opacity: 0, transform: `scale(${from})` },
      { opacity: 1, transform: "scale(1)" },
    ],
    t,
    d,
  };
}

/** Grow along the local x axis from the local origin (a line drawn from x=0). */
export function growX(t = 0, d = 420, e = EASE_DRAW): MotionSpec {
  return { k: [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], t, d, e };
}

export function growY(t = 0, d = 420, e = EASE_DRAW): MotionSpec {
  return { k: [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], t, d, e };
}

// ---------------------------------------------------------------- geometry helpers

export type Point = [number, number];

export function distance(a: Point, b: Point) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function polylineLength(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1], points[i]);
  return total;
}

export function pointAt(points: Point[], fraction: number): Point {
  const total = polylineLength(points);
  let target = Math.max(0, Math.min(1, fraction)) * total;
  for (let i = 1; i < points.length; i += 1) {
    const segment = distance(points[i - 1], points[i]);
    if (target <= segment || i === points.length - 1) {
      const ratio = segment === 0 ? 0 : Math.min(1, target / segment);
      return [
        points[i - 1][0] + (points[i][0] - points[i - 1][0]) * ratio,
        points[i - 1][1] + (points[i][1] - points[i - 1][1]) * ratio,
      ];
    }
    target -= segment;
  }
  return points[points.length - 1];
}

/** Sample a quadratic Bezier into a polyline. */
export function sampleQuadratic(a: Point, control: Point, b: Point, steps = 18): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * control[0] + t * t * b[0], u * u * a[1] + 2 * u * t * control[1] + t * t * b[1]]);
  }
  return out;
}

const r2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Keyframes that carry a small mark along a polyline at constant speed, fading in at the
 * start and out at the end. `travel` is the share of the iteration spent moving; the rest of
 * the iteration the mark stays hidden, which gives looping packets a rest between passes.
 */
export function travelKeyframes(points: Point[], travel = 1, fadePx = 14): Keyframe[] {
  const total = polylineLength(points) || 1;
  const fade = Math.min(0.25, fadePx / total);
  const stops: Array<{ o: number; p: Point }> = [{ o: 0, p: points[0] }];
  let walked = 0;
  for (let i = 1; i < points.length; i += 1) {
    walked += distance(points[i - 1], points[i]);
    stops.push({ o: walked / total, p: points[i] });
  }
  stops.push({ o: fade, p: pointAt(points, fade) }, { o: 1 - fade, p: pointAt(points, 1 - fade) });
  stops.sort((a, b) => a.o - b.o);
  const opacityAt = (o: number) => (o <= 0 || o >= 1 ? 0 : o < fade ? o / fade : o > 1 - fade ? (1 - o) / fade : 1);
  const frames: Keyframe[] = [];
  let last = -1;
  for (const stop of stops) {
    if (stop.o - last < 1e-4) continue;
    frames.push({
      offset: Math.round(stop.o * travel * 10000) / 10000,
      opacity: Math.round(opacityAt(stop.o) * 1000) / 1000,
      transform: `translate(${r2(stop.p[0])}px, ${r2(stop.p[1])}px)`,
    });
    last = stop.o;
  }
  const end = points[points.length - 1];
  frames[frames.length - 1].opacity = 0;
  if (travel < 1) frames.push({ offset: 1, opacity: 0, transform: `translate(${r2(end[0])}px, ${r2(end[1])}px)` });
  frames[0].offset = 0;
  frames[frames.length - 1].offset = 1;
  return frames;
}

/**
 * Like travelKeyframes, but the trip happens inside a window of the iteration: it starts at
 * share `from` and ends at share `to`, and the mark is hidden for the rest of the iteration.
 */
export function windowedTravel(points: Point[], from: number, to: number, fadePx = 12): Keyframe[] {
  const inner = travelKeyframes(points, 1, fadePx);
  const span = Math.max(1e-4, to - from);
  const start = points[0];
  const end = points[points.length - 1];
  const frames: Keyframe[] = [];
  if (from > 0) frames.push({ offset: 0, opacity: 0, transform: `translate(${r2(start[0])}px, ${r2(start[1])}px)` });
  for (const frame of inner) {
    frames.push({ ...frame, offset: Math.round((from + (frame.offset as number) * span) * 10000) / 10000 });
  }
  if (to < 1) frames.push({ offset: 1, opacity: 0, transform: `translate(${r2(end[0])}px, ${r2(end[1])}px)` });
  // Offsets must not decrease; rounding can make neighbours equal, which is allowed.
  for (let i = 1; i < frames.length; i += 1) {
    if ((frames[i].offset as number) < (frames[i - 1].offset as number)) frames[i].offset = frames[i - 1].offset;
  }
  frames[0].offset = 0;
  frames[frames.length - 1].offset = 1;
  return frames;
}

/** Opacity keyframes with one short peak at each of `times` (shares of one iteration). */
export function peaksKeyframes(times: number[], peak = 1, rise = 0.012, hold = 0.02, fall = 0.09): Keyframe[] {
  const sorted = [...times].sort((a, b) => a - b);
  const points: Array<[number, number]> = [[0, 0]];
  for (const at of sorted) {
    points.push([Math.max(0, at - rise), 0], [at, peak], [Math.min(1, at + hold), peak], [Math.min(1, at + hold + fall), 0]);
  }
  points.push([1, 0]);
  const frames: Keyframe[] = [];
  let last = -1;
  for (const [offset, opacity] of points) {
    let clamped = Math.min(1, offset);
    if (clamped < last) clamped = last;
    frames.push({ offset: Math.round(clamped * 10000) / 10000, opacity });
    last = clamped;
  }
  frames[0].offset = 0;
  frames[frames.length - 1].offset = 1;
  return frames;
}

/**
 * Opacity keyframes for a looping highlight: invisible, rising at `at` (a share of the
 * iteration), holding for `hold`, then fading over `fadeOut`. Shares are of one iteration.
 */
export function pulseKeyframes(at: number, rise = 0.02, hold = 0.03, fadeOut = 0.12, peak = 1): Keyframe[] {
  const points: Array<[number, number]> = [
    [0, 0],
    [Math.max(0, at - rise), 0],
    [at, peak],
    [Math.min(1, at + hold), peak],
    [Math.min(1, at + hold + fadeOut), 0],
    [1, 0],
  ];
  const frames: Keyframe[] = [];
  let last = -1;
  for (const [offset, opacity] of points) {
    const clamped = Math.min(1, Math.max(last + 1e-4, offset));
    if (clamped > 1) continue;
    frames.push({ offset: Math.round(clamped * 10000) / 10000, opacity });
    last = clamped;
  }
  frames[0].offset = 0;
  frames[frames.length - 1].offset = 1;
  return frames;
}

/**
 * Opacity keyframes over one timeline of `total` ms: hidden, shown at `showAt`, hidden again at
 * `hideAt` (stays shown when omitted). Use it with `t: 0, d: total, e: LINEAR` for an element
 * that is on screen only during part of a longer story, such as one frame of a slide show.
 */
export function windowFrames(total: number, showAt: number, hideAt?: number, fade = 260): Keyframe[] {
  const at = (time: number) => Math.round(Math.min(1, Math.max(0, time / total)) * 10000) / 10000;
  const frames: Keyframe[] = [
    { offset: 0, opacity: 0 },
    { offset: at(showAt), opacity: 0 },
    { offset: at(showAt + fade), opacity: 1 },
  ];
  if (hideAt !== undefined) {
    frames.push({ offset: at(hideAt), opacity: 1 }, { offset: at(hideAt + fade), opacity: 0 }, { offset: 1, opacity: 0 });
  } else {
    frames.push({ offset: 1, opacity: 1 });
  }
  for (let i = 1; i < frames.length; i += 1) {
    if ((frames[i].offset as number) < (frames[i - 1].offset as number)) frames[i].offset = frames[i - 1].offset;
  }
  return frames;
}
