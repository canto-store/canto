// This script helps fix HMR issues by ensuring service workers don't interfere
(function () {
  // Always run in the browser - no environment check needed

  // Check if there are any service workers and unregister them
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        console.log("Unregistered service worker:", registration.scope);
      }
    });
  }

  // Clear caches that might be causing issues
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
        console.log("Deleted cache:", cacheName);
      });
    });
  }

  console.log("HMR fix script executed");
})();
