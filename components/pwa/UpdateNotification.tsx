"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    swRegistration: ServiceWorkerRegistration | null;
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export function UpdateNotification() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  // Define handleUpdate using useCallback to avoid recreating it on every render
  const handleUpdate = useCallback(() => {
    // If we have a registration and there's a waiting worker, tell it to skip waiting
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    // Force page reload to activate the new service worker
    window.location.reload();
  }, [registration]);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Only proceed if service workers are supported
    if (!("serviceWorker" in navigator)) return;

    // Check if the app is running in standalone mode (installed)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // Check if user has previously dismissed the notification
    const dismissed = localStorage.getItem("update-notification-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }

    // Function to check for updates
    const checkForUpdates = async () => {
      try {
        // Get all service worker registrations
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length === 0) return;

        // We'll use the first registration
        const reg = registrations[0];
        setRegistration(reg);

        // Check for updates
        await reg.update();

        // Listen for the updatefound event
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;

          if (!newWorker) return;

          // Listen for state changes on the new worker
          newWorker.addEventListener("statechange", () => {
            // When the new service worker is installed, an update is available
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New version available!");
              setIsUpdateAvailable(true);

              // Show toast notification for non-installed apps
              if (!isStandalone) {
                toast.info("A new version is available", {
                  description: "Refresh to update the app",
                  action: {
                    label: "Update",
                    onClick: () => handleUpdate(),
                  },
                  duration: 10000,
                });
              }
            }
          });
        });
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Listen for messages from the service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_AVAILABLE") {
        console.log(`Update available: version ${event.data.version}`);
        setIsUpdateAvailable(true);
        setNewVersion(event.data.version);

        // Reset dismissal state when a new version is available
        localStorage.removeItem("update-notification-dismissed");
        setIsDismissed(false);

        // Show toast notification for non-installed apps
        if (!isStandalone) {
          toast.info("A new version is available", {
            description: `Version ${event.data.version} is ready to install`,
            action: {
              label: "Update",
              onClick: () => handleUpdate(),
            },
            duration: 10000,
          });
        }
      }
    };

    // Add message listener
    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Initial check for updates
    checkForUpdates();

    // Set up periodic checks for updates (every 30 minutes)
    const intervalId = setInterval(checkForUpdates, 30 * 60 * 1000);

    // Use the stored registration if available
    if (window.swRegistration) {
      setRegistration(window.swRegistration);
    }

    return () => {
      clearInterval(intervalId);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [handleUpdate]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in localStorage to prevent showing again in this session
    localStorage.setItem("update-notification-dismissed", "true");
  };

  // Don't show the banner if no update is available or it's been dismissed
  if (!isUpdateAvailable || isDismissed) return null;

  // Only show the fixed banner for installed apps
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return (
      <div className="fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg bg-white p-4 shadow-lg md:right-6 md:bottom-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Update Available</h3>
              <p className="mt-1 text-sm text-gray-500">
                {newVersion
                  ? `Version ${newVersion} is ready to install. Update to get the latest features.`
                  : "A new version of Canto is available. Update to get the latest features and improvements."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Update Now
                </Button>
                <Button variant="outline" size="sm" onClick={handleDismiss}>
                  Later
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-1 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // For non-installed apps, we'll return null as we're already showing a toast
  return null;
}
