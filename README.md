# Jzet Labs — landing

Página de presentación de Josh (https://jzetlabs.vercel.app). Hermana de **La tienda · por Jzetlabs** (https://latienda-jzetlabs.vercel.app/portafolio/): la landing es para conocerme y confiar; La tienda es para comprar.

- React + Vite + Tailwind 4. Efectos con **anime.js 4.4.1** por CDN con SRI (`index.html`); si no carga o hay "reducir movimiento", todo se ve quieto y completo (`src/lib/anime.ts`).
- Precios en `src/data/pricing.ts`: tienen que cuadrar EXACTO con La tienda.
- `public/assets/*.jpg`: fotos que La tienda carga con esos nombres exactos. No renombrar ni borrar.
- Se publica sola al subir a `main` (Vercel conectado a GitHub).

```bash
npm install
npm run dev
```
