// BuildingSync R1 — minimal service worker so the app is installable as a
// PWA (iOS Safari / Chrome / Edge "Add to Home Screen"). Caching strategy
// is intentionally conservative for a smoke build: cache the offline
// fallback shell on install (one URL at a time so a single 404 doesn't
// abort the install), network-first for navigation, fall through to the
// offline page when there's no network.

const CACHE = "buildingsync-r1-v6";
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

// Web Push: incoming push from our /api/push/test or event-driven
// senders (announcements, deliveries, work-order updates). Payload is
// JSON: { title, body, url?, tag? }. We surface as a system
// notification; clicking focuses the existing PWA window if open or
// opens a new one at the payload's url.
self.addEventListener("push", (event) => {
  let payload = { title: "BuildingSync", body: "You have a new update" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (_e) {
    // Non-JSON payload — keep the defaults.
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: payload.tag || "buildingsync",
      data: { url: payload.url || "/dashboard" },
      renotify: false,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        // Reuse an existing PWA window if one is already open.
        if ("focus" in w && new URL(w.url).origin === self.location.origin) {
          w.navigate(target);
          return w.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
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
