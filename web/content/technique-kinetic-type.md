---
title: "Technique: kinetic type per glyph"
label: "Kinetic type per glyph"
order: 19
parent: "guides/motion-techniques"
summary: "Treat every letter as its own element with its own spring and a fixed stagger, so words arrive as a rhythm and not as a block."
---

# Technique: kinetic type per glyph

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

One prompt in our database spells out how a poster-style word should arrive: "per-glyph spring (y, opacity, blur). Stagger = 1/16 note at 120 BPM (125 ms)" ([techhalla](https://x.com/techhalla/status/2103411244468498547)). The same prompt asks for a slam from below with spring overshoot for the opening line, and for letters that scramble (a seeded shuffle per glyph) and then snap into place on the beat. Another asks for the wordmark to rise letter by letter from a mask line ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)).

```viz motion-techniques/kinetic-type
caption: Each letter of STEAL is its own element and rises 125 ms after the one before. The ticks under the word are the start offsets: 0, 125, 250, 375 and 500 ms.
```

## How it works

A word that fades in as one block has one motion. A word whose letters start 125 ms apart has a rhythm, and the rhythm locks to the [beat grid](technique-beat-grid.md): at 120 BPM, 125 ms is a sixteenth note, so the last letter still lands within the beat. Each glyph carries three animated values (vertical offset, opacity, blur), each from its own [spring](technique-closed-form-springs.md) started at `start + index * 0.125`.

## How to build it

```js
const STAGGER = 0.125;                              // 1/16 note at 120 BPM
for (const [i, g] of glyphs.entries()) {
  const k = spring(t - (start + i * STAGGER), 0.72, 0.35);
  drawGlyph(g, { y: (1 - k) * 40, alpha: k, blur: (1 - k) * 12 });
}
```

For the scramble variant, shuffle with a [seeded](technique-cadence-and-seed.md) shuffle per glyph, never `Math.random`.

## Watch for

- **Too many words.** The same prompt limits the display type to one to four words.
- **Stagger longer than the beat.** Forty letters at 125 ms take five seconds; stagger by word, not by letter, for long lines.
- **Blur you cannot read.** Keep the final frame crisp; blur is for the first 150 ms.

**Sources:** [techhalla-498547](https://x.com/techhalla/status/2103411244468498547), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612) in our prompt database; the snippet is ours.
