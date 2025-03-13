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

  // Check if we're in recovery mode
  if (window.location.pathname === "/recovery.html") {
    console.log("Recovery mode: Not registering service worker");
    return;
  }

  // Check if there was a previous failure
  const swFailureCount = parseInt(
    localStorage.getItem("sw_failure_count") || "0",
  );
  const lastFailureTime = localStorage.getItem("sw_last_failure_time");
  const now = new Date().getTime();

  // If there have been multiple failures in a short time, redirect to recovery
  if (
    swFailureCount > 2 &&
    lastFailureTime &&
    now - parseInt(lastFailureTime) < 5 * 60 * 1000
  ) {
    console.log(
      "Multiple service worker failures detected, redirecting to recovery page",
    );
    window.location.href = "/recovery.html";
    return;
  }

  const swUrl = "/sw.js";

  // Add a timestamp to the service worker URL to force updates
  const swUrlWithCache = `${swUrl}?v=${new Date().getTime()}`;

  // Set up error detection
  let registrationSuccessful = false;
  let registrationTimeout = setTimeout(() => {
    if (!registrationSuccessful) {
      console.error("Service Worker registration timed out");
      recordFailure();
    }
  }, 10000); // 10 second timeout

  navigator.serviceWorker
    .register(swUrlWithCache)
    .then((registration) => {
      registrationSuccessful = true;
      clearTimeout(registrationTimeout);
      console.log("Service Worker registered with scope:", registration.scope);

      // Reset failure counter on successful registration
      localStorage.setItem("sw_failure_count", "0");

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

      // Set up error detection for the service worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "redundant") {
            console.error("Service Worker installation failed");
            recordFailure();
          }

          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("New service worker installed and waiting to activate");
          }
        });
      });
    })
    .catch((error) => {
      registrationSuccessful = true; // Prevent timeout from also triggering
      clearTimeout(registrationTimeout);
      console.error("Service Worker registration failed:", error);
      recordFailure();
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
      navigator.standalone === true;

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

  // Add a global error handler to detect page load failures
  window.addEventListener("error", (event) => {
    console.error("Global error detected:", event.message);
    // Only count certain errors that might be related to service worker issues
    if (
      event.message &&
      (event.message.includes("fetch") ||
        event.message.includes("network") ||
        event.message.includes("load") ||
        event.message.includes("failed"))
    ) {
      recordFailure();
    }
  });

  // Function to record a service worker failure
  function recordFailure() {
    const currentCount = parseInt(
      localStorage.getItem("sw_failure_count") || "0",
    );
    localStorage.setItem("sw_failure_count", (currentCount + 1).toString());
    localStorage.setItem(
      "sw_last_failure_time",
      new Date().getTime().toString(),
    );

    // If there have been multiple failures, show a recovery option
    if (currentCount >= 2) {
      showRecoveryPrompt();
    }
  }

  // Function to show a recovery prompt
  function showRecoveryPrompt() {
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
    promptContainer.style.right = "20px";
    promptContainer.style.backgroundColor = "white";
    promptContainer.style.padding = "15px";
    promptContainer.style.borderRadius = "8px";
    promptContainer.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    promptContainer.style.zIndex = "9999";
    promptContainer.style.maxWidth = "300px";

    promptContainer.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">Having trouble with the app?</div>
      <p style="margin-bottom: 15px; font-size: 14px;">We've detected some issues that might affect your experience.</p>
      <div style="display: flex; justify-content: space-between;">
        <button id="fix-app-btn" style="background-color: #2563eb; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Fix Now</button>
        <button id="dismiss-prompt-btn" style="background-color: #e5e7eb; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Dismiss</button>
      </div>
    `;

    document.body.appendChild(promptContainer);

    // Add event listeners
    document.getElementById("fix-app-btn").addEventListener("click", () => {
      window.location.href = "/recovery.html";
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
    }, 30000);
  }
}
