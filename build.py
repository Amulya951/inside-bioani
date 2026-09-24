#!/usr/bin/env python3
"""
Build Inside BioAni into ONE self-contained HTML file.

    python3 build.py

- Inlines styles/*.css and every local <script src> from index.html.
- Embeds every image in assets/photos/ (jpg, jpeg, png, webp) as data URIs,
  so the published page shows real photos with no external files.
  Missing photos fall back to monogram placeholders automatically.
- Output: dist/inside-bioani.html
"""
import base64, json, mimetypes, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "dist" / "inside-bioani.html"
PHOTOS = ROOT / "assets" / "photos"
MAX_MB = 15.5

html = (ROOT / "index.html").read_text(encoding="utf-8")

def inline_css(m):
    href = m.group(1)
    if href.startswith("http"):
        return m.group(0)
    return "<style>\n" + (ROOT / href).read_text(encoding="utf-8") + "\n</style>"

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)

photos = {}
if PHOTOS.exists():
    for p in sorted(PHOTOS.iterdir()):
        if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
            photos[p.name] = "data:%s;base64,%s" % (mime, base64.b64encode(p.read_bytes()).decode())

first = [True]
def inline_js(m):
    src = m.group(1)
    code = (ROOT / src).read_text(encoding="utf-8").replace("</script", "<\\/script")
    block = "<script>\n/* " + src + " */\n" + code + "\n</script>"
    # Right after config.js, register the embedded photo map.
    if src == "data/config.js":
        block += "\n<script>IB.config.photoMode = 'embedded'; IB.embeddedPhotos = " + json.dumps(photos) + ";</script>"
    return block

html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
mb = OUT.stat().st_size / 1e6
print("Built %s  (%.2f MB, %d photos embedded)" % (OUT, mb, len(photos)))
if mb > MAX_MB:
    print("WARNING: over %.1f MB. Resize photos (e.g. 800px wide, ~150 KB each) before publishing." % MAX_MB)
    sys.exit(1)
