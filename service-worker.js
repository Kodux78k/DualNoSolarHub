/* Service Worker para Hub1 Apps Integrados */
const CACHE_NAME = 'hub1-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/convertLivroVivo.js',
  '/livro_vivo_trinity_override.js',
  '/README-DesignSystem-Hub1-v1.md',
  '/Livro_Vivo_Agua_Memoria_Infodose_2.md',
  '/hub1-home-ia.html',
  '/node01.html',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});