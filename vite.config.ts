import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
      },
    },
  },
})
