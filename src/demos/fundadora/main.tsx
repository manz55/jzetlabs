import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import FundadoraDemo from './FundadoraDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FundadoraDemo />
  </StrictMode>,
)
