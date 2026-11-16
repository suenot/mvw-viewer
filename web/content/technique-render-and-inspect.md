---
title: "Technique: render, then inspect real frames"
label: "Render and inspect"
order: 7
parent: "guides/motion-techniques"
summary: "A quality gate that cannot be argued with: pull frames at fixed times from an actual render, write down what is wrong with each, fix the source."
---

# Technique: render, then inspect real frames

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The creator credits his model with analysing reference clips and checking its own work ([05:00](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=300s)), and his checklist includes an agent review of frames ([10:14](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=614s)). Studio Igor adds numbers: scripts measure foot slide, asymmetry, bone stretch and transition jolts, and image critics look at rendered frames ([20:55](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=1255s)). The shared idea is that an assistant's statement that "it looks right" is not evidence; a frame is.

```viz motion-techniques/render-inspect
caption: Frames at 0.5, 1.0, 2.0 and 4.5 s are checked in turn. The 2.0 s frame has its label at the edge; the defect is logged with its time, the source is fixed and the clip is rendered again.
```

## How it works

1. **Render a preview** of the scene, not a mock-up. A saved file is the proof that the check ran.
2. **Pull frames at fixed times:** the opening, a midpoint, a transition and the last frame. For a 5 s clip that is 0.5, 1.0, 2.0 and 4.5 s.
3. **Write one observation per frame, with the time.** "Label touches the right edge at 2.0 s" is a finding. "Looks fine" is not.
4. **Fix the source, not the frame,** then render again and compare.
5. **Watch the clip once at normal speed.** Frames cannot show sparkle, flicker, a missed beat or a bad hold.

A person still decides about meaning, facts and style fit. The loop removes the defects an assistant can see and hands over a short list of what remains.

## Add numbers where you can

Measure what is measurable: contour displacement per frame, text bounding boxes against the safe area, the share of near-black frames. Our [skill trial](skill-trial-bond-short.md) turned scans like these into gates, and every build failed at least one gate in a draft and was fixed before the render.

## Watch for

- **A claim without a file.** Require the preview path and the frame times in the report.
- **Checking only the start.** Defects cluster at transitions and at the end.
- **Fixing in post.** A patched frame hides a source that will break again; correct the scene.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 05:00-06:16 and 10:14-11:41; Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk) at 20:55-22:50. Both describe the checks; neither publishes pass rates.
