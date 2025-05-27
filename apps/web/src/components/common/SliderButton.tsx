import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SliderButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

export function SliderButton({
  direction,
  onClick,
  className,
  children,
}: SliderButtonProps) {
  const t = useTranslations("slider");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "/20 hover:/40 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md backdrop-blur-md transition-all hover:cursor-pointer focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95",
        className,
      )}
      aria-label={direction === "left" ? t("previousSlide") : t("nextSlide")}
    >
      {children}
    </button>
  );
}
