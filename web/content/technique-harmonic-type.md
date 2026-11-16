---
title: "Technique: letters as compound harmonic contours"
label: "Harmonic type"
order: 27
parent: "guides/motion-techniques"
summary: "A glyph is a few closed contours. Fill them as one compound path with the even-odd rule so holes stay open, and draw text from the same primitives as the art."
---

# Technique: letters as compound harmonic contours

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

In the owner's game project the letters are not a font file. Each glyph is a short list of closed contours, stored as harmonics like every other shape ([harmonic morph](technique-harmonic-morph.md)), plus an advance width and an entry and exit point. Text is laid out from those glyphs. The picture and the type then come from one source, with one look.

```viz motion-techniques/harmonic-type
caption: The letters O and A, each with an outer and an inner contour rebuilt from 16 harmonics. Non-zero fill (left) fills the holes in; even-odd fill of one compound path (right) keeps them open.
```

## How it works

An "O" is two contours: the outside and the hole. Draw them as two separate shapes and the hole is covered. Draw them as one path with several sub-paths and the fill rule decides. With the non-zero rule, two contours that run the same way both count as "inside", so the hole fills. With the even-odd rule, a point is inside when a ray from it crosses an odd number of edges, so the hole stays open whichever way the contours run ([MDN: fill-rule](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill-rule)).

The project draws a glyph as one compound path with even-odd fill, and sizes text through the font's units per em. Spaces use a stored space advance. A missing character is an error, not a silent gap.

## How to build it

```js
function glyphPath(glyph, scale, x, y) {
  let d = "";
  for (const c of glyph.contours) d += pathOf(contour(c.harmonics, 96), x, y, scale); // M..L..Z each
  return d;                                    // one string, several sub-paths
}
ctx.fill(new Path2D(glyphPath(g, size, penX, baseline)), "evenodd");
penX += g.advance * size;
```

A letter animates like any other [harmonic shape](technique-harmonic-morph.md): its contours can be mixed with another letter's, as long as both have the same number of contours in the same order. Each contour can also go through the [kinetic type](technique-kinetic-type.md) timing.

## Watch for

- **Hole contours too.** Every hole is its own contour in the glyph. Forget it and the "A" is a solid triangle.
- **Missing characters.** Decide the character set before the first draw; fall back loudly.
- **Baseline and Y direction.** The caller owns the baseline and the axis direction. Pick one and test a letter with a descender.
- **Legibility is a visual check.** A low harmonic budget rounds the corners and can make "A" and "R" look alike. The project says recognisable silhouettes are acceptance checks for the consuming game, not something numbers can prove.
- **Licensing.** Letter shapes you draw yourself are yours; do not trace a font you are not allowed to copy.

**Sources:** the owner's project (private repository) and its package notes. Our demo builds two letters from polygons through a real DFT. We have not set a full alphabet.
