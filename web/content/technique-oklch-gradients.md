---
title: "Technique: gradients in OKLCH"
label: "OKLCH gradients"
order: 41
parent: "guides/motion-techniques"
summary: "Blend two colours in OKLCH instead of sRGB numbers and the middle of the gradient keeps its chroma instead of going grey."
---

# Technique: gradients in OKLCH

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Mixing two sRGB colours number by number passes through a dull middle. The colour-motion skill tells you to interpolate in a perceptual space (OKLCH or Lab) to fix "muddy" or grey gradients.

```viz motion-techniques/oklch-gradients
caption: The same blue and amber in 40 stripes, mixed two ways. The line under each bar is the chroma of every stripe, computed in the demo from the displayed colour. The sRGB mix dips in the middle; the OKLCH mix does not.
```

## What OKLCH is

`oklch(L C H)`: L is perceptual lightness (0 to 1), C is chroma (colourfulness), H is the hue angle in degrees. Keeping L and C fixed while turning H gives hues of about equal visual weight, which is hard in HSL.

## How the demo computes it

The demo converts both endpoints to OKLab with the published matrices, then interpolates lightness, chroma and hue (taking the short way round the hue circle) and converts back to sRGB. The grey dip is measured, not asserted: the chroma line is computed from each displayed stripe. Out-of-gamut values are clipped per channel, which is the simplest choice. In CSS you can ask for the same blend with `linear-gradient(in oklch, ...)`.

**Sources:** [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills), `skills/color-motion/SKILL.md` and `references/palettes-and-interpolation.md` (MIT licence). The colour conversion uses Bjorn Ottosson's published OKLab matrices. The two colours are ours.
