"use client";

import { X } from "lucide-react";
import { useClipboard } from "react-haiku";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useBanner } from "@/providers";
import { useState, useEffect } from "react";

export function PromoBanner() {
  const clipboard = useClipboard();
  const t = useTranslations();
  const { showBanner, setShowBanner } = useBanner();
  const [isClosing, setIsClosing] = useState(false);

  const handleCopy = () => {
    clipboard.copy("SUMMER25");
    toast.success(t("promo.copiedToClipboard"));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsClosing(false);
    }, 150);
  };

  useEffect(() => {
    if (showBanner) {
      setIsClosing(false);
    }
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div
      className={`to-orange-red from-burgundy relative flex h-8 items-center justify-center bg-gradient-to-r px-4 text-center text-[11px] text-white shadow-md transition-all duration-150 md:h-10 md:text-sm ${
        isClosing
          ? "translate-y-[-100%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex w-full items-center justify-center">
        <div className="flex gap-1 font-medium">
          <span className="inline">🌟</span>
          <p>
            {t("promo.promoBanner")}
            <span className="mx-1 rounded-md bg-black/20 px-2 py-0.5 font-bold tracking-wide">
              25%
            </span>
            <a
              className="font-mono font-bold tracking-wider text-yellow-300 hover:cursor-pointer"
              onClick={handleCopy}
            >
              SUMMER25
            </a>
          </p>
          <span className="inline">🌟</span>
        </div>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2.5 rounded-full transition-colors hover:bg-black/20 md:right-5"
        aria-label="Close promotional banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
