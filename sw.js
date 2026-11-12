// SNUG service worker: keeps the app shell available offline and loads fast on repeat visits.
// Bump VERSION on each release so phones pick up the new files.
const VERSION = 'snug-v26';
const SHELL = ['./', 'index.html', 'styles.css', 'engine.js', 'app.js', 'previews/tv.jpg', 'previews/dressing.jpg', 'previews/biblio.jpg', 'previews/escalier.jpg', 'previews/bureau.jpg', 'previews/autre.jpg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Network first for the app's own files (fresh after a release), cache as fallback offline.
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok && (url.origin === location.origin || url.hostname === 'cdnjs.cloudflare.com')) {
        const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
