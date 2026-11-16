---
title: "Technique: reveal a diagram in order"
label: "Progressive diagram"
order: 40
parent: "guides/motion-techniques"
summary: "Nodes first, then edges, then labels; then keep the active node at full strength and dim the rest to 35 percent."
---

# Technique: reveal a diagram in order

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Showing a whole diagram at once makes the viewer read all of it. Showing it in order makes them read one idea per beat.

```viz motion-techniques/progressive-diagram
caption: Three nodes appear, then the two edges with a dot travelling along them, then the labels. Last, node 2 stays at full strength and the others dim to 35 percent.
```

## The rules from the skill

- Reveal in this order: nodes, then edges, then labels. Nothing dumps in all at once.
- Highlight the active element and dim the rest (focus and context). The skill's table gives the dim level as opacity 0.35 over 0.3 s.
- Pace to comprehension: hold each step 0.5 to 1.5 seconds so it lands.
- Keep one visual grammar: a colour means one thing and never changes mid-piece.

In the demo the final state is also the resting picture, and each element's entrance and its dimming are merged into one animation. Two animations on one property would let the later one's backward fill override the earlier. See [seekable frame](technique-seekable-frame.md).

**Sources:** [iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills), `skills/diagram-animation/SKILL.md`. MIT licence. The node names are placeholders.
