"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromoBannerProps {
  className?: string;
  onClose?: () => void;
}

export function PromoBanner({ className, onClose }: PromoBannerProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 px-4 text-center text-sm text-white shadow-md transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="hidden sm:inline">🌟</span>
        <p>
          Limited Time Offer! Free Shipping on Orders Over $50 + Extra{" "}
          <span className="mx-1 rounded-md bg-white/20 px-2 py-0.5 font-bold tracking-wide">
            20% OFF
          </span>{" "}
          with Code:{" "}
          <span className="font-mono font-bold tracking-wider text-yellow-300">
            SUMMER2024
          </span>
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
