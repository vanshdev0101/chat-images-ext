// Floating button -> overlay grid of every image in the current conversation.
const MIN = 100; // ponytail: size filter skips avatars/icons; tune if real images get hidden

function collect() {
  const main = document.querySelector("main") || document.body;
  const seen = new Set();
  return [...main.querySelectorAll("img")].filter(i => {
    const src = i.currentSrc || i.src;
    if (!src || seen.has(src)) return false;
    if (Math.max(i.naturalWidth, i.width) < MIN) return false;
    seen.add(src);
    return true;
  }).map(i => i.currentSrc || i.src);
}

function show() {
  const srcs = collect();
  const o = document.createElement("div");
  o.setAttribute("popover", "manual");
  o.style.cssText = "margin:0;border:0;width:100vw;height:100vh;box-sizing:border-box;position:fixed;inset:0;z-index:2147483647;background:#000d;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;align-content:start";
  o.addEventListener("click", e => { if (e.target === o) o.remove(); });
  const hdr = document.createElement("div");
  hdr.style.cssText = "grid-column:1/-1;color:#fff;font:14px sans-serif";
  hdr.textContent = `${srcs.length} images — click background or Esc to close`;
  o.append(hdr);
  for (const s of srcs) {
    const a = document.createElement("a");
    a.href = s; a.target = "_blank";
    const im = new Image(); im.src = s;
    im.style.cssText = "width:100%;border-radius:6px;display:block";
    a.append(im); o.append(a);
  }
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { o.remove(); document.removeEventListener("keydown", esc); }
  });
  document.documentElement.append(o);
  try { o.showPopover(); } catch (e) { console.error("[chat-images] popover", e); }
}

const b = document.createElement("button");
b.textContent = "🖼 Images";
b.style.cssText = "position:fixed;bottom:16px;left:16px;z-index:2147483646;padding:8px 12px;border-radius:8px;border:0;background:#333;color:#fff;cursor:pointer;pointer-events:auto !important";
b.addEventListener("click", () => {
  try { console.log("[chat-images] click");
    b.textContent = "…"; setTimeout(() => b.textContent = "🖼 Images", 600); show(); }
  catch (e) { console.error("[chat-images]", e); alert("Chat Images error: " + e.message); }
}, true);
document.documentElement.append(b);
