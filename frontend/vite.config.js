// vite.config.js — Vite build tool configuration
// This file tells Vite to use the React plugin (JSX support)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // The React plugin enables JSX transformation and Fast Refresh
    // (Fast Refresh = components update in-browser without losing state)
    react(),
  ],
  server: {
    // The port the frontend dev server listens on
    port: 5173,
  },
});
