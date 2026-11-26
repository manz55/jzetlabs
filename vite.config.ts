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
        demoDistribuidora: resolve(__dirname, 'demos/distribuidora/index.html'),
        demoPlanilla: resolve(__dirname, 'demos/planilla/index.html'),
        muestraTuStore: resolve(__dirname, 'muestras/tustore/index.html'),
        muestraStudioPrivee: resolve(__dirname, 'muestras/studioprivee/index.html'),
        demoEventos: resolve(__dirname, 'demos/eventos/index.html'),
        demoPediatria: resolve(__dirname, 'demos/pediatria/index.html'),
        demoVeterinaria: resolve(__dirname, 'demos/veterinaria/index.html'),
        demoMedicina: resolve(__dirname, 'demos/medicina/index.html'),
        demoOftalmologia: resolve(__dirname, 'demos/oftalmologia/index.html'),
        demoTaller: resolve(__dirname, 'demos/taller/index.html'),
        demoFerreteria: resolve(__dirname, 'demos/ferreteria/index.html'),
        demoHotel: resolve(__dirname, 'demos/hotel/index.html'),
        demoMedio: resolve(__dirname, 'demos/medio-comunicacion/index.html'),
      },
    },
  },
})
