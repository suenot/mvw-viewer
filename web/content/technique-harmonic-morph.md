---
title: "Technique: shapes as harmonics, and morphing between them"
label: "Harmonic morph"
order: 26
parent: "guides/motion-techniques"
summary: "Store a closed outline as a few complex harmonics, then morph between two outlines by mixing coefficients. The same list is also a smoothness dial."
---

# Technique: shapes as harmonics, and morphing between them

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

This technique comes from the owner's own project, a set of small browser games where every creature, asteroid and letter is a closed outline stored as Fourier coefficients (the project is private; the maths is standard). The idea fits video as well: an outline is a list of complex numbers, and a list of numbers can be mixed.

```viz motion-techniques/harmonic-morph
caption: Left, a star becomes a house: the 12 largest harmonics of each outline are mixed from alpha 0 to 1, drawn as 14 in-between frames (dashed: the two full outlines). Right, the same star rebuilt from 2, 6 and 24 harmonics.
```

## How it works

Walk once around a closed outline at constant speed and write each point as a complex number `x + iy`. A discrete Fourier transform turns the points into coefficients `c_k`, one per signed frequency `k`. The outline comes back as `point(t) = sum of c_k * exp(i * 2 * pi * k * t)` for `t` from 0 to 1. The `k = 0` term is the centre; `k = 1` alone is a circle; each further pair adds finer detail.

Two things follow:

- **Smoothness is a budget.** Keep the centre and the few terms with the largest magnitude, and the outline loses its fine corners but keeps its character. This is a low-pass filter on a shape. It is also a size limit: 12 numbers instead of 96 points.
- **A morph is a mix.** If two shapes use the same frequencies, `mix(a, b, alpha)` is `a + (b - a) * alpha` on the real and imaginary part of each coefficient. A frequency missing on one side counts as zero. Every in-between frame is a valid, smooth outline, and `alpha` can be eased, sprung or keyed like any other number.

## How to build it

Do the DFT once, at authoring time, and keep the coefficients:

```js
const N = 96;                                   // same sample count for every shape
const ca = selectLargest(dft(resample(star,  N)), 12);
const cb = selectLargest(dft(resample(house, N)), 12);

const pose = (t) => contour(mix(ca, cb, easeInOut(t)), 120);   // a pure function of t
ctx.fill(new Path2D(toPath(pose(t))));
```

`resample` walks the polygon and returns `N` points spaced evenly by arc length. `selectLargest` keeps the centre plus the `budget` terms of largest magnitude. `contour` evaluates the sum at `m` values of `t`.

## Watch for

- **Same start, same direction.** Both outlines must run the same way round and start at the corresponding point. The project's own notes warn that automatic alignment by closest point does not guarantee the intended match: look at the middle frames.
- **One fixed set per clip.** Pick the harmonics once for the clip. Reselecting the largest terms on every in-between frame makes terms switch on and off and the outline twitch.
- **One normalisation for the whole family.** Scale and centre all shapes of a clip the same way, or the morph also resizes.
- **Mid-way self-crossing.** Two valid outlines can mix into one that crosses itself. Check frames at alpha 0.25, 0.5 and 0.75.
- **Cost.** The plain DFT is quadratic. Fine at authoring time for up to a few hundred samples; do not run it per frame.
- **Corners.** A low budget rounds them. That is a look, not a bug, but say so in the [style contract](technique-style-contract.md).

**Sources:** the owner's project and its package notes (private repository); the maths is the standard Fourier description of a closed curve. The demo above runs a real DFT on two polygons. We built the demo and did not run a video through this pipeline.
