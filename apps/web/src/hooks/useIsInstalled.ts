"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the app is running as an installed PWA
 */
export function useIsInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallStatus = () => {
      if (typeof window === "undefined") return false;

      // Check for standalone display mode (PWA installed)
      let installed = false;

      // Check display-mode: standalone
      if (typeof window.matchMedia === "function") {
        try {
          installed = window.matchMedia("(display-mode: standalone)").matches;
        } catch {
          // ignore
        }
      }

      // Check for iOS Safari standalone mode
      if (!installed && typeof navigator !== "undefined") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          installed = !!(navigator as any).standalone;
        } catch {
          // ignore
        }
      }

      return installed;
    };

    setIsInstalled(checkInstallStatus());

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => setIsInstalled(checkInstallStatus());

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isInstalled;
}
