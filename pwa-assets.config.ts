import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

/**
 * Genera los íconos de la PWA (192/512, maskable, apple-touch, favicon)
 * a partir del SVG de marca. Lo consume vite-plugin-pwa (pwaAssets).
 */
export default defineConfig({
  preset: minimal2023Preset,
  images: ['public/favicon.svg'],
})
