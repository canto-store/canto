/**
 * Canto HMR Fix for Service Workers
 * This script ensures hot module replacement works correctly with service workers
 * by unregistering them in development mode.
 */

(async function hmrFix() {
  // Only run in development mode
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "http:";

  if (!isDev) return;

  // Check if service worker is supported
  if (!("serviceWorker" in navigator)) return;

  try {
    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length === 0) return;

    console.log(
      "[HMR Fix] Unregistering service workers in development mode...",
    );

    // Unregister all service workers
    for (const registration of registrations) {
      try {
        const success = await registration.unregister();
        if (success) {
          console.log(
            `[HMR Fix] Unregistered service worker for scope: ${registration.scope}`,
          );
        } else {
          console.error(
            `[HMR Fix] Failed to unregister service worker for scope: ${registration.scope}`,
          );
        }
      } catch (error) {
        console.error(`[HMR Fix] Error unregistering service worker: ${error}`);
      }
    }

    // Clear all caches
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log(`[HMR Fix] Cleared ${cacheNames.length} cache(s)`);
      } catch (error) {
        console.error(`[HMR Fix] Error clearing caches: ${error}`);
      }
    }

    console.log(
      "[HMR Fix] Service workers disabled in development mode for better HMR support",
    );
  } catch (error) {
    console.error(`[HMR Fix] Error: ${error.message}`);
  }
})();
