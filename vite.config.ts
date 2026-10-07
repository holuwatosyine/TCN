import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "5173-itvbzjx93pquccbin5kql-78bd9a0b.us1.manus.computer",
      "4173-ih5d7qcy2d1l4y3c7316b-3fed1ece.us1.manus.computer",
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
