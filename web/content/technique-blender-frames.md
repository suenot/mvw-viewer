---
title: "Technique: a Blender animation as frame numbers"
label: "Blender frames"
order: 32
parent: "guides/motion-techniques"
summary: "Script Blender without its interface, key a scene, and render every frame from its number. We ran a small test and measured what comes out."
---

# Technique: a Blender animation as frame numbers

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Blender can sit in this workflow the way Three.js does: a 3D element made by a script, with a motion that is a function of the frame number, rendered to still images and laid into the video. Nothing in this collection covered Blender, so we ran a small test ourselves. It covers only what we measured, and the limits are listed below.

```viz motion-techniques/blender-frames
caption: The four steps of the test, and the cube position at five frames. Orange line: the default Bezier interpolation. Dashed: linear. The numbers are what the script printed.
```

## What we ran

Blender 5.2.2 LTS, headless, with this script (`/Applications/Blender.app/Contents/MacOS/Blender -b -P test.py`):

```python
import bpy
sc = bpy.context.scene
sc.frame_start, sc.frame_end = 1, 48
sc.render.engine = "BLENDER_WORKBENCH"
sc.render.resolution_x, sc.render.resolution_y = 320, 180
cube = bpy.context.object
cube.location.x = -2; cube.keyframe_insert("location", index=0, frame=1)
cube.location.x =  2; cube.keyframe_insert("location", index=0, frame=48)

act, slot = cube.animation_data.action, cube.animation_data.action_slot
fc = next(f for f in act.layers[0].strips[0].channelbag(slot).fcurves
          if f.data_path == "location" and f.array_index == 0)
print([round(fc.evaluate(f), 3) for f in (1, 12, 24, 36, 48)])
sc.frame_set(24)                      # the scene is now exactly frame 24
sc.render.filepath = "out/"; bpy.ops.render.render(animation=True)
```

## What we measured

- **The value is a function of the frame.** With the default Bezier keys, `fc.evaluate` gave -2, -1.445, -0.064, 1.351 and 2 at frames 1, 12, 24, 36, 48. After `frame_set(5)` and then `frame_set(24)` the cube was at the same x as before.
- **Default is not linear.** The Bezier join eases in and out: at frame 12 the cube is at -1.445, where a linear join gives -1.064. For a steady travel set the keys to `LINEAR`.
- **Same frame, same file.** Frame 24 rendered twice gave identical PNG files.
- **Fast enough to iterate.** 48 frames in Workbench at 320 by 180 took 0.4 seconds. This says nothing about Eevee or Cycles at full size.
- **The curves API moved.** In 5.2.2 `action.fcurves` was not there. Curves live on a channel bag: `action.layers[0].strips[0].channelbag(slot).fcurves`. Older recipes you find online break on it.

This is the same contract as a [seekable frame](technique-seekable-frame.md): render frame `n` from `n` alone. Keys placed on Bezier handles can be shaped like the [camera curves](technique-camera-curves.md); for a rig, key the camera object the same way.

## How it fits a video

Render the 3D part as a numbered PNG sequence (a transparent background is a render setting; we did not test it) and treat it as a layer: lay it over the 2D scene, mask it, and check it frame by frame as in [render and inspect](technique-render-and-inspect.md). Use Blender when the object needs modelling, materials or physically based light. Use Three.js, as in the [camera curves](technique-camera-curves.md) article, when the whole scene is real-time and shares the page clock.

## Not tested

Encoding to a video file, a transparent background, Eevee and Cycles, GPU rendering, rigs, simulations, and a long sequence. The Blender add-on for live control was not connected in this session, so the test used the command line only.

**Sources:** our own run, as above; [Blender Python API](https://docs.blender.org/api/current/) for the names used. The installed Blender skill documents the same area.
