import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import PerfilDemo from './PerfilDemo.tsx'

// se pinta de una vez para que el cambio suave entre demos tenga la página nueva lista
const root = createRoot(document.getElementById('root')!)
flushSync(() => root.render(
  <StrictMode>
    <PerfilDemo />
  </StrictMode>,
))
