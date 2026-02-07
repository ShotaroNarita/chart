import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@modyfi/vite-plugin-yaml";
import path from "path";

export default defineConfig({
  plugins: [react(), yaml()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
