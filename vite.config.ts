/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig((_) => ({
  build: {
    target: ['es2023'],
    cssMinify: 'lightningcss'
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
        }]
      },
    }),
  ],
}));
