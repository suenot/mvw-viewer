import { ErrorBoundary, Suspense, lazy } from "solid-js";
import { registry } from "./registry";

const lazyViz = Object.fromEntries(Object.entries(registry).map(([id, e]) => [id, lazy(e.load)]));
const ratio = ([w, h]: [number, number]) => `${w} / ${h}`;

export function Viz(props: { id: string; caption?: string }) {
  const entry = registry[props.id];
  if (!entry) return <p class="viz-failed">Unknown visualization: {props.id}</p>;
  const Component = lazyViz[props.id];
  const caption = props.caption ?? entry.title;
  const replay = (e: MouseEvent & { currentTarget: HTMLButtonElement }) =>
    e.currentTarget.closest("figure")?.dispatchEvent(new CustomEvent("viz:replay"));
  return (
    <figure class="viz" data-viz={props.id} style={{ "--viz-wide-ratio": ratio(entry.size.wide), "--viz-narrow-ratio": ratio(entry.size.narrow) }}>
      <div class="viz-frame" role="img" aria-label={entry.summary}>
        <div class="viz-canvas">
          <ErrorBoundary fallback={<p class="viz-failed">This visualization could not be drawn. The text around it has the same facts.</p>}>
            <Suspense fallback={<div class="viz-loading" aria-hidden="true" />}>
              <Component size={entry.size} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <figcaption class="viz-caption">
        <span>{caption}</span>
        <button type="button" class="viz-replay" onClick={replay} aria-label={`Replay the animation: ${caption}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
          <span>Replay</span>
        </button>
      </figcaption>
    </figure>
  );
}
