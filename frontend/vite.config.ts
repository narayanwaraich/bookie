import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // <== IMPORTANT: makes it accessible over network
    port: Number(process.env.PORT) || 3001, // <== optional: choose your port
    strictPort: true, // optional: prevent auto port changes
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../backend/src"),
    },
  },
});
