// Script to unregister service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker unregistered");
    }

    // Clear caches
    if ("caches" in window) {
      caches
        .keys()
        .then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              return caches.delete(cacheName);
            }),
          );
        })
        .then(function () {
          console.log("Caches cleared");
          document.getElementById("status").textContent =
            "Service Worker unregistered and caches cleared. Reloading...";

          // Reload the page after a short delay
          setTimeout(function () {
            window.location.reload(true);
          }, 1000);
        });
    } else {
      console.log("Caches API not available");
      document.getElementById("status").textContent =
        "Service Worker unregistered. Reloading...";

      // Reload the page after a short delay
      setTimeout(function () {
        window.location.reload(true);
      }, 1000);
    }
  });
} else {
  console.log("Service Worker not supported");
  document.getElementById("status").textContent =
    "Service Worker not supported in this browser.";
}
