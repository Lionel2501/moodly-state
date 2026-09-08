// Minimal service worker: exists only to satisfy PWA installability criteria
// (a registered SW with a fetch handler). Intentionally does no caching so it
// can't serve stale bundles or interfere with API requests.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
