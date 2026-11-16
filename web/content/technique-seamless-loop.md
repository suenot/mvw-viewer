---
title: "Technique: a seamless loop"
label: "Seamless loop"
order: 16
parent: "guides/motion-techniques"
summary: "Make the last frame equal the first, including the cursor, so a piece can repeat with no visible seam."
---

# Technique: a seamless loop

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Looping pieces need more than a long fade at the end. Three prompts in our database require "the last frame must be the first frame" ([flxrnc](https://x.com/flxrnc/status/2108242454105251921), [AnnaCher](https://x.com/AnnaCher___/status/2103571098638152174), [0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)), and one adds that position, opacity and cursor must match too ([techhalla](https://x.com/techhalla/status/2103411244468498547)). The same prompt that asks for a 14 s loop lists the usual failure as a fix: "the cursor jump at the loop wrap" is removed with `t - 14*floor(t/14)`.

```viz motion-techniques/seamless-loop
caption: Two 14 s loops drawn as rings. Left: the last frame is not the first, and the dot jumps at the seam. Right: time is wrapped and the last frame equals the first, so the dot closes the ring.
```

## How it works

A loop has a seam where the end meets the start. Anything that is not identical at the two ends shows as a jump: a cursor that ends mid-screen, an opacity that has not returned to its starting value, a spring that has not settled. The fix has two halves. Design the story so it returns to its first state (in the prompts, "the toast turns back into an empty prompt bar", "the toast shrinks back into the mascot"). And make every time-dependent value read the wrapped time, so a frame at `t = 14` is the frame at `t = 0`.

## How to build it

```js
const LOOP = 14;
const wrap = (t) => t - LOOP * Math.floor(t / LOOP);   // 0 <= wrap(t) < 14
window.renderAt = (t) => draw(ctx, layout(plan, wrap(t)));
```

Then compare frame 0 with the last frame, pixel by pixel, as one of the [render-and-inspect](technique-render-and-inspect.md) checks. Let all springs finish before the end so the last frame is at rest.

## Watch for

- **A cursor that ends elsewhere.** Park it where it starts, as part of the last beat.
- **A long cross-fade.** It hides the jump but also the story; one prompt bans "crossfades" outright ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)).
- **Springs still moving.** A [spring](technique-closed-form-springs.md) that settles at 0.35 s needs 0.35 s of quiet before the wrap.

**Sources:** [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [annacher-152174](https://x.com/AnnaCher___/status/2103571098638152174), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612), [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) in our prompt database. The wrap expression is the prompt's; the pixel comparison is our proposal.
