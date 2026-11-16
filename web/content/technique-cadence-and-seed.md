---
title: "Technique: drawing cadence and a stable seed"
label: "Cadence and seed"
order: 2
parent: "guides/motion-techniques"
summary: "Why the redraw rhythm must come from time, not from the frame number, and why the random numbers must be seeded so a re-render gives the same picture."
---

# Technique: drawing cadence and a stable seed

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Line boil needs two decisions that look like details and decide whether the effect survives a render. First, how often a new drawing appears, independent of the video's frame rate. Second, which random numbers a given moment uses, so that the same moment always looks the same.

## Cadence is not the frame rate

ProdAdvice contrasts 24 and 12 fps with a ball example ([08:22](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=502s)). The part that carries over to a production file is the idea, not the setting: the drawing rate is a look, and the file rate is a delivery format.

```viz hyperframes-tutorial-study/cadence
caption: Half a second at 12 drawings a second. The drawing rhythm stays the same; only the number of frames each drawing holds changes with the file rate.
```

The drawing index is `floor(time * 12)`. In a 24 fps file each drawing holds 2 frames. In a 30 fps file the holds alternate between 3 and 2 frames. Both show the same six drawings in half a second.

## A seed makes a moment repeatable

A renderer may visit the same time more than once: it seeks, it re-renders a failed chunk, you scrub back to check a defect. If the outline uses a random number at every call, the second visit draws a different contour, and the defect you saw is gone or a new one appears.

```viz motion-techniques/seed
caption: The same three visits to the timeline: 0.5 s, 1.0 s, then 0.5 s again. With a random number the third circle differs from the first; with a seed that comes from the scene seed plus the drawing index it is identical.
```

The fix is one line: seed the generator with the scene seed plus the drawing index, `seed = sceneSeed + floor(time * 12)`. Then 0.5 s is drawing 6 every time, and 1.0 s is drawing 12.

## Checklist

1. Compute the drawing index from time, never from a frame counter.
2. Give each scene one fixed seed and store it with the scene, so a revision does not reshuffle every line.
3. Let the camera and any text read continuous time, not the drawing index. Only the stroke follows the cadence.
4. Do not change a required delivery rate (24, 25, 30) to imitate a source video. Keep 12 drawings a second inside the file.

This is our proposed implementation. The tutorial does not publish its code; see the source limits in [HyperFrames tutorial study](hyperframes-tutorial-study.md).

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 08:22.
