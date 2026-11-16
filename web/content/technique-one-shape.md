---
title: "Technique: one shape, never cut"
label: "One shape, never cut"
order: 18
parent: "guides/motion-techniques"
summary: "Tell a product story with one element that morphs from state to state, driven by a cursor, with no cuts and no cross-fades."
---

# Technique: one shape, never cut

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A group of prompts for product UI motion share a rule: one shape tells the whole story. "Every state is the same element morphing its size, radius and color while its content swaps with a short blur" ([AnnaCher](https://x.com/AnnaCher___/status/2103571098638152174)). "A prompt bar becomes a button, the button becomes a progress ring, the ring becomes a preview window... No cuts, no fades between scenes: objects transform" ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)). "One shape, zero cuts. The shape morphs from state to state and is never replaced" ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)).

```viz motion-techniques/one-shape
caption: One element in four states, from a mascot to a play button, a loader and a timeline. The dashed ring travels between the cards to show the element is the same one: it morphs and is never replaced.
```

## How it works

Because the element persists, the eye follows it across states and the story needs no cut. Size, radius and colour are each a [chain of springs](technique-closed-form-springs.md), so a change in one state starts from wherever the last one ended. Content inside the shape is separate: it swaps with a 12 px blur and a fade over 0.15 s ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)), and needs its own clip and its own enter and exit timing so text never overlaps ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)). A cursor causes every change with a real click or drag, and its tip stays locked to whatever it drags. The camera zooms so each state fills about half the frame.

## How to build it

```js
const shape = {
  w: chain(springs, "w"), h: chain(springs, "h"),
  r: chain(springs, "r"), color: chain(springs, "color"),
};
// at time t, read each property; draw one rounded rect; then draw the current content inside its clip
```

List the states and their beats first, as in the [storyboard](technique-storyboard-first.md).

## Watch for

- **Cross-fading one colour into another.** The prompt says: do not cross-fade orange into ink. Animate the colour value.
- **Content popping while the shape moves.** Give text its own timing, after the morph has started.
- **A cursor that arrives late.** Aim it at where the target will be when it lands, and keep its speed under 65 px per frame.

**Sources:** [annacher-152174](https://x.com/AnnaCher___/status/2103571098638152174), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612), [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921) in our prompt database. We have not run these prompts; the demo is a stand-in drawing, not their output.
