import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://donatelli.dev',
  outDir: './dist/analog/public',
  integrations: [sitemap()],
});
