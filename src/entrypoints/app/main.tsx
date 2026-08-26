import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { App } from '@/views/App'
import { Toaster } from "@/components/ui/toast";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { AppSettingsProvider } from "@/providers/AppSettingsProvider";
import '@/assets/styles/globals.css'
import '@/i18n'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <NavigationProvider>
        <AppSettingsProvider>
          <Toaster />
          <App />
        </AppSettingsProvider>
      </NavigationProvider>
    </StrictMode>,
  )
