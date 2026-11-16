---
title: "Technique: hatching instead of a flat fill"
label: "Hatching"
order: 3
parent: "guides/motion-techniques"
summary: "Shade with strokes, not with a solid colour. A circle-and-chord recipe, a second crossing pass and the reasons it keeps a drawing from looking digital."
---

# Technique: hatching instead of a flat fill

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A flat fill is the clearest sign of a computer-made drawing. A pencil shades by laying down many short parallel strokes, and the viewer reads their spacing as light and dark. ProdAdvice shows this as a diagram that contrasts a flat fill with hatched shading ([09:00](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=540s)).

```viz motion-techniques/hatching
caption: The same ball twice. Left, a flat fill. Right, diagonal strokes only on the side away from the light, then a second pass crossing the darkest part.
```

## How it works

1. Decide where the light comes from. In the demo it is the upper left, so the shadow is on the lower right.
2. Lay parallel strokes at one angle (45 degrees here), spaced 6 px apart, only where the surface is in shadow. Each stroke runs from one edge of the shape to the other.
3. Add a second pass at the crossing angle over the deepest part only. Two directions read as a darker tone than one.
4. Wobble each stroke slightly with a seeded offset (1.6 px in the demo), so the lines are not machine-straight. Draw the strokes on in order, not all at once, if the shape appears by being drawn.

## How to build it

For a circle the strokes are chords. Lines `x + y = k` cut a circle of radius `r` at distance `d = |cx + cy - k| / sqrt(2)` from its centre, with half-length `sqrt(r * r - d * d)`, so no clipping mask is needed. For other shapes, clip a set of long diagonal lines to the shape and keep those on the shadow side.

Spacing is the tone control. Closer strokes are darker, so a gradient of shade is a gradient of spacing, not of opacity.

## Watch for

- **Hatching that changes direction between frames.** Fix the angle per object and seed the offsets; see [Drawing cadence and a stable seed](technique-cadence-and-seed.md). Put this failure in your [error log](technique-error-log.md).
- **Shading under text.** Keep the area behind a label free of strokes, or the label loses contrast.
- **Too many strokes.** A busy shape competes with the message. Reserve the dense hatch for one object.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 08:05-09:09. The chord arithmetic and the spacing values are from our demo.
