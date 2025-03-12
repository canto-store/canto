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

  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
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
}
