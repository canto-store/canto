const CACHE_NAME = "canto-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/offline.html",
  "/apple-touch-icon.png",
  "/apple-touch-icon-120x120.png",
  "/apple-touch-icon-152x152.png",
  "/apple-touch-icon-167x167.png",
  "/apple-splash-750-1334.png",
  "/apple-splash-828-1792.png",
  "/apple-splash-1125-2436.png",
  "/apple-splash-1242-2208.png",
  "/apple-splash-1242-2688.png",
  "/apple-splash-1536-2048.png",
  "/apple-splash-1668-2388.png",
  "/apple-splash-2048-2732.png",
];

// Version number - increment this when you want to force an update
const VERSION = "1.0.3";

// Install event - cache core assets
self.addEventListener("install", (event) => {
  console.log(`[Service Worker] Installing new version ${VERSION}`);

  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each asset individually to handle failures gracefully
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((error) => {
            console.error(`Failed to cache asset ${url}:`, error);
          }),
        ),
      );
    }),
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
      }),
  );
});

// Simplified fetch event handler for better Safari compatibility
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Simple network-first strategy for all requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(async () => {
        // Try to get a cached version
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's a navigation request, return the offline page
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html") || caches.match("/");
        }

        // Return a basic error response for other requests
        return new Response("Network error occurred", {
          status: 408,
          headers: { "Content-Type": "text/plain" },
        });
      }),
  );
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Handle periodic sync for iOS (not fully supported but future-proofing)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "refresh-content") {
    event.waitUntil(refreshContent());
  }
});

// Function to refresh content in the background
async function refreshContent() {
  try {
    // Fetch the main page to refresh the cache
    const response = await fetch("/");
    const cache = await caches.open(CACHE_NAME);
    await cache.put("/", response);
    console.log("Content refreshed in background");
  } catch (error) {
    console.error("Failed to refresh content:", error);
  }
}
