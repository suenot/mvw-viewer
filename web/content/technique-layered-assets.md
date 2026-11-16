---
title: "Technique: painted layers, with light and text in code"
label: "Layered assets"
order: 10
parent: "guides/motion-techniques"
summary: "Generate the detailed pictures as separate transparent layers, then let code do depth, light, particles and text. Parallax is the proof it works."
---

# Technique: painted layers, with light and text in code

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Studio Igor's first platformer, drawn entirely in code, scored 2/10; he stopped after 37 minutes and 12 % of a weekly model allowance. His second attempt generated the pictures as images and let code move them ([6:09](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=369s)). The split is the technique: images carry painted forms and texture, code carries scale, position, light, motion and interaction ([7:48](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=468s)).

```viz motion-techniques/layers
caption: Background, subject and foreground are images; light and text are code. Composed, a slow sideways camera moves the foreground by 18 px, the subject by 9 px and the background by 4 px (demo values) while the code layer stays still.
```

## How it works

- **Separate by depth.** Generate the background, the subject and the foreground as their own layers, each on a transparent ground with room around the subject.
- **Keep mutable effects out of the pictures.** Glow, shadow, particles, text and water are deliberately excluded from generated images ([19:12](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=1152s)). Draw them in code, where one number changes them.
- **Move layers by depth.** When the camera shifts sideways, near layers shift more than far ones. That is parallax, and it is what makes flat pictures read as a space.
- **Hold text still.** Text belongs to the code layer, so it never slides with the picture.

## Check before you animate

- **Holes.** When a layer moves, look for gaps at its edges. Draw layers wider than the frame, as the demo does.
- **A clean subject.** Neutral light and no baked shadow, so the lighting you add does not fight the lighting in the picture.
- **A recorded source.** Save each asset with its prompt, model and source reference, so a bad layer can be regenerated.

## Limits

The method suits scenes and cutout characters. Studio Igor rejected AI sprite sheets and cutting one generated character into pieces; he generates separate body parts in an agreed pose and assembles them ([19:12](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=1152s)). It is not a replacement for frame animation, and the allowance percentages are one creator's account, not a transferable cost.

Details and a proposed experiment for a 5 to 10 s shot are in [Layered art tutorial study](layered-art-to-video.md). The author's open [ref2game skill](https://github.com/studioigor/ref2game) describes the workflow.

**Source:** Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk) at 6:09-8:59 and 19:12-20:55. The pixel shifts in the demo are illustrative.
