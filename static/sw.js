const CACHE_NAME = 'multi-downloader-v1';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
    );
});

self.addEventListener('activate', (evt) => {
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then(cached => {
            return cached || fetch(evt.request).then(resp => {
                const copy = resp.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(evt.request, copy));
                return resp;
            });
        }).catch(() => {
            if (evt.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        })
    );
});
