import type { Component } from "solid-js";
import type { VizProps, VizSize } from "./types";

export type VizEntry = { title: string; summary: string; size: VizSize; load: () => Promise<{ default: Component<VizProps> }> };

export const registry: Record<string, VizEntry> = {
  "motion-techniques/line-boil": {
    title: "Line boil",
    summary:
      "A circle drawn six times with slightly different wobble. On the left the six drawings play one after another, one every 83 ms (12 a second), so the contour seems to vibrate while the shape stays put. On the right the same six drawings are laid over each other.",
    size: { wide: [640, 200], narrow: [336, 340] },
    load: () => import("./demos/line-boil"),
  },
  "motion-techniques/seed": {
    title: "Stable seed",
    summary:
      "Two rows of three small circles for the visits 0.5 s, 1.0 s and 0.5 s again. In the row with a random number at every call, the second visit to 0.5 s draws a different contour. In the row seeded with the scene seed plus floor of time times 12, the second visit to 0.5 s draws the same contour as the first.",
    size: { wide: [640, 260], narrow: [336, 290] },
    load: () => import("./demos/seed"),
  },
  "motion-techniques/hatching": {
    title: "Hatching instead of flat fill",
    summary:
      "A ball drawn twice. On the left it has a flat fill. On the right its shadowed lower right side is built from diagonal strokes, and a second pass of crossing strokes darkens the deepest part.",
    size: { wide: [640, 200], narrow: [336, 340] },
    load: () => import("./demos/hatching"),
  },
  "motion-techniques/construction-lines": {
    title: "Construction lines and broken strokes",
    summary:
      "Three stages of one circle. First light guides: a dashed box, a cross and a looser circle. Second a contour made of seven short strokes with small gaps. Third both together, with the guides left faint.",
    size: { wide: [640, 200], narrow: [336, 300] },
    load: () => import("./demos/construction-lines"),
  },
  "motion-techniques/timing-plan": {
    title: "A timing plan as data",
    summary:
      "Four bars on a 5 second axis: coastline from 0 s, location dot from 1.0 s, fact label, and a clear at 4.5 s. A playhead sweeps the plan, then the fact label's start is edited from 2.0 s to 2.4 s and only that bar moves.",
    size: { wide: [640, 230], narrow: [336, 210] },
    load: () => import("./demos/timing-plan"),
  },
  "motion-techniques/style-dna": {
    title: "A style contract",
    summary:
      "Four tokens: line 3 px, redraw 2 px, one blue, 12 drawings a second. Under them two rows of a circle, a square and a triangle. In the first row all shapes follow the tokens and look like one set. In the second row there is no contract and each shape has its own line weight, wobble and colour.",
    size: { wide: [640, 260], narrow: [336, 310] },
    load: () => import("./demos/style-dna"),
  },
  "motion-techniques/render-inspect": {
    title: "Render, inspect, fix",
    summary:
      "Four frames pulled from a render at 0.5, 1.0, 2.0 and 4.5 seconds are checked one after another. The frame at 2.0 s has a defect: its label touches the edge. The defect is logged with its time, fixed in the source and the clip is rendered again.",
    size: { wide: [640, 220], narrow: [336, 350] },
    load: () => import("./demos/render-inspect"),
  },
  "motion-techniques/error-log": {
    title: "An error log that becomes checks",
    summary:
      "Three concrete failures on the left, each turned into a rule for the next scene on the right: a label collides with the phone crop at 3.2 s, so keep labels 90 px inside the safe area; hatching flips direction between frames, so use one hatch angle per object with a fixed seed; text flickers as the contour redraws, so labels follow continuous time.",
    size: { wide: [640, 220], narrow: [336, 326] },
    load: () => import("./demos/error-log"),
  },
  "motion-techniques/assemble": {
    title: "Long work from short pieces",
    summary:
      "Four scenes of 5 seconds each are built and approved one at a time, then slide together into one 20 second strip. The three seams between the scenes are flagged for review of palette, audio and pacing.",
    size: { wide: [640, 210], narrow: [336, 220] },
    load: () => import("./demos/assemble"),
  },
  "motion-techniques/layers": {
    title: "Layered assets and parallax",
    summary:
      "Four layers shown apart: background, subject and foreground are images; light and text are code. They are composed into one picture where a slow sideways camera moves the foreground by 18 px, the subject by 9 px and the background by 4 px, while the code layer stays still.",
    size: { wide: [640, 150], narrow: [336, 360] },
    load: () => import("./demos/layers"),
  },
  "motion-techniques/sentence-shot": {
    title: "One sentence, one shot",
    summary:
      "Four sentences of narration on a 10 second axis and, below them, four shots. Each cut lands 0.14 seconds before the first word of its sentence. The longest pause, 0.8 seconds, sits before the last sentence, the punch line.",
    size: { wide: [640, 224], narrow: [336, 200] },
    load: () => import("./demos/sentence-shot"),
  },
  "motion-techniques/readout": {
    title: "A number as a readout",
    summary:
      "Two portrait frames of the same drop tower. Left, a slam: a large 50 M over the picture, 8 percent of the frame height. Right, a readout: a thin measuring line and a small 50 M beside the tower, about 3.5 percent of the frame height.",
    size: { wide: [640, 380], narrow: [336, 320] },
    load: () => import("./demos/readout"),
  },
  "hyperframes-tutorial-study/cadence": {
    title: "Drawing cadence against file frame rate",
    summary:
      "Half a second of a pencil treatment drawn at 12 drawings a second, so six drawings. In a 24 fps file the 12 frames show drawings 1, 1, 2, 2, 3, 3 and so on: every drawing holds two frames. In a 30 fps file the 15 frames show drawing 1 for three frames, drawing 2 for two, then three, two, three, two: the holds alternate between three and two frames. The drawing index is floor(time times 12), independent of the file frame rate.",
    size: { wide: [640, 232], narrow: [336, 268] },
    load: () => import("./demos/cadence"),
  },
};
