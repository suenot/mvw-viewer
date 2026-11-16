---
title: "Technique: print misregistration"
label: "Print misregistration"
order: 21
parent: "guides/motion-techniques"
summary: "Show two offset colour copies of text for a moment on impact frames only, like a badly aligned print."
---

# Technique: print misregistration

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A street-poster look can be made with a cheap trick from print: two ink colours that do not line up. The prompt says when and how much: "on accent frames only, duplicate the text layer offset (±2–4 px) in magenta and acid green at 40% opacity", and "magenta and green may misregister (print offset) by 2 to 4 px on impact frames only" ([techhalla](https://x.com/techhalla/status/2103411244468498547)).

```viz motion-techniques/misregistration
caption: At the two impact marks a blue and an orange copy of IMPACT appear behind the word, offset 4 px at 45 % opacity, then vanish. Between impacts the text is clean.
```

## How it works

The offset copies add a hit to a beat: they make an impact look physical. The rule "impact frames only" matters as much as the effect. If the colour split is always on, it is a style filter; if it appears on the beat and disappears, it is an accent. The values are small on purpose: 2 to 4 px at 40 %.

## How to build it

```js
function drawTitle(t) {
  drawText(ink, 0, 0);                        // the clean text
  const hit = impact(t);                      // 1 on an impact frame, 0 otherwise (from the beat grid)
  if (hit) {
    drawText(accentA, -3, 0, 0.4);            // behind, offset left
    drawText(accentB, +3, +2, 0.4);           // behind, offset right
  }
}
```

Take `impact(t)` from the [beat grid](technique-beat-grid.md) and keep it to a few frames.

## Watch for

- **Always on.** It stops reading as an impact.
- **Large offsets.** Past about 4 px the text becomes hard to read at phone size.
- **Wrong palette.** The prompt pairs two accent colours with one dark background and one white; other hues are banned.

**Source:** [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) in our prompt database; the snippet is ours.
