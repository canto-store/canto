/*eslint-disable */

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
  variant?: "header" | "menu" | "message";
  className?: string;
}

export function InstallPWA({
  variant = "header",
  className = "",
}: InstallPWAProps) {
  const t = useTranslations("pwa");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Set initial mobile state
    setIsMobile(window.innerWidth < 768);

    // Add resize listener for responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Check if the app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    setIsAppInstalled(isStandalone);

    if (isStandalone) {
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    // Check if user has previously dismissed the message
    if (variant === "message") {
      const dismissed = localStorage.getItem("pwa-message-dismissed");
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    }

    // For iOS, we'll always show our custom message since the beforeinstallprompt event isn't supported
    if (isIOSDevice && variant === "message" && !isDismissed) {
      setTimeout(() => {
        setIsMessageVisible(true);
        setIsInstallable(true);
      }, 2000);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    // Listen for the beforeinstallprompt event (non-iOS browsers)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Show message after a delay if it's the message variant
      if (variant === "message" && !isDismissed) {
        setTimeout(() => {
          setIsMessageVisible(true);
        }, 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if we already have a stored prompt
    if (window.deferredPrompt) {
      setInstallPrompt(window.deferredPrompt);
      setIsInstallable(true);

      // Show message immediately if it's the message variant
      if (variant === "message" && !isDismissed) {
        setIsMessageVisible(true);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("resize", handleResize);
    };
  }, [variant, isDismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions instead of triggering the prompt
      setShowIOSInstructions(true);
      return;
    }

    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setIsInstallable(false);
    setIsMessageVisible(false);
    window.deferredPrompt = null;
  };

  const handleDismiss = () => {
    setIsMessageVisible(false);
    setShowIOSInstructions(false);
    setIsDismissed(true);
    localStorage.setItem("pwa-message-dismissed", "true");
  };

  // If the app is already installed, don't show the install button
  if (isAppInstalled) return null;

  // If not installable and not iOS, don't show the button
  if (!isInstallable && !isIOS) return null;

  // Message variant for mobile
  if (variant === "message") {
    if ((!isMessageVisible || isDismissed) && !showIOSInstructions) return null;

    // iOS Instructions
    if (showIOSInstructions) {
      return (
        <div className="fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg bg-white p-4 shadow-lg md:right-6 md:bottom-6">
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

    // Standard install message
    return (
      <div className="fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg bg-white p-4 shadow-lg md:right-6 md:bottom-6">
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
                  onClick={handleInstallClick}
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
  if (variant === "menu") {
    return (
      <Button
        onClick={handleInstallClick}
        variant="ghost"
        className="flex w-full items-center justify-start px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
      >
        <Download className="mr-3 h-4 w-4" />
        {isIOS ? t("addToHomeScreen") : t("install")}
      </Button>
    );
  }

  // Header variant - default
  // Don't show in mobile view
  if (isMobile) {
    return null;
  }

  // Only show in desktop view
  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className={`items-center gap-2 ${className}`}
    >
      <Download className="h-4 w-4" />
      <span>{isIOS ? t("addToHomeScreen") : t("install")}</span>
    </Button>
  );
}
