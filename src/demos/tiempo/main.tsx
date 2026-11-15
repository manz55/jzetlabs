import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import TiempoDemo from './TiempoDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TiempoDemo />
  </StrictMode>,
)
