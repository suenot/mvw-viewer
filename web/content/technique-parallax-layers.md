---
title: "Technique: parallax from three layer speeds"
label: "Parallax layers"
order: 42
parent: "guides/motion-techniques"
summary: "Move the background at 0.2x, the midground at 0.6x and the foreground at 1.2x, so depth is read from the speed difference."
---

# Technique: parallax from three layer speeds

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Depth in a flat scene comes from layers that move by different amounts for the same camera move.

```viz motion-techniques/parallax-layers
caption: One camera pan of 100 units. The background layer follows at 0.2x, the midground at 0.6x and the foreground at 1.2x. A clipped frame hides what slides outside it.
```

## The numbers

The shot-composition skill gives the CSS speeds `--speed: 0.2` for the background, `0.6` for the middle and `1.2` for the foreground. The demo uses them as multipliers of one pan. Each layer is a transform on a group, ending at the resting position.

## Notes

- Give each layer a role: a low-contrast, soft background (ambient), a midground that supports the subject, a sharp foreground (primary). This is our reading, not a quoted rule.
- Use the camera ease the skill recommends, ease-in-out, never linear except for continuous loops. The camera pairs well with the [camera curves](technique-camera-curves.md).
- Parallax is a vestibular trigger. Remove it under reduced motion: see [reduced motion in tiers](technique-reduced-motion-tiers.md).

**Sources:** [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills), `skills/shot-composition/references/camera-and-grids.md` (section "Parallax layering"). MIT licence.
