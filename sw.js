// Früherer Service Worker auf oberster Ebene: meldet sich selbst ab, damit sich die persönliche Seite (/de/)
// und die App-Website (/Universal-Search-for-Android/) nicht mehr überschneiden.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('dw-site-')).map(k => caches.delete(k))))
    .then(() => self.registration.unregister()));
});
