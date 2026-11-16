---
title: "Technique: an error log that turns into checks"
label: "Error log"
order: 8
parent: "guides/motion-techniques"
summary: "Keep a short list of concrete failures and the rule each one produced, so the next scene starts stronger without a longer prompt."
---

# Technique: an error log that turns into checks

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

The last item on ProdAdvice's checklist is a list of errors ([10:14](https://www.youtube.com/watch?v=K1Mr5_7Gm3g&t=614s)). Studio Igor shows it working: when a character's hand goes behind the body while aiming upward, he adds a corrective rule to the skill ([14:14](https://www.youtube.com/watch?v=YQ01D9xGAnk&t=854s)). A mistake is paid for once and then guarded against.

```viz motion-techniques/error-log
caption: Three concrete failures and the check each produces: a label collides with the phone crop at 3.2 s (keep labels 90 px inside the safe area), hatching flips direction between frames (one angle per object, fixed seed), text flickers as the contour redraws (labels follow continuous time).
```

## How it works

Each entry has two halves:

- **What went wrong,** specific enough that someone else can find it: the thing, the symptom and the time.
- **The check it becomes,** a rule a script or an assistant can apply before it shows you anything.

Good entries name numbers and times. "Label collides with phone crop at 3.2 s" is useful; "text layout issues" is not. A vague entry cannot become a check.

## Keep it short

Do not paste an ever-growing transcript into every prompt. Cap the log at the failures that still matter, merge entries that say the same thing, and move a rule that is always true into the [style contract](technique-style-contract.md). Version the file with the project, so a revert brings back the matching rules.

## Make it run

The best rules are tested, not just read:

```js
if (label.box.right > frame.width - 90) fail("label inside safe area", label.id, time);
```

A rule that can fail loudly in the render step needs no one to remember it.

## Watch for

- **Rules that fight each other.** When two checks disagree, decide which wins and delete the other.
- **A log nobody feeds.** Add the entry in the same sitting as the fix, while the frame number is still in front of you.
- **Rules from a different format.** A check made for a map fact may not fit a character scene. Note the scope in the entry.

**Source:** ProdAdvice, [K1Mr5_7Gm3g](https://www.youtube.com/watch?v=K1Mr5_7Gm3g) at 10:14-11:41; Studio Igor, [YQ01D9xGAnk](https://www.youtube.com/watch?v=YQ01D9xGAnk) at 14:14-17:33. The three example entries are from our [HyperFrames tutorial study](hyperframes-tutorial-study.md) and are illustrations.
