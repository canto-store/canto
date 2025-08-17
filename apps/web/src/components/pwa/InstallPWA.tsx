"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDeviceOS } from "@/hooks/useDeviceOS";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsPWAInstalled } from "@/hooks/useIsPWAInstalled";
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

interface InstallPWAProps {
  variant?: "menu" | "message";
  className?: string;
  dismissalKey?: string;
  displayDelay?: number;
}

export function InstallPWA({
  variant = "message",
  className = "",
  dismissalKey,
  displayDelay = 2000,
}: InstallPWAProps) {
  const t = useTranslations("pwa");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const deviceOS = useDeviceOS();
  const isIOSDevice = deviceOS === "iOS";
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  const storageDismissalKey = dismissalKey || "pwa-message-dismissed";
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const isInstalled = useIsPWAInstalled();

  useEffect(() => {
    if (isInstalled) {
      setIsDismissed(true);
      localStorage.setItem(storageDismissalKey, "true");
    }
  }, [isInstalled, storageDismissalKey]);

  useEffect(() => {
    setIsDismissed(localStorage.getItem(storageDismissalKey) === "true");
    const handler = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.deferredPrompt) {
      setInstallPrompt(window.deferredPrompt);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [variant, isDismissed, displayDelay, storageDismissalKey]);

  useEffect(() => {
    if (isDismissed) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, displayDelay);
    return () => clearTimeout(timer);
  }, [isDismissed, displayDelay]);

  const handleInstall = async () => {
    if (isIOSDevice) {
      setShowIOSInstructions(true);
      return;
    }

    const promptToUse = window.deferredPrompt || installPrompt;
    if (!promptToUse) return;

    try {
      await promptToUse.prompt();
      setInstallPrompt(null);
      window.deferredPrompt = null;
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  };

  const handleDismiss = () => {
    setShowIOSInstructions(false);
    setIsDismissed(true);
    localStorage.setItem(storageDismissalKey, "true");
  };

  if (!isMobile || !isOpen) return null;

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

  if (variant === "message" && !isDismissed) {
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
                  {isIOSDevice ? t("addToHomeScreen") : t("installNow")}
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

  if (variant === "menu") {
    return (
      <Button
        onClick={handleInstall}
        variant="ghost"
        className={`flex w-full items-center justify-start px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black ${className}`}
      >
        <Download className={`${isRTL ? "ml-3" : "mr-3"} h-4 w-4`} />
        {isIOSDevice ? t("addToHomeScreen") : t("install")}
      </Button>
    );
  }
}
