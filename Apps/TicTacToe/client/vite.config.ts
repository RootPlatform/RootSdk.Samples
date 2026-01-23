import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    open: true,
  },
  plugins: [react(), hotReload(), checker({ typescript: true })],
});

function hotReload(): import("vite").Plugin {
  return {
    name: "hotreload-hmr",
    enforce: "post",
    handleHotUpdate({ file, server }) {
      if (
        file.endsWith(".json") ||
        file.endsWith(".tsx") ||
        file.endsWith(".ts")
      ) {
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}
