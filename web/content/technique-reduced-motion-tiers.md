---
title: "Technique: reduced motion in three tiers"
label: "Reduced motion tiers"
order: 43
parent: "guides/motion-techniques"
summary: "When a viewer asks for less motion, remove the vestibular triggers, shorten the rest to a fade, and keep colour changes and progress."
---

# Technique: reduced motion in three tiers

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

`prefers-reduced-motion: reduce` is a signal that some movement causes nausea, dizziness or migraines. The accessible-animation skill treats it as graceful degradation, not a kill switch: an instant change with no transition can disorient more, because elements teleport.

```viz motion-techniques/reduced-motion-tiers
caption: Three rows, each with the normal version and the reduced version. Tier 1 is removed: the big slide is static. Tier 2 is softened: a slide becomes a 150 ms fade. Tier 3 is kept: a colour fade stays.
```

## The three tiers

1. **Remove entirely (vestibular triggers).** Parallax, large slides across the viewport, scale or zoom of large elements, 3D spin, auto-playing carousels and marquees, scroll hijacking, motion paths.
2. **Soften or shorten.** Replace movement with a short opacity fade (200 ms or less), reduce distance and duration. Keep the fact of a transition. The skill's example: a 600 ms slide from the left becomes a 150 ms cross-fade.
3. **Always keep.** Opacity fades, colour changes, focus rings, loading indicators, and motion essential to meaning.

## A sketch

Our sketch, not run: write the motion as the default and override it under the media query.

```css
.card { transition: transform 600ms ease, opacity 600ms ease, background-color 200ms ease; }
@media (prefers-reduced-motion: reduce) {
  .card { transition: opacity 150ms ease, background-color 200ms ease; transform: none; }
}
```

For a video file there is no media query, so keep a second cut without the tier 1 moves if viewers need one.

**Sources:** [iart-ai/web-animation-skills](https://github.com/iart-ai/web-animation-skills), `skills/accessible-animation/SKILL.md`. MIT licence. The WCAG reference (2.3.3) is the skill's, not checked by us.
