---
title: "Technique: a camera that is a curve of time"
label: "Camera curves"
order: 30
parent: "guides/motion-techniques"
summary: "Give a 3D camera a few channels, key each one, and join the keys with monotone Hermite curves: smooth, no overshoot, flat on holds, and a pure function of time."
---

# Technique: a camera that is a curve of time

[Motion techniques](motion-techniques.md) · Reviewed November 16, 2026

Our own Tabletop Miniature style (approved on October 1, 2026) is one small 3D model on a dark table, rendered in real time with Three.js and exported through HyperFrames. There are no cuts: one orbiting camera flies from station to station. The camera is a pure function of time, built from keyframed channels.

```viz motion-techniques/camera-curves
caption: One camera channel, the azimuth, keyed at four stations with two holds. Dashed: linear keys (corners). Orange: a Catmull-Rom spline (dips below the first key, rises above the second). Blue: monotone Hermite. On the right the monotone curve drives the camera around the model.
```

## How it works

The rig has four numbers: a target point, an azimuth (angle around the model), an elevation and a distance. Every channel is a list of keys joined by curves; the style also keys its post-processing values (blur band, blur radius, depth aperture) in the same table. At time `t` the renderer reads each channel and places the camera. Nothing else moves it.

The choice of curve matters. A **linear** join has a corner at every key: the camera starts and stops abruptly. A general **spline** is smooth but can overshoot: next to a hold it backs up before moving, or swings past the station. A **monotone cubic Hermite** curve (Fritsch and Carlson) picks its tangents so that the curve never leaves the range of the two keys around it, and has a zero slope on a hold ([Wikipedia: monotone cubic interpolation](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation)). A hold in the keys is a real hold in the picture.

## How to build it

```js
function monotone(xs, ys) {                      // Fritsch-Carlson tangents + cubic Hermite
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const m = [d[0], ...d.slice(1).map((v, i) => (d[i] * v <= 0 ? 0 : (d[i] + v) / 2)), d.at(-1)];
  d.forEach((di, i) => {
    if (di === 0) { m[i] = m[i + 1] = 0; return; }
    const a = m[i] / di, b = m[i + 1] / di, s = a * a + b * b;
    if (s > 9) { m[i] = (3 / Math.sqrt(s)) * a * di; m[i + 1] = (3 / Math.sqrt(s)) * b * di; }
  });
  return (x) => hermite(xs, ys, m, x);           // standard cubic Hermite basis on the segment
}
const az = monotone(T, AZ), el = monotone(T, EL), dist = monotone(T, DIST);
const camera = (t) => placeOnSphere(target(t), az(t), el(t), dist(t));   // the only place the camera moves
```

Key the angle as an unwrapped number (350 degrees then 380, not 350 then 20), or the camera spins the long way round. Render `camera(frame / fps)` for every frame.

## Watch for

- **Sight lines at every key.** The style page lists it as a trap: a tall prop between the camera path and a station hides it. Check the view at each key, not only the model.
- **Things with a front.** Props with a front and a back must face the side the camera passes; check from the camera azimuth.
- **Anchored labels.** Tags fixed in 3D can land under the headline at some angles; clamp their screen position.
- **Glare.** A bright surface seen top-down can look milky: lower exposure at those keys.
- **One clock.** Overlays on the page read the same `t`, so they stay with the camera; see [seekable frame](technique-seekable-frame.md).

**Sources:** our Tabletop Miniature style page (built with Three.js r181 and HyperFrames, one video made from it); the curve is the standard monotone cubic interpolation. The demo draws all three curves from the same keys. The code above is a sketch we have not run.
