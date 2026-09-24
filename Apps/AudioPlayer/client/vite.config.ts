import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    // Audio is already compressed. Inlining it as a data URI would only bloat
    // the JavaScript bundle.
    assetsInlineLimit: 0,
  },
  server: {
    open: true,
  },
  plugins: [react(), checker({ typescript: true })],
});
