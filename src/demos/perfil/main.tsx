import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import PerfilDemo from './PerfilDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PerfilDemo />
  </StrictMode>,
)
