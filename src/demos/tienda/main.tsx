import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import TiendaDemo from './TiendaDemo.tsx'

// la tienda de ropa ahora tiene su propia página
const t = new URLSearchParams(location.search).get('tipo')
if (t !== 'restaurante' && t !== 'tiempo') location.replace('/demos/ropa/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TiendaDemo />
  </StrictMode>,
)
