import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import TiendaDemo from './TiendaDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TiendaDemo />
  </StrictMode>,
)
