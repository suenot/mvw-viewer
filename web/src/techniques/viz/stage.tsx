import { createContext, onCleanup, onMount, useContext, type JSX } from "solid-js";
import { MotionEngine } from "./engine";
import type { VizSize } from "./types";

// <VizStage> owns the timeline of one visualization: builds every animation paused at zero, plays when the
// figure is at least a third in view, pauses off screen, rebuilds on "viz:replay". With
// prefers-reduced-motion it builds nothing, so the resting (final) state is shown.

export const REPLAY_EVENT = "viz:replay";
const SizeCtx = createContext<VizSize>();

export function VizStage(props: { size: VizSize; children: JSX.Element }) {
  let root!: HTMLDivElement;
  onMount(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || typeof Element.prototype.animate !== "function") return;
    const figure = root.closest("figure");
    const engine = new MotionEngine(root);
    try { engine.build(); } catch { engine.destroy(); return; }
    figure?.setAttribute("data-viz-motion", "on");
    let started = false, visible = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        visible = e.isIntersecting;
        if (!e.isIntersecting) engine.pause();
        else if (started || e.intersectionRatio >= 0.3) { started = true; engine.play(); }
      }
    }, { threshold: [0, 0.3, 0.6] });
    io.observe(root);
    const replay = () => { engine.build(); started = true; if (visible) engine.play(); };
    figure?.addEventListener(REPLAY_EVENT, replay);
    onCleanup(() => { io.disconnect(); figure?.removeEventListener(REPLAY_EVENT, replay); figure?.removeAttribute("data-viz-motion"); engine.destroy(); });
  });
  return (
    <SizeCtx.Provider value={props.size}>
      <div ref={root} class="viz-stage">{props.children}</div>
    </SizeCtx.Provider>
  );
}

/** Two drawings of one visualization: `wide` for a column of 520 px and more, `narrow` below (CSS container query picks). */
export function VizLayouts(props: { wide: (w: number, h: number) => JSX.Element; narrow: (w: number, h: number) => JSX.Element }) {
  const size = useContext(SizeCtx)!;
  return (
    <>
      <svg class="viz-svg viz-wide" viewBox={`0 0 ${size.wide[0]} ${size.wide[1]}`} aria-hidden="true" focusable="false">{props.wide(size.wide[0], size.wide[1])}</svg>
      <svg class="viz-svg viz-narrow" viewBox={`0 0 ${size.narrow[0]} ${size.narrow[1]}`} aria-hidden="true" focusable="false">{props.narrow(size.narrow[0], size.narrow[1])}</svg>
    </>
  );
}
