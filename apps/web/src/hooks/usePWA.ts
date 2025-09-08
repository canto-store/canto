"use client";

import { useDeviceOS } from "@/hooks/useDeviceOS";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Checks if the app is running as an installed PWA
 */
const getIsInstalled = () => {
  if (typeof window === "undefined") return false;

  let installed = false;
  if (typeof window.matchMedia === "function") {
    try {
      installed = window.matchMedia("(display-mode: standalone)").matches;
    } catch {
      // ignore
    }
  }

  if (!installed) {
    try {
      // iOS Safari when launched from home screen
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof navigator !== "undefined" && (navigator as any).standalone) {
        installed = true;
      }
    } catch {
      // ignore
    }
  }

  return installed;
};

export function usePWASetup() {
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const deviceOS = useDeviceOS();
  const isIOSDevice = deviceOS === "iOS";
  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled());

  // Effect for checking if the app is already installed as a PWA
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : null;

    const handleInstallStatusChange = () => setIsInstalled(getIsInstalled());

    media?.addEventListener?.("change", handleInstallStatusChange);
    window.addEventListener("appinstalled", handleInstallStatusChange);
    window.addEventListener("visibilitychange", handleInstallStatusChange);

    // Sync on mount in case environment changed between renders
    handleInstallStatusChange();

    return () => {
      media?.removeEventListener?.("change", handleInstallStatusChange);
      window.removeEventListener("appinstalled", handleInstallStatusChange);
      window.removeEventListener("visibilitychange", handleInstallStatusChange);
    };
  }, []);

  // Effect for checking if the app is installable
  useEffect(() => {
    // Check if the app is installable
    const checkInstallable = () => {
      if (window.deferredPrompt) {
        setInstallPrompt(window.deferredPrompt);
        setIsInstallable(true);
      }
    };

    // Check on initial load
    checkInstallable();

    // Setup event listener for future "beforeinstallprompt" events
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (isIOSDevice) {
      setShowIOSInstructions(true);
      return;
    }

    const promptToUse = window.deferredPrompt || installPrompt;
    if (!promptToUse) return;

    try {
      await promptToUse.prompt();
      const choiceResult = await promptToUse.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setInstallPrompt(null);
      window.deferredPrompt = null;
      setIsInstallable(false);
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  };

  const closeIOSInstructions = () => {
    setShowIOSInstructions(false);
  };

  return {
    handleInstall,
    showIOSInstructions,
    closeIOSInstructions,
    isInstallable,
    isIOSDevice,
    isInstalled,
  };
}
