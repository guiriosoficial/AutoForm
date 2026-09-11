import path from "node:path";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import manifest, { APP_ID, APP_NAME, APP_VERSION } from "./manifest.config";

const defineVariables = {
  __APP_ID__: JSON.stringify(APP_ID),
  __APP_NAME__: JSON.stringify(APP_NAME),
  __APP_VERSION__: JSON.stringify(APP_VERSION),
};

export default defineConfig({
  define: defineVariables,
  resolve: {
    alias: {
      "@": `${path.resolve(import.meta.dirname, "src")}`,
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: `crx-${APP_ID}-${APP_VERSION}.zip` }),
    {
      name: "html-transform",
      transformIndexHtml(html) {
        let transformedHtml = html;
        for (const [key, value] of Object.entries(defineVariables)) {
          const rawValue = String(value).replaceAll(/^"|"$/gu, "");
          transformedHtml = transformedHtml.replaceAll(`%${key}%`, rawValue);
        }
        return transformedHtml;
      },
    },
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//u],
    },
  },
});
