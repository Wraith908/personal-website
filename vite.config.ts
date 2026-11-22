import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const commit =
  process.env.COMMIT_REF ||
  execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8'
  }).trim();

const buildId = commit.slice(0, 7);
const buildDate = new Date().toISOString();

export default defineConfig({

  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __BUILD_DATE__: JSON.stringify(buildDate)
  },

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
