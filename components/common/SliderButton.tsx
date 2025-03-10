import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SliderButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}

export function SliderButton({
  icon: Icon,
  onClick,
  className,
  ariaLabel,
}: SliderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/30",
        className,
      )}
      aria-label={ariaLabel}
    >
      <Icon className="h-6 w-6 text-white" />
    </button>
  );
}
