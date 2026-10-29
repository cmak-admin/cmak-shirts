/* CMAK Shirts – service worker. Bump CACHE when you change any file below. */
const CACHE = 'cmak-shirts-v1';
const SHELL = ['./', './index.html', './report.html', './styles.css', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache the Apps Script API or WhatsApp links
  if (url.hostname.endsWith('google.com') || url.hostname.endsWith('googleusercontent.com') || url.hostname === 'wa.me') return;
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Network first for the shell, fall back to cache when offline
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
