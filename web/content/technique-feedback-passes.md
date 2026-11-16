---
title: "Technique: feedback in passes"
label: "Feedback passes"
order: 24
parent: "guides/motion-techniques"
summary: "Improve a coded video in short passes, one concern at a time: pace, then sound, then music fitted to the beat."
---

# Technique: feedback in passes

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The tutorial's promo was not one prompt but a process: install HyperFrames, ask for key frames, tell it to keep to the brand and give your references, then refine step by step. First feedback on which scenes are too fast, then sound and music (a few options to choose from), after which the model fitted the animation to the music so it hooks harder ([ИИ МАСТОДОНТ, 08:13](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=493s)). Other demos in the same video: the vertical Short took feedback such as "redraw the logo, fast in places, slow in others", and the talking-head edit began dull and improved when he asked it to be creative and not follow a template ([09:15](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=555s), [11:07](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=667s)). A prompt in our database reports the same shape: "1 prompt and 2 rounds of feedback" ([daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)).

```viz motion-techniques/feedback-passes
caption: Three versions. v1 has only picture, with the note that scenes are too fast. v2 adds sound to every movement. v3 adds a track cut to its beat. Each pass adds one layer.
```

## How it works

A model that is asked for everything at once spreads its effort thin. One concern per pass keeps each change small enough to judge. The order matters: pace first (picture), then sound that matches visible movement, then music, which depends on pace being settled. Each pass starts from the last approved version and is checked with [render and inspect](technique-render-and-inspect.md).

## How to build it

- Pass 1: "scenes 2 and 4 are too fast; hold each for at least 1.5 s". Re-check the [timing plan](technique-timing-plan.md).
- Pass 2: "add a sound for every visible movement" (the prompt database has one: "make every sound match a movement you can see", [adrianduta96](https://x.com/adrianduta96/status/2109187815195992248)).
- Pass 3: bring your own track or generate one without words, and ask to fit the video to the song and pick the best moments ([13:37](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=817s)). Put the cuts on the [beat grid](technique-beat-grid.md).
- When it feels flat: ask it to be creative and not follow a template.

## Watch for

- **Mixed notes.** "Faster, add music and change the colour" is three passes; the model will do one well.
- **Music first.** Changing pace afterwards breaks the fit.
- **Music made in code.** The author says he does not know how the model makes it and prefers his own track; one prompt in our database makes the soundtrack from sine waves and noise ([daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)). Treat either as a draft to listen to.

**Sources:** ИИ МАСТОДОНТ, [yEpN_s9UkAE](https://www.youtube.com/watch?v=yEpN_s9UkAE) at 08:13, 09:15, 11:07 and 13:37; [daniel-haida-636937](https://x.com/daniel_haida/status/2104139720829636937) and [adrianduta96-992248](https://x.com/adrianduta96/status/2109187815195992248) in our prompt database.
