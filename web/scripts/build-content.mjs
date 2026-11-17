// Renders content/*.md (techniques hub, 12 technique articles, skills list) to src/techniques/content.generated.json.
// Output per page: { id, title, label, order, summary, blocks: [{t:"html",html} | {t:"viz",id,caption} | {t:"steps",caption,steps}] }.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const dir = new URL("../content/", import.meta.url);
const out = new URL("../src/techniques/content.generated.json", import.meta.url);

const route = (file) => {
  if (file === "motion-techniques.md") return "#/techniques";
  if (file === "motion-skills-list.md") return "#/skills";
  if (file === "ai-access.md") return "#/ai";
  const m = file.match(/^technique-(.+)\.md$/);
  return m ? `#/techniques/${m[1]}` : null;
};

function fixLinks(html) {
  html = html.replace(/<table>/g, '<div class="tq-tablewrap"><table>').replace(/<\/table>/g, "</table></div>");
  return html.replace(/<a href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (all, href, rest, text) => {
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noreferrer"${rest}>${text}</a>`;
    const [file, hash] = href.split("#");
    const to = route(file);
    if (to) return `<a href="${to}"${rest}>${text}</a>`;
    return `<span class="dead">${text}</span>`; // a study that lives only in the internal docs site
  });
}

function parseFence(body) {
  const t = body.trim();
  if (t.startsWith("{")) return JSON.parse(t);
  const o = {};
  for (const line of t.split("\n")) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) o[m[1]] = m[2]; }
  return o;
}

const SITE = "https://production-warehouse.suenot.com";
const pages = [];
const plain = []; // the same pages as markdown, for AI clients (techniques.json and the MCP server)
for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
  const raw = readFileSync(new URL(file, dir), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  for (const line of fm[1].split("\n")) { const m = line.match(/^(\w+):\s*"?(.*?)"?$/); if (m) meta[m[1]] = m[2]; }
  const md = raw.slice(fm[0].length);
  const blocks = [];
  let last = 0;
  const push = (text) => { if (text.trim()) blocks.push({ t: "html", html: fixLinks(marked.parse(text)) }); };
  for (const m of md.matchAll(/```viz ([^\n]+)\n([\s\S]*?)\n```/g)) {
    push(md.slice(last, m.index));
    last = m.index + m[0].length;
    const id = m[1].trim();
    const p = parseFence(m[2]);
    if (id === "kit/steps") blocks.push({ t: "steps", caption: p.caption, steps: p.steps });
    else blocks.push({ t: "viz", id, caption: p.caption });
  }
  push(md.slice(last));
  const markdown = md
    .replace(/```viz ([^\n]+)\n([\s\S]*?)\n```/g, (all, id, body) => { const c = parseFence(body).caption; return c ? `[Figure, animated on the site: ${c}]` : ""; })
    .replace(/\]\(([^)#]*\.md)(#[^)]*)?\)/g, (all, f) => (route(f) ? `](${SITE}/${route(f)})` : "]()"))
    .trim();
  plain.push({ id: file.replace(/\.md$/, ""), route: route(file), title: meta.title, label: meta.label, order: Number(meta.order), summary: meta.summary, markdown });
  pages.push({ id: file.replace(/\.md$/, ""), route: route(file), title: meta.title, label: meta.label, order: Number(meta.order), summary: meta.summary, blocks });
}
writeFileSync(out, JSON.stringify(pages));

// Published next to the site: /techniques.json (markdown of every page) and /llms.txt (what an AI should fetch).
const pub = new URL("../public/", import.meta.url);
mkdirSync(pub, { recursive: true });
writeFileSync(new URL("techniques.json", pub), JSON.stringify(plain));
const lines = [...plain].sort((a, b) => a.order - b.order).map((p) => `- [${p.title}](${SITE}/${p.route}): ${p.summary}`);
writeFileSync(new URL("llms.txt", pub), `# Production Warehouse

> A catalog of about 800 motion-design videos with the prompts that made them, and ${plain.filter((p) => p.id.startsWith("technique-")).length} written motion-design techniques with worked demos. Public, read-only, no sign-in.

## For AI clients

- MCP server (Streamable HTTP, read-only): ${SITE}/mcp . Tools: search_videos, get_video, get_video_doc, list_filters, list_techniques, get_technique, search_techniques.
- Video catalog as JSON: ${SITE}/items.json (one object per video: title, author, category, tags, prompt, links to videos and poster).
- Techniques and skills as JSON with markdown bodies: ${SITE}/techniques.json
- Local MCP over stdio: the mcp/ folder of https://github.com/suenot/mvw-viewer

## Pages

${lines.join("\n")}
`);
console.log(`content: ${pages.length} pages, ${pages.reduce((n, p) => n + p.blocks.filter((b) => b.t !== "html").length, 0)} figures`);
