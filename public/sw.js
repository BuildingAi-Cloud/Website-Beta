// BuildingSync R1 — minimal service worker so the app is installable as a
// PWA (iOS Safari / Chrome / Edge "Add to Home Screen"). Caching strategy
// is intentionally conservative for a smoke build: cache the offline
// fallback shell on install (one URL at a time so a single 404 doesn't
// abort the install), network-first for navigation, fall through to the
// offline page when there's no network.

const CACHE = "buildingsync-r1-v3";
const SHELL = ["/offline"];

// Cache a list of URLs but tolerate any individual failure — addAll() is
// atomic and would abort the entire install if any URL 404s. We can't
// afford to lose the SW over a transient cache miss.
async function cacheSafely(cache, urls) {
  await Promise.allSettled(urls.map((u) => cache.add(u)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cacheSafely(cache, SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Network-first for navigation. Cache the offline page on first
// successful nav so the fallback works even if the user installs the
// PWA before /offline loads naturally.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Opportunistically refresh the cached /offline page on every
        // successful nav fetch so it stays current with deploys.
        if (new URL(request.url).pathname === "/offline" && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((c) => c.put("/offline", copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match("/offline").then((r) => r || new Response(
          "<!doctype html><meta charset=utf-8><title>Offline</title><h1>You're offline</h1><p>Reconnect and reload.</p>",
          { headers: { "Content-Type": "text/html" } },
        )),
      ),
  );
});
