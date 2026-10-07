/* Service worker — offline support for the trip planner.
   v12 fix: never cache or serve redirected responses (browsers reject them for
   navigations → the page failed on the 2nd visit). Own pages/scripts are
   network-first (always fresh online, cached copy offline). Map tiles & photos
   are cache-first. Supabase / weather / FX APIs are never cached. */
const CACHE = 'rockies-v16';
const SHELL = [
  'toronto.html', 'ahorro.html', 'inventario.html', 'costos.html',
  'style.css', 'planner.css', 'planner.js', 'toronto-routes.js', 'toronto-photos.js', 'cloud.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

/* A redirected response can't be returned for a navigation; rebuild a clean copy. */
async function clean(res) {
  if (!res || !res.redirected) return res;
  const body = await res.blob();
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
}
function cacheable(res) { return res && !res.redirected && (res.ok || res.type === 'opaque'); }

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(async u => {
        const res = await fetch(new Request(u, { cache: 'reload' }));
        if (res.ok) await c.put(u, await clean(res));
      })))
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
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('open-meteo.com') || url.hostname.endsWith('er-api.com')) return;

  const sameOrigin = url.origin === self.location.origin;

  /* Pages and our own scripts/styles: network first, cache as offline fallback. */
  if (req.mode === 'navigate' || sameOrigin) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (cacheable(res) && req.mode !== 'navigate') caches.open(CACHE).then(c => c.put(req, res.clone()));
        else if (req.mode === 'navigate' && res.ok) { const copy = await clean(res.clone()); caches.open(CACHE).then(c => c.put(new URL(res.url).pathname.replace(/^\//, '') || 'toronto.html', copy)); }
        return await clean(res);
      } catch (err) {
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return clean(hit);
        if (req.mode === 'navigate') return (await caches.match('toronto.html')) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  /* Map tiles, photos, CDN libs: cache first, refresh in the background. */
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      fetch(req).then(res => { if (cacheable(res)) caches.open(CACHE).then(c => c.put(req, res)); }).catch(() => {});
      return clean(cached);
    }
    try {
      const res = await fetch(req);
      if (cacheable(res)) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    } catch (err) {
      return Response.error();
    }
  })());
});
