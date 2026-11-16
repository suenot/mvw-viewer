---
title: "Motion skills: where to extract the techniques"
label: "Motion skills list"
order: 9
parent: "guides/video-creation-study"
summary: "The skills and repositories behind the motion techniques, with licences, what each one yields and the verdict from our trial, plus a procedure for extracting a technique safely."
---

# Motion skills: where to extract the techniques

[Video creation studies](video-creation-study.md) · [Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

A skill is a prompt with taste. Our [skill trial](skill-trial-bond-short.md) found that no third-party skill beat a control built with none, and that every skill collided with the owner's rules at least once. What is worth taking is a single technique together with its evidence, and this page lists where each technique can be taken from.

Licences below were checked on the dates in the trial; they can change, so check the repository before copying anything. Verdicts are from the October 19, 2026 trial: one 39 s story, one run per skill, one auditor.

```viz kit/steps
{"caption": "How to extract a technique from a skill without installing it.",
 "summary": "Five steps: read the skill as data and run none of its code; check its licence; write the technique as a short article with a demo; list where it conflicts with the house rules; test it on one scene against a control built without it.",
 "steps": [
  {"title": "Read as data", "text": "Run none of its scripts or installer"},
  {"title": "Check the licence", "text": "Reading is fine; copying needs a grant"},
  {"title": "Write it down", "text": "One technique, one article, one demo"},
  {"title": "List conflicts", "text": "Against the owner's rules and gates"},
  {"title": "Test with a control", "text": "One scene, built with and without it"}
 ]}
```

## Skills and repositories

| Source | Repository | Licence | Techniques it yields | Verdict |
| --- | --- | --- | --- | --- |
| HyperFrames | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Not recorded in our docs; check the repository | A seekable, paused timeline that makes [timing plans](technique-timing-plan.md) and [render and inspect](technique-render-and-inspect.md) possible | The studio's framework, see [HyperFrames build rules](hyperframes-build-rules.md) |
| ref2game (Studio Igor) | [studioigor/ref2game](https://github.com/studioigor/ref2game) | Not recorded in our docs | [Layered assets](technique-layered-assets.md), a style bible sent with every request, motion checks with numbers | Reading; its README corroborates the video's phases |
| iart-ai motion-skills | [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) | MIT | Real data drawn on a real picture, draw-on routes, labelled unit charts | Adopt partly, as recipes |
| iart-ai map-animation-skills | [iart-ai/map-animation-skills](https://github.com/iart-ai/map-animation-skills) | MIT | Projection and draw-on recipe for editorial maps | Adopt partly (the recipe, not camera flights or highlights) |
| iart-ai tiktok-video-skills | [iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills) | MIT | Short-form craft: hooks, safe areas, loops | Adopt partly |
| iart-ai data-animation-skills | [iart-ai/data-animation-skills](https://github.com/iart-ai/data-animation-skills) | MIT | Chart design: finished frame first, then reveal in order | Adopt partly |
| iart-ai webgl-animation-skills | [iart-ai/webgl-animation-skills](https://github.com/iart-ai/webgl-animation-skills) | Not recorded in our docs | Shader scenes, used as research for the shader-dive style | Reading |
| motionmaxxing | [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) | Apache-2.0 (early release) | A slop checklist for [render and inspect](technique-render-and-inspect.md) and the [error log](technique-error-log.md); a sound arc and ducking guide | Adopt partly, as reading |
| claude-faceless-shorts-creator | [hassancs91/claude-faceless-shorts-creator](https://github.com/hassancs91/claude-faceless-shorts-creator) | MIT | A +4 dB audibility test for sound cues; a seamless loop ending | Adopt partly; not the paid-service factory |
| herk-edit-kit | [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) | MIT for original material; imported pipeline resources keep a separate grant | An open loop planted early and paid off late; cuts on word onsets ([sentence and shot](technique-sentence-shot.md)); labelling the thing | Do not adopt the layout or camera grammar |
| vizavi-motion | [vizavi.academy/lesson-motion](https://vizavi.academy/lesson-motion/) | None stated; treat as read-only | A storyboard before the build; motion and sound on the same events | Reading only |
| OpenMontage | [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) | AGPL-3.0 | Character animation with SVG rigs and GSAP | Reading only; copying would pull in AGPL terms |
| LottieFiles motion-design-skill | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | MIT | General timing and easing principles for UI motion | Scouted, not applied |
| awesome-claude-video-skills | [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) | A list, not code | An index of about 180 repositories that the skill scout started from | Where to search next |

The 2D video plugin from the third tutorial ([YyUP_hSovOg](https://www.youtube.com/watch?v=YyUP_hSovOg)) is not on this list. It is handed out as a zip through a Telegram link, we did not install it, and the techniques we took from it come from measuring its demo (see [Reference: 2D video plugin](reference-claude-2d-video-plugin.md)).

## Which technique to look for where

| Technique | Look in |
| --- | --- |
| [Line boil](technique-line-boil.md), [hatching](technique-hatching.md), [construction lines](technique-construction-lines.md) | The ProdAdvice tutorial itself; none of our studies links a public repository for it. Studio Igor's cartoon shows line boil too |
| [Timing plan](technique-timing-plan.md) | HyperFrames |
| [Style contract](technique-style-contract.md) | ref2game (style bible), motionmaxxing (slop checklist) |
| [Render and inspect](technique-render-and-inspect.md), [error log](technique-error-log.md) | ref2game (motion checks), motionmaxxing, HyperFrames check and snapshot commands |
| [Layered assets](technique-layered-assets.md) | ref2game |
| [One sentence, one shot](technique-sentence-shot.md) | herk-edit-kit (`short-form-edit`), claude-faceless-shorts-creator |
| [Number readout](technique-number-readout.md) | iart-ai data-animation-skills |

## Rules for taking from a skill

- **Install nothing.** An installed skill can change defaults silently, and copying files brings in licence terms. Keep the repositories as reading.
- **Read as data, run no code.** Never run an installer or a script from a skill you have not reviewed.
- **Check the licence.** AGPL and "none stated" mean reading only.
- **List conflicts first.** Each skill in the trial collided with an owner rule: a moving camera, camera travel, region highlights, never-ship items.
- **Build a control.** Make the same scene without the skill and let an independent check rank them by the owner's rules.
- **A checklist that demands change needs a fact to show.** One checklist item pushed a builder to invent a meaning on a map; the change must use facts already in the fact table.

Skills released after October 19, 2026 and the roughly 34 downloaded repositories that were not applied have not been evaluated.
