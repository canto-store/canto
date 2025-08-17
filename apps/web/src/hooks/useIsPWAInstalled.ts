"use client";

import { useEffect, useState } from "react";

/**
 * Returns whether the app is running as an installed PWA.
 * Checks both display-mode media query and iOS Safari's navigator.standalone.
 */
export function useIsPWAInstalled() {
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

  const [isInstalled, setIsInstalled] = useState<boolean>(getIsInstalled);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : null;

    const handleChange = () => setIsInstalled(getIsInstalled());

    media?.addEventListener?.("change", handleChange);
    window.addEventListener("appinstalled", handleChange);
    window.addEventListener("visibilitychange", handleChange);

    // Sync on mount in case environment changed between renders
    handleChange();

    return () => {
      media?.removeEventListener?.("change", handleChange);
      window.removeEventListener("appinstalled", handleChange);
      window.removeEventListener("visibilitychange", handleChange);
    };
  }, []);

  return isInstalled;
}
