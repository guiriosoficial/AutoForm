import { defineManifest } from '@crxjs/vite-plugin'
import { APP_NAME, APP_VERSION } from "./src/configs";

export default defineManifest({
  manifest_version: 3,
  name: APP_NAME,
  version: APP_VERSION,
  icons: {
    48: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'src/entrypoints/app/index.html',
  },
  permissions: [
    'storage',
    'sidePanel',
    'contentSettings',
  ],
  // content_scripts: [{
  //   js: ['src/content/main.tsx'],
  //   matches: ['https://*/*'],
  // }],
  side_panel: {
    default_path: 'src/entrypoints/app/index.html',
  },
})
