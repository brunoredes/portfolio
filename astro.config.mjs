import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://donatelli.dev',
	output: 'static',
	integrations: [
		mdx(),
		sitemap(),
		// AstroPWA({
		// 	registerType: 'autoUpdate',
		// 	pwaAssets: { config: true },
		// 	manifest: {
		// 		name: 'Bruno Donatelli — Portfolio',
		// 		short_name: 'Donatelli',
		// 		description: 'Portfólio de Bruno Donatelli — full stack developer.',
		// 		lang: 'pt-BR',
		// 		start_url: '/',
		// 		display: 'standalone',
		// 		theme_color: '#5b45e0',
		// 		background_color: '#1b1730',
		// 	},
		// 	workbox: {
		// 		globPatterns: ['**/*.{html,js,css,woff2,svg,png,ico}'],
		// 		navigateFallback: '/',
		// 		navigateFallbackDenylist: [/^\/api\//],
		// 		runtimeCaching: [
		// 			{
		// 				urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
		// 				handler: 'StaleWhileRevalidate',
		// 				options: { cacheName: 'google-fonts-css' },
		// 			},
		// 			{
		// 				urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
		// 				handler: 'CacheFirst',
		// 				options: { cacheName: 'google-fonts-files', expiration: { maxEntries: 20 } },
		// 			},
		// 		],
		// 	},
		// }),
	],
	compressHTML: true,
});
