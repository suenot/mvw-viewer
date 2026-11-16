---
title: "Technique: line boil, a contour that is redrawn while the shape stays still"
label: "Line boil"
order: 1
parent: "guides/motion-techniques"
summary: "Redraw each outline a dozen times a second with a little wobble, so a still pose looks hand-drawn. How it works, a small code recipe and where it goes wrong."
---

# Technique: line boil

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Hand-drawn animation never repeats a line exactly. Even a character holding still has an outline that trembles, because the artist redraws it for every drawing. Line boil copies that on purpose: the silhouette stays where it is, and only the stroke is redrawn, about 12 times a second.

```viz motion-techniques/line-boil
caption: One circle, six drawings. On the left they play in turn, one every 83 ms, which is 12 drawings a second; on the right the same six are laid over each other. The shape does not move, only its edge does.
```

## How it works

Two things move on different clocks. The object (its position, size, rotation) follows the scene timeline smoothly. The outline of that object is a separate set of points, and those points are displaced by a small random amount, a new amount for each drawing. ProdAdvice describes exactly this for "otherwise still contours" at 12 fps ([08:05](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=485s)), and Studio Igor's whale cartoon uses the same effect with "vibrating contours" at about 12 drawings a second ([0:49](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=49s)).

The displacement is small. In the demo above it is 2.6 px on a circle of 62 px radius, which is about 4 % of the radius. A larger amount reads as shaking, not as pencil.

## How to build it

Our own recipe, not recovered source code:

```js
// one drawing = the same points, each moved by a seeded random offset
function boil(points, drawing, amp, sceneSeed) {
  const rand = mulberry32(sceneSeed + drawing);
  return points.map(([x, y]) => [x + (rand() - 0.5) * 2 * amp, y + (rand() - 0.5) * 2 * amp]);
}
const drawing = Math.floor(time * 12);   // the drawing cadence
draw(boil(outline, drawing, 2.6, 7));
```

Keep the position of the object outside this function. Pass the amplitude as one token of the style (see [Style contract](technique-style-contract.md)), so one number changes the whole film.

## Watch for

- **Noise everywhere.** Move only the strokes, never the labels or numbers. A label that wobbles is hard to read.
- **Too large an amplitude.** If the shape seems to swim, halve the amount.
- **A drawing rhythm tied to the file.** The drawing index must come from time, not from the frame number. See [Drawing cadence and a stable seed](technique-cadence-and-seed.md).
- **Sparkle.** Judge it at normal playback speed, not frame by frame. A single frame always looks fine.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g), and Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk); both are analysed in [HyperFrames tutorial study](hyperframes-tutorial-study.md) and [Layered art tutorial study](layered-art-to-video.md). The amplitude figure is from our demo, not from either video.
