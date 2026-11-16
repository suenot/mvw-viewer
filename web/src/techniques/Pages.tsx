import { For, Match, Show, Switch } from "solid-js";
import "./viz/viz.css";
import pages from "./content.generated.json";
import { Viz } from "./viz/Viz";

type Block = { t: "html"; html: string } | { t: "viz"; id: string; caption?: string } | { t: "steps"; caption?: string; steps: { title: string; text: string }[] };
type Page = { id: string; route: string; title: string; blocks: Block[] };

const GROUPS: [string, string[]][] = [
  ["The pencil look", ["line-boil", "cadence-and-seed", "hatching", "construction-lines"]],
  ["The workflow", ["timing-plan", "style-contract", "render-and-inspect", "error-log", "assemble-from-pieces"]],
  ["Picture and voice", ["layered-assets", "sentence-shot", "number-readout"]],
  ["Motion engineering", ["seekable-frame", "closed-form-springs", "beat-grid", "seamless-loop", "subframe-blur", "one-shape", "independent-clocks"]],
  ["Type and print", ["kinetic-type", "mask-reveal", "misregistration"]],
  ["Direction and review", ["storyboard-first", "reference-by-link", "feedback-passes", "locked-message"]],
  ["Harmonic shapes", ["harmonic-morph", "harmonic-type", "shape-to-sound"]],
  ["3D and Blender", ["camera-curves", "tilt-shift", "blender-frames"]],
  ["Timing and importance", ["motion-defaults", "importance-budget"]],
  ["Cuts, sound and overlays", ["speed-ramp", "downbeat-cuts", "broll-treatments", "lower-third", "vertical-safe-box"]],
  ["Drawing and diagrams", ["hand-draw-on", "progressive-diagram"]],
  ["Colour, depth and access", ["oklch-gradients", "parallax-layers", "reduced-motion-tiers"]],
];
const labelOf = (id: string) => (pages as any[]).find((p) => p.id === `technique-${id}`)?.label as string;

function Menu(props: { route: string }) {
  const link = (href: string, text: string) => (
    <a href={href} aria-current={props.route === href ? "page" : undefined}
      class={`block rounded-md px-3 py-1.5 text-sm transition-colors ${props.route === href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{text}</a>
  );
  return (
    <nav aria-label="Techniques" class="space-y-4">
      {link("#/techniques", "Overview")}
      <For each={GROUPS}>{([title, ids]) => (
        <div>
          <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <For each={ids}>{(id) => link(`#/techniques/${id}`, labelOf(id))}</For>
        </div>
      )}</For>
    </nav>
  );
}

export default function Pages(props: { route: string }) {
  return (
    <Show when={props.route.startsWith("#/techniques")} fallback={<Article route={props.route} />}>
      <div class="mx-auto flex max-w-6xl gap-6 px-4">
        <aside class="sticky top-[4.5rem] hidden max-h-[calc(100vh-5.5rem)] w-56 shrink-0 self-start overflow-y-auto py-6 lg:block"><Menu route={props.route} /></aside>
        <div class="min-w-0 flex-1">
          <details class="mt-4 rounded-md border lg:hidden">
            <summary class="cursor-pointer px-3 py-2 text-sm font-medium">Techniques menu</summary>
            <div class="border-t p-2"><Menu route={props.route} /></div>
          </details>
          <Article route={props.route} />
        </div>
      </div>
    </Show>
  );
}

function Article(props: { route: string }) {
  const page = () => (pages as Page[]).find((p) => p.route === props.route);
  return (
    <Show when={page()} fallback={<p class="p-6 text-sm text-muted-foreground">Page not found. <a class="underline" href="#/techniques">Techniques</a></p>}>
      {(p) => (
        <article class={`tq tq-prose ${p().id === "motion-skills-list" ? "tq-wide" : ""}`}>
          <For each={p().blocks}>
            {(b) => (
              <Switch>
                <Match when={b.t === "html"}><div innerHTML={(b as any).html} /></Match>
                <Match when={b.t === "viz"}><Viz id={(b as any).id} caption={(b as any).caption} /></Match>
                <Match when={b.t === "steps"}>
                  <ol class="tq-steps">
                    <For each={(b as any).steps as { title: string; text: string }[]}>{(s) => <li><b>{s.title}</b><span>{s.text}</span></li>}</For>
                  </ol>
                  <Show when={(b as any).caption}><p class="tq-fcap">{(b as any).caption}</p></Show>
                </Match>
              </Switch>
            )}
          </For>
        </article>
      )}
    </Show>
  );
}
