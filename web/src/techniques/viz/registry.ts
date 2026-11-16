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
  "motion-techniques/seekable-frame": {
    title: "A seekable frame function",
    summary:
      "Two rows of five small frames at 0, 1.2, 2.4, 3.6 and 4.8 seconds with a ball sliding left to right. In the first row every frame is computed from time alone, so a jump to 3.6 seconds gives the right frame. In the second row each frame depends on the one before, so after the jump to 3.6 seconds the ball still shows the old position and the frame is wrong.",
    size: { wide: [640, 282], narrow: [336, 274] },
    load: () => import("./demos/seekable-frame"),
  },
  "motion-techniques/closed-form-springs": {
    title: "Closed-form springs",
    summary:
      "Two curves on a time axis from 0 to 0.8 seconds. The shape spring with damping 0.72 settles in 0.35 seconds and overshoots the target by about 3.8 percent. The camera spring with damping 1.0 settles in 0.6 seconds with no overshoot and arrives later. Two dots replay the curves in slow motion.",
    size: { wide: [640, 220], narrow: [336, 310] },
    load: () => import("./demos/closed-form-springs"),
  },
  "motion-techniques/beat-grid": {
    title: "A beat grid",
    summary:
      "A 4 second axis with a tick every 0.5 seconds (120 beats per minute) and fainter ticks every 125 milliseconds. Six events sit on the beats. A seventh hit that started at 1.3 seconds slides onto the beat at 1.5 seconds.",
    size: { wide: [640, 200], narrow: [336, 200] },
    load: () => import("./demos/beat-grid"),
  },
  "motion-techniques/seamless-loop": {
    title: "A seamless loop",
    summary:
      "Two rings, each a 14 second loop. In the left ring the last frame is not the first, so the moving dot jumps back at the seam. In the right ring time is wrapped with t minus 14 times floor of t over 14, the last frame equals the first and the dot closes the ring with no jump.",
    size: { wide: [640, 196], narrow: [336, 300] },
    load: () => import("./demos/seamless-loop"),
  },
  "motion-techniques/subframe-blur": {
    title: "Subframe motion blur",
    summary:
      "The same fast ball in two panels. With one sample per frame it is a sharp disc. With four subframes blended it leaves a short streak, so the motion reads as smooth. The four samples are taken at t, t plus a quarter, t plus a half and t plus three quarters of one sixtieth of a second.",
    size: { wide: [640, 170], narrow: [336, 276] },
    load: () => import("./demos/subframe-blur"),
  },
  "motion-techniques/one-shape": {
    title: "One shape, never cut",
    summary:
      "Four cards show one element in four states: a mascot circle at 0 seconds, a play button at 1 second, a loader ring at 2 seconds and a timeline pill at 2.5 seconds. A dashed ring travels from card to card to show that the same element is morphing and nothing is replaced.",
    size: { wide: [640, 172], narrow: [336, 262] },
    load: () => import("./demos/one-shape"),
  },
  "motion-techniques/kinetic-type": {
    title: "Kinetic type per glyph",
    summary:
      "The word STEAL, each letter its own element. The letters rise one after another with a start offset of 125 milliseconds each, a sixteenth note at 120 beats per minute. Tick marks under the word show the offsets 0, 125, 250, 375 and 500 milliseconds.",
    size: { wide: [640, 170], narrow: [336, 160] },
    load: () => import("./demos/kinetic-type"),
  },
  "motion-techniques/mask-reveal": {
    title: "A reveal through the letters",
    summary:
      "Three panels. First, an outgoing plate with the word BAD. Second, the word becomes a window and the next scene, the word WORKFLOWS, shows through the letterforms. Third, the window grows until the next scene almost fills the frame.",
    size: { wide: [640, 180], narrow: [336, 410] },
    load: () => import("./demos/mask-reveal"),
  },
  "motion-techniques/misregistration": {
    title: "Print misregistration",
    summary:
      "The word IMPACT. At two impact moments marked on a small timeline, a blue copy and an orange copy appear behind it, shifted by 4 pixels at 45 percent opacity, and then vanish. Outside the impacts the text is clean.",
    size: { wide: [640, 170], narrow: [336, 160] },
    load: () => import("./demos/misregistration"),
  },
  "motion-techniques/storyboard-first": {
    title: "Storyboard before code",
    summary:
      "Six beat cards, each with a time and a short caption, from 0 seconds to 12 seconds. Below them a flow of five steps: storyboard, you approve, code, one still per beat, fix then render.",
    size: { wide: [640, 196], narrow: [336, 350] },
    load: () => import("./demos/storyboard-first"),
  },
  "motion-techniques/reference-by-link": {
    title: "Reference by link",
    summary:
      "Three boxes in a chain. A post you like, given only as a link. The style read out of it: palette, type, camera, beat grid, cursor and springs. Your own story told in that style.",
    size: { wide: [640, 160], narrow: [336, 326] },
    load: () => import("./demos/reference-by-link"),
  },
  "motion-techniques/feedback-passes": {
    title: "Feedback in passes",
    summary:
      "Three versions of a video. Version 1 has only picture, with the note that scenes are too fast. Version 2 adds sound to every movement. Version 3 adds a music track cut to its beat. Each pass adds one layer.",
    size: { wide: [640, 240], narrow: [336, 280] },
    load: () => import("./demos/feedback-passes"),
  },
  "motion-techniques/locked-message": {
    title: "A locked message and a ban list",
    summary:
      "Left, six lines of on-screen text in a fixed order, the only words allowed. Right, a ban list of clichés each crossed out: brains and robots, sparkles, soft gradients, bouncy easing, particle explosions and glassmorphism.",
    size: { wide: [640, 170], narrow: [336, 330] },
    load: () => import("./demos/locked-message"),
  },
  "hyperframes-tutorial-study/cadence": {
    title: "Drawing cadence against file frame rate",
    summary:
      "Half a second of a pencil treatment drawn at 12 drawings a second, so six drawings. In a 24 fps file the 12 frames show drawings 1, 1, 2, 2, 3, 3 and so on: every drawing holds two frames. In a 30 fps file the 15 frames show drawing 1 for three frames, drawing 2 for two, then three, two, three, two: the holds alternate between three and two frames. The drawing index is floor(time times 12), independent of the file frame rate.",
    size: { wide: [640, 232], narrow: [336, 268] },
    load: () => import("./demos/cadence"),
  },
};
