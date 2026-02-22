// Service Worker for Portfolio - Bruno Donatelli
// @ts-nocheck

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
];

// Runtime cache strategies
const CACHE_STRATEGIES = {
  // Cache-first: Static assets (long-lived, immutable)
  cacheFirst: [
    /\.(woff2?|ttf|otf|eot)$/, // Fonts
    /\.(avif|webp|jpg|jpeg|png|gif|svg)$/, // Images
    /\.css$/, // Styles
    /\.js$/, // Scripts
  ],

  // Network-first: HTML pages (fresh content preferred)
  networkFirst: [/\.html$/],

  // Stale-while-revalidate: API calls, dynamic content
  staleWhileRevalidate: [/\/api\//],
};

/**
 * Install event - precache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets:', PRECACHE_ASSETS);
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Force activation immediately
        return self.skipWaiting();
      })
  );
});

/**
 * Activate event - clean old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - apply caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests (e.g., Google Analytics, fonts.googleapis.com)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Determine strategy based on URL pattern
  const strategy = getStrategy(url.pathname);

  event.respondWith(strategy(request));
});

/**
 * Get caching strategy for URL
 */
function getStrategy(pathname) {
  // Check cache-first patterns
  if (CACHE_STRATEGIES.cacheFirst.some((pattern) => pattern.test(pathname))) {
    return cacheFirstStrategy;
  }

  // Check network-first patterns
  if (CACHE_STRATEGIES.networkFirst.some((pattern) => pattern.test(pathname))) {
    return networkFirstStrategy;
  }

  // Check stale-while-revalidate patterns
  if (CACHE_STRATEGIES.staleWhileRevalidate.some((pattern) => pattern.test(pathname))) {
    return staleWhileRevalidateStrategy;
  }

  // Default: network-first
  return networkFirstStrategy;
}

/**
 * Cache-First Strategy
 * Best for: Fonts, images, versioned JS/CSS
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    throw error;
  }
}

/**
 * Network-First Strategy
 * Best for: HTML pages, API calls
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Network failed, trying cache:', error);

    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page if available
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }

    throw error;
  }
}

/**
 * Stale-While-Revalidate Strategy
 * Best for: API calls, frequently updated content
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Fetch in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  // Return cached response immediately if available
  return cachedResponse || fetchPromise;
}

/**
 * Message handler for cache updates
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
