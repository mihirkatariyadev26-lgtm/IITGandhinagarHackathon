import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "autobrandaifrontend.onrender.com",
      ".onrender.com", // Allow all Render subdomains
    ],
    host: true, // Listen on all addresses including 0.0.0.0
    port: process.env.PORT || 4173,
  },
});
