// Injected on toolbar-icon click: toggles an overlay grid of every image in the conversation.
(() => {
  const MIN = 100; // ponytail: size filter skips avatars/icons; tune if real images get hidden
  const ID = "chat-images-overlay";
  const old = document.getElementById(ID);
  if (old) return old.remove();

  const main = document.querySelector("main") || document.body;
  const seen = new Set();
  const srcs = [...main.querySelectorAll("img")].filter(i => {
    const src = i.currentSrc || i.src;
    if (!src || seen.has(src) || Math.max(i.naturalWidth, i.width) < MIN) return false;
    seen.add(src);
    return true;
  }).map(i => i.currentSrc || i.src);

  const o = document.createElement("div");
  o.id = ID;
  o.setAttribute("popover", "manual"); // top layer: above any ChatGPT dialog
  o.style.cssText = "margin:0;border:0;width:100vw;height:100vh;box-sizing:border-box;position:fixed;inset:0;background:#000d;overflow:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;align-content:start";
  o.addEventListener("click", e => { if (e.target === o) o.remove(); });
  const hdr = document.createElement("div");
  hdr.style.cssText = "grid-column:1/-1;color:#fff;font:14px sans-serif";
  hdr.textContent = `${srcs.length} images — click background, Esc, or the toolbar icon to close`;
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
  o.showPopover();
})();
