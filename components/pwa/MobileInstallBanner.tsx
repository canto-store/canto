"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function MobileInstallBanner() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Only show on mobile
    if (window.innerWidth >= 768) return;

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem("pwa-banner-dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show banner after 5 seconds of user interaction
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if we already have a stored prompt
    if (window.deferredPrompt) {
      setInstallPrompt(window.deferredPrompt);
      // Show banner after 2 seconds
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);
    setIsVisible(false);
    window.deferredPrompt = null;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white p-4 shadow-lg md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download className="text-primary h-6 w-6" />
          <div>
            <p className="font-medium">Install Canto App</p>
            <p className="text-sm text-gray-500">
              Add to home screen for better experience
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 rounded-full"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" onClick={handleInstall}>
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}
