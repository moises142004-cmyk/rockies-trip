# Jime & Moi — Toronto + Niagara 🍁

Planner del viaje de invierno **24 Dic 2026 – 2 Ene 2027**: base en Toronto con días de huskies + snow tubing y Niagara Falls. **Vuelos comprados** (Porter PD790 SJO→YYZ 23–24 dic · Air Transat TS112 YYZ→SJO 2 ene). La raíz `/` redirige a `toronto.html`.

`calgary.html` (ruta Calgary, Plan B) está **escondido**: no aparece en el menú. `/` sirve `toronto.html` (rewrite, sin redirect).

- **`ahorro.html` — Ahorro** · plan de ahorro hasta el viaje. Los ingresos NO están en el código: se cargan con un link personal (`#ing=…&sal=…`) y viven en localStorage del dispositivo.

Sitio estático, sin build ni dependencias de servidor. Secciones:

- **`toronto.html` — Mapa principal** · itinerario de 10 días, presupuesto y checklist de lo que falta reservar (`toronto-routes.js`, `toronto-photos.js`).
- **`calgary.html` — Plan B (Rockies, escondido)** · itinerario de 7 días (base doble: Calgary + Canmore), rutas que siguen calles reales (geometría OSRM horneada en `routes.js`), marcadores y galerías de fotos reales (`photos.js`) por cada punto.
- **`inventario.html` — Inventario** · lista de empaque de invierno; marcar empacado, agregar ítems, marcar "comprado allá". Se guarda en el navegador (localStorage).
- **`costos.html` — Costos** · presupuesto en CAD con conversión en vivo a USD y colones. Se guarda en localStorage.

Archivos compartidos: `style.css` (sistema de diseño + nav) y `store.js` (helpers de localStorage).

> Nota: los datos de Inventario y Costos son **por dispositivo** (localStorage), no se sincronizan entre teléfonos/computadoras.

## Datos: rutas y fotos
- **Rutas** (`routes.js`): geometría de carretera precalculada con OSRM (`overview=simplified`) y horneada como `[lat,lng]` por día — funciona sin red ni API key.
- **Fotos** (`photos.js`): URLs reales hotlinkeadas, keyed por `pk`. Wikimedia (`Special:FilePath`, hotlink-safe) para landmarks; sitios oficiales para negocios. Si una imagen falla, cae a un placeholder con ícono.

## Local
Servir la carpeta (no abrir con `file://`, para que localStorage funcione por origen):
```bash
python3 -m http.server 8765
# abrir http://localhost:8765
```

## Deploy
Auto-deploy a Vercel en cada `git push` a `main`.
