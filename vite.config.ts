import vue from "@vitejs/plugin-vue";

import { defineConfig } from "vite";
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: "0.0.0.0",
    port: 8000,
    strictPort: true,
    open: true,
  },
  plugins: [vue(), vueJsx()],
});
