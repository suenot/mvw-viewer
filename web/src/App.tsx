import { For, Show, Suspense, createEffect, createMemo, createResource, createSignal, lazy, onCleanup, onMount } from "solid-js";
import { loadItems, loadText, url } from "./lib";

const Pages = lazy(() => import("./techniques/Pages")); // techniques + skills pages: own chunk, not loaded with the catalog

const WORKSPACE = "https://github.com/suenot/motion-videos-warehouse"; // root repo; every source repo is a git submodule of it

const ALL = "__all__";
const PAGE = 48; // cards per step; more load as the page end comes near
const sources = (i: any): string[] => i.source.split(" + ");
// The lower-cased text a search looks in, built once per item (the prompts are about 600 KB in all).
const hay = new WeakMap<object, string>();
const haystack = (i: any) => { let h = hay.get(i); if (h === undefined) { h = [i.title, i.author, i.prompt, i.id].join(" ").toLowerCase(); hay.set(i, h); } return h; };

const field = "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";
const btn = "inline-flex h-8 items-center rounded-md border border-input bg-background px-3 text-sm hover:bg-accent";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

// A card is a lazy poster image. The video element exists only while the pointer is over the card, so a page of
// 48 cards makes no video requests and only the posters near the viewport are fetched.
function Card(props: { item: any; onOpen: (i: any) => void }) {
  const src = () => props.item.videos.original;
  const [live, setLive] = createSignal(false);
  let vid: HTMLVideoElement | undefined;
  return (
    <button
      onClick={() => props.onOpen(props.item)}
      class="group overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-ring"
      style={{ "content-visibility": "auto", "contain-intrinsic-size": "auto 230px" }}
      onMouseEnter={() => { if (src()) { setLive(true); queueMicrotask(() => vid?.play().catch(() => {})); } }}
      onMouseLeave={() => setLive(false)}
    >
      <div class="relative aspect-video w-full bg-black">
        <Show when={props.item.poster}>
          <img src={url(props.item.poster)} alt="" loading="lazy" decoding="async" class="h-full w-full object-cover" />
        </Show>
        <Show when={live()}>
          <video ref={vid} src={url(src())} class="absolute inset-0 h-full w-full bg-black object-cover" muted loop playsinline />
        </Show>
      </div>
      <div class="p-3">
        <div class="truncate text-sm font-medium">{props.item.title || props.item.id}</div>
        <div class="truncate text-xs text-muted-foreground">
          {sources(props.item).join(" · ")}{props.item.author ? ` · ${props.item.author}` : ""}
        </div>
      </div>
    </button>
  );
}

// Long markdown docs live outside the index; fetched only when the section is opened.
function LazyDoc(props: { title: string; href: string }) {
  const [on, setOn] = createSignal(false);
  const [text] = createResource(on, () => loadText(props.href));
  return (
    <details onToggle={(e) => e.currentTarget.open && setOn(true)}>
      <summary class="cursor-pointer text-sm">{props.title}</summary>
      <pre class="mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
        {text.error ? "failed to load" : text() ?? "Loading…"}
      </pre>
    </details>
  );
}

function Details(props: { item: any }) {
  const link = (href?: string, text?: string) => href && <a class="underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{text}</a>;
  return (
    <div class="mt-2 space-y-4">
      <p class="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
        <span>{props.item.source}</span>{props.item.category && <span>{props.item.category}</span>}
        {props.item.author && (props.item.author_url ? link(props.item.author_url, props.item.author) : <span>{props.item.author}</span>)}
        {link(props.item.post_url, "original post")}{link(props.item.source_url, "source")}
      </p>
      <Show when={props.item.summary}><p class="text-sm">{props.item.summary}</p></Show>
      <div class="flex flex-wrap gap-3">
        <For each={Object.entries(props.item.videos) as [string, string][]} fallback={<i class="text-sm text-muted-foreground">no video</i>}>
          {([name, u]) => (
            <figure class="min-w-[260px] flex-1">
              <video src={url(u)} controls loop playsinline preload={name === "original" ? "auto" : "metadata"} autoplay={name === "original"} muted={name === "original"} class="w-full rounded-md bg-black" />
              <figcaption class="mt-1 text-xs text-muted-foreground">{name}</figcaption>
            </figure>
          )}
        </For>
      </div>
      <Show when={props.item.prompt}>
        <div>
          <button class={btn} onClick={() => navigator.clipboard.writeText(props.item.prompt)}>Copy prompt</button>
          <pre class="mt-2 max-h-[30vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{props.item.prompt}</pre>
        </div>
      </Show>
      <Show when={props.item.how}><LazyDoc title="How it was made (full page)" href={props.item.how} /></Show>
      <Show when={props.item.style_doc}><LazyDoc title="Style recipe" href={props.item.style_doc} /></Show>
    </div>
  );
}

// Loads the next step when the end of the list nears the viewport; the button stays as a fallback.
function More(props: { onMore: () => void; left: number }) {
  let el!: HTMLDivElement;
  onMount(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && props.onMore(), { rootMargin: "800px" });
    io.observe(el);
    onCleanup(() => io.disconnect());
  });
  return <div ref={el} class="flex justify-center pb-8"><button class={btn} onClick={props.onMore}>Show more ({props.left})</button></div>;
}

const TABS = [["#/", "Videos"], ["#/techniques", "Techniques"], ["#/skills", "Skills"], ["#/ai", "For AI"]] as const;

function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, "/") || "/";
  const [route, setRoute] = createSignal(read());
  const on = () => { setRoute(read()); window.scrollTo(0, 0); };
  window.addEventListener("hashchange", on);
  window.addEventListener("popstate", on);
  onCleanup(() => { window.removeEventListener("hashchange", on); window.removeEventListener("popstate", on); });
  return route;
}

export default function App() {
  const route = useRoute();
  const videos = () => route() === "/";
  const tab = (href: string) => (href === "#/" ? videos() : route() === href.slice(1) || route().startsWith(href.slice(1) + "/"));
  const [data, { refetch }] = createResource<any[]>(loadItems);
  const items = () => (data.error ? [] : data() ?? []); // reading data() of a failed resource throws
  const [q, setQ] = createSignal(""); // what the search box shows
  const [qd, setQd] = createSignal(""); // what filters, one beat later, so typing stays smooth
  let qTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(qTimer));
  createEffect(() => { const v = q(); clearTimeout(qTimer); qTimer = setTimeout(() => setQd(v), 150); });
  const [src, setSrc] = createSignal(ALL);
  const [cat, setCat] = createSignal(ALL);
  const [withPrompt, setWithPrompt] = createSignal(false);
  const [shown, setShown] = createSignal(PAGE);
  const [open, setOpen] = createSignal<any>(null);
  let dlg!: HTMLDialogElement;

  createEffect(() => { qd(); src(); cat(); withPrompt(); setShown(PAGE); });
  createEffect(() => { if (open()) { if (!dlg.open) dlg.showModal(); } else if (dlg.open) dlg.close(); });

  const srcOptions = createMemo(() => [...new Set(items().flatMap(sources))].sort());
  const catOptions = createMemo(() => [...new Set(items().map((i) => i.category).filter(Boolean))].sort());
  const list = createMemo(() => {
    const t = qd().trim().toLowerCase();
    return items().filter((i) =>
      (src() === ALL || sources(i).includes(src())) && (cat() === ALL || i.category === cat()) && (!withPrompt() || i.prompt) &&
      (!t || haystack(i).includes(t)));
  });

  return (
    <div class="min-h-screen">
      <header class="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 class="mr-2 whitespace-nowrap text-base font-semibold tracking-tight">Production Warehouse</h1>
        <nav class="flex gap-1" aria-label="Sections">
          <For each={TABS}>{([href, label]) => (
            <a href={href} aria-current={tab(href) ? "page" : undefined}
              class={`rounded-md px-3 py-1.5 text-sm transition-colors ${tab(href) ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{label}</a>
          )}</For>
        </nav>
        <Show when={videos()}><>
        <input
          value={q()} onInput={(e) => setQ(e.currentTarget.value)} placeholder="Search title, author, prompt…"
          class={`${field} min-w-[200px] flex-1`}
        />
        <select class={`${field} select min-w-[10rem]`} value={src()} onChange={(e) => setSrc(e.currentTarget.value)}>
          <option value={ALL}>All sources</option>
          <For each={srcOptions()}>{(s) => <option value={s}>{s}</option>}</For>
        </select>
        <select class={`${field} select min-w-[10rem]`} value={cat()} onChange={(e) => setCat(e.currentTarget.value)}>
          <option value={ALL}>All categories</option>
          <For each={catOptions()}>{(s) => <option value={s}>{s}</option>}</For>
        </select>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" class="h-4 w-4 accent-primary" checked={withPrompt()} onChange={(e) => setWithPrompt(e.currentTarget.checked)} />with prompt
        </label>
        <span class="text-sm text-muted-foreground">{list().length} / {items().length}</span>
        </></Show>
        <a href={WORKSPACE} target="_blank" rel="noreferrer" title="Source: motion-videos-warehouse (all repos as submodules)" aria-label="GitHub"
          class="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <GithubIcon />
        </a>
      </header>
      <Show when={!videos()}><Suspense fallback={<p class="p-6 text-sm text-muted-foreground">Loading…</p>}><Pages route={"#" + route()} /></Suspense></Show>
      <Show when={videos()}><>
      <Show when={data.loading && !items().length}>
        <div class="boot-grid" aria-busy="true" aria-label="Loading the catalog"><For each={Array.from({ length: 12 })}>{() => <i />}</For></div>
      </Show>
      <Show when={data.error}>
        <div class="p-6 text-sm" role="alert">
          <p class="mb-3">The catalog did not load. Check the connection and try again.</p>
          <button class={btn} onClick={() => refetch()}>Try again</button>
        </div>
      </Show>
      <main class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 p-4">
        <For each={list().slice(0, shown())}>{(i) => <Card item={i} onOpen={setOpen} />}</For>
      </main>
      <Show when={shown() < list().length}>
        <More onMore={() => setShown((n) => n + PAGE)} left={list().length - shown()} />
      </Show>
      </>
      </Show>
      <dialog
        ref={dlg} onClose={() => setOpen(null)}
        onClick={(e) => e.target === dlg && setOpen(null)}
        class="m-auto max-h-[92vh] w-[min(1100px,95vw)] overflow-y-auto rounded-lg border bg-background p-0 text-foreground shadow-lg backdrop:bg-black/70"
      >
        <Show when={open()} keyed>
          {(item) => (
            <div class="relative p-5">
              <h2 class="pr-8 text-lg font-semibold">{item.title || item.id}</h2>
              <button class="absolute right-4 top-4 opacity-70 hover:opacity-100" aria-label="Close" onClick={() => setOpen(null)}>✕</button>
              <Details item={item} />
            </div>
          )}
        </Show>
      </dialog>
    </div>
  );
}
