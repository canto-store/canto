/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

interface InstallPWAProps {
  /**
   * The display variant of the install prompt
   * - "menu": Menu item for navigation menus (mobile only)
   * - "message": Floating card notification (mobile only)
   */
  variant?: "menu" | "message";

  /**
   * Optional CSS class name to apply to the component
   */
  className?: string;

  /**
   * Delay in milliseconds before showing the prompt (for message variant)
   * Default: 2000ms
   */
  showDelay?: number;

  /**
   * Local storage key to use for tracking dismissal state
   * Default: "pwa-install-dismissed"
   */
  dismissalKey?: string;
}

export function InstallPWA({
  variant = "message",
  className = "",
  showDelay,
  dismissalKey,
}: InstallPWAProps) {
  const t = useTranslations("pwa");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine the appropriate dismissal key
  const storageDismissalKey = dismissalKey || "pwa-message-dismissed";

  // Default delay for showing the prompt
  const displayDelay = showDelay ?? 2000;

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Check if the document direction is RTL
    setIsRTL(document.dir === "rtl");

    // Check if on mobile device (once on mount)
    setIsMobile(window.innerWidth < 768);

    // Improved iOS detection
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    // Check if the user is in Safari on iOS (required for Add to Home Screen)
    const isSafari =
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
      (navigator.vendor && navigator.vendor.indexOf("Apple") > -1);

    setIsIOS(isIOSDevice);

    // Check if the app is already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsAppInstalled(isStandalone);

    // If app is already installed, no need to continue
    if (isStandalone) return;

    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem(storageDismissalKey);
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // For iOS, we'll always show our custom message since the beforeinstallprompt event isn't supported
    if (isIOSDevice && !isDismissed) {
      // Only show the prompt in Safari on iOS
      if (isSafari) {
        setTimeout(() => {
          setIsVisible(true);
          setIsInstallable(true);
        }, displayDelay);
      }
      return;
    }

    // Listen for the beforeinstallprompt event (non-iOS browsers)
    const handler = (e: Event) => {
      e.preventDefault();
      // Store the event for later use
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Show prompt after a delay if it's the message variant
      if (variant === "message" && !isDismissed) {
        setTimeout(() => {
          setIsVisible(true);
        }, displayDelay);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if we already have a stored prompt
    if (window.deferredPrompt) {
      setInstallPrompt(window.deferredPrompt);
      setIsInstallable(true);

      // Show prompt immediately if it's the message variant
      if (variant === "message" && !isDismissed) {
        setTimeout(() => {
          setIsVisible(true);
        }, displayDelay);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [variant, isDismissed, displayDelay, storageDismissalKey]);

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, show instructions instead of triggering the prompt
      setShowIOSInstructions(true);
      return;
    }

    // Use either the stored prompt or the current installPrompt
    const promptToUse = window.deferredPrompt || installPrompt;
    if (!promptToUse) return;

    try {
      // Show the install prompt
      await promptToUse.prompt();

      setInstallPrompt(null);
      setIsInstallable(false);
      setIsVisible(false);
      window.deferredPrompt = null;
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSInstructions(false);
    setIsDismissed(true);
    localStorage.setItem(storageDismissalKey, "true");
  };

  // If the app is already installed, don't show the install button
  if (isAppInstalled) return null;

  // If not installable and not iOS, don't show the button
  if (!isInstallable && !isIOS) return null;

  // Only show on mobile devices
  if (!isMobile) return null;

  // iOS Instructions (for message variant)
  if (variant === "message" && showIOSInstructions) {
    return (
      <div className="bg-global fixed right-4 bottom-22 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="flex items-center font-medium">
              <Globe className="mr-2 h-5 w-5" />
              {t("installOnIOS")}
            </h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                {t("iosInstructions.step1")}{" "}
                <Share className="inline h-4 w-4 align-text-bottom" />
              </li>
              <li>{t("iosInstructions.step2")}</li>
              <li>{t("iosInstructions.step3")}</li>
              <li className="text-xs text-gray-500 italic">
                {t("iosInstructions.note")}
              </li>
            </ol>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="w-full"
              >
                {t("gotIt")}
              </Button>
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

  // Message variant
  if (variant === "message") {
    return (
      <div className="bg-global fixed right-4 bottom-22 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Download className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{t("installApp")}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("installDescription")}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleInstall}
                  className="text-white"
                >
                  {isIOS ? t("addToHomeScreen") : t("installNow")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDismiss}>
                  {t("notNow")}
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

  // Menu item variant
  return (
    <Button
      onClick={handleInstall}
      variant="ghost"
      className={`flex w-full items-center justify-start px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black ${className}`}
    >
      <Download className={`${isRTL ? "ml-3" : "mr-3"} h-4 w-4`} />
      {isIOS ? t("addToHomeScreen") : t("install")}
    </Button>
  );
}
