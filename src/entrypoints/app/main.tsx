import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from '@/views/app/App'
import '@/assets/styles/globals.css'
import '@/i18n'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
