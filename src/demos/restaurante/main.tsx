import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import RestauranteDemo from './RestauranteDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RestauranteDemo />
  </StrictMode>,
)
