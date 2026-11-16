---
title: "Technique: a hand that draws on, tip on the point"
label: "Hand draw-on"
order: 39
parent: "guides/motion-techniques"
summary: "A whiteboard draw-on: one eased value draws the stroke, and the pen sits on the point at that same value; between strokes it lifts and moves unseen."
---

# Technique: a hand that draws on, tip on the point

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The VideoScribe look is a stroke that draws itself and a pen that never leaves the newest point. The trick is that both come from one number.

```viz motion-techniques/hand-draw-on
caption: Two strokes, each drawn as 30 line pieces that fade in one after another. The pen sits on the newest point, lifts at the end of the first stroke and travels unseen to the start of the second.
```

## The mechanic

Give each path `pathLength="1"`, so a single value from 0 to 1 draws any path whatever its real length. Use a linear or very gentle ease: an ease-in-out on a long stroke makes the marker lurch. At progress `k`, sample the path at `k` and put the pen's nib there. Offset the pen art so its tip, not its corner, lands on the point. Between separate strokes lift the pen (fade out, jump, fade in) so it does not slide across blank board. Draw one thing at a time, in narration order.

## A sketch

Our sketch, not run. The skill uses `stroke-dashoffset`; our demo, which animates only transform and opacity, draws 30 short pieces instead.

```js
path.setAttribute("pathLength", 1);
path.style.strokeDasharray = 1;
path.style.strokeDashoffset = 1 - k;          // k from 0 to 1
const p = path.getPointAtLength(k * path.getTotalLength());
pen.setAttribute("transform", `translate(${p.x - NIB.x} ${p.y - NIB.y})`);
```

The nib stays glued because both the stroke and the pen read the same `k`. This is the [seekable frame](technique-seekable-frame.md) contract again: given `k`, the picture is known.

**Sources:** [iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills), `skills/whiteboard-animation/SKILL.md`. MIT licence.
