import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import CelularesDemo from './CelularesDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CelularesDemo />
  </StrictMode>,
)
