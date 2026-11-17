import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../index.css'
import LujoDemo from './LujoDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LujoDemo />
  </StrictMode>,
)
