const CACHE_NAME = "canto-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/offline.html",
  // Add Apple-specific assets
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
const VERSION = "1.0.2";

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

// Helper function to determine if a request is a navigation request
const isNavigationRequest = (request) => {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  );
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  return STATIC_ASSETS.some((asset) => url.pathname === asset);
};

// Helper function to determine if a request is for an image
const isImageRequest = (request) => {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
};

// Fetch event - improved caching strategy with better offline support
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Handle navigation requests with network-first strategy
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful navigation responses
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(async () => {
          // Try to get a cached version of the page
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cached version, return cached offline page as fallback
          return caches.match("/offline.html") || caches.match("/");
        }),
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache, try to fetch it
          return fetch(event.request).then((response) => {
            // Cache the fetched response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          });
        })
        .catch(() => {
          // For critical assets like icons, return a fallback if possible
          if (event.request.url.includes("icon")) {
            return caches.match("/logo.svg");
          }
          return new Response("Asset not available", {
            status: 404,
            headers: { "Content-Type": "text/plain" },
          });
        }),
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not in cache, try to fetch it
        return fetch(event.request)
          .then((response) => {
            // Cache the fetched response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Return a placeholder image or null
            return new Response("Image not available", {
              status: 404,
              headers: { "Content-Type": "text/plain" },
            });
          });
      }),
    );
    return;
  }

  // Handle all other requests with network-first strategy
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
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Return a basic error response if no cached version exists
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
