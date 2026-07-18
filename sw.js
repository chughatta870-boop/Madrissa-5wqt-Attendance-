const CACHE = 'madrissa-v3'; // Version update کر دی
const FILES = [
  './',
  './index.html',
  './style.css', 
  './script.js', 
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Install - Files ko cache karna
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log('Files Cached');
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting(); // Naya SW turant activate ho
});

// 2. Activate - Purana cache delete karna
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch - Pehle cache check karo, na mile to internet se lao
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
