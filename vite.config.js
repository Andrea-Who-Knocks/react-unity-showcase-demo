// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/react-unity-showcase-demo/", // Must match your GitHub repository name
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    // Ensure that assets are properly referenced
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
