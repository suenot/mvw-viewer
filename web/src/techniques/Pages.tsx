import { For, Match, Show, Switch } from "solid-js";
import "./viz/viz.css";
import pages from "./content.generated.json";
import { Viz } from "./viz/Viz";

type Block = { t: "html"; html: string } | { t: "viz"; id: string; caption?: string } | { t: "steps"; caption?: string; steps: { title: string; text: string }[] };
type Page = { id: string; route: string; title: string; blocks: Block[] };

export default function Pages(props: { route: string }) {
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
