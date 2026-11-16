// Closed-form second-order step responses, used by the spring and loop demos.
// `settle` is the time to stay within 2 % of the target.

/** Step response of a spring with damping ratio `zeta` that settles in `settle` seconds. */
export function springAt(t: number, zeta: number, settle: number): number {
  if (t <= 0) return 0;
  if (zeta >= 1) {
    const wn = 5.83 / settle; // critical damping: 2 % settling is about 5.83 / wn
    return 1 - (1 + wn * t) * Math.exp(-wn * t);
  }
  const wn = 4 / (zeta * settle); // under-damped: 2 % settling is about 4 / (zeta * wn)
  const root = Math.sqrt(1 - zeta * zeta);
  const wd = wn * root;
  return 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / root) * Math.sin(wd * t));
}

/** Sample `f` at n+1 even steps over [0, 1] into keyframes (offsets 0..1) with the given transform. */
export function sampleKeys(n: number, make: (u: number) => Keyframe): Keyframe[] {
  const out: Keyframe[] = [];
  for (let i = 0; i <= n; i += 1) out.push({ ...make(i / n), offset: i / n });
  return out;
}

export const px1 = (v: number) => Math.round(v * 100) / 100;
