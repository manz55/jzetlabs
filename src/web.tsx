import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PaginaWeb from './web/PaginaWeb.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaginaWeb />
  </StrictMode>,
)
