import { useEffect, useMemo, useState } from "react";
import { Copy, Search } from "lucide-react";
import { Button, Checkbox, Dialog, DialogContent, Select } from "./components/ui";
import { loadItems, url } from "./lib";

const ALL = "__all__";
const PAGE = 120;
const sources = (i) => i.source.split(" + ");

function Card({ item, onOpen }) {
  const src = item.videos.original;
  return (
    <button
      onClick={() => onOpen(item)}
      className="group overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-ring"
      onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); if (v && src) { if (!v.src) v.src = url(src); v.play().catch(() => {}); } }}
      onMouseLeave={(e) => e.currentTarget.querySelector("video")?.pause()}
    >
      <video className="aspect-video w-full bg-black object-cover" poster={url(item.poster)} muted loop playsInline preload="none" />
      <div className="p-3">
        <div className="truncate text-sm font-medium">{item.title || item.id}</div>
        <div className="truncate text-xs text-muted-foreground">
          {sources(item).join(" · ")}{item.author ? ` · ${item.author}` : ""}
        </div>
      </div>
    </button>
  );
}

function Details({ item }) {
  const link = (href, text) => href && <a className="underline underline-offset-2" href={href} target="_blank" rel="noreferrer">{text}</a>;
  return (
    <div className="mt-2 space-y-4">
      <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
        <span>{item.source}</span>{item.category && <span>{item.category}</span>}
        {item.author && (item.author_url ? link(item.author_url, item.author) : <span>{item.author}</span>)}
        {link(item.post_url, "original post")}{link(item.source_url, "source")}
      </p>
      {item.summary && <p className="text-sm">{item.summary}</p>}
      <div className="flex flex-wrap gap-3">
        {Object.entries(item.videos).map(([name, u]) => (
          <figure key={name} className="min-w-[260px] flex-1">
            <video src={url(u)} controls loop playsInline autoPlay={name === "original"} muted={name === "original"} className="w-full rounded-md bg-black" />
            <figcaption className="mt-1 text-xs text-muted-foreground">{name}</figcaption>
          </figure>
        ))}
        {!Object.keys(item.videos).length && <i className="text-sm text-muted-foreground">no video</i>}
      </div>
      {item.prompt && (
        <div>
          <Button onClick={() => navigator.clipboard.writeText(item.prompt)}><Copy className="mr-2 h-3.5 w-3.5" />Copy prompt</Button>
          <pre className="mt-2 max-h-[30vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{item.prompt}</pre>
        </div>
      )}
      {item.how && <details><summary className="cursor-pointer text-sm">How it was made (full page)</summary><pre className="mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{item.how}</pre></details>}
      {item.style_doc && <details><summary className="cursor-pointer text-sm">Style recipe</summary><pre className="mt-2 max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{item.style_doc}</pre></details>}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [src, setSrc] = useState(ALL);
  const [cat, setCat] = useState(ALL);
  const [withPrompt, setWithPrompt] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(null);

  useEffect(() => { loadItems().then(setItems).catch((e) => setError(String(e))); }, []);
  useEffect(() => setShown(PAGE), [q, src, cat, withPrompt]);

  const srcOptions = useMemo(() => [...new Set(items.flatMap(sources))].sort(), [items]);
  const catOptions = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(), [items]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((i) =>
      (src === ALL || sources(i).includes(src)) && (cat === ALL || i.category === cat) && (!withPrompt || i.prompt) &&
      (!t || [i.title, i.author, i.prompt, i.id].join(" ").toLowerCase().includes(t)));
  }, [items, q, src, cat, withPrompt]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="mr-2 whitespace-nowrap text-base font-semibold tracking-tight">Production Warehouse</h1>
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, author, prompt…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Select value={src} onValueChange={setSrc} placeholder="Source" options={[{ value: ALL, label: "All sources" }, ...srcOptions.map((s) => ({ value: s, label: s }))]} />
        <Select value={cat} onValueChange={setCat} placeholder="Category" options={[{ value: ALL, label: "All categories" }, ...catOptions.map((s) => ({ value: s, label: s }))]} />
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={withPrompt} onCheckedChange={(v) => setWithPrompt(v === true)} />with prompt</label>
        <span className="text-sm text-muted-foreground">{list.length} / {items.length}</span>
      </header>
      {error && <p className="p-4 text-sm text-red-500">{error}</p>}
      <main className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 p-4">
        {list.slice(0, shown).map((i) => <Card key={i.source + i.id} item={i} onOpen={setOpen} />)}
      </main>
      {shown < list.length && <div className="flex justify-center pb-8"><Button onClick={() => setShown((n) => n + PAGE)}>Show more ({list.length - shown})</Button></div>}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        {open && <DialogContent title={open.title || open.id}><Details item={open} /></DialogContent>}
      </Dialog>
    </div>
  );
}
