---
title: "Motion techniques Claude can use"
label: "Motion techniques"
order: 8
parent: "guides/video-creation-study"
summary: "Twelve motion-design techniques from the studied tutorials, one article each with an animated demo of how it works."
---

# Motion techniques Claude can use

[Video creation studies](video-creation-study.md) · Reviewed November 16, 2026

This is the practical side of the studies: each technique the tutorials describe, pulled out as its own article with a small animated demo, so an assistant (or a person) can apply it one at a time. The main source is ProdAdvice's HyperFrames tutorial ([K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g)); we add the two other tutorials the owner picked, Studio Igor's game-art experiments ([YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk)) and Andrey Zenin's 2D video plugin tutorial ([YyUP_hSovOg](https://www.youtube.com/watch?v=YyUP_hSovOg)).

The skills these techniques can be pulled from, with repository links, are on [Motion skills: where to extract the techniques](motion-skills-list.md).

```viz kit/steps
{"caption": "The three groups of techniques: how the drawing looks, how the work is organised, and how picture, voice and numbers meet.",
 "summary": "Three groups. The pencil look: line boil, cadence and seed, hatching, construction lines. The workflow: timing plan, style contract, render and inspect, error log, short pieces. Picture and voice: layered assets, one sentence one shot, number readout.",
 "steps": [
  {"title": "Pencil look", "text": "Line boil, cadence and seed, hatching, construction lines"},
  {"title": "Workflow", "text": "Timing plan, style contract, render and inspect, error log, short pieces"},
  {"title": "Picture and voice", "text": "Layered assets, one sentence one shot, number readout"}
 ]}
```

## The techniques

### The pencil look

| Technique | What it does | Main source |
| --- | --- | --- |
| [Line boil](technique-line-boil.md) | Redraws each outline about 12 times a second while the shape stays still | ProdAdvice 08:05, Studio Igor 0:49 |
| [Drawing cadence and a stable seed](technique-cadence-and-seed.md) | Keeps the drawing rhythm independent of the file frame rate, and makes a re-render identical | ProdAdvice 08:22 |
| [Hatching](technique-hatching.md) | Shades with strokes instead of a flat fill | ProdAdvice 09:00 |
| [Construction lines](technique-construction-lines.md) | Leaves faint guides under a contour made of short broken strokes | ProdAdvice 08:05, Studio Igor 0:49 |

### The workflow

| Technique | What it does | Main source |
| --- | --- | --- |
| [Timing plan](technique-timing-plan.md) | Holds every entrance, exit and path as plain numbers on one timeline | ProdAdvice 01:32 |
| [Style contract](technique-style-contract.md) | Turns a look into measurable tokens that every scene shares | ProdAdvice 10:14, Studio Igor 2:32 |
| [Render and inspect](technique-render-and-inspect.md) | Checks real frames at fixed times and writes down each defect | ProdAdvice 05:00, Studio Igor 20:55 |
| [Error log](technique-error-log.md) | Turns each failure into a check for the next scene | ProdAdvice 10:14, Studio Igor 14:14 |
| [Short pieces](technique-assemble-from-pieces.md) | Approves scenes one at a time and reviews only the seams | ProdAdvice 10:14, Zenin 6:39 |

### Picture and voice

| Technique | What it does | Main source |
| --- | --- | --- |
| [Layered assets](technique-layered-assets.md) | Painted layers for forms, code for depth, light and text | Studio Igor 7:48 |
| [One sentence, one shot](technique-sentence-shot.md) | Cuts a fraction of a second before each sentence | Zenin 2:02 |
| [Number readout](technique-number-readout.md) | Shows a figure small, beside what it measures | Zenin 2:26 |

## How to use them

1. Start from the workflow group: a [timing plan](technique-timing-plan.md) and a [style contract](technique-style-contract.md) cost minutes and prevent most rework.
2. Pick one look technique for the job and test it on one short scene. Do not stack all four of the pencil techniques on a first attempt.
3. Run [render and inspect](technique-render-and-inspect.md) on every scene, and keep the [error log](technique-error-log.md) current.
4. For narrated pieces add the picture-and-voice group.

## Limits

The demos are our own drawings that show how each mechanism works. They are not frames from the tutorials, and the numbers inside them (amplitudes, spacings, pixel shifts) are illustrative unless an article says a number comes from a source. The code snippets are our proposed implementations; none of the three tutorials publishes its source. A technique that works in a demo has to be tested on a real scene, with the checks in [Auditing a video](auditing-a-video.md), before it enters a client video.

Studies behind this page: [HyperFrames tutorial study](hyperframes-tutorial-study.md), [Layered art tutorial study](layered-art-to-video.md), [Reference: 2D video plugin](reference-claude-2d-video-plugin.md), [Skill trial: bond Short](skill-trial-bond-short.md).
