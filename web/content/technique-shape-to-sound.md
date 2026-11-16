---
title: "Technique: a contour spectrum as a voice"
label: "Shape to sound"
order: 28
parent: "guides/motion-techniques"
summary: "Use the magnitudes of a shape's harmonics as the partials of a tone, so the look of a character sets its timbre. All sound is synthesised, so it is deterministic."
---

# Technique: a contour spectrum as a voice

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The owner's game project synthesises every sound from harmonics: no recordings, no sample packs. Its notes describe one link that suits motion work well: the contour of a character is also its voice. A round character sounds nearly like a sine wave; a spiky one sounds buzzy.

```viz motion-techniques/shape-to-sound
caption: A circle and a star. Bars: the magnitudes of their first 16 harmonics, normalised. Line: one period of the tone those partials make. The circle is almost one partial; the star spreads over many.
```

## How it works

A shape is a set of harmonics ([harmonic morph](technique-harmonic-morph.md)). A tone is also a set of harmonics: partials at multiples of one pitch. The project maps one onto the other. For each shape harmonic `k` it takes the magnitude `sqrt(re^2 + im^2)`, folds the positive and negative frequency together as `|k|`, ignores the centre term, and uses the result as the level of partial `|k|`, at most 32 of them, normalised to unit energy. The browser's `PeriodicWave` builds the waveform from those levels ([MDN: PeriodicWave](https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave)).

Position does not enter, and a uniform change of size only scales all magnitudes, so after normalisation shifting or scaling a character does not change its timbre. Only the silhouette does.

The same notes build short sounds the same way: additive spectra, short amplitude envelopes, pitch sweeps, and percussive texture from three nested sine oscillators instead of random noise. No random number is needed, so the sound is the same on every render.

## How to build it

```js
const real = new Float32Array(33), imag = new Float32Array(33);
for (const { k, re, im } of harmonics)
  if (k !== 0 && Math.abs(k) < 33) imag[Math.abs(k)] += Math.hypot(re, im);
const e = Math.hypot(...imag);
for (let k = 1; k < 33; k++) imag[k] /= e;
osc.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
```

For a video, render the track offline (`OfflineAudioContext`) so it is exported as a file, not played live. Then a [morph](technique-harmonic-morph.md) can glide the timbre: recompute the levels from the mixed harmonics at each audio block. We have not tried this part; it follows from the mapping.

## Watch for

- **Same shape, same voice.** If a mascot changes shape, say whether its voice should change. A fixed identity wants a fixed spectrum.
- **Level.** Check loudness numerically, as in [render and inspect](technique-render-and-inspect.md), and duck under narration.
- **Not a recording.** Synthesised tones are clean. Add an envelope (attack, release) or they click.
- **Live audio in a render.** A live `AudioContext` needs a user gesture and follows the wall clock. Do not use it inside a [seekable frame](technique-seekable-frame.md) pipeline.

**Sources:** the owner's project notes on harmonic audio (private repository). The demo computes the spectra from real DFTs; we did not render audio.
