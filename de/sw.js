// Service Worker der persönlichen Website: zuerst aus dem Netz, offline aus dem Zwischenspeicher.
// Die App-Website (/Universal-Search-for-Android/) liegt auf derselben Adresse und hat einen eigenen Service Worker – nie anfassen.
const CACHE = 'dw-site-v1';
const CORE = ['./', 'index.html', 'assets/site.css', 'assets/fonts/fonts.css', 'assets/img/profil.webp'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('dw-site-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/Universal-Search-for-Android/')) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : undefined))));
});
