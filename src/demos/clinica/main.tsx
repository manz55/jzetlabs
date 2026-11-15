import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import ClinicaDemo from './ClinicaDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClinicaDemo />
  </StrictMode>,
)
