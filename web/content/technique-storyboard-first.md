---
title: "Technique: a storyboard before code, stills before render"
label: "Storyboard and pre-pass"
order: 22
parent: "guides/motion-techniques"
summary: "Show a beat-by-beat storyboard before any code, and render one still per beat before the full render, so problems are found cheaply."
---

# Technique: a storyboard before code, stills before render

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The prompts and the tutorial agree on order of work. A prompt ends with the instruction: "First show me the storyboard. Then write the code. After the first render, check 5 frames around every beat and fix the issues before the final render" ([flxrnc](https://x.com/flxrnc/status/2108242454105251921)). Another: "Render one still per beat first. Fix anything cramped, off-grid or hard to read before the full render" ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)), and "before full render, export one still per major beat (8 frames). Fix cramped type, orphan words, low contrast" ([techhalla](https://x.com/techhalla/status/2103411244468498547)). In the tutorial, HyperFrames shows a set of key frames before it renders, so feedback comes before it spends 10 minutes and tokens on an MP4 ([Mastodon video, 06:04](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=364s)); the author says the key frames were how he saw it was fine and what to correct ([07:13](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=433s)).

```viz motion-techniques/storyboard-first
caption: Six beat cards with times, then the flow: the storyboard is approved first, code comes second, one still per beat is checked and fixed, and only then the full render.
```

## How it works

A render is the most expensive way to find a mistake. A storyboard costs a few lines and shows whether the story and the beats are right. A still per beat costs a few seconds each and shows layout problems (cramped type, an orphan word, weak contrast) before the long render. Because a frame is a [function of time](technique-seekable-frame.md), stills at the beat times are free to make.

## How to build it

1. Ask for the storyboard as a list of `time, what is on screen, what moves` for every beat on the [beat grid](technique-beat-grid.md). Approve or edit it.
2. Write the code. Keep the beats in the [timing plan](technique-timing-plan.md).
3. Export stills at each beat (and a few frames either side, the prompt says five) and look at them with [render and inspect](technique-render-and-inspect.md).
4. Fix what you logged in the [error log](technique-error-log.md), then run the full render.

## Watch for

- **Skipping step 1 because the idea is simple.** A one-line change to the storyboard is cheap; a change to finished code is not.
- **Stills only on the beat.** Problems hide between beats; the prompt asks for five frames around each one.
- **Approving the storyboard in prose.** Ask for times and counts, not adjectives.

**Sources:** [flxrnc-251921](https://x.com/flxrnc/status/2108242454105251921), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612), [techhalla-498547](https://x.com/techhalla/status/2103411244468498547) in our prompt database, and the ИИ МАСТОДОНТ tutorial [yEpN_s9UkAE](https://www.youtube.com/watch?v=yEpN_s9UkAE).
