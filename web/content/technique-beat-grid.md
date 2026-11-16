---
title: "Technique: a beat grid"
label: "Beat grid"
order: 15
parent: "guides/motion-techniques"
summary: "Put every move, click and sound on a fixed grid of beats so a piece without a soundtrack still feels in time, and music can be added later."
---

# Technique: a beat grid

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Prompts for product motion often start from a grid of time, not from a list of effects. One gives a 0.5 s beat grid and lists what happens at each beat, from "0.0 pixel mascot idles" to "12.0 toast shrinks back into the mascot" ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)). Another sets 120 BPM and says something must land on every beat for the first 16 beats, and after that on every other beat ([techhalla](https://x.com/techhalla/status/2103411244468498547)). A third wants 24 beats at 120 BPM "and something happens on every beat" ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)); a fourth syncs everything to a 128 BPM grid ([BuildFastWithAI](https://x.com/BuildFastWithAI/status/2108403445304844291)).

```viz motion-techniques/beat-grid
caption: A 4 s axis at 120 BPM: a heavy tick every 0.5 s, a light tick every 125 ms. Six events sit on beats. A hit that started at 1.3 s slides to the beat at 1.5 s.
```

## How it works

At 120 BPM one beat is 0.5 s and a sixteenth note is 125 ms. If every entrance, click and impact is placed on that grid, the piece has a pulse before any sound exists, and a track at the same tempo fits with no re-timing. The 125 ms step also gives a natural stagger for [letters](technique-kinetic-type.md).

## How to build it

Put the grid in the [timing plan](technique-timing-plan.md) and snap to it:

```js
const BPM = 120, beat = 60 / BPM;            // 0.5 s
const onGrid = (t) => Math.round(t / beat) * beat;
const plan = { mascotSquash: onGrid(1.0), loader: onGrid(1.5), check: onGrid(2.0) };
```

With real music, find the track's own grid first: start on a downbeat and place each click and chime on a measured peak ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612) asks for exactly this, with a royalty-free track near 120 BPM).

## Watch for

- **Every beat filled for ever.** The prompt that fills the first 16 beats relaxes to every other beat afterwards. Constant hits tire the eye.
- **A grid that fights the story.** Sentences have their own timing; see [one sentence, one shot](technique-sentence-shot.md). Use the grid for UI and motion pieces, voice timing for narrated ones.
- **Rounding the tempo.** A track at 118 BPM on a 120 BPM grid drifts out in a few bars.

**Sources:** [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [techhalla-498547](https://x.com/techhalla/status/2103411244468498547), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612), BuildFastWithAI in our prompt database; the `onGrid` snippet is ours.
