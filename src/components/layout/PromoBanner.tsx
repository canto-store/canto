"use client";

import { useClipboard } from "react-haiku";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function PromoBanner() {
  const clipboard = useClipboard();
  const t = useTranslations();

  const handleCopy = () => {
    clipboard.copy("SUMMER25");
    toast.success(t("promo.copiedToClipboard"));
  };

  return (
    <div
      className={`to-orange-red from-burgundy relative flex min-h-8 items-center justify-center bg-gradient-to-r px-4 text-center text-[10px] text-white shadow-md transition-all duration-150 md:h-10 md:text-sm`}
    >
      <div className="flex w-full items-center justify-center">
        <div className="flex gap-1 font-medium">
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
        </div>
      </div>
    </div>
  );
}
