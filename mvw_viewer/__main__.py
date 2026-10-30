"""Local viewer for the warehouse. stdlib only. Usage: python -m mvw_viewer [--port 8765]"""
import argparse
import json
import mimetypes
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from mvw_core import iter_items, warehouse_root

STATIC = Path(__file__).parent / "static"
VIDEOS = ("original.mp4", "remake.mp4")
POSTERS = ("poster.webp", "poster.jpg", "poster.png")


def build_index(root):
    """One entry per (id); sources sharing an id (awesome list + skillry) are merged."""
    merged = {}
    for m in iter_items(root):
        d = root / m["source"] / m["id"]
        base = f"/media/{m['source']}/{m['id']}/"
        item = {k: m.get(k) for k in ("source", "id", "title", "author", "author_url", "post_url",
                                      "source_url", "category", "tags", "stats", "published", "summary", "duration")}
        item["videos"] = {n.split(".")[0]: base + n for n in VIDEOS if (d / n).exists()}
        item["poster"] = next((base + n for n in POSTERS if (d / n).exists()), None)
        p = d / "prompt.txt"
        item["prompt"] = p.read_text(encoding="utf-8") if p.exists() else None
        for f, k in (("how.md", "how"), ("style.md", "style_doc")):
            item[k] = (d / f).read_text(encoding="utf-8") if (d / f).exists() else None
        key = m["id"] if m["source"].endswith("opus55") else m["source"] + "/" + m["id"]
        cur = merged.setdefault(key, {"sources": []})
        cur["sources"].append(m["source"])
        for k, v in item.items():
            if k == "videos":
                cur.setdefault("videos", {}).update(v)
            elif v and not cur.get(k):
                cur[k] = v
    out = []
    for cur in merged.values():
        cur["source"] = " + ".join(cur.pop("sources"))
        cur.setdefault("videos", {})
        for k in ("prompt", "poster", "title", "author", "category", "how", "style_doc"):
            cur.setdefault(k, None)
        out.append(cur)
    return out


class Handler(BaseHTTPRequestHandler):
    root = warehouse_root()

    def log_message(self, *a):
        pass

    def _send_file(self, path, ctype=None):
        if not path.is_file():
            return self.send_error(404)
        size = path.stat().st_size
        ctype = ctype or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        start, end, code = 0, size - 1, 200
        rng = self.headers.get("Range")
        if rng:
            m = re.match(r"bytes=(\d*)-(\d*)", rng)
            if m:
                if m.group(1):
                    start = int(m.group(1))
                    end = int(m.group(2)) if m.group(2) else size - 1
                elif m.group(2):
                    start = max(0, size - int(m.group(2)))
                end = min(end, size - 1)
                code = 206
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(end - start + 1))
        if code == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        try:
            with open(path, "rb") as f:
                f.seek(start)
                left = end - start + 1
                while left > 0:
                    chunk = f.read(min(1 << 16, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        if path == "/api/items":
            body = json.dumps(build_index(self.root), ensure_ascii=False).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            return self.wfile.write(body)
        if path.startswith("/media/"):
            target = (self.root / path[len("/media/"):]).resolve()
            if self.root not in target.parents:
                return self.send_error(403)
            return self._send_file(target)
        if path == "/":
            path = "/index.html"
        target = (STATIC / path.lstrip("/")).resolve()
        if STATIC.resolve() not in target.parents:
            return self.send_error(403)
        self._send_file(target)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--host", default="127.0.0.1")
    a = ap.parse_args()
    print(f"warehouse: {Handler.root}\nhttp://{a.host}:{a.port}")
    ThreadingHTTPServer((a.host, a.port), Handler).serve_forever()


main()
