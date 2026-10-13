import { defineManifest } from "@crxjs/vite-plugin";
import { version, name } from "./package.json";

export const APP_VERSION = version;
export const APP_ID = name;
export const APP_NAME = APP_ID.replaceAll(/(?:^|-)\w/gu, (match) => match.slice(-1).toUpperCase());

export default defineManifest(
  {
    manifest_version: 3,
    name: APP_NAME,
    version: APP_VERSION,
    browser_specific_settings: {
      gecko: {
        id: "autoform@guiriosoficial.com",
        data_collection_permissions: {
          required: ["none"],
          optional: [],
        },
      },
    },
    icons: {
      48: "public/logo.png",
    },
    action: {
      default_icon: { 48: "public/logo.png" },
      default_popup: "src/entrypoints/app/index.html",
      default_title: APP_NAME,
    },
    side_panel: {
      default_path: "src/entrypoints/app/index.html",
    },
    permissions: [
      "scripting",
      "activeTab",
      "storage",
      "sidePanel",
    ],
    content_scripts: [
      {
        js: ["src/entrypoints/content/main.ts"],
        matches: ["https://*/*", "http://*/*"],
      },
    ],
    sandbox: {
      pages: ["src/entrypoints/sandbox/index.html"],
    },
  }
);
