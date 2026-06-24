/* ===== Jime & Moi — Las Rockies · cloud store (Supabase REST) =====
   Shared data for Inventario & Costos so both phones see the same thing, live.
   Public app, no login — protected only by RLS on the trip_* tables.
   Offline-safe: reads fall back to the last cached copy in this browser. */
const Cloud = (() => {
  const BASE = 'https://bxafkbnfdgoqofdwccpo.supabase.co/rest/v1';
  const KEY  = 'sb_publishable_09QlAy3FmLI85b7-5xHu4A_BsapG-U-';
  const H = extra => Object.assign({ apikey:KEY, Authorization:'Bearer '+KEY, 'Content-Type':'application/json' }, extra||{});

  const cache = {
    get:(k,f)=>{ try{ const v=localStorage.getItem('rockies:'+k); return v==null?f:JSON.parse(v); }catch(e){ return f; } },
    set:(k,v)=>{ try{ localStorage.setItem('rockies:'+k, JSON.stringify(v)); }catch(e){} }
  };

  async function list(table, qs=''){
    const r = await fetch(`${BASE}/${table}?${qs}`, { headers:H(), cache:'no-store' });
    if(!r.ok) throw new Error('list '+table+' '+r.status);
    return r.json();
  }
  // list with offline fallback to cache (keyed by cacheKey)
  async function listCached(table, qs, cacheKey){
    try { const rows = await list(table, qs); cache.set(cacheKey, rows); return { rows, online:true }; }
    catch(e){ console.warn('Cloud offline:', e.message); return { rows: cache.get(cacheKey, []), online:false }; }
  }
  async function insert(table, obj){
    const r = await fetch(`${BASE}/${table}`, { method:'POST', headers:H({Prefer:'return=representation'}), body:JSON.stringify(obj) });
    if(!r.ok) throw new Error('insert '+r.status); return (await r.json())[0];
  }
  async function update(table, id, patch){
    const r = await fetch(`${BASE}/${table}?id=eq.${id}`, { method:'PATCH', headers:H({Prefer:'return=representation'}), body:JSON.stringify(patch) });
    if(!r.ok) throw new Error('update '+r.status); return r.json();
  }
  async function remove(table, id){
    const r = await fetch(`${BASE}/${table}?id=eq.${id}`, { method:'DELETE', headers:H() });
    if(!r.ok) throw new Error('delete '+r.status);
  }
  async function getSettings(){
    try { const rows = await list('trip_settings','id=eq.1'); const s=rows[0]||null; if(s) cache.set('settings',s); return s; }
    catch(e){ return cache.get('settings', null); }
  }
  async function saveSettings(patch){
    patch = Object.assign({}, patch, { updated_at: new Date().toISOString() });
    cache.set('settings', Object.assign(cache.get('settings',{}), patch));
    return update('trip_settings', 1, patch);
  }

  return { list, listCached, insert, update, remove, getSettings, saveSettings, cache };
})();
