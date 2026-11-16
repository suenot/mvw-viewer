---
title: "Technique: a number as a readout, not a slam"
label: "Number readout"
order: 12
parent: "guides/motion-techniques"
summary: "Show a figure small, beside the thing it measures, on the spoken word, with a thin measuring line. It reads as evidence, not as decoration."
---

# Technique: a number as a readout, not a slam

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

In the demo from Andrey Zenin's tutorial, every number is an instrument readout ([2:26](https://www.youtube.com/watch?v=YyUP_hSovOg&t=146s)). A thin measuring line and "50 M" stand beside a drop tower. The text is about 3 % of the frame height, not a headline.

```viz motion-techniques/readout
caption: The same drop tower in two portrait frames. Left, a slam: a large "50 M" over the picture, 8 % of the frame height. Right, a readout: a thin measuring line and a small "50 M" beside the tower, 3.5 % of the frame height.
```

## How it works

- **Attach it to the thing measured.** Put the label beside the object and draw the measuring line along it. The number then says what it is without a caption.
- **Make it small.** In our rebuild a readout is 60 to 80 px on a 1920 px frame, which is 3.1 to 4.2 %; the drawing uses 3.5 %. The v3 bond Short set "US$8.8" as a slam of 156 px, which is 8.1 %.
- **Land it on the word.** The readout arrives when the number is spoken, without a slam or a bounce.
- **One per shot, at most.** The demo's other readouts are "TREMOR 0.0", "VOICE" with an even level meter and "100 %" on a popcorn bucket. Each confirms or contradicts the voice.
- **No captions and no headline type** in the excerpt.

## How to build it

```js
const readout = { label: "50 M", size: 0.035 * frameHeight, at: wordStart("fifty") };
```

Make the label and the measuring line one component, so the line and the text always move and fade together.

## Watch for

- **Unreadable on a phone.** Test at arm's length. If it fails, make it slightly larger, not a slam.
- **A count-up on a ratio.** Mid-count it shows a wrong ratio on screen (the bond Short builder saw "1 : 8" on the way to a different value). Show finished ratios.
- **A number the voice already says,** with a label that repeats the voice. Keep a label only where the voice cannot carry the meaning.

This is a proposed change for our shorts, not an approved style rule; it was suggested in [Reference: 2D video plugin](reference-claude-2d-video-plugin.md) and has not been audited.

**Source:** Andrey Zenin, [YyUP_hSovOg](https://www.youtube.com/watch?v=YyUP_hSovOg) at 2:26-2:47; [Skill trial: bond Short](skill-trial-bond-short.md) for the count-up finding.
