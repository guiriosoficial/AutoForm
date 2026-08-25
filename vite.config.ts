import path from 'node:path'
import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack'
import tailwindcss from "@tailwindcss/vite";
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import manifest, {
  APP_NAME,
  APP_VERSION,
  APP_ID
} from './manifest.config'

export default defineConfig({
  define: {
    __APP_NAME__: APP_NAME,
    __APP_VERSION__: APP_VERSION,
    __APP_ID__: APP_ID
  },
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${APP_ID}-${APP_VERSION}.zip` }),
  ],
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
})
