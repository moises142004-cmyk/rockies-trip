/* Shared map-planner engine. Each page defines its data (TRIP, SPOTS, LODGING, STAY, DAYCOL, FCLBL, FCCOL) and CFG before loading this. */
/* ===== STATE ===== */
let map=null, MAP_OK=false, curView='sat';
let dayLines={}; const dayMarkers=[], spotMarkers=[];
let openDay=null, activeFilter='all';
const $=id=>document.getElementById(id);
const eachMarker=fn=>{dayMarkers.forEach(fn);spotMarkers.forEach(fn);};
function gmaps(lat,lng){return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;}
/* Street View at the spot (opens the Google Maps app on the phone) */
function gsv(lat,lng){return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;}
/* request the right size: Google photos (=wW-hH) or Wikimedia (?width=) */
function sizeImg(u,w,h){if(/^img\/[^/]+\.jpg$/.test(u))return w<=420?u.replace('img/','img/t/'):w<=860?u.replace('img/','img/m/'):u;return u.includes('googleusercontent.com/')?u.replace(/=w\d+-h\d+[^"']*$/,'')+'=w'+w+'-h'+h+'-k-no':u.replace(/width=\d+/,'width='+w);}
function photosFor(pk){return (pk&&PHOTOS[pk]&&PHOTOS[pk].photos)?PHOTOS[pk].photos:[];}
const totalKm=Object.values(ROUTE_KM).reduce((a,b)=>a+b,0);

/* ===== LIVE WEATHER (Open-Meteo) + TODAY ===== */
function dayISO(i){const d=new Date(...CFG.start);d.setDate(d.getDate()+i);const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());}
const WX_LOC=CFG.wxDay;
let WXLIVE={}; try{WXLIVE=JSON.parse(localStorage.getItem(CFG.wxKey)||'{}');}catch(e){}
function wmo(c){if(c==null)return'🌡️';if(c===0)return'☀️';if(c<=2)return'🌤️';if(c===3)return'☁️';if(c<=48)return'🌫️';if(c<=67)return'🌧️';if(c<=77)return'🌨️';if(c<=86)return'🌨️';return'⛈️';}
function wxPill(di){const w=WXLIVE[di];
  if(w&&w.max!=null)return `<span class="pill wx-live" title="Pronóstico real">${wmo(w.code)} ${Math.round(w.max)}°/${Math.round(w.min)}° <b>live</b></span>`;
  return `<span class="pill">🌡️ ${TRIP[di].wx}</span>`;}
function todayIndex(){const now=new Date(),start=new Date(...CFG.start,0,0,0),end=new Date(2027,0,2,23,59,59);
  if(now<start||now>end)return -1;return Math.floor((now-start)/86400000);}
const TODAY_I=todayIndex();
async function loadWeather(){
  const locs=CFG.wxLocs;
  try{
    const got={};
    for(const k in locs){const[la,lo]=locs[k];
      const u=`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=${encodeURIComponent(CFG.tz)}&start_date=${dayISO(0)}&end_date=${dayISO(TRIP.length-1)}`;
      const r=await fetch(u);if(!r.ok)continue;const d=await r.json();if(d.daily&&d.daily.time)got[k]=d.daily;}
    const live={};
    TRIP.forEach((day,di)=>{const loc=got[WX_LOC[di]];if(!loc)return;const idx=loc.time.indexOf(dayISO(di));if(idx<0)return;
      const mx=loc.temperature_2m_max[idx],mn=loc.temperature_2m_min[idx];if(mx!=null&&mn!=null)live[di]={max:mx,min:mn,code:loc.weather_code[idx]};});
    if(Object.keys(live).length){WXLIVE=live;try{localStorage.setItem(CFG.wxKey,JSON.stringify(live));}catch(e){}renderTrail();reapplyOpen();}
  }catch(e){/* offline / fuera de rango (>16 días): se queda el promedio estacional */}
}
function reapplyOpen(){document.querySelectorAll('.day').forEach(d=>d.classList.toggle('open',+d.dataset.di===openDay));}

/* ===== PANELS (no Leaflet needed) ===== */
function renderTrail(){
  const trail=$('trail');trail.innerHTML='';
  $('kmStat').textContent=totalKm||'—';
  TRIP.forEach((day,di)=>{
    day.c=DAYCOL[di];
    const el=document.createElement('div');el.className='day';el.style.setProperty('--dc',day.c);el.dataset.di=di;
    const km=ROUTE_KM[di]?ROUTE_KM[di]+' km':'—';
    const st=day.stay?STAY[day.stay]:null;
    const stayHtml=!st?'':st.flight
      ?`<div class="dstay">✈️ <b>${st.label}</b> · ${st.dates}</div>`
      :st.url
        ?`<a class="dstay" href="${st.url}" target="_blank" rel="noopener">🛏 <b>${st.label}</b> · ${st.dates} <span class="ext">↗</span></a>`
        :`<div class="dstay${st.todo?' todo':''}">🛏 <b>${st.label}</b> · ${st.dates}${st.todo?' · por reservar':''}</div>`;
    const skm=ROUTE_SITEKM[di]||[];
    let sitesHtml=day.sites.map((s,si)=>{
      const k=skm[si];const kmTag=(k!=null)?`<span class="s-km">${k} km</span>`:'';
      return `<div class="site" data-di="${di}" data-si="${si}"><div class="s-time">${s.t}</div><div class="s-ico">${s.ic}</div><div class="s-name">${s.name}${s.p?`<span class="s-p">💵 ${s.p}</span>`:''}</div>${kmTag}</div>`;
    }).join('');
    if(ROUTE_RETURNKM[di]!=null) sitesHtml+=`<div class="site ret"><div class="s-time"></div><div class="s-ico">🛏</div><div class="s-name">Vuelta al hospedaje</div><span class="s-km">${ROUTE_RETURNKM[di]} km</span></div>`;
    el.innerHTML=`<div class="day-row"><div class="seal">${day.n}</div><div class="day-meta">
      <div class="dtag">${day.tag}</div><div class="dttl">${day.title}</div>
      <div class="dsub"><span class="pill">${day.date}</span><span class="pill">${day.trans}</span>${wxPill(di)}<span class="pill">🧭 ${km}</span>${day.cost?`<span class="pill pill-cost" title="Estimado para 2 sin hospedaje, CAD">💵 ${day.cost} CAD</span>`:''}${di===TODAY_I?'<span class="pill pill-today">● Hoy</span>':''}</div>
      <div class="dblurb">${day.blurb}</div><div class="dtip"><b>Tip ·</b> ${day.tip}</div>${stayHtml}</div></div><div class="sites">${sitesHtml}</div>`;
    trail.appendChild(el);
  });
  trail.querySelectorAll('.day').forEach(d=>d.querySelector('.day-row').addEventListener('click',()=>focusDay(+d.dataset.di)));
  trail.querySelectorAll('.site').forEach(si=>si.addEventListener('click',e=>{
    e.stopPropagation();const di=+si.dataset.di,idx=+si.dataset.si;
    if(window.innerWidth<=900)$('win').classList.remove('open');
    if(!MAP_OK)return;
    const target=dayMarkers.find(m=>m._di===di&&m._s===TRIP[di].sites[idx]);if(!target)return;
    if(!map.hasLayer(target)){activeFilter='all';syncChips();applyVisibility();}
    flyToSite(target._s.lat,target._s.lng,()=>target.openPopup());
  }));
}
function buildPanels(){
  $('spotStat').textContent=SPOTS.length;
  $('cold').innerHTML=CFG.panel;
  if(typeof CFG.onPanel==='function')CFG.onPanel();
  renderTrail();
  const tWrap=$('treasures');
  /* grouped by type (burgers, KBBQ…) when the page defines CFG.spotGroups; otherwise by city */
  const blocks=CFG.spotGroups?CFG.spotGroups.map(g=>({title:g.label,list:SPOTS.filter(s=>s.grp===g.k)}))
                             :CFG.cities.map(city=>({title:city,list:SPOTS.filter(s=>s.city===city)}));
  blocks.forEach(({title,list})=>{
    if(!list.length)return;
    const block=document.createElement('div');block.className='tcity';
    block.innerHTML=`<h3>${title} <span class="cnt">${list.length}</span></h3>`+
      list.map(sp=>{const ph=photosFor(sp.pk)[0];
        const ic=ph?`<img loading="lazy" decoding="async" src="${sizeImg(ph.url,120,120)}" alt="" onerror="this.parentNode.textContent='${sp.ic}'">`:sp.ic;
        const meta=[sp.hot?`<span class="thot">🔥 ${sp.hot}</span>`:'',sp.p?`💵 ${sp.p}`:'',CFG.spotGroups&&sp.city!=='Toronto'?sp.city:''].filter(Boolean).join(' · ');
        return `<div class="tspot" data-id="${sp.id}" style="--cc:${FCCOL[sp.cat]}"><div class="tic">${ic}</div><div><div class="tn">${sp.name}</div><div class="tc">${meta||FCLBL[sp.cat]}</div><div class="tnote">${sp.note}</div></div></div>`;}).join('');
    tWrap.appendChild(block);
  });
  tWrap.querySelectorAll('.tspot').forEach(el=>el.addEventListener('click',()=>{
    const sp=SPOTS.find(s=>s.id===el.dataset.id);if(!sp)return;
    if(window.innerWidth<=900)$('win').classList.remove('open');
    if(!MAP_OK||!sp._m)return;
    if(!map.hasLayer(sp._m)){activeFilter='all';syncChips();applyVisibility();}
    flyToSite(sp.lat,sp.lng,()=>sp._m.openPopup());
  }));
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');
    const tab=t.dataset.tab;
    $('trail').style.display=tab==='log'?'':'none';
    $('treasures').style.display=tab==='treasures'?'':'none';
    $('cold').style.display=tab==='cold'?'':'none';
    $('winHead').style.display=tab==='log'?'':'none';
    $('scroll').scrollTop=0;
    $('tlTitle').textContent=tab==='log'?'Itinerario':tab==='treasures'?'Cofre de tesoros':CFG.panelTitle;
  });
  $('btnSpots').onclick=()=>{document.querySelector('.tab[data-tab="treasures"]').click();$('scroll').scrollTop=0;if(window.innerWidth<=900)$('win').classList.add('open');};
  document.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));ch.classList.add('on');
    activeFilter=ch.dataset.cat;
    if(MAP_OK){applyVisibility();if(openDay===null){activeFilter==='all'?fitAll():fitVisible();}}
  });
  $('btnAll').onclick=()=>{activeFilter='all';syncChips();if(MAP_OK)resetView(true);else{openDay=null;document.querySelectorAll('.day').forEach(d=>d.classList.remove('open'));setNow();}};
  document.querySelectorAll('#viewToggle button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#viewToggle button').forEach(x=>x.classList.toggle('on',x===b));curView=b.dataset.view;if(MAP_OK)setView(b.dataset.view);});
  $('menuBtn').onclick=()=>$('win').classList.toggle('open');
  const win=$('win'),stop=e=>e.stopPropagation();
  $('dotClose').addEventListener('click',e=>{stop(e);win.classList.add('closed');document.body.classList.add('win-closed');});
  $('reopen').addEventListener('click',()=>{win.classList.remove('closed');document.body.classList.remove('win-closed');});
  $('dotMin').addEventListener('click',e=>{stop(e);win.classList.toggle('min');});
  $('dotMax').addEventListener('click',e=>{stop(e);
    if(window.innerWidth<=900){win.classList.add('open');return;}
    win.classList.remove('min');
    if(win.classList.toggle('max')){win.style.width='430px';win.style.left='16px';win.style.top='72px';win.style.bottom='16px';}
    else{win.style.width='';win.style.left='';win.style.top='';win.style.bottom='';}
  });
  ['dotClose','dotMin','dotMax'].forEach(id=>$(id).addEventListener('mousedown',stop));
  $('titlebar').addEventListener('click',e=>{if(e.target.closest('.tl-dots'))return;if(window.innerWidth<=900)win.classList.toggle('open');});
  (function(){let drag=false,sx,sy,ox,oy;const bar=$('titlebar');
    bar.addEventListener('mousedown',e=>{if(window.innerWidth<=900||e.target.closest('.tl-dots'))return;drag=true;sx=e.clientX;sy=e.clientY;const r=win.getBoundingClientRect();ox=r.left;oy=r.top;win.style.bottom='auto';win.style.right='auto';win.style.left=ox+'px';win.style.top=oy+'px';e.preventDefault();});
    window.addEventListener('mousemove',e=>{if(!drag)return;let nx=ox+(e.clientX-sx),ny=oy+(e.clientY-sy);nx=Math.max(6,Math.min(window.innerWidth-360,nx));ny=Math.max(64,Math.min(window.innerHeight-120,ny));win.style.left=nx+'px';win.style.top=ny+'px';});
    window.addEventListener('mouseup',()=>drag=false);
  })();
}
function syncChips(){document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.cat===activeFilter));}
function setNow(){const t=$('nowText');if(openDay===null)t.innerHTML=`Viaje completo · <b>${CFG.nowText}</b>`;else{const d=TRIP[openDay];t.innerHTML=`Día ${d.n} · <b>${d.title}</b>`;}}
function focusDay(di){
  openDay=(openDay===di)?null:di;
  document.querySelectorAll('.day').forEach(d=>d.classList.toggle('open',+d.dataset.di===openDay));
  setNow();
  if(!MAP_OK)return;
  applyVisibility();
  if(openDay===null){fitAll();return;}
  const wide=window.innerWidth>900,b=L.latLngBounds(TRIP[di].sites.map(s=>[s.lat,s.lng])),o={paddingTopLeft:[wide?372:40,118],paddingBottomRight:[wide?40:40,wide?60:280],maxZoom:13};
  prefetchBounds(b,o);map.flyToBounds(b,{...o,duration:.8});
}

/* ===== MAP ===== */
function galHtml(photos){
  if(!photos.length) return '';
  const imgs=photos.map(p=>`<img decoding="async" src="${sizeImg(p.url,560,380)}" alt="${(p.caption||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none'">`).join('');
  const nav=photos.length>1?`<button class="nav prev" onclick="this.parentNode.querySelector('.track').scrollBy({left:-272})">‹</button><button class="nav next" onclick="this.parentNode.querySelector('.track').scrollBy({left:272})">›</button><span class="count">1 / ${photos.length}</span>`:'';
  return `<div class="gal"><div class="track">${imgs}</div>${nav}</div>`;
}
function stayPopHtml(o){
  return `<div style="--pc:#F5A623"><div class="gal"><div class="ph"><span class="e">🏠</span><span class="t">Hospedaje</span></div></div>`+
    `<div class="pp-body"><div class="pp-cat" style="color:#F5A623">Hospedaje</div><div class="pp-name">${o.name}</div>`+
    `<div class="pp-meta">🗓 ${o.dates}</div><div class="pp-note">${o.note}</div>`+
    `<div class="pp-row">${o.url?`<a class="pp-go" href="${o.url}" target="_blank" rel="noopener" style="background:#F5A623;color:#241500;border-color:#F5A623">↗ ${CFG.stayBtn||'Ver sitio'}</a>`:`<span class="pp-badge">Por reservar</span>`}`+
    `<a class="pp-go" href="${gmaps(o.lat,o.lng)}" target="_blank" rel="noopener">▸ Mapa</a></div></div></div>`;
}
function popHtml(o){
  const photos=photosFor(o.pk);
  /* no photo of our own: the placeholder opens the place in Google Maps, where the real photos and reviews are */
  const gq=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.name.replace(/^(Almuerzo|Cena|Opcional|Cena splurge|Poutine de medianoche):\s*/,'').split(' · ')[0]+', Toronto')}`;
  const gal=photos.length?galHtml(photos):`<div class="gal"><a class="ph" href="${gq}" target="_blank" rel="noopener" style="text-decoration:none"><span class="e">${o.ic||'📍'}</span><span class="t">Ver fotos en Google Maps ↗</span></a></div>`;
  const meta=o.metaLine?`<div class="pp-meta">${o.metaLine}</div>`:'';
  return `<div style="--pc:${o.pc}">${gal}<div class="pp-body"><div class="pp-cat">${o.cat}</div><div class="pp-name">${o.name}</div>${meta}<div class="pp-note">${o.note}</div><div class="pp-row"><span class="pp-badge">${o.badge}</span><a class="pp-go" href="${gmaps(o.lat,o.lng)}" target="_blank" rel="noopener">▸ Cómo llegar</a><a class="pp-go" href="${gsv(o.lat,o.lng)}" target="_blank" rel="noopener">👁 Street View</a>${o.ig?`<a class="pp-go" href="${o.ig}" target="_blank" rel="noopener">◎ Insta</a>`:''}</div></div></div>`;
}
let layers;
function setView(v){
  curView=v;
  [layers.sat,layers.terr,layers.dark,layers.darkRef].forEach(l=>map.removeLayer(l));map.removeLayer(layers.satLabels);
  if(v==='sat'){layers.sat.addTo(map);syncLabels();}
  else if(v==='terr')layers.terr.addTo(map);
  else{layers.dark.addTo(map);const add=()=>{if(curView==='dark'&&!map.hasLayer(layers.darkRef))layers.darkRef.addTo(map);};
    layers.dark.isLoading()?(layers.dark.once('load',add),setTimeout(add,1500)):add();}
}
/* street/place labels over satellite only when zoomed in (a 2nd tile layer doubles the per-frame cost).
   The photo goes first: labels wait until the imagery of this view has landed, so the 6 connections
   per host that Esri's HTTP/1.1 server allows go to the tiles you actually see. */
let labelWait=null;
function syncLabels(){if(!map||curView!=='sat')return;const want=map.getZoom()>=11;const has=map.hasLayer(layers.satLabels);
  if(want&&!has){if(labelWait)return;const add=()=>{labelWait=null;if(curView==='sat'&&map.getZoom()>=11&&!map.hasLayer(layers.satLabels))layers.satLabels.addTo(map);};
    if(layers.sat.isLoading&&layers.sat.isLoading()){labelWait=add;layers.sat.once('load',add);setTimeout(()=>{if(labelWait===add)add();},1500);}else add();}
  else if(!want&&has)map.removeLayer(layers.satLabels);}

/* ===== TILE PREFETCH =====
   How the big map apps feel instant: they ask for the next view's tiles before you get there.
   Tapping a stop starts a ~0.7 s fly animation; we request the destination tiles at the tap, so
   they are already in the browser (and in the service worker cache) when the animation lands. */
const TILE_PX=256;
function liveLayers(z){if(curView==='sat')return z>=11?[layers.sat,layers.satLabels]:[layers.sat];if(curView==='terr')return[layers.terr];return[layers.dark,layers.darkRef];}
function tileUrl(layer,x,y,z){return L.Util.template(layer._url,L.Util.extend({s:layer._getSubdomain({x,y}),x,y,z,r:L.Browser.retina?'@2x':''},layer.options));}
function tilesFor(center,zoom,size,layerList){
  const tz=Math.round(zoom),scale=Math.pow(2,tz-zoom),p=map.project(center,tz),half=size.multiplyBy(scale/2);
  const a=p.subtract(half).divideBy(TILE_PX).floor(),b=p.add(half).divideBy(TILE_PX).floor(),n=Math.pow(2,tz),out=[];
  for(const ly of layerList){const mz=ly.options.maxNativeZoom!=null?ly.options.maxNativeZoom:ly.options.maxZoom;if(tz>mz)continue;
    for(let x=a.x;x<=b.x;x++)for(let y=a.y;y<=b.y;y++){if(y<0||y>=n)continue;out.push(tileUrl(ly,((x%n)+n)%n,y,tz));}}
  return out;}
const warmed=new Set();
function warm(urls){urls.forEach(u=>{if(warmed.has(u))return;warmed.add(u);const i=new Image();i.crossOrigin='anonymous';i.decoding='async';i.src=u;});}
function prefetchView(center,zoom){try{warm(tilesFor(L.latLng(center),zoom,map.getSize(),liveLayers(Math.round(zoom))));}catch(e){}}
function prefetchBounds(bounds,opts){try{const r=map._getBoundsCenterZoom(bounds,opts);prefetchView(r.center,r.zoom);}catch(e){}}
function flyToSite(lat,lng,cb){prefetchView([lat,lng],14);map.flyTo([lat,lng],14,{duration:.7});if(cb)setTimeout(cb,720);}

/* ===== MAPA OFFLINE =====
   Downloads the street-level tiles (zoom 13–16) around every stop, treasure and the Airbnb into
   the service worker, so in Toronto the map opens instantly and works without data. */
function offlineUrls(){
  const pts=[];TRIP.forEach(d=>d.sites.forEach(s=>pts.push([s.lat,s.lng])));SPOTS.forEach(s=>pts.push([s.lat,s.lng]));LODGING.forEach(s=>pts.push([s.lat,s.lng]));
  const set=new Set(),ring={13:1,14:1,15:1,16:1};
  pts.forEach(([la,lo])=>{for(const z of [13,14,15,16]){const p=map.project([la,lo],z).divideBy(TILE_PX).floor(),r=ring[z];
    for(let x=p.x-r;x<=p.x+r;x++)for(let y=p.y-r;y<=p.y+r;y++){set.add(tileUrl(layers.sat,x,y,z));set.add(tileUrl(layers.satLabels,x,y,z));}}});
  return[...set];}
function offlineSaveUI(){
  const box=$('offlineBox');if(!box||!MAP_OK)return;
  const urls=offlineUrls(),imgs=urls.filter(u=>u.includes('World_Imagery')).length,mb=Math.round(imgs*22/1024);
  const done=localStorage.getItem(CFG.wxKey+':offline');
  box.innerHTML=`<div class="cnote">Baja el satélite con calles de los <b>${TRIP.reduce((a,d)=>a+d.sites.length,0)+SPOTS.length} lugares</b> del viaje (zoom de calle). Así en Toronto el mapa abre al toque y funciona sin datos. Son ~${mb} MB: hacelo con Wi-Fi.${done?`<br><b style="color:var(--good)">✓ Guardado el ${done}.</b> Podés repetirlo si agregaste lugares.`:''}</div>
    <button class="btn" id="offlineBtn" style="margin-top:10px">📥 ${done?'Actualizar':'Guardar'} el mapa offline</button><div class="cnote" id="offlineProg" style="margin-top:8px"></div>`;
  $('offlineBtn').onclick=()=>runOffline(urls);
}
async function runOffline(urls){
  const btn=$('offlineBtn'),prog=$('offlineProg');btn.disabled=true;btn.textContent='Descargando…';
  const show=(n,t,f)=>{prog.innerHTML=`${n} / ${t} pedazos del mapa${f?` · ${f} fallaron`:''}`;};
  const finish=(f)=>{const d=new Date().toLocaleDateString('es-CR',{day:'numeric',month:'short'});try{localStorage.setItem(CFG.wxKey+':offline',d);}catch(e){}
    btn.disabled=false;btn.textContent='📥 Actualizar el mapa offline';prog.innerHTML=`<b style="color:var(--good)">✓ Listo:</b> ${urls.length-f} pedazos guardados${f?` (${f} fallaron: repetilo con mejor señal)`:''}.`;};
  const sw=navigator.serviceWorker&&navigator.serviceWorker.controller;
  if(sw){const ch=new MessageChannel();ch.port1.onmessage=e=>{const m=e.data||{};if(m.type==='progress')show(m.done,m.total,m.failed);if(m.type==='done')finish(m.failed||0);};
    sw.postMessage({type:'offline-tiles',urls},[ch.port2]);return;}
  /* sin service worker todavía (primera visita): el navegador los guarda en su caché normal */
  let i=0,f=0,n=0;const next=async()=>{while(i<urls.length){const u=urls[i++];try{await fetch(u,{mode:'cors'});}catch(e){f++;}show(++n,urls.length,f);}};
  await Promise.all(Array.from({length:6},next));finish(f);
}
function applyVisibility(){
  eachMarker(m=>{let show=(activeFilter==='all'||m._fc===activeFilter||(activeFilter==='hot'&&m._hot));if(m._kind==='site'&&openDay!==null)show=show&&(m._di===openDay);show?m.addTo(map):map.removeLayer(m);});
  Object.entries(dayLines).forEach(([k,arr])=>arr.forEach(l=>{const glow=l.options.className==='route-glow';let op;if(openDay===null)op=glow?.16:.85;else op=(+k===openDay)?(glow?.32:1):(glow?.03:.08);l.setStyle({opacity:op});}));
}
function fitAll(animate=true){
  const all=[];TRIP.forEach(d=>d.sites.forEach(s=>all.push([s.lat,s.lng])));
  const wide=window.innerWidth>900,opts={paddingTopLeft:[wide?372:30,116],paddingBottomRight:[wide?40:30,wide?60:90]};
  animate?map.flyToBounds(L.latLngBounds(all),{...opts,duration:.8}):map.fitBounds(L.latLngBounds(all),{...opts,animate:false});
}
function fitVisible(){const pts=[];eachMarker(m=>{if(map.hasLayer(m))pts.push(m.getLatLng());});if(!pts.length)return;const wide=window.innerWidth>900;map.flyToBounds(L.latLngBounds(pts),{paddingTopLeft:[wide?372:30,116],paddingBottomRight:[wide?40:30,wide?70:96],maxZoom:14,duration:.7});}
function resetView(refit){openDay=null;document.querySelectorAll('.day').forEach(d=>d.classList.remove('open'));applyVisibility();setNow();if(refit)fitAll();}

function renderDayLayers(){
  Object.values(dayLines).forEach(arr=>arr.forEach(l=>map.removeLayer(l)));dayLines={};
  dayMarkers.forEach(m=>map.removeLayer(m));dayMarkers.length=0;
  TRIP.forEach((day,di)=>{
    const c=DAYCOL[di];day.c=c;dayLines[di]=[];
    const path=(ROUTES[di]&&ROUTES[di].length>1)?ROUTES[di]:day.sites.map(s=>[s.lat,s.lng]);
    if(path.length>1){
      /* one solid line per day (the glow + dash pair doubled canvas redraws on every frame) */
      dayLines[di].push(L.polyline(path,{className:'route-main',color:c,weight:4,opacity:.9,lineCap:'round',lineJoin:'round',interactive:false,smoothFactor:2}).addTo(map));
    }
  });
  let mi=0;
  TRIP.forEach((day,di)=>{const c=DAYCOL[di];day.sites.forEach((s,si)=>{
    const first=si===0,delay=Math.min(mi*0.012,.35).toFixed(2);
    const html=first?`<div class="mk seal-m" style="--c:${c};animation-delay:${delay}s">${day.n}</div>`:`<div class="mk pin" style="--c:${c};animation-delay:${delay}s">${s.ic}</div>`;
    const icon=L.divIcon({html,className:'',iconSize:first?[40,40]:[30,30],iconAnchor:first?[20,20]:[15,15]});
    const m=L.marker([s.lat,s.lng],{icon,riseOnHover:true}).addTo(map);
    m._fc=s.fc;m._di=di;m._kind='site';m._s=s;m._hot=!!s.hot;
    m.bindPopup(popHtml({pc:c,cat:FCLBL[s.fc]||s.fc,name:s.name,ic:s.ic,pk:s.pk,metaLine:`◷ ${s.t} &nbsp;·&nbsp; ${day.wx}${s.p?` &nbsp;·&nbsp; 💵 ${s.p}`:''}${s.hot?`<br>🔥 ${s.hot}`:''}`,note:s.note,badge:`Día ${day.n} · ${day.date}`,lat:s.lat,lng:s.lng}),{className:'t-pop',maxWidth:272,minWidth:272,autoPanPadding:[40,90]});
    dayMarkers.push(m);mi++;
  });});
  applyVisibility();
}
function initMap(){
  map=L.map('map',{zoomControl:true,attributionControl:true,renderer:L.canvas({padding:.5,tolerance:0}),minZoom:4,maxZoom:17,preferCanvas:true,zoomSnap:.5,wheelPxPerZoomLevel:90}).setView(CFG.center,CFG.zoom);
  layers={
    sat:L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,crossOrigin:true,subdomains:['server','services'],updateWhenZooming:false,keepBuffer:4,attribution:'Imagery © Esri, Maxar'}),
    satLabels:L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,crossOrigin:true,subdomains:['server','services'],updateWhenZooming:false}),
    terr:L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,crossOrigin:true,subdomains:['server','services'],attribution:'© Esri'}),
    /* "Mapa": Esri dark base + its labels as two layers, so the labels can wait for the base like on
       satellite. (CARTO's free dark tiles now come back stamped "API KEY REQUIRED" — checked 2026-11-20.) */
    dark:L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:16,maxZoom:18,crossOrigin:true,subdomains:['server','services'],attribution:'© Esri'}),
    darkRef:L.tileLayer('https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:16,maxZoom:18,crossOrigin:true,subdomains:['server','services']})
  };
  SPOTS.forEach(sp=>{const c=FCCOL[sp.cat]||'#93A4BC';sp.c=c;
    const icon=L.divIcon({html:`<div class="mk spot" style="--c:${c}">${sp.ic}</div>`,className:'',iconSize:[28,28],iconAnchor:[14,14]});
    const m=L.marker([sp.lat,sp.lng],{icon,riseOnHover:true}).addTo(map);
    m._fc=sp.cat;m._di=null;m._kind='spot';m._sp=sp;m._hot=!!sp.hot;
    m.bindPopup(popHtml({pc:c,cat:FCLBL[sp.cat]||sp.cat,name:sp.name,ic:sp.ic,pk:sp.pk,metaLine:`✦ ${sp.city}${sp.p?` &nbsp;·&nbsp; 💵 ${sp.p}`:''}`,note:sp.note,badge:sp.hot?`🔥 ${sp.hot}`:`Tesoro · ${sp.city}`,lat:sp.lat,lng:sp.lng,ig:sp.ig}),{className:'t-pop',maxWidth:272,minWidth:272,autoPanPadding:[40,90]});
    sp._m=m;spotMarkers.push(m);
  });
  LODGING.forEach(lg=>{
    const icon=L.divIcon({html:`<div class="mk home" title="${lg.name}">🏠</div>`,className:'',iconSize:[32,32],iconAnchor:[16,16]});
    const m=L.marker([lg.lat,lg.lng],{icon,riseOnHover:true}).addTo(map);
    m._kind='stay';m._fc='hotel';m._di=null;
    m.bindPopup(stayPopHtml(lg),{className:'t-pop',maxWidth:272,minWidth:272,autoPanPadding:[40,90]});
    lg._m=m;
  });
  renderDayLayers();
  MAP_OK=true;
  map.on('zoomend',syncLabels);
  map.invalidateSize();fitAll(false);
  setView(curView);
  offlineSaveUI();
}
function showMapError(){document.body.classList.add('mapfail');}

/* ===== BOOT ===== */
function ensureLeaflet(cb){
  if(window.L)return cb(true);
  const s=document.createElement('script');
  s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.onload=()=>cb(!!window.L);s.onerror=()=>cb(false);
  document.head.appendChild(s);
}
buildPanels();
setNow();
loadWeather();
ensureLeaflet(function(ok){ if(ok){ try{initMap();}catch(e){console.error(e);showMapError();} } else { showMapError(); }
  if(TODAY_I>=0 && TODAY_I<TRIP.length){ setTimeout(()=>focusDay(TODAY_I),300); }
});
