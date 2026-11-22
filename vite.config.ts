
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: null,

      injectManifest: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,webp}'
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },

      manifest: false,

      devOptions: {
        enabled: false
      }
    })
  ]
});
