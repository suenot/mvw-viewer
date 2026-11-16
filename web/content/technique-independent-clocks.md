---
title: "Technique: a clock per motion, accumulated"
label: "Independent clocks"
order: 29
parent: "guides/motion-techniques"
summary: "Change a speed without moving the past: advance each motion's own phase by speed times dt, and give every motion its own clock."
---

# Technique: a clock per motion, accumulated

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The owner's game project moves planets around stars and spins them. Its notes state the rule: orbit and spin speeds advance independent accumulated clocks, so changing a slider changes only future motion and never recalculates the past at the new speed. The ocean waves keep a third, real-time clock, so stopping a planet's rotation does not freeze the sea. It is a game rule, and it solves a real problem in speed ramps and slow motion.

```viz motion-techniques/independent-clocks
caption: Speed goes from 1x to 3x at 2 s. Left: phase = speed(t) * t, so the phase jumps from 2 to 6 at the change. Right: phase += speed * dt, so the phase only changes slope.
```

## How it works

If a motion is written as `angle = speed * t`, changing `speed` at 2 s re-scales everything before it: at the moment of the change the angle jumps from `1 * 2` to `3 * 2`. The picture pops. The fix is to store the phase itself and advance it: `phase += speed * dt`. A change of speed now bends the curve and leaves its past alone. Each motion has its own phase (orbit, spin, waves, a camera drift), so you can slow one without touching the others.

For video the phase must still be a function of time, or [seeking](technique-seekable-frame.md) breaks. Phase is the integral of speed, so build a table once and read it:

```js
const fps = 30, phase = new Float64Array(frames + 1);
for (let f = 1; f <= frames; f++) phase[f] = phase[f - 1] + speed((f - 0.5) / fps) / fps;
// renderAt(t) reads phase[Math.floor(t * fps)], or interpolates between two entries
```

Keep one table per motion. A speed ramp is then a few keys in `speed(t)` (eased with [springs](technique-closed-form-springs.md) or a [Hermite curve](technique-camera-curves.md)), never a step.

## Watch for

- **Step changes of speed.** A step in speed is a step in velocity: a visible kick. Ramp it over a few frames.
- **Loops.** A [seamless loop](technique-seamless-loop.md) needs the phase to come back to a multiple of one turn at the end; check the table's last entry.
- **Sound.** If the sound follows the motion, drive it from the same phase table.
- **Slow motion.** A slow-down is a lower `speed` for a while. Do not render at a lower frame rate and stretch it; use [subframe blur](technique-subframe-blur.md) if the motion needs it.

**Sources:** the owner's project notes on celestial motion (private repository). The table code is our proposal; we have not rendered a clip with it.
