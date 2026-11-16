---
title: "Technique: one sentence, one shot, cut just before the word"
label: "Sentence and shot"
order: 11
parent: "guides/motion-techniques"
summary: "Cut to a new picture a fraction of a second before its sentence begins, and put the longest pause before the punch line. Measured from a 30 s demo."
---

# Technique: one sentence, one shot, cut just before the word

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A code-drawn demo in Andrey Zenin's tutorial shows an editing grammar that carries over to any narrated video ([2:02](https://www.youtube.com/watch?v=YyUP_hSovOg&t=122s)). We measured its 28.6 s excerpt with scene detection and word timestamps; the full table is in [Reference: 2D video plugin](reference-claude-2d-video-plugin.md).

```viz motion-techniques/sentence-shot
caption: Four sentences and their four shots on a 10 s axis (illustrative times). Each cut lands 0.14 s before its sentence's first word, and the longest pause (0.8 s) comes before the punch line.
```

## What the measurement shows

- After the first, 11 of 13 sentences get a new shot. Ten cut at the sentence start and one on the noun the shot shows. The two without a cut play out inside one held shot where the action itself changes the picture.
- The cut comes 0.01 to 0.29 s before the first word, with a median of 0.14 s. The eye sees the new picture a few frames before the ear hears the sentence.
- The pattern is a wide shot, then a close insert of the one detail that carries the sentence. The inserts are short (1.0 to 2.1 s); the wides carry the time (1.6 to 6.0 s).
- Gaps between sentences run from 0.38 to 0.80 s, with a median near 0.48 s. The 0.80 s gap sits right before the punch line.
- The camera does not travel. A closer view is a cut to a new framing, not a push.

## How to build it

Mark sentence starts separately from word times in your cue file. Put shot boundaries on the sentence starts, 0.1 to 0.3 s early. Word cues inside a sentence drive reveals, not cuts.

```js
shots = sentences.map(s => ({ cutAt: s.start - 0.14, hold: s.end }));
```

Give the punch line the largest `gap_before` value. A setup shot shows what everyone expects, a short insert shows what actually happened.

## Watch for

- **Cuts inside a sentence,** unless the sentence is a list.
- **A locked frame with nothing changing.** A static frame is alive only if something inside it changes; our [skill trial](skill-trial-bond-short.md) recommends a change at least every 3 s.
- **Late cuts.** A cut after the word reads as lag. Keep them inside a 0.3 s window.

**Source:** Andrey Zenin, [YyUP_hSovOg](https://www.youtube.com/watch?v=YyUP_hSovOg) at 2:02-2:47. Measurements are ours, accurate to about 0.1 s, from the YouTube file and automatic transcription of a 30 s excerpt the author chose.
