import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import zip from "vite-plugin-zip-pack";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: {
        "@": `${path.resolve(import.meta.dirname, "src")}`,
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      crx({ manifest }),
      zip({ outDir: "release", outFileName: `crx-${env.VITE_APP_ID}-${env.VITE_APP_VERSION}.zip` }),
    ],
    server: {
      cors: {
        origin: [/chrome-extension:\/\//u],
      },
    },
    build: {
      rollupOptions: {
        input: {
          app: path.resolve(
            import.meta.dirname,
            "src/entrypoints/app/index.html",
          ),
          sandbox: path.resolve(
            import.meta.dirname,
            "src/entrypoints/sandbox/index.html",
          ),
        },
      },
    },
  }
});
