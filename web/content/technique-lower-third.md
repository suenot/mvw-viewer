---
title: "Technique: a lower third that stays inside the safe area"
label: "Lower third"
order: 38
parent: "guides/motion-techniques"
summary: "A name strap in the bottom third: inside title-safe, motion only in the build-in and build-out, and a hold that stands still while it is read."
---

# Technique: a lower third that stays inside the safe area

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A lower third is a small, repeatable overlay, so its rules are few and strict.

```viz motion-techniques/lower-third
caption: Left, a 16:9 frame with a dashed title-safe line and a strap sliding in at the lower left (the name is a placeholder). Right, the clip: lead 0.2 s, in 0.8 s, hold 5.5 s, out 0.5 s, tail 0.2 s.
```

## The rules

- **Inside title-safe.** Every pixel at least 5 percent in from each edge (the skill's template uses 6 percent). The lower third lives in the bottom third; the middle of the frame stays empty for the speaker.
- **Still while read.** The motion is in the build-in and build-out. The hold does not move, or moves so little it does not pull the eye (one slow sheen at most).
- **Defaults when none are given:** 1920 by 1080 at 30 fps, about 8 seconds (under a second in, a still hold of 5 to 6 seconds, half a second out), lower left, silent.

The demo's timeline adds a 0.2 s lead and tail as an empty first and last frame; the skill's check looks for empty first and last frames. Its numbers 0.8 in and 5.5 hold fit the quoted ranges.

## Checks

The skill renders over a checkerboard and over dark and light footage, then checks that every word reads on both and nothing shows outside the revealed part of its panel. Do the same with [render and inspect](technique-render-and-inspect.md). For a transparent delivery use WebM or `.mov` with alpha; H.264 has none.

**Sources:** [iart-ai/lower-thirds-skills](https://github.com/iart-ai/lower-thirds-skills), `skills/lower-thirds/SKILL.md`. MIT licence. We did not run its renderer.
