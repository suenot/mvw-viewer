---
title: "Motion techniques Claude can use"
label: "Motion techniques"
order: 8
parent: "guides/video-creation-study"
summary: "Thirty-two motion-design techniques from the studied tutorials, the prompt database, the owner's curves project and our own 3D work, one article each with an animated demo of how it works."
---

# Motion techniques Claude can use

[Video creation studies](video-creation-study.md) · Reviewed November 16, 2026

This is the practical side of the studies: each technique the tutorials describe, pulled out as its own article with a small animated demo, so an assistant (or a person) can apply it one at a time. The main source is ProdAdvice's HyperFrames tutorial ([K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g)); we add the two other tutorials the owner picked, Studio Igor's game-art experiments ([YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk)) and Andrey Zenin's 2D video plugin tutorial ([YyUP_hSovOg](https://www.youtube.com/watch?v=YyUP_hSovOg)). The second wave of techniques comes from a fourth tutorial found in the chat history, ИИ МАСТОДОНТ's "Sonnet 5.5 and HyperFrames" ([yEpN_s9UkAE](https://www.youtube.com/watch?v=yEpN_s9UkAE)), and from the prompts in this site's own Videos catalog, mainly the detailed ones by flxrnc, techhalla and 0xnicc0 (their authors' X posts are linked in each article). The third wave comes from the owner's curves project (harmonic shapes, letters and sound, accumulated clocks) and from 3D work: our Tabletop Miniature style and a small Blender test we ran. We read the transcript and the prompts; we have not rerun them.

The skills these techniques can be pulled from, with repository links, are on [Motion skills: where to extract the techniques](motion-skills-list.md).

```viz kit/steps
{"caption": "The eight groups of techniques: how the drawing looks, how the work is organised, how picture and voice meet, how motion is engineered, how type moves, how the work is directed and reviewed, how shapes become harmonics, and how 3D is used.",
 "summary": "Eight groups. The pencil look: line boil, cadence and seed, hatching, construction lines. The workflow: timing plan, style contract, render and inspect, error log, short pieces. Picture and voice: layered assets, one sentence one shot, number readout. Motion engineering: seekable frame, closed-form springs, beat grid, seamless loop, subframe blur, one shape, independent clocks. Type and print: kinetic type, mask reveal, misregistration. Direction and review: storyboard and pre-pass, reference by link, feedback passes, locked message. Harmonic shapes: harmonic morph, harmonic type, shape to sound. 3D and Blender: camera curves, tilt-shift band, Blender frames.",
 "steps": [
  {"title": "Pencil look", "text": "Line boil, cadence and seed, hatching, construction lines"},
  {"title": "Workflow", "text": "Timing plan, style contract, render and inspect, error log, short pieces"},
  {"title": "Picture and voice", "text": "Layered assets, one sentence one shot, number readout"},
  {"title": "Motion engineering", "text": "Seekable frame, springs, beat grid, loop, subframe blur, one shape, clocks"},
  {"title": "Type and print", "text": "Kinetic type, mask reveal, misregistration"},
  {"title": "Direction and review", "text": "Storyboard and pre-pass, reference by link, feedback passes, locked message"},
  {"title": "Harmonic shapes", "text": "Harmonic morph, harmonic type, shape to sound"},
  {"title": "3D and Blender", "text": "Camera curves, tilt-shift band, Blender frames"}
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

### Motion engineering

| Technique | What it does | Main source |
| --- | --- | --- |
| [Seekable frame](technique-seekable-frame.md) | Draws the picture as a pure function of time, so any moment can be frozen and checked | Prompts flxrnc, techhalla, BuildFastWithAI |
| [Closed-form springs](technique-closed-form-springs.md) | Moves everything with exact spring formulas; the camera is slower than the shape | Prompts flxrnc, AnnaCher, 0xnicc0 |
| [Beat grid](technique-beat-grid.md) | Puts every event on a fixed grid of beats (0.5 s at 120 BPM) | Prompts flxrnc, techhalla, 0xnicc0 |
| [Seamless loop](technique-seamless-loop.md) | Makes the last frame equal the first, cursor included | Prompts flxrnc, techhalla |
| [Subframe blur](technique-subframe-blur.md) | Blends four samples per frame for real motion blur | Prompts flxrnc, techhalla |
| [One shape, never cut](technique-one-shape.md) | Tells a product story with one element that morphs, with no cuts | Prompts AnnaCher, 0xnicc0, flxrnc |
| [Independent clocks](technique-independent-clocks.md) | Gives each motion its own accumulated phase, so a speed change never moves the past | The owner's curves project |

### Type and print

| Technique | What it does | Main source |
| --- | --- | --- |
| [Kinetic type per glyph](technique-kinetic-type.md) | A spring per letter, started 125 ms apart | Prompt techhalla |
| [Mask reveal](technique-mask-reveal.md) | Turns the outgoing word into a window onto the next scene | Prompt techhalla |
| [Print misregistration](technique-misregistration.md) | Two offset colour copies of text, on impact frames only | Prompt techhalla |

### Direction and review

| Technique | What it does | Main source |
| --- | --- | --- |
| [Storyboard and pre-pass](technique-storyboard-first.md) | Storyboard before code, one still per beat before the render | Prompts flxrnc, 0xnicc0, techhalla; ИИ МАСТОДОНТ 06:04 |
| [Reference by link](technique-reference-by-link.md) | Gives a link to a clip you like and asks for your story in that style | ИИ МАСТОДОНТ 13:10 |
| [Feedback in passes](technique-feedback-passes.md) | Pace, then sound, then music fitted to the beat | ИИ МАСТОДОНТ 08:13 |
| [Locked message and bans](technique-locked-message.md) | Fixes the exact words and lists what must not appear | Prompt techhalla |

### Harmonic shapes

| Technique | What it does | Main source |
| --- | --- | --- |
| [Harmonic morph](technique-harmonic-morph.md) | Stores an outline as a few complex harmonics; morphs by mixing coefficients; the count is a smoothness dial | The owner's curves project |
| [Harmonic type](technique-harmonic-type.md) | Builds letters from closed contours, filled as one even-odd compound path so holes stay open | The owner's curves project |
| [Shape to sound](technique-shape-to-sound.md) | Uses the magnitudes of a contour's harmonics as the partials of a tone | The owner's curves project |

### 3D and Blender

| Technique | What it does | Main source |
| --- | --- | --- |
| [Camera curves](technique-camera-curves.md) | Keys a 3D camera's channels with monotone Hermite curves: smooth, no overshoot, flat on holds | Our Tabletop Miniature style |
| [Tilt-shift band](technique-tilt-shift.md) | Blurs all but one band so a scene reads as a miniature; grain seeded by frame number | Our Tabletop Miniature style |
| [Blender frames](technique-blender-frames.md) | Scripts a headless Blender animation and renders each frame from its number | Our own test, Blender 5.2.2 |

## How to use them

1. Start from the workflow group: a [timing plan](technique-timing-plan.md) and a [style contract](technique-style-contract.md) cost minutes and prevent most rework.
2. Pick one look technique for the job and test it on one short scene. Do not stack all four of the pencil techniques on a first attempt.
3. Run [render and inspect](technique-render-and-inspect.md) on every scene, and keep the [error log](technique-error-log.md) current.
4. For narrated pieces add the picture-and-voice group.
5. For product and UI motion, or pieces that loop or go to music, add the motion-engineering group ([seekable frame](technique-seekable-frame.md) first) and the direction-and-review group.
6. For character and shape work add the harmonic group; for 3D scenes, the 3D group (the Blender article is a measured test, the others come from a finished style).

## Limits

The demos are our own drawings that show how each mechanism works. They are not frames from the tutorials, and the numbers inside them (amplitudes, spacings, pixel shifts) are illustrative unless an article says a number comes from a source. The code snippets are our proposed implementations; none of the four tutorials publishes its source, and the prompts in the catalog are given without their code. A technique that works in a demo has to be tested on a real scene, with the checks in [Auditing a video](auditing-a-video.md), before it enters a client video.

Studies behind this page: [HyperFrames tutorial study](hyperframes-tutorial-study.md), [Layered art tutorial study](layered-art-to-video.md), [Reference: 2D video plugin](reference-claude-2d-video-plugin.md), [Skill trial: bond Short](skill-trial-bond-short.md).
