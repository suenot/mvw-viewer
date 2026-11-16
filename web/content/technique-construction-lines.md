---
title: "Technique: construction lines and broken strokes"
label: "Construction lines"
order: 4
parent: "guides/motion-techniques"
summary: "Leave the artist's scaffolding in the picture: faint guides under the contour, and a contour made of short strokes with gaps."
---

# Technique: construction lines and broken strokes

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A real sketch shows how it was made: a light box, a cross to find the centre, a looser first circle, then a darker contour that does not quite close. ProdAdvice lists "broken strokes" and "light construction lines" among the marks that give the handmade impression ([08:05](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=485s)). Studio Igor's whale cartoon draws blue construction strokes before the main action ([0:49](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=49s)).

```viz motion-techniques/construction-lines
caption: One circle in three stages: guides (a dashed box, a cross and a looser circle), then a contour of seven short strokes with gaps, then both together with the guides left faint.
```

## How it works

- **Guides** go down first and in a second colour, so they read as scaffolding. A dashed bounding box, a cross through the centre and a slightly larger, looser circle are enough.
- **The contour** is split into short strokes. In the demo there are seven, each ending a little before the next begins, with the end points moved by a seeded offset.
- **Together:** when the contour lands, the guides drop to about half their strength (opacity 0.9 to 0.45 in the demo) and stay.

The order matters for motion. Guides appear first, which gives the eye something to track; the strokes then arrive over them. A guide that appears after the contour looks like an error.

## How to build it

Treat guides as their own layer with their own opacity token. The contour function takes a stroke count and a gap size, and returns a path with several sub-paths:

```js
const strokes = 7, gap = 0.16;   // radians left open at each seam
for (let s = 0; s < strokes; s++) {
  const a0 = (s / strokes) * TAU + gap / 2, a1 = ((s + 1) / strokes) * TAU - gap / 2;
  path.push(arc(cx, cy, r, a0, a1, jitter(seed + s)));
}
```

## Watch for

- **Guides that compete with a label.** Keep them out of the area reserved for text, or fade them out before the label arrives.
- **Gaps that look like a rendering bug.** If a seam is wider than a few pixels at delivery size, reduce the gap.
- **Everything at once.** Use guides on the hero object, not on every element of the frame.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 08:05-09:09, and Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk) at 0:49-2:31. Stroke count, gap and opacity figures are from our demo.
