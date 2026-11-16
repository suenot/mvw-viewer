---
title: "Technique: the vertical safe box"
label: "Vertical safe box"
order: 44
parent: "guides/motion-techniques"
summary: "In a 1080 by 1920 short, keep the hook and the key subject in the centre 900 by 1400 box and the bottom 320 px clear of text."
---

# Technique: the vertical safe box

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Short-form apps paint captions, buttons and an action rail over the video. What you place there can be hidden.

```viz motion-techniques/vertical-safe-box
caption: A 1080 by 1920 frame. Shaded bands: top 120 px, bottom 320 px, right 120 px. Dashed: the centre 900 by 1400 box. The green pill sits inside and is readable; the grey pill sits in the bottom band, under the app interface.
```

## The numbers from the skill

For all platforms put the hook text and the key subject in the centre 900 by 1400 box. Reserve the bottom 320 px even if it looks empty in the editor. The skill's checklist: composed inside the 900 by 1400 box, with the bottom 320 px, top 120 px and right 120 px kept clear. A second skill gives looser percentages (top about 12 percent, bottom 20 to 35 percent).

## A thing the numbers hide

A box 1400 high, centred in 1920, spans y from 260 to 1660. The bottom clear band starts at y 1600. So the box dips 60 px into that band, and the real limit for text is y 1600, not the box edge. That is our arithmetic from the skill's numbers, not a line in the skill; check it against the platform you target.

Pair this with [one sentence, one shot](technique-sentence-shot.md) for captions and with [render and inspect](technique-render-and-inspect.md) to check frames against the bands.

**Sources:** [iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills), `skills/short-form-video/SKILL.md` (safe-area table and checklist) and `skills/caption-animation/SKILL.md`. MIT licence. Platform interfaces change; we did not verify the bands against any app.
