/* ===== Jime & Moi — Las Rockies · localStorage store ===== */
/* All three pages share one origin, so one store serves the whole app.
   Data is per-device (no cloud sync). */
const Store = (() => {
  const PREFIX = 'rockies:';
  const read = (key, fallback) => {
    try { const v = localStorage.getItem(PREFIX + key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { console.warn('Store.read', key, e); return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (e) { console.warn('Store.write', key, e); return false; }
  };
  const remove = key => localStorage.removeItem(PREFIX + key);
  const uid = () => 'x' + Math.abs(Date.now() ^ ((performance.now() * 1000) | 0)).toString(36) + (idCounter++).toString(36);
  let idCounter = 0;
  return { read, write, remove, uid };
})();
