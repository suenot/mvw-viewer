---
title: "Technique: motion blur from subframes"
label: "Subframe blur"
order: 17
parent: "guides/motion-techniques"
summary: "Draw four samples inside each frame and blend them, so fast movement gets a short streak instead of a sharp hop."
---

# Technique: motion blur from subframes

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Code-drawn motion is razor sharp: a ball that moves 60 px between frames is two crisp discs, and the eye sees a hop. Two prompts in our database ask for real motion blur and say how: render 4 subframes for each frame ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)); "render 4 subframes per frame, blend (tmix-style)" ([techhalla](https://x.com/techhalla/status/2103411244468498547)).

```viz motion-techniques/subframe-blur
caption: The same ball moving fast. Left: one sample per frame. Right: four samples blended, which leaves a short streak behind the ball.
```

## How it works

A camera exposes for a part of the frame time, so a moving object smears. A coded scene can fake this by evaluating the picture at several moments inside one frame and averaging. At 60 fps a frame is 1/60 s; with four subframes the picture is drawn at `t`, `t + 1/4`, `t + 1/2` and `t + 3/4` of that interval and blended into one frame. It works because the picture is a [function of time](technique-seekable-frame.md): asking for a time between frames costs nothing.

## How to build it

```js
const SUB = 4, FPS = 60;
for (let f = 0; f < frames; f++) {
  clearAccumulator();
  for (let s = 0; s < SUB; s++) {
    renderAt(f / FPS + (s / SUB) / FPS);
    accumulate(canvas, 1 / SUB);     // add this sample with weight 1/4
  }
  writeFrame(accumulator);
}
```

Rendering is four times slower, so keep it for the final render and test with one sample ([render and inspect](technique-render-and-inspect.md)).

## Watch for

- **Blur on text that should be crisp.** Fast text can smear into mush; blur the moving layer, not a settled label.
- **Too few subframes on very fast moves.** Four samples show visible steps when an object crosses most of the frame in one frame time; add samples or slow the move.
- **Blur and a [stable seed](technique-cadence-and-seed.md).** Sample times between frames must not change the seed of a hand-drawn wobble, or the subframes disagree.

**Sources:** [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) in our prompt database. The accumulation loop is ours.
