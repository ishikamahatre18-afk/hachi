/* App shell + the runtime files from jsDelivr are cached so the app opens offline. The model itself is cached by transformers.js. */
const V = "hachi2-v3";
const SHELL = ["./", "index.html", "worker.js", "data.js", "engine.js", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin !== location.origin && u.hostname !== "cdn.jsdelivr.net") return; // model files are handled by transformers.js
  const same = u.origin === location.origin;
  const net = () => fetch(e.request, same ? { cache: "no-cache" } : undefined).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(x => x.put(e.request, c)); } return res; });
  // own files: network first (so updates arrive), cache when offline. Runtime files from jsDelivr: cache first.
  e.respondWith(same ? net().catch(() => caches.match(e.request, { ignoreSearch: true }).then(h => h || caches.match("index.html")))
    : caches.match(e.request).then(h => h || net().catch(() => Response.error())));
});
