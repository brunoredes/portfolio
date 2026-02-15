/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((_) => ({
  build: {
    target: ['es2023'],
    cssMinify: 'lightningcss',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          // Service worker must be at root for proper scope
          if (chunkInfo.name === 'service-worker') {
            return 'service-worker.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
      input: {
        main: './index.html',
        'service-worker': './src/service-worker.ts'
      }
    }
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      ssr: false,
      static: true,
      prerender: {
        routes: async () => ['/', '/home', {
          route: '/home',
          staticData: true
        }, '/privacy-policy'],
        sitemap: {
          host: 'https://donatelli.dev',
        },
      },
      nitro: {
        preset: 'static',
      },
    }),
  ]
}));
