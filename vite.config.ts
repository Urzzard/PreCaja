import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // El service worker se actualiza solo al desplegar una versión nueva.
      registerType: 'autoUpdate',
      // Genera e inyecta los íconos desde pwa-assets.config.ts.
      pwaAssets: { config: true },
      manifest: {
        name: 'PreCaja',
        short_name: 'PreCaja',
        description:
          'Tu total aproximado en vivo mientras haces compras. Funciona offline.',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        theme_color: '#059669',
        background_color: '#0f172a',
        categories: ['shopping', 'finance', 'productivity'],
      },
      workbox: {
        // Precachea la app para que abra sin red.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
})
