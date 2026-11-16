---
title: "Technique: reference by link"
label: "Reference by link"
order: 23
parent: "guides/motion-techniques"
summary: "Give the assistant a link to a clip you like and ask for your own story in that style, instead of describing the style in words."
---

# Technique: reference by link

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The ИИ МАСТОДОНТ tutorial lists this as the first of its four tips: when you see a strong clip, give the link to the post to the model and say "do it in this style, but with my story or prompt"; the author calls it the simplest way to copy any style, and says it used to be almost impossible ([13:10](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=790s)). He shows it in the cartoon demo, where he pasted a prompt and a link to an X post, and the model went and found the media itself, which older models needed a file path for ([03:45](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=225s)). For the promo he gave references, then sent the model to look for the best videos made with the same model, "for inspiration", and it came back with a better result ([07:23](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=443s)). Several prompts in our database do the same: "Analyze [a link] and build a product promo from our own UI" ([AnnaCher](https://x.com/AnnaCher___/status/2103571098638152174)).

```viz motion-techniques/reference-by-link
caption: A link goes in; a short read-out of the style comes out (palette, type, camera, beat grid, cursor, springs); then it is applied to a new story.
```

## How it works

Style is hard to put in words and easy to point at. The model reads the clip or its post and extracts a specification: colours, fonts, camera behaviour, timing grid, how the cursor moves. Your content (words, facts, product) is separate. That is the whole contract: **their grammar of motion, your story.**

## How to build it

Ask in two steps so you can check the read-out:

1. "Read this post and write the style as a spec: palette in hex, fonts, camera moves, tempo, cursor rules, what is banned."
2. "Now make my 12 s piece about X with that spec." Keep the spec in the [style contract](technique-style-contract.md) so every scene uses it.

## Watch for

- **Copying the content.** The link supplies style only. Check that no copyrighted frames, words or music came along; see the [style gate](style-gate-and-new-styles.md).
- **A read-out you did not see.** Without step 1 you cannot tell whether the model understood the reference.
- **Taking a demo for a guarantee.** The author says a good monteur still does better; treat the result as a draft ([11:14](https://www.youtube.com/watch?v=yEpN_s9UkAE&t=674s)).

**Sources:** ИИ МАСТОДОНТ, [yEpN_s9UkAE](https://www.youtube.com/watch?v=yEpN_s9UkAE) at 03:45, 07:23 and 13:10 (transcript read by us; we have not run the prompts), and [annacher-152174](https://x.com/AnnaCher___/status/2103571098638152174) in our prompt database.
