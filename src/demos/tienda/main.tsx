import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import TiendaDemo from './TiendaDemo.tsx'

// la tienda de ropa y el restaurante ahora tienen su propia página
const t = new URLSearchParams(location.search).get('tipo')
if (t === 'restaurante') location.replace('/demos/restaurante/')
else if (t !== 'tiempo') location.replace('/demos/ropa/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TiendaDemo />
  </StrictMode>,
)
