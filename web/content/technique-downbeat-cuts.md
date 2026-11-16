---
title: "Technique: cuts on the downbeat, without a startle"
label: "Downbeat cuts"
order: 36
parent: "guides/motion-techniques"
summary: "Give each scene a whole number of bars so every cut lands on a downbeat, and mark the cut with a chord change, not with volume."
---

# Technique: cuts on the downbeat, without a startle

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Two rules from one generated-soundtrack skill: where the cuts go, and how loud the music may get at a cut.

```viz motion-techniques/downbeat-cuts
caption: Top, a strip of scenes of 2, 2 and 4 bars; each cut falls on a bar start. Below, four loudness jumps into a cut against the 6 dB line: an accent on the cut, kick and bass entering together, layers a bar apart, a chord change.
```

## Where the cuts go

Each scene gets a whole number of bars (the tempo may flex per scene), so every cut lands on a downbeat. This extends the [beat grid](technique-beat-grid.md): the grid is bars, and scene lengths are multiples of a bar.

## How loud a cut may be

The skill reports its own measurements on short pieces:

- A loud accent on a cut (bass and a bright chime at once) reads as a jump scare: a jump of +7 to +10 dB was flagged as startling. A chord change with +3 to +5 dB reads as a clean edit.
- Even the normal downbeat accent tipped short pieces over +6 dB, because the bar before is still decaying. The chord change is enough.
- Kick and bass entering together after a quiet intro measured +11 dB. Staggered by a bar, +3.5 dB. Bring layers in one or two per bar.

The skill's check script fails a cut that is off the beat by more than 100 ms (about three frames) or that jumps more than +6 dB against the second before. The demo draws that threshold as a line. The bar heights are the skill's quoted figures (the accent drawn at 8.5 and the chord change at 4, the middles of the quoted ranges).

**Sources:** [iart-ai/javascript-animation-skills](https://github.com/iart-ai/javascript-animation-skills), `skills/soundtrack/SKILL.md`. MIT licence. We did not run its check script.
