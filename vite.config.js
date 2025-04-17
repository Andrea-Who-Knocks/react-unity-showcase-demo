import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/react-unity-showcase-demo/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0, // Don't inline any assets as base64
    rollupOptions: {
      output: {
        // Ensure proper file extensions for all output files
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
});
