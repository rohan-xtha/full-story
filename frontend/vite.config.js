// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/full-story/", // Replace with your repo name (e.g., '/your-repo-name/')
});
