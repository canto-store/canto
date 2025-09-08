"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Globe, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePWASetup } from "@/hooks/usePWA";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface InstallPWAProps {
  variant?: "menu" | "message";
  className?: string;
  displayDelay?: number;
}

export function InstallPWA({
  variant = "message",
  displayDelay = 2000,
}: InstallPWAProps) {
  const t = useTranslations("pwa");
  const {
    handleInstall,
    showIOSInstructions,
    closeIOSInstructions,
    isIOSDevice,
    isInstalled,
  } = usePWASetup();

  const [isDismissed, setIsDismissed] = useState(false);

  const storageDismissalKey = "pwa-message-dismissed";

  useEffect(() => {
    if (isInstalled) {
      setIsDismissed(true);
      sessionStorage.setItem(storageDismissalKey, "true");
    }
  }, [isInstalled, storageDismissalKey]);

  useEffect(() => {
    setIsDismissed(sessionStorage.getItem(storageDismissalKey) === "true");
  }, [variant, isDismissed, displayDelay, storageDismissalKey]);

  const handleDismiss = () => {
    closeIOSInstructions();
    sessionStorage.setItem(storageDismissalKey, "true");
    setIsDismissed(true);
  };

  const isMobile = useMediaQuery("(max-width: 768px)", false);
  if (!isMobile) return null;

  if (
    variant === "message" &&
    !isDismissed &&
    !isInstalled &&
    !showIOSInstructions
  ) {
    return (
      <div className="bg-global fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-lg p-4 shadow-lg">
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

  if (showIOSInstructions) {
    return (
      <Dialog open={showIOSInstructions} onOpenChange={closeIOSInstructions}>
        <DialogContent className="bg-global sm:max-w-[425px]">
          <DialogTitle className="flex items-center font-medium">
            <Globe className="mr-2 h-5 w-5" />
            {t("installOnIOS")}
          </DialogTitle>
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
        </DialogContent>
      </Dialog>
    );
  }
  if (variant === "menu") {
    return (
      <Button onClick={handleInstall} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        {isIOSDevice ? t("addToHomeScreen") : t("install")}
        <ChevronRight className="ml-auto h-4 w-4" />
      </Button>
    );
  }
}
