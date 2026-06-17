# Jime & Moi — Las Rockies 🏔️

Mapa interactivo del viaje a las Rockies canadienses (Calgary + Banff), Dic 26 2026 – Ene 1 2027.
Es un solo archivo estático (`index.html`). No necesita build ni dependencias.

## Deploy a Vercel — Opción A (CLI, lo más rápido)
```bash
npm i -g vercel
cd rockies-deploy
vercel            # primera vez abre el browser para login; luego deploya
vercel --prod     # para publicarlo en producción
```
Te devuelve la URL pública al instante.

## Deploy a Vercel — Opción B (GitHub + auto-deploy)
```bash
cd rockies-deploy
git init
git add .
git commit -m "Rockies trip map"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/rockies-trip.git
git push -u origin main
```
Luego en vercel.com/new → Import ese repo → Deploy.
Cada `git push` futuro redespliega solo.

## Local
Solo abrí `index.html` en el navegador. Listo.
