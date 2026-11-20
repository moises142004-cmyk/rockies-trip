/* Service worker — offline support for the trip planner.
   v12 fix: never cache or serve redirected responses (browsers reject them for
   navigations → the page failed on the 2nd visit). Own pages/scripts are
   network-first (always fresh online, cached copy offline).
   v24: map tiles and photos each get their own cache, cache-first with no
   background re-download, and the tile cache is capped. Before this every tile
   went into the main cache as an opaque response (each counts ~7 MB of quota in
   Chrome), was looked up in an ever-growing cache, and was downloaded a second
   time in the background, which made the zoomed-in map crawl.
   v25: the page now asks for the next view's tiles before the fly animation ends, so a tile can
   be requested twice at once: identical requests in flight share one download. "Guardar el mapa offline" downloads the
   street-level tiles of every stop into their own uncapped cache (OFFLINE), which the tile
   handler checks first.
   Supabase / weather / FX APIs and everything else are never touched. */
const CACHE = 'rockies-v25';
const TILES = 'rockies-tiles-1';
const IMGS = 'rockies-img-1';
const OFFLINE = 'rockies-offline-1';
const TILE_MAX = 1500;
const isTileHost = h => h.endsWith('arcgisonline.com');
const SHELL = [
  'toronto.html', 'ahorro.html', 'inventario.html', 'costos.html', 'viaje.html',
  'style.css', 'planner.css', 'planner.js', 'toronto-routes.js', 'toronto-photos.js', 'toronto-data.js', 'cloud.js', 'manifest.json',
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
function cacheable(res) { return res && !res.redirected && res.ok; }

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
      .then(keys => Promise.all(keys.filter(k => ![CACHE, TILES, IMGS, OFFLINE].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Cache-first from one named cache; a miss goes to the network and is stored.
   `also` = an extra cache to look in first (the offline map). Same-URL misses in flight share one fetch. */
let puts = 0;
const inflight = new Map();
async function cacheFirst(req, name, cap, also) {
  if (also) { const o = await (await caches.open(also)).match(req); if (o) return o; }
  const c = await caches.open(name);
  const hit = await c.match(req);
  if (hit) return hit;
  const key = req.url;
  let p = inflight.get(key);
  if (!p) {
    p = fetch(req).then(res => {
      if (cacheable(res) && res.type !== 'opaque') {
        c.put(key, res.clone()).then(() => { if (cap && ++puts % 100 === 0) trim(name, cap); }).catch(() => {});
      }
      return res;
    }).finally(() => setTimeout(() => inflight.delete(key), 0));
    inflight.set(key, p);
  }
  return (await p).clone();
}

/* "Guardar el mapa offline": the page sends the tile URLs; we download them 6 at a time
   (Esri's limit per host) into OFFLINE and report progress through the MessageChannel port. */
self.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'offline-tiles' || !Array.isArray(m.urls) || !e.ports[0]) return;
  const port = e.ports[0], urls = m.urls.filter(u => { try { return isTileHost(new URL(u).hostname); } catch (x) { return false; } });
  e.waitUntil((async () => {
    const c = await caches.open(OFFLINE);
    let i = 0, done = 0, failed = 0;
    const worker = async () => {
      while (i < urls.length) {
        const u = urls[i++];
        try {
          if (!(await c.match(u))) {
            const res = await fetch(u, { mode: 'cors' });
            if (res.ok) await c.put(u, res); else failed++;
          }
        } catch (x) { failed++; }
        done++;
        if (done % 20 === 0 || done === urls.length) port.postMessage({ type: 'progress', done, total: urls.length, failed });
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    port.postMessage({ type: 'done', total: urls.length, failed });
  })());
});
async function trim(name, cap) {
  const c = await caches.open(name), keys = await c.keys();
  for (let i = 0; i < keys.length - cap; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Map tiles (requested with CORS so they aren't opaque) */
  if (isTileHost(url.hostname)) {
    e.respondWith(cacheFirst(req, TILES, TILE_MAX, OFFLINE).catch(() => Response.error()));
    return;
  }
  /* Trip photos never change under the same name */
  if (sameOrigin && url.pathname.startsWith('/img/')) {
    e.respondWith(cacheFirst(req, IMGS).catch(() => Response.error()));
    return;
  }
  /* Leaflet from the CDN */
  if (url.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }
  /* Everything else from other sites goes straight to the network. */
  if (!sameOrigin && req.mode !== 'navigate') return;

  /* Pages and our own scripts/styles: network first, cache as offline fallback. */
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
});
