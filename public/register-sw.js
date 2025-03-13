if ("serviceWorker" in navigator) {
  if (document.readyState === "complete") {
    registerSW();
  } else {
    window.addEventListener("load", registerSW);
  }
}

function registerSW() {
  // Check if we're in development mode
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "http:";

  if (isDev) {
    console.log("Development mode: Not registering service worker");
    return;
  }

  const swUrl = "/sw.js";

  // Add a timestamp to the service worker URL to force updates
  const swUrlWithCache = `${swUrl}?v=${new Date().getTime()}`;

  navigator.serviceWorker
    .register(swUrlWithCache)
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);

      // Store the registration for later use
      window.swRegistration = registration;

      // Check for updates on page load
      registration.update();

      // Set up periodic checks for updates (every 30 minutes)
      setInterval(
        () => {
          registration.update();
          console.log("Checking for service worker updates...");
        },
        30 * 60 * 1000,
      );

      // Set up periodic content refresh (every 15 minutes)
      if ("periodicSync" in registration) {
        // This is future-proofing as periodicSync isn't widely supported yet
        try {
          registration.periodicSync.register("refresh-content", {
            minInterval: 15 * 60 * 1000, // 15 minutes
          });
        } catch (error) {
          console.log("Periodic Sync could not be registered:", error);
        }
      } else {
        // Fallback for browsers that don't support periodicSync
        setInterval(
          () => {
            if (navigator.onLine) {
              console.log("Performing manual content refresh");
              fetch("/").catch((err) =>
                console.log("Manual refresh failed:", err),
              );
            }
          },
          15 * 60 * 1000,
        );
      }

      // Handle service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("New service worker installed and waiting to activate");
            // Notify the user about the update if needed
          }
        });
      });
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });

  // Initialize deferredPrompt as null
  window.deferredPrompt = null;

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    window.deferredPrompt = e;
    console.log("Install prompt ready");
  });

  // Handle iOS PWA events
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // Check if the app is running in standalone mode (installed PWA)
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInStandaloneMode) {
      console.log("Running as installed PWA on iOS");

      // Add event listeners for iOS PWA lifecycle
      window.addEventListener("pagehide", () => {
        // This event fires when the page is hidden (app closed or switched)
        console.log("App hidden or closed on iOS");
        // Store any necessary state in localStorage
        localStorage.setItem("pwa_last_active", new Date().toISOString());
      });

      window.addEventListener("pageshow", (event) => {
        // This event fires when the page is shown (app opened or resumed)
        if (event.persisted) {
          console.log("App resumed from iOS back-forward cache");
          // Check if we need to refresh content
          const lastActive = localStorage.getItem("pwa_last_active");
          if (lastActive) {
            const lastActiveTime = new Date(lastActive).getTime();
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastActiveTime;

            // If app was inactive for more than 5 minutes, refresh content
            if (timeDiff > 5 * 60 * 1000) {
              console.log(
                "App was inactive for more than 5 minutes, refreshing content",
              );
              window.location.reload();
            }
          }
        }
      });
    }
  }
}
