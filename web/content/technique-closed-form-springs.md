---
title: "Technique: closed-form springs"
label: "Closed-form springs"
order: 14
parent: "guides/motion-techniques"
summary: "Move things with the exact step response of a spring, a formula of time, and give the camera a slower spring than the shape."
---

# Technique: closed-form springs

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The prompts that ask for a premium UI feel agree on how things should move: with springs, and with numbers, not adjectives. One prompt gives them: the shape uses damping 0.72 and settles in 0.35 s, the camera uses damping 1.0 and settles in 0.6 s ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)). It also asks for the inputs "in hex codes, seconds, damping ratios and pixel sizes instead of adjectives". Two other prompts ask for "springs everywhere, a tiny overshoot at most" ([AnnaCher](https://x.com/AnnaCher___/status/2103571098638152174), [0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)).

```viz motion-techniques/closed-form-springs
caption: Both curves are exact formulas, replayed here three times slower than real time. The shape (blue) overshoots by 3.8 % and settles in 0.35 s. The camera (orange) does not overshoot and arrives at 0.6 s.
```

## How it works

A spring does not need a physics loop. Its response to a step has a closed form, so the value at time `t` is one expression. That keeps the animation a [pure function of time](technique-seekable-frame.md): seeking to any moment needs no simulation of the moments before it.

The two numbers mean what they say. **Damping** below 1 overshoots a little and returns; at 1 the value arrives without overshoot. **Settle time** is how long until it stays within 2 % of the target. In the demo, 0.72 gives about 3.8 % overshoot, which reads as life without looking like a cartoon.

Give the camera a slower, non-overshooting spring than the shape. The shape arrives first, then the frame comes to rest around it, and the eye follows the object before the view settles.

## How to build it

```js
// step response, 0 to 1. zeta = damping ratio, settle = seconds to stay within 2 %
function spring(t, zeta, settle) {
  if (t <= 0) return 0;
  if (zeta >= 1) { const w = 5.83 / settle; return 1 - (1 + w * t) * Math.exp(-w * t); }
  const w = 4 / (zeta * settle), r = Math.sqrt(1 - zeta * zeta), wd = w * r;
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta / r) * Math.sin(wd * t));
}

// one spring per change of target, summed, so the value stays a function of t
const value = changes.reduce((v, c) => v + (c.to - c.from) * spring(t - c.at, 0.72, 0.35), start);
```

Both prompts that animate a main shape ask for this: "when a value changes target several times, add one spring per change" ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)).

## Watch for

- **Bounce.** Damping near 0.3 looks like rubber. The prompts keep overshoot small and ban "bouncy cartoon easing".
- **One spring for everything.** Give shape, camera and text their own numbers, or the scene moves as one lump.
- **Easing curves for the camera.** A cubic ease has no memory of an earlier move; a spring per change blends them.

**Sources:** [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [annacher-152174](https://x.com/AnnaCher___/status/2103571098638152174), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612) in our prompt database. The numbers 0.72, 0.35, 1.0 and 0.6 are the prompt's; the formula and the 3.8 % figure are ours.
