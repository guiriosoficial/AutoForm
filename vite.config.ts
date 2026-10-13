import path from "node:path";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import manifest, { APP_ID, APP_NAME, APP_VERSION } from "./manifest.config";

export default defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(import.meta.dirname, "src")}`,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest }),
    zip({
      outDir: "release",
      outFileName: `crx-${APP_ID}-${APP_VERSION}.zip`,
    }),
  ],
  define: {
    "import.meta.env.VITE_APP_ID": JSON.stringify(APP_ID),
    "import.meta.env.VITE_APP_NAME": JSON.stringify(APP_NAME),
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(APP_VERSION),
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//u],
    },
  },
});
