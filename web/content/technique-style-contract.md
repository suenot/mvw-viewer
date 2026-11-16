---
title: "Technique: a style contract (style DNA) before any scene"
label: "Style contract"
order: 6
parent: "guides/motion-techniques"
summary: "Turn style words into numbers (line weight, wobble, palette, cadence) and hand them to every scene, so ten shapes look like one set."
---

# Technique: a style contract

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

"Hand-drawn" is not a style, it is a mood. ProdAdvice's checklist starts with "style DNA" and palettes ([10:14](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=614s)). Studio Igor shows the same lesson from the other side: a generic request for pixel art fails, and the second try works because it names a 320 x 180 internal canvas, a sixfold scale and palette cycling ([2:32](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=152s)). Later he has the agent write a "style bible" and send it with every image request ([17:34](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=1054s)).

```viz motion-techniques/style-dna
caption: Four tokens (line 3 px, redraw 2 px, one blue, 12 drawings a second) applied to a circle, a square and a triangle, against the same three shapes with no contract: each picks its own line weight, wobble and colour.
```

## How it works

Write the contract as a short list of measurable values and keep it in one file that every scene imports:

- **Paper:** background colour and texture.
- **Palette:** four or fewer core colours.
- **Line:** weight in pixels, and how it varies.
- **Wobble:** redraw amplitude and cadence (see [Line boil](technique-line-boil.md)).
- **Shading:** hatch angle and spacing (see [Hatching](technique-hatching.md)).
- **Type and sound:** the font, and the character of the sound.

Add two or three approved stills as visual anchors, and describe the mechanisms behind them in words, because a prompt that only says "like this picture" gives you a copy of the picture.

## Why numbers

A token can be tested. If the contract says 3 px and a frame shows a 5 px line, that is a defect you can name. "Looks off-style" cannot be fixed by a script or by an assistant that was not in the room.

## Watch for

- **Too many tokens.** A contract of forty values will not be followed. Keep the ones that change the look.
- **A contract copied from someone else's film.** Take the mechanisms (timing, mark types, colour relationships) and make original assets; a reference clip does not give reuse rights.
- **A contract that never changes.** When a review finds a better value, update the file and re-render, not just the one scene.

In this studio a new look still goes through the [style gate](style-gate-and-new-styles.md) before client use.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 10:14-11:41; Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk) at 2:32-3:37 and 17:34-19:12. The token values in the demo are ours.
