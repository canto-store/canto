/**
 * Canto Service Worker Registration
 * This script handles the registration and lifecycle management of the service worker
 */

// Configuration
const SW_URL = "/sw.js";
const DEBUG = false;
const RECOVERY_URL = "/recovery.html";

// Utility for logging
const log = (message, isError = false) => {
  if (DEBUG || isError) {
    if (isError) {
      console.error(`[SW Registration] ${message}`);
    } else {
      console.log(`[SW Registration] ${message}`);
    }
  }
};

// Check if we should register the service worker
const shouldRegisterSW = () => {
  // Only register in secure contexts (HTTPS or localhost)
  if (!("serviceWorker" in navigator)) {
    log("Service Worker not supported in this browser", true);
    return false;
  }

  // Check if we're in development mode
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "http:";

  if (isDev && !DEBUG) {
    log("Development mode: Not registering service worker");
    return false;
  }

  // Don't register in recovery mode
  if (window.location.pathname === RECOVERY_URL) {
    log("Recovery mode: Not registering service worker");
    return false;
  }

  return true;
};

// Register the service worker
const registerServiceWorker = async () => {
  if (!shouldRegisterSW()) return;

  try {
    // Add cache-busting query parameter
    const swUrlWithCache = `${SW_URL}?v=${new Date().getTime()}`;

    // Register the service worker
    const registration = await navigator.serviceWorker.register(swUrlWithCache);
    log(
      `Service Worker registered successfully with scope: ${registration.scope}`,
    );

    // Store registration for later use
    window.swRegistration = registration;

    // Reset failure counter on successful registration
    localStorage.removeItem("sw_failure_count");
    localStorage.removeItem("sw_last_failure_time");

    // Set up update detection
    setupUpdateDetection(registration);

    // Set up periodic updates
    setupPeriodicUpdates(registration);

    return registration;
  } catch (error) {
    log(`Service Worker registration failed: ${error}`, true);
    recordFailure();
    return null;
  }
};

// Set up detection for service worker updates
const setupUpdateDetection = (registration) => {
  // When a new service worker is found
  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;

    newWorker.addEventListener("statechange", () => {
      // When the new service worker is installed
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        log("New service worker installed and waiting to activate");
        showUpdatePrompt();
      }

      // If installation fails
      if (newWorker.state === "redundant") {
        log("Service Worker installation failed", true);
        recordFailure();
      }
    });
  });

  // Listen for controller change
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    log("Service Worker controller changed - page will reload");
    // Reload the page when the new service worker takes control
    if (!window.isReloading) {
      window.isReloading = true;
      window.location.reload();
    }
  });
};

// Set up periodic updates for the service worker
const setupPeriodicUpdates = (registration) => {
  // Check for updates immediately
  setTimeout(() => {
    registration
      .update()
      .catch((err) => log(`Update check failed: ${err}`, true));
  }, 5000);

  // Then check every 6 hours
  setInterval(
    () => {
      registration
        .update()
        .catch((err) => log(`Update check failed: ${err}`, true));
    },
    6 * 60 * 60 * 1000,
  );
};

// Show a prompt when an update is available
const showUpdatePrompt = () => {
  // Don't show the prompt if it's already visible
  if (document.getElementById("sw-update-toast")) return;

  const toast = document.createElement("div");
  toast.id = "sw-update-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "white";
  toast.style.color = "#333";
  toast.style.padding = "16px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  toast.style.zIndex = "9999";
  toast.style.display = "flex";
  toast.style.flexDirection = "column";
  toast.style.gap = "12px";
  toast.style.maxWidth = "300px";

  toast.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
    <p style="margin: 0; font-size: 14px;">A new version of the app is available. Refresh to update?</p>
    <div style="display: flex; gap: 8px; margin-top: 8px;">
      <button id="sw-update-now" style="background-color: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; flex: 1;">Update Now</button>
      <button id="sw-update-later" style="background-color: #e5e7eb; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Later</button>
    </div>
  `;

  document.body.appendChild(toast);

  // Add event listeners
  document.getElementById("sw-update-now").addEventListener("click", () => {
    if (window.swRegistration && window.swRegistration.waiting) {
      // Send message to the waiting service worker to skip waiting
      window.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    toast.remove();
  });

  document.getElementById("sw-update-later").addEventListener("click", () => {
    toast.remove();
  });

  // Auto-remove after 1 hour
  setTimeout(
    () => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    },
    60 * 60 * 1000,
  );
};

// Record a service worker failure
const recordFailure = () => {
  const currentCount = parseInt(
    localStorage.getItem("sw_failure_count") || "0",
  );
  localStorage.setItem("sw_failure_count", (currentCount + 1).toString());
  localStorage.setItem("sw_last_failure_time", new Date().getTime().toString());

  // If there have been multiple failures, show a recovery option
  if (currentCount >= 2) {
    showRecoveryPrompt();
  }
};

// Show a recovery prompt
const showRecoveryPrompt = () => {
  // Check if we've already shown the prompt recently
  const lastPromptTime = localStorage.getItem("sw_recovery_prompt_time");
  const now = new Date().getTime();

  if (lastPromptTime && now - parseInt(lastPromptTime) < 60 * 60 * 1000) {
    // Don't show the prompt more than once per hour
    return;
  }

  // Record that we showed the prompt
  localStorage.setItem("sw_recovery_prompt_time", now.toString());

  // Create and show a recovery prompt
  const promptContainer = document.createElement("div");
  promptContainer.style.position = "fixed";
  promptContainer.style.bottom = "20px";
  promptContainer.style.left = "20px";
  promptContainer.style.backgroundColor = "white";
  promptContainer.style.padding = "16px";
  promptContainer.style.borderRadius = "8px";
  promptContainer.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  promptContainer.style.zIndex = "9999";
  promptContainer.style.maxWidth = "300px";

  promptContainer.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">Having trouble with the app?</div>
    <p style="margin: 0 0 16px 0; font-size: 14px;">We've detected some issues that might affect your experience.</p>
    <div style="display: flex; gap: 8px;">
      <button id="fix-app-btn" style="background-color: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Fix Now</button>
      <button id="dismiss-prompt-btn" style="background-color: #e5e7eb; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Dismiss</button>
    </div>
  `;

  document.body.appendChild(promptContainer);

  // Add event listeners
  document.getElementById("fix-app-btn").addEventListener("click", () => {
    window.location.href = RECOVERY_URL;
  });

  document
    .getElementById("dismiss-prompt-btn")
    .addEventListener("click", () => {
      promptContainer.remove();
    });

  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (document.body.contains(promptContainer)) {
      promptContainer.remove();
    }
  }, 30 * 1000);
};

// Set up PWA installation prompt
const setupInstallPrompt = () => {
  // Initialize deferredPrompt for use later
  window.deferredPrompt = null;

  // Listen for beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    window.deferredPrompt = e;
    log("Install prompt ready");
  });

  // Listen for appinstalled event
  window.addEventListener("appinstalled", () => {
    // Clear the deferredPrompt
    window.deferredPrompt = null;
    log("PWA was installed");

    // You might want to track this event for analytics
    if (typeof gtag === "function") {
      gtag("event", "pwa_install");
    }
  });
};

// Initialize everything
const init = () => {
  if (document.readyState === "complete") {
    registerServiceWorker();
    setupInstallPrompt();
  } else {
    window.addEventListener("load", () => {
      registerServiceWorker();
      setupInstallPrompt();
    });
  }
};

// Initialize the service worker registration
void (function () {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // Document already ready, initialize immediately
    init();
  } else {
    // Wait for the DOM to be ready
    window.addEventListener("DOMContentLoaded", init);
  }
})();
