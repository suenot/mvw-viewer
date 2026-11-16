---
title: "Technique: a reveal through the letters"
label: "Mask reveal"
order: 20
parent: "guides/motion-techniques"
summary: "Replace one line of text with the next by turning the outgoing word into a window, so the cut is made by the type itself."
---

# Technique: a reveal through the letters

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

One prompt describes a transition that needs no cross-fade: "BAD PROMPTING IS" replaces the previous line "via mask wipe through the letterforms (the outgoing line is the mask)", with a magenta and green channel split on the cut. The required technique is stated plainly: "destination text revealed by animating a path mask derived from the outgoing word's outlines" ([techhalla](https://x.com/techhalla/status/2103411244468498547)).

```viz motion-techniques/mask-reveal
caption: Left: the outgoing plate with the word BAD. Middle: the word becomes a window and the next scene shows through the letterforms. Right: the window grows until the next scene fills the frame.
```

## How it works

The old word is on a plate. To leave, the plate gets a hole in the shape of the word. Through the hole you see the next scene. Then the hole grows (the letters scale up) until the plate is gone. The viewer sees one object, the word, doing the cutting, so the change reads as designed, not as a fade. The mask path is derived from the same outlines that drew the word, so the two cannot drift apart.

## How to build it

In SVG or Canvas, draw the destination, then the plate with the outgoing text as a cut-out:

```html
<mask id="m"><rect width="100%" height="100%" fill="#fff"/>
  <text id="word" fill="#000" font-size="54">BAD</text></mask>
<rect class="destination"/>                     <!-- next scene -->
<rect class="plate" mask="url(#m)"/>            <!-- outgoing scene, with the word cut out -->
```

Drive `font-size` (or a scale on the text in the mask) from a [spring](technique-closed-form-springs.md) of time, so the reveal stays seekable. Add the [misregistration](technique-misregistration.md) on the cut frame.

## Watch for

- **A thin face.** A light font makes a window too small to see through; use a heavy display font, as the prompt does (Archivo Black).
- **Mask and word out of step.** Use the same size, tracking and position for both.
- **A fade as a fallback.** If the mask is not ready, cut instead; do not fade.

**Source:** [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) in our prompt database. We have read the prompt, not run it; the demo is our drawing.
