---
title: "Technique: a sharp band that makes a scene look small"
label: "Tilt-shift band"
order: 31
parent: "guides/motion-techniques"
summary: "Blur everything except one horizontal band and a real scene reads as a miniature. Key the band like a camera channel, and seed any grain by frame number."
---

# Technique: a sharp band that makes a scene look small

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Miniature faking is an old photographic trick: shoot from above and blur the top and bottom, and the eye reads the scene as a model, because only small things have so shallow a focus ([Wikipedia: miniature faking](https://en.wikipedia.org/wiki/Miniature_faking)). Our Tabletop Miniature style uses it as its main look: a single post-processing shader does the tilt-shift band and a depth-based blur together, then tone mapping, a colour grade, a vignette and film grain.

```viz motion-techniques/tilt-shift
caption: A small town from above, blurred except for one sharp band. The band moves down and rests in the middle. Two copies of the scene: a sharp one, and a blurred one that a mask hides inside the band.
```

## How it works

The blur size at a pixel (the circle of confusion) is the larger of two values: one from the distance to the band, and one from the scene depth. Inside the band it is zero; outside it grows. The style page uses a 40-tap Vogel-disk gather: for each pixel take 40 samples around it in a spiral, weight each by its own blur size so that sharp objects do not bleed into blurred ones, and sum them.

The band is a number like any other camera value, so it belongs in the same keyed table as the [camera curves](technique-camera-curves.md): move it to the station that matters.

## How to build it

The full-screen shader, as a sketch:

```glsl
float band = smoothstep(uHalf, uHalf + uFall, abs(vUv.y - uCenter));   // 0 in the band, 1 far from it
float coc  = uMaxBlur * max(band, depthCoc);                            // size of the blur disk
for (int i = 0; i < 40; i++) {                                          // Vogel disk: golden angle spiral
  float r = sqrt(float(i) + 0.5) / sqrt(40.0), a = float(i) * 2.39996;
  vec2 o = r * coc * vec2(cos(a), sin(a));
  // weight by the sample's own coc, then accumulate colour
}
```

For a flat scene (no depth buffer) the SVG demo above is enough: a blurred copy and a gradient mask.

## Watch for

- **Grain seeded by the wall clock.** The style's first version reseeded its grain on a 24 Hz clock, `floor(uTime * 24.0)`. Rendered at 30 fps, that repeats the same grain on one frame in five, so the picture holds still for a frame and then jumps six times a second. It looked like simultaneous white glints on the water. Seed the grain from a frame counter, `uFrame = round(t * fps)`.
- **Measure, do not guess.** The diagnosis: group the frame-to-frame change of in-focus blocks by frame index modulo 5. One class sat 46 percent below the others, and about 1 percent after the fix. A six hertz peak in the spectrum of that change was 8.8 times the median before and 1.8 after. Do not answer the symptom by lowering the grain.
- **Soft edges of the band.** A hard edge reads as a mask. Give it a gradient.
- **Bokeh and noise from `Math.random`.** The same rule as the grain: derive every random value from the frame number and a [seed](technique-cadence-and-seed.md).
- **Real depth of field is different.** The band is a cheat that works from above. Do not use it on an eye-level shot.

**Sources:** our Tabletop Miniature style page (shader design, the grain pitfall and its measurements); [Wikipedia: miniature faking](https://en.wikipedia.org/wiki/Miniature_faking). The GLSL is a sketch of our design, not the style's code; the demo is a 2D imitation.
