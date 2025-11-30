const CACHE_NAME = 'gram-sahayak-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://aistudiocdn.com/@google/genai@^1.30.0',
  'https://aistudiocdn.com/react-markdown@^10.1.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/recharts@^3.5.1',
  'https://aistudiocdn.com/react@^19.2.0/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // We use map/catch to ensure one failing file doesn't break the whole install
        return Promise.all(
            urlsToCache.map(url => {
                return cache.add(url).catch(err => console.log('Failed to cache:', url, err));
            })
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response;
        return fetch(event.request).then((response) => {
             // Cache successful GET requests
            if(response && response.status === 200 && event.request.method === 'GET') {
                 const responseToCache = response.clone();
                 caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                 });
            }
            return response;
        }).catch(() => {});
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});