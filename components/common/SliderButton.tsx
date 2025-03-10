import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/40 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95",
        className,
      )}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      {children}
    </button>
  );
}
