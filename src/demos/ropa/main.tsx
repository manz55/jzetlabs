import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import RopaDemo from './RopaDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RopaDemo />
  </StrictMode>,
)
