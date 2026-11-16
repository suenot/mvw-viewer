---
title: "Technique: a seekable frame function"
label: "Seekable frame"
order: 13
parent: "guides/motion-techniques"
summary: "Write the whole picture as renderAt(t), a pure function of time, so any moment can be frozen, checked and re-rendered exactly."
---

# Technique: a seekable frame function

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Several of the strongest prompts in our prompt database make the same demand first: the picture at time `t` may depend on `t` and nothing else. One prompt states it as a build rule: `window.renderAt(t)` must be a pure function of time, with no `Math.random`, no clock and no carried state, and `?t=` in the address must freeze the exact moment ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)). Another asks for `seek(t)` with no CSS transitions, no `setInterval` and no React state across frames ([techhalla](https://x.com/techhalla/status/2103411244468498547)). A third says the same in one line: every frame is a function ([BuildFastWithAI](https://x.com/BuildFastWithAI/status/2108403445304844291)).

```viz motion-techniques/seekable-frame
caption: Top row: five frames computed from time alone, so a jump to 3.6 s gives the right picture. Bottom row: each frame is built from the last one, so after the same jump the ball is still where it was at 2.4 s.
```

## How it works

If a frame depends only on `t`, three things become cheap. You can **seek**: open `?t=3.6` and see exactly that moment. You can **check**: render five stills around a beat without playing the clip ([storyboard and pre-pass](technique-storyboard-first.md)). You can **re-render** a single scene and get the same pixels. A stateful animation, where each frame nudges the previous one, gives none of these: a jump lands in a state nobody has computed.

## How to build it

Keep every number that changes in a function of `t`, and draw from it:

```js
window.renderAt = (t) => {
  const p = layout(plan, t);   // positions, opacities, text: from t and the plan only
  draw(ctx, p);                // paint; never read what was painted before
};
const t = Number(new URLSearchParams(location.search).get("t"));
if (!Number.isNaN(t)) renderAt(t);   // ?t=3.6 freezes that moment
```

The export loop then calls `renderAt(frame / fps)` for every frame. Randomness comes from a [stable seed](technique-cadence-and-seed.md), never from `Math.random`.

## Watch for

- **Hidden state.** A counter, an array that grows, a timer or a transition that keeps running is state. Derive it from `t` instead (a typed text shows `floor(progress * length)` characters).
- **CSS transitions and timers.** They run on the page clock, not on `t`. Do not use them.
- **Changing a target several times.** Do not mutate a value. Add one [spring](technique-closed-form-springs.md) per change.

**Sources:** the prompts [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) and [BuildFastWithAI](https://x.com/BuildFastWithAI/status/2108403445304844291) in our prompt database. We have read the prompts, not run them; the code is our proposal.
