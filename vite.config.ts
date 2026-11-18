import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// En las demos, el navegador espera a que la página esté lista antes de pintarla,
// para que el cambio suave entre demos (view transitions) muestre la página nueva y no una en blanco.
const pinturaCompleta = {
  name: 'pintura-completa',
  transformIndexHtml: {
    order: 'post' as const,
    handler: (html: string, ctx: { path: string }) =>
      ctx.path.startsWith('/demos/') ? html.replace(/<script type="module" crossorigin/g, '<script type="module" blocking="render" crossorigin') : html,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pinturaCompleta],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      // dos páginas: la Home (/) y la de páginas web para negocios (/web)
      input: {
        main: resolve(__dirname, 'index.html'),
        web: resolve(__dirname, 'web/index.html'),
        demoTienda: resolve(__dirname, 'demos/tienda/index.html'),
        demoRopa: resolve(__dirname, 'demos/ropa/index.html'),
        demoCosmeticos: resolve(__dirname, 'demos/cosmeticos/index.html'),
        demoFundadora: resolve(__dirname, 'demos/fundadora/index.html'),
        demoCelulares: resolve(__dirname, 'demos/celulares/index.html'),
        demoBoutique: resolve(__dirname, 'demos/boutique/index.html'),
        demoRestaurante: resolve(__dirname, 'demos/restaurante/index.html'),
        demoTiempo: resolve(__dirname, 'demos/tiempo-compartido/index.html'),
        demoClinica: resolve(__dirname, 'demos/clinica/index.html'),
        demoPerfil: resolve(__dirname, 'demos/perfil-belleza/index.html'),
        demoSalon: resolve(__dirname, 'demos/salon/index.html'),
        demoPasteleria: resolve(__dirname, 'demos/pasteleria/index.html'),
        demoGimnasio: resolve(__dirname, 'demos/gimnasio/index.html'),
      },
    },
  },
})
