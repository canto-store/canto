/**
 * Canto Service Worker powered by Workbox
 * This service worker handles caching strategies and offline functionality
 */

// Import Workbox from CDN (this will be replaced with the actual library at runtime)
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js",
);

// Check if Workbox loaded successfully
if (!workbox) {
  console.error("Workbox failed to load");
} else {
  console.log("Workbox loaded successfully!");

  // Force development logs in debug mode
  workbox.setConfig({ debug: false });

  // Customize the default cache names
  workbox.core.setCacheNameDetails({
    prefix: "canto",
    suffix: "v1",
    precache: "precache",
    runtime: "runtime",
  });

  // Skip waiting and claim clients
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precache manifest will be injected here by workbox-cli or other build tools
  // This is a placeholder that would normally be filled during build
  self.__WB_MANIFEST = self.__WB_MANIFEST || [];
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Precache specific static assets
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/offline.html", revision: "1" },
    { url: "/manifest.ts", revision: "1" },
    { url: "/logo.svg", revision: "1" },
    { url: "/web-app-manifest-192x192.png", revision: "1" },
    { url: "/web-app-manifest-512x512.png", revision: "1" },
    { url: "/apple-touch-icon.png", revision: "1" },
    { url: "/apple-touch-icon-120x120.png", revision: "1" },
    { url: "/apple-touch-icon-152x152.png", revision: "1" },
    { url: "/apple-touch-icon-167x167.png", revision: "1" },
  ]);

  // Cache page navigations (HTML) with a Network First strategy
  workbox.routing.registerRoute(
    // Check if the request is a navigation to an HTML page
    ({ request }) => request.mode === "navigate",
    new workbox.strategies.NetworkFirst({
      // Use a custom cache name
      cacheName: "canto-pages-cache",
      plugins: [
        // Cache for a maximum of 1 day
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 24 * 60 * 60,
          // Only cache 50 pages
          maxEntries: 50,
          // Automatically cleanup if quota is exceeded
          purgeOnQuotaError: true,
        }),
        // Return the offline page if network fails
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        // Fallback to offline page if network fails
        {
          handlerDidError: async () => {
            return await caches.match("/offline.html");
          },
        },
      ],
    }),
  );

  // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "worker",
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "canto-assets-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          maxEntries: 100,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // Cache images with a Cache First strategy
  workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "canto-images-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxEntries: 60,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // Cache fonts with a Cache First strategy
  workbox.routing.registerRoute(
    ({ request }) => request.destination === "font",
    new workbox.strategies.CacheFirst({
      cacheName: "canto-fonts-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
          maxEntries: 20,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // API calls with Network First strategy
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith("/api/"),
    new workbox.strategies.NetworkFirst({
      cacheName: "canto-api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 10 * 60, // 10 minutes
          maxEntries: 50,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // Handle offline analytics
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
    "analytics-queue",
    {
      maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
    },
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith("/api/analytics"),
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin],
    }),
    "POST",
  );

  // Catch routing errors, like when the network is unavailable
  workbox.routing.setCatchHandler(({ event }) => {
    // Return the precached offline page if a document is being requested
    if (event.request.destination === "document") {
      return caches.match("/offline.html");
    }

    // If we don't have a fallback, return an error response
    return Response.error();
  });

  // Listen for message events
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
}
