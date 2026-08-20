import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/content/views/App.tsx'
import '@/content/views/index.css'
import '@/locales/i18n'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
