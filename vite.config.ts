/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, type Plugin } from 'vite';

/**
 * Converts Vite's auto-injected CSS <link> tags from render-blocking to
 * non-blocking using the media="print" onload trick.
 *
 * Safe because all critical CSS is already inlined in <head> <style>.
 * Vite-injected links have the `crossorigin` attribute, so we target those.
 */
function deferAutoInjectedCss(): Plugin {
  return {
    name: 'defer-auto-injected-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+)">/g,
        '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'">'
      );
    },
  };
}

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
    deferAutoInjectedCss(),
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
