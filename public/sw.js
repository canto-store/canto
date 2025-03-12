const CACHE_NAME = "canto-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Version number - increment this when you want to force an update
const VERSION = "1.0.0";

// Install event - cache core assets
self.addEventListener("install", (event) => {
  console.log(`[Service Worker] Installing new version ${VERSION}`);

  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log(`[Service Worker] Activating new version ${VERSION}`);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => {
        // Claim clients to ensure the new service worker takes control immediately
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients that an update has occurred
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "UPDATE_AVAILABLE", version: VERSION });
          });
        });
      }),
  );
});

// Fetch event - simple cache-first for static assets, network-first for everything else
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Simple strategy: cache-first for static assets, network-first for everything else
  const isStaticAsset = STATIC_ASSETS.some((asset) =>
    event.request.url.endsWith(asset),
  );

  if (isStaticAsset) {
    // Cache-first for static assets
    event.respondWith(
      caches
        .match(event.request)
        .then((cachedResponse) => cachedResponse || fetch(event.request)),
    );
  } else {
    // Network-first for everything else
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .catch(() => {
          // Fallback for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return null;
        }),
    );
  }
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
