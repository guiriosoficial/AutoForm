import { defineManifest } from "@crxjs/vite-plugin";
import { loadEnv } from "vite";

export default defineManifest(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    manifest_version: 3,
    name: env.VITE_APP_NAME,
    version: env.VITE_APP_VERSION,
    icons: {
      48: "public/logo.png",
    },
    action: {
      default_icon: { 48: "public/logo.png" },
      default_popup: "src/entrypoints/app/index.html",
      default_title: env.VITE_APP_NAME,
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
  };
});
