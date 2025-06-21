const CACHE_NAME = 'multi-downloader-v1';
const PRECACHE_URLS = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './static/assets/192x192.png',
    './static/assets/512x512.png',
    './static/assets/16x16.png',
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const url of PRECACHE_URLS) {
                try {
                    await cache.add(url);
                } catch (e) {
                    console.error('Failed to cache:', url, e);
                }
            }
        })
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

self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activated');
});

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
