// Barebones Service Worker for PWA Installation
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
    // Pass-through fetch for now, just enough to trigger PWA install prompt
    e.respondWith(fetch(e.request).catch(() => new Response('App is offline')));
});