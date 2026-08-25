import { defineManifest } from '@crxjs/vite-plugin'
import { name, version } from './package.json'

export const APP_NAME = name.replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase());
export const APP_VERSION = version;
export const APP_ID = name;

export default defineManifest({
  manifest_version: 3,
  name: APP_NAME,
  version: APP_VERSION,
  icons: {
    48: 'public/logo.png',
  },
  action: {
    default_icon: { 48: 'public/logo.png' },
    default_popup: 'src/entrypoints/app/index.html',
  },
  side_panel: {
    default_path: 'src/entrypoints/app/index.html',
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
})
