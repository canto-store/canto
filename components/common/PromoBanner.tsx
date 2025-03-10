"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClipboard } from "react-haiku";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
interface PromoBannerProps {
  className?: string;
  onClose?: () => void;
}

export function PromoBanner({ className, onClose }: PromoBannerProps) {
  const clipboard = useClipboard();
  const t = useTranslations();
  const handleCopy = () => {
    clipboard.copy("SUMMER2024");
    toast.success(t("promo.copiedToClipboard"));
  };

  return (
    <div
      className={cn(
        "to-orange-red from-burgundy relative flex h-10 items-center justify-center bg-gradient-to-r px-4 text-center text-sm text-white shadow-md transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="hidden sm:inline">🌟</span>
        <p>
          {t("promo.promoBanner")}
          <span className="mx-1 rounded-md bg-white/20 px-2 py-0.5 font-bold tracking-wide">
            {t("promo.promoPercent")}
          </span>
          <a
            className="font-mono font-bold tracking-wider text-yellow-300 hover:cursor-pointer"
            onClick={handleCopy}
          >
            SUMMER2024
          </a>
        </p>
        <span className="hidden sm:inline">🌟</span>
      </div>
      <button
        onClick={onClose}
        className="absolute right-2 rounded-full p-1.5 transition-colors hover:bg-white/20"
        aria-label="Close promotional banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
