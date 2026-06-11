// Minimal service worker — enables "Add to Home Screen" / installable PWA
// and caches the app shell so it opens instantly (messages still come live
// from Supabase when online).
const CACHE = "private-chat-v1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache Supabase API / realtime traffic — always go to network.
  if (url.hostname.endsWith("supabase.co")) return;

  // App shell: cache-first, fall back to network.
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
