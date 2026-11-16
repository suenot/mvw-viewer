---
title: "Technique: a timing plan as editable data"
label: "Timing plan"
order: 5
parent: "guides/motion-techniques"
summary: "Write when every object enters, moves and leaves as plain numbers on one timeline, so a late correction is one edit, not a new render of everything."
---

# Technique: a timing plan as editable data

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

ProdAdvice's central claim is that a coded animation is editable: the assistant writes the graphics and the motion as code, and you change one value. A graphic on screen at 02:50 labels appearance and disappearance times, movement and colour around a common timeline ([01:32-03:05](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=92s)). The technique is to write that plan down before any motion exists.

```viz motion-techniques/timing-plan
caption: A 5 s plan as four bars. A playhead sweeps it, then one number changes (the fact label enters at 2.4 s instead of 2.0 s) and only that bar moves; nothing else is redone.
```

## How it works

Give every object one row with its entrance time, exit time, path, scale or rotation, colour change and layer. In the demo:

| Object | Plan |
| --- | --- |
| Coastline | Draws from 0 to 1 s, stays until 4.5 s |
| Location dot | Enters at 1.0 s, stays until 4.5 s |
| Fact label | Enters at 2.0 s (edited to 2.4 s), stays until 4.5 s |
| Clear | Everything leaves from 4.5 s to 5.0 s |

The scene reads these numbers; it does not contain them. A missed interval or a wrong coordinate is then fixed in the plan, and you do not regenerate the clip.

## How to build it

Keep the plan in one object at the top of the scene file, and let every animation take its start and end from it:

```js
const plan = {
  coast: { in: 0, draw: 1.0, out: 4.5 },
  dot:   { in: 1.0, out: 4.5 },
  fact:  { in: 2.4, out: 4.5 },
  clear: { in: 4.5, out: 5.0 },
};
```

Build the timeline so it can be sought: the picture at time `t` depends only on `t` and the plan, never on what played before. HyperFrames works this way with a single paused timeline (see [HyperFrames build rules](hyperframes-build-rules.md)).

## Watch for

- **Numbers hidden inside animations.** If a start time lives in a tween, the plan is not the source of truth. Move it out.
- **Timing that ignores the voice.** When there is narration, derive the plan from measured word times, not from guesses.
- **A plan with no end state.** Always give the last object an exit, or the final frame is whatever was left over.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 01:32-03:05. The 5 s example is the exercise from [HyperFrames tutorial study](hyperframes-tutorial-study.md); the plan format is our proposal.
