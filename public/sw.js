const CACHE_NAME = "canto-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/logo.svg",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/offline.html",
];

// Version number - increment this when you want to force an update
const VERSION = "1.0.1";

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
  return STATIC_ASSETS.some((asset) => request.url.endsWith(asset));
};

// Fetch event - improved caching strategy with better offline support
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Handle navigation requests
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
          // If no cached version, return cached home page as fallback
          return caches.match("/");
        }),
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cachedResponse) => cachedResponse || fetch(event.request)),
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
