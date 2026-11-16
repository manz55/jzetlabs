import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import CosmeticosDemo from './CosmeticosDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CosmeticosDemo />
  </StrictMode>,
)
