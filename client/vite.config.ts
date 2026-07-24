import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:5000" } },
  build: {
    // Tach vendor thanh cac chunk rieng -> cache tot hon, tai trang dau nhanh hon.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
              id,
            )
          )
            return "react-vendor";
          if (/[\\/]node_modules[\\/](recharts|d3-|victory|chart\.js)/.test(id)) return "charts";
          return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
