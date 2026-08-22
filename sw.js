// Keep On Baking service worker — v2.1.0
// Strategy:
//  - App shell (index.html): NETWORK-FIRST, cache fallback → always fresh when online, still opens offline
//  - CDN assets (Firebase SDK, Google Fonts): CACHE-FIRST → instant loads, offline-safe
//  - Firebase Realtime Database traffic: NEVER touched (live sync must bypass the cache)
const CACHE = 'kob-v2.1.0';
const SHELL = ['./', './index.html'];
const CDN_HOSTS = ['www.gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never intercept database / auth traffic
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') && !CDN_HOSTS.includes(url.hostname)) return;

  // App shell: network-first so new versions land immediately, cache when offline
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // CDN assets: cache-first
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
