import React from 'react';
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    React(), 
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        name: "Gup-Shup Chat",
        short_name: "Gup-Shup",
        theme_color: "#FFD700",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
