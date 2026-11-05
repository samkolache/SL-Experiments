# How to build the Figma → code build report

This is how `products-pricing-card-report.html` was made. Follow these steps to make the same report for any future Figma-to-code task.

The result is **one self-contained HTML file**. All images are embedded as base64 and there are no external assets, so you can email it, attach it to a PR, or open it straight from Finder.

---

## 1. What the report contains (in this order)

| # | Section | What goes in it |
|---|---------|-----------------|
| — | **Hero + summary tiles** | Title, one-line summary, 4–5 stat tiles (layouts built, checklist score, new tokens, build errors, token estimate) |
| — | **Sticky nav** | Anchor links to every section below |
| 1 | **📝 Your prompt** | The user's original prompt, **verbatim**, in a dark `<pre>` block (HTML-escaped) |
| 2 | **✅ Did it do what you asked?** | Table: each DO / DON'T / requirement from the prompt, then status (✅ Done / ⚠️ Partly / ❌ Not done), then what was done |
| 3 | **🖼️ Before / Figma / After** | Side-by-side screenshots per breakpoint with colored labels (grey = Before, purple = Figma, green = After). Click to zoom. Less important widths go in a collapsed `<details>` |
| 4 | **📐 How it responds** | Table: width range, then layout description, then Figma node IDs covered |
| 5 | **🎨 Design system: reused vs. new** | Table with colored labels: **Exos** (green) = from `@exos/exos-theme-external`, **Existing code** (blue) = already in the project, **New** (orange) = had to be created (new colors, sizes, breakpoints) |
| 6 | **⚠️ Gaps & assumptions** | Bullet list: where the result differs from the mocks and why, plus judgment calls |
| 7 | **🔌 Figma MCP tools used** | Table: tool, call count, what it was used for. Add a callout box if any tool failed |
| 8 | **🔢 Token usage** | Approximate breakdown (agents can't see exact counts, so label it as an estimate) |
| 9 | **📁 Files changed** | Table: file, then change |

---

## 2. Capture the screenshots

### 2a. Figma targets (via the local Figma MCP)

Start a session and save the session ID:

```bash
SID=$(curl -s -i -X POST http://127.0.0.1:3845/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}' \
  | grep -i '^mcp-session-id' | awk '{print $2}' | tr -d '\r')

curl -s -X POST http://127.0.0.1:3845/mcp -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' -H "mcp-session-id: $SID" \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' > /dev/null
```

Helper script `mcp.sh`:

```bash
#!/bin/bash
# usage: mcp.sh <id> <method> <params-json>
SID=<paste session id>
curl -s --max-time 90 -X POST http://127.0.0.1:3845/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -H "mcp-session-id: $SID" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":$1,\"method\":\"$2\",\"params\":$3}" | sed -n 's/^data: //p'
```

Screenshot a node and save it as a PNG:

```bash
./mcp.sh 10 tools/call '{"name":"get_screenshot","arguments":{"nodeId":"683:8698"}}' \
  | python3 -c "import json,sys,base64;d=json.load(sys.stdin)
for c in d['result']['content']:
  if c['type']=='image': open('fig-683-8698.png','wb').write(base64.b64decode(c['data']))"
```

**Tips**
- Screenshot the **card node**, not the whole frame (the frame includes the navbar and sidebar). Find it with `get_metadata` on the frame.
- Figma shrinks tall nodes. A 2516px-tall mobile card came back only 161px wide. For mobile, screenshot **child nodes** instead (the banner, the first product block) to get a usable resolution.
- `get_design_context` may hang. Always pass `--max-time` to curl. If it hangs, start a **new session**, because the stuck request blocks the old one.

### 2b. App screenshots (Before and After)

Run the app with `npx ng serve --port 4311`. The URL includes the base href:
`http://localhost:4311/enterpriseportal/exos-prototypes/sam/product-and-fees`

**Desktop and tablet (≥ 768px):** headless Chrome directly:

```bash
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$C" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=10000 \
  --window-size=1270,1100 --screenshot=after-1270.png "$URL"
```

**Mobile (< 768px): don't use `--window-size=402`.** Headless Chrome won't make its window narrower than about 500px, so the page lays out wider and gets clipped. Load the page in an iframe of the exact width instead, and capture at 2× for sharpness:

```bash
# frame-402.html
<!DOCTYPE html><html><body style="margin:0">
<iframe src="$URL" style="border:0;width:402px;height:1600px;display:block;margin:0 auto"></iframe>
</body></html>
```

```bash
"$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=15000 --window-size=800,1600 --screenshot=raw.png "file://$PWD/frame-402.html"
# sips crops from the CENTER, which is why the iframe is centered (margin:0 auto)
sips -c 3200 804 raw.png --out after-402.png      # height = 1600*2, width = 402*2
```

**Before shots:** temporarily swap the old component back in (uncomment the old tag and import, comment out the new ones). **Wait for the dev server to finish rebuilding** before shooting, or you'll capture a blank page or a redirect:

```bash
n0=$(grep -c "Page reload sent" serve.log)
# ...edit files...
until [ $(grep -c "Page reload sent" serve.log) -gt $n0 ]; do sleep 2; done; sleep 4
# ...shoot, then restore the files from a backup copy
```

### 2c. Image quality rules

| Image | Format | Size |
|-------|--------|------|
| Desktop / tablet | JPEG, quality 70 | Shrink so the longest side is 1400px: `sips -s format jpeg -s formatOptions 70 -Z 1400 in.png --out out.jpg` |
| Mobile | **PNG, 2×, no shrinking** | Display at the real CSS width (`max-width:402px`) so it stays sharp |

Never shrink a tall mobile screenshot to fit a box. That's what made the first version blurry.

---

## 3. Generate the HTML

Use a small Python script that base64-embeds each image into one f-string template. Note: inside a Python f-string, CSS braces must be doubled: `{{ }}`.

```python
import base64, html as H

def jpg(p): return 'data:image/jpeg;base64,' + base64.b64encode(open(p,'rb').read()).decode()
def png(p): return 'data:image/png;base64,'  + base64.b64encode(open(p,'rb').read()).decode()

def shot(src, caption, tag, max_w=None):
    st = f' style="max-width:{max_w}px"' if max_w else ''
    return (f'<figure{st}><span class="tag tag-{tag.lower()}">{tag}</span>'
            f'<img src="{src}" alt="{H.escape(caption)}" loading="lazy">'
            f'<figcaption>{H.escape(caption)}</figcaption></figure>')

prompt = H.escape(open('prompt.txt').read())   # save the user's prompt verbatim first

EXOS  = '<span class="chip exos">Exos</span>'
EXIST = '<span class="chip exist">Existing code</span>'
NEW   = '<span class="chip new">New</span>'
OK    = '<span class="st ok">✅ Done</span>'
PART  = '<span class="st part">⚠️ Partly</span>'
```

### Page skeleton

```html
<header class="hero"><div class="wrap">
  <h1>…title…</h1><p class="sub">…one-line summary…</p>
  <div class="tiles"><div class="tile"><b>3 layouts</b><span>cover all 8 mocks</span></div> …</div>
</div></header>

<nav><div class="wrap"><a href="#prompt">Your prompt</a> <a href="#checklist">Checklist</a> …</div></nav>

<main class="wrap">
  <section id="prompt"><h2>📝 Your prompt</h2><pre class="prompt">{prompt}</pre></section>
  <section id="checklist">…table…</section>
  <section id="screens">
    <h3>Desktop: 1270px</h3>
    <div class="cmp">{shot(before)} {shot(figma)} {shot(after)}</div>
    <details><summary>More widths</summary>…</details>
  </section>
  …other sections…
</main>

<div id="lb" onclick="this.style.display='none'"><img alt=""></div>  <!-- lightbox -->
```

### CSS

```css
:root{--ink:#05152a;--ink2:#304258;--mute:#687885;--line:#d8dfe6;--bg:#f5f8fc;--blue:#066dce;--green:#3F9252;--amber:#b45309}
body{margin:0;font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg)}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
header.hero{background:linear-gradient(120deg,#e4f2fe,#fdf3e8);padding:40px 24px 28px;border-bottom:1px solid var(--line)}
nav{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--line)}
nav a{text-decoration:none;color:var(--ink2);font-weight:600;font-size:14px;padding:6px 12px;border-radius:999px}
nav a:hover{background:#eff7fe;color:var(--blue)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-top:22px}
.tile{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.tile b{display:block;font-size:24px}
section{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px 26px;margin:22px 0;scroll-margin-top:64px}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{border-bottom:1px solid var(--line);padding:10px 8px;text-align:left;vertical-align:top}
.chip{font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px}
.chip.exos{background:#e6f4ea;color:var(--green)} .chip.exist{background:#eff7fe;color:var(--blue)} .chip.new{background:#fff4e5;color:var(--amber)}
pre.prompt{background:#0f1b2d;color:#e6edf6;padding:18px 20px;border-radius:10px;white-space:pre-wrap;font:13px/1.6 ui-monospace,Menlo,monospace;max-height:420px;overflow:auto}
.cmp{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}
figure{position:relative;margin:0;flex:1 1 300px;border:1px solid var(--line);border-radius:10px;padding:10px}
figure img{width:100%;display:block;cursor:zoom-in}
.tag{position:absolute;top:16px;left:16px;font-size:11px;font-weight:800;text-transform:uppercase;padding:3px 8px;border-radius:6px;color:#fff}
.tag-before{background:#687885} .tag-figma{background:#8f5bd6} .tag-after{background:var(--green)}
.callout{background:#fff8eb;border:1px solid #f3d9a8;border-radius:10px;padding:12px 16px}
#lb{position:fixed;inset:0;background:rgba(5,21,42,.85);display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:30px;cursor:zoom-out}
```

### Lightbox JS

```js
document.querySelectorAll('figure img').forEach(i => i.addEventListener('click', () => {
  const lb = document.getElementById('lb'); lb.firstChild.src = i.src; lb.style.display = 'flex';
}));
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('lb').style.display = 'none'; });
```

---

## 4. Final checks

- [ ] The prompt section matches the user's prompt exactly
- [ ] Every DO / DON'T from the prompt has a checklist row
- [ ] Mobile screenshots are sharp at 100% zoom, and inputs aren't clipped on the right
- [ ] The Before shots really show the old component (not a blank page or redirect)
- [ ] After capturing Before shots, the page files are restored (`grep` for the new component tag)
- [ ] Anything marked **New** in the design-system table is real (searched `tokens.json` and the theme SCSS first)
- [ ] The token numbers are labeled as estimates
- [ ] Headless screenshot of the report itself looks right: `--window-size=1280,1500`
- [ ] Dev server stopped: `pkill -f "ng serve --port 4311"`
