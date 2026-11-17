---
title: "Technique: a speed ramp as a time remap"
label: "Speed ramp"
order: 35
parent: "guides/motion-techniques"
summary: "Slow down into an impact and snap back: speed is a curve, the source frame is its running sum, and the slowest frame lands on the beat."
---

# Technique: a speed ramp as a time remap

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A speed ramp is not a cut. It changes how fast the source plays, so the viewer sees slow motion into a hit and a quick release after it.

```viz motion-techniques/speed-ramp
caption: Left, speed against frame: 100 percent to frame 20, an ease down to 25 percent at frame 28, back to 100 percent at frame 40. Right, the source frame, which is the running sum of that speed. The dot moves along it; the dashed line is the impact.
```

## The numbers from the skill

At 30 fps: frames 0 to 20 at 100 percent (run-up); 20 to 28 an ease down to 25 percent (anticipation); frame 28 is the impact, on the beat; 28 to 40 an ease back to 100 percent (release). The skill also says to keep motion blur consistent through the ramp, or the slow section looks strobed.

## A sketch

The code below sketches the idea.

```js
// speed(f): 1 → 0.25 → 1. Source frame = running sum of speed.
const s = (a, b, f) => { const t = Math.min(1, Math.max(0, (f - a) / (b - a))); return t * t * (3 - 2 * t); };
const speed = (f) => f < 20 ? 1 : f < 28 ? 1 - 0.75 * s(20, 28, f) : 1 - 0.75 * (1 - s(28, 40, f));
let src = 0; const sourceFrame = (f) => { src = 0; for (let i = 0; i < f; i++) src += speed(i); return src; };
```

This is the same idea as the [independent clocks](technique-independent-clocks.md) article: accumulate the speed, do not multiply it by time. In an editor use time-remap keyframes with smooth interpolation; in a code timeline drive a remap curve.

**Sources:** [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills), `skills/beat-sync-editing/SKILL.md` (section "Retime: speed ramps"). MIT licence.
