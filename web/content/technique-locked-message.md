---
title: "Technique: a locked message and a ban list"
label: "Locked message and bans"
order: 25
parent: "guides/motion-techniques"
summary: "Fix the exact words and their order, and list what must not appear, so the model spends its effort on motion and not on inventing copy."
---

# Technique: a locked message and a ban list

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The most precise prompt in our database does two things that cost nothing and remove most of the risk. It **locks the message**: six lines "in this exact order", with the instruction "do not soften, do not add filler slogans", and small supporting words (at most 18 characters, never full sentences). And it **bans** a list: "generic AI clichés (brains, robots, neural nets, sparkles), soft gradients, bouncy cartoon easing, particle explosions, stock futuristic HUD, long paragraphs, narrator essay energy, Canva-deck energy, extra slogans, purple/blue neon, glassmorphism" ([techhalla](https://x.com/techhalla/status/2103411244468498547)). Other prompts ban the same family: "crossfades, gradients on UI, particles, glows, bouncy easing, dead beats, anything that feels like a template" ([0xnicc0](https://x.com/0xnicc0/status/2107217691505516612)).

```viz motion-techniques/locked-message
caption: Left: six lines of text in a fixed order, the only words allowed on screen. Right: a ban list, each item struck through.
```

## How it works

A model left alone adds slogans and decoration. A locked message takes the writing away from it, so all its effort goes into timing, type and camera. A ban list does the opposite job: it removes the generic defaults that make a piece look made by a template. Together with strict numbers (a palette of three hex values, three named fonts, tracking values) they leave little room for a generic result.

## How to build it

- Write the lines first and number them; each line gets one beat on the [beat grid](technique-beat-grid.md).
- Put them in the [style contract](technique-style-contract.md) with palette and fonts as values.
- Add the ban list as a check in the [error log](technique-error-log.md): after each render, look for anything on the list.
- Keep it short; the prompt's list has about a dozen items, not fifty.

## Watch for

- **A message locked too early.** Lock it after you are sure of the story; changing it later is a rewrite.
- **Bans without a reason.** A list the model does not understand gets worked around. Say what to do instead (for example, "springs, tiny overshoot at most").
- **Copy you did not write.** A locked line you did not write still needs a source and a check; see [auditing a video](auditing-a-video.md).

**Sources:** [techhalla-498547](https://x.com/techhalla/status/2103411244468498547), [0xnicc0-516612](https://x.com/0xnicc0/status/2107217691505516612) in our prompt database. We have read the prompts, not run them.
