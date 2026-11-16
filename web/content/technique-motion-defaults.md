---
title: "Technique: motion defaults in frames"
label: "Motion defaults"
order: 33
parent: "guides/motion-techniques"
summary: "When nobody says how long a move lasts, use measured medians: opacity 6 frames, entrances 12, blur 7, exits 10 to 13, at 30 fps."
---

# Technique: motion defaults in frames

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A default duration saves a decision on every element. The Motionmaxxing skill keeps a table of medians measured on a corpus of product films, and a rule for when no other information exists. We read the rule and the table; we did not remeasure the corpus.

```viz motion-techniques/motion-defaults
caption: Six defaults at 30 fps. Each bar is one move, with its length in frames and in milliseconds. The highlighted bar (a translate or scale entrance, 12 frames) is the one to reach for first.
```

## The defaults

| Move | Frames at 30 fps | Milliseconds |
| --- | --- | --- |
| Opacity in | 6 | 200 |
| Call to action, supporting move | 6 | 200 |
| Blur in | 7 | 233 |
| Scale out | 10 | 333 |
| Translate or scale in | 12 | 400 |
| Translate out | 13 | 433 |

The skill states the rule as: with no other information, use 12 frames for a translate or scale entrance, 6 for opacity, 7 for blur, 13 to 14 for a translate exit and 10 for a scale exit; treat 6 and 24 frames as the 25th and 75th percentile edges. The median over all moves in its sample is 10 frames (0.33 s). The demo draws 13 for the translate exit, the lower end of the skill's range.

## How to use them

- Keep durations in frames, not seconds, and derive milliseconds when you need them, as in the [timing plan](technique-timing-plan.md).
- Land entrances with an ease-out: the skill reports that most landings cover the bulk of their travel in the first four frames.
- A film built on 20 to 30 frame ease-outs for everything is slower than the whole sample. Start from these numbers, then change one on purpose.

**Sources:** [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing), `references/motion.md` (rule R1.1 and the duration table) and `README.md`. Apache 2.0 licence. The numbers are the skill's; the demo is our drawing.
