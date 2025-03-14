/**
 * Canto Service Worker Disabler
 * This script safely unregisters all service workers and cleans up related caches
 */

void (async function disableServiceWorker() {
  // Configuration
  const DEBUG = false;
  const REDIRECT_DELAY = 2000; // 2 seconds
  const REDIRECT_URL = "/";

  // Utility for logging
  const log = (message, isError = false) => {
    if (DEBUG || isError) {
      if (isError) {
        console.error(`[SW Disabler] ${message}`);
      } else {
        console.log(`[SW Disabler] ${message}`);
      }
    }
  };

  // Create status element if it doesn't exist
  let statusElement = document.getElementById("sw-disable-status");
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = "sw-disable-status";
    statusElement.style.position = "fixed";
    statusElement.style.top = "20px";
    statusElement.style.left = "50%";
    statusElement.style.transform = "translateX(-50%)";
    statusElement.style.backgroundColor = "white";
    statusElement.style.color = "#333";
    statusElement.style.padding = "16px";
    statusElement.style.borderRadius = "8px";
    statusElement.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    statusElement.style.zIndex = "9999";
    statusElement.style.textAlign = "center";
    statusElement.style.maxWidth = "90%";
    statusElement.style.width = "400px";
    document.body.appendChild(statusElement);
  }

  // Update status
  const updateStatus = (message, isError = false) => {
    statusElement.textContent = message;
    statusElement.style.backgroundColor = isError ? "#fee2e2" : "white";
    statusElement.style.color = isError ? "#b91c1c" : "#333";
    log(message, isError);
  };

  try {
    // Check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      updateStatus("Service Worker not supported in this browser.", true);
      return;
    }

    updateStatus("Disabling Service Worker...");

    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();

    if (registrations.length === 0) {
      updateStatus("No Service Workers found to disable.");

      // Still clear caches just to be safe
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        updateStatus(
          "No Service Workers found. Cleared all caches as a precaution.",
        );
      }

      // Redirect after delay
      setTimeout(() => {
        window.location.href = REDIRECT_URL;
      }, REDIRECT_DELAY);

      return;
    }

    // Unregister all service workers
    let unregisteredCount = 0;
    for (const registration of registrations) {
      try {
        const success = await registration.unregister();
        if (success) {
          unregisteredCount++;
          log(
            `Successfully unregistered service worker for scope: ${registration.scope}`,
          );
        } else {
          log(
            `Failed to unregister service worker for scope: ${registration.scope}`,
            true,
          );
        }
      } catch (error) {
        log(`Error unregistering service worker: ${error}`, true);
      }
    }

    // Clear all caches
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        log(`Cleared ${cacheNames.length} cache(s)`);
      } catch (error) {
        log(`Error clearing caches: ${error}`, true);
      }
    }

    // Clear PWA-related localStorage items
    try {
      const keys = Object.keys(localStorage);
      const pwaKeys = keys.filter(
        (key) =>
          key.startsWith("sw_") ||
          key.startsWith("pwa_") ||
          key.includes("cache") ||
          key.includes("worker"),
      );

      for (const key of pwaKeys) {
        localStorage.removeItem(key);
      }

      log(`Cleared ${pwaKeys.length} PWA-related localStorage items`);
    } catch (error) {
      log(`Error clearing localStorage: ${error}`, true);
    }

    // Final status update
    if (unregisteredCount > 0) {
      updateStatus(
        `Successfully disabled ${unregisteredCount} Service Worker(s). Redirecting...`,
      );
    } else {
      updateStatus(
        "Failed to disable Service Workers. Please try again or contact support.",
        true,
      );
    }

    // Redirect after delay
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, REDIRECT_DELAY);
  } catch (error) {
    updateStatus(`Error disabling Service Worker: ${error.message}`, true);
    log(`Error: ${error.stack}`, true);
  }
})();
