/* Service worker — offline support for the Rockies planner.
   App shell is precached; map tiles & photos are cached as you view them
   (cache-first). Supabase API is never cached so Inventario/Costos stay live. */
const CACHE = 'rockies-v1';
const SHELL = [
  './', 'index.html', 'inventario.html', 'costos.html',
  'style.css', 'routes.js', 'photos.js', 'cloud.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Supabase + the FX API: always go to network (live data); don't cache.
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('open-meteo.com') || url.hostname.endsWith('er-api.com')) return;

  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      // refresh in the background (stale-while-revalidate)
      fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then(c => c.put(req, res.clone()));
      }).catch(() => {});
      return cached;
    }
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    } catch (err) {
      if (req.mode === 'navigate') return (await caches.match('index.html')) || Response.error();
      return new Response('', { status: 504, statusText: 'offline' });
    }
  })());
});
