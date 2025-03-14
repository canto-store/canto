"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  // State is still needed for the resize listener but we don't use it in rendering
  const [, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to check if viewport is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <header
      className={cn(
        "border-primary bg-global fixed top-0 z-50 w-full border-b",
        className,
      )}
    >
      {/* 
        Pure CSS-based responsive rendering:
        - Mobile header is visible by default on small screens (below md breakpoint)
        - Web header is visible by default on larger screens (md and above)
        - JavaScript only enhances this behavior for edge cases and window resizing
      */}
      <div className="block md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <WebHeader />
      </div>
    </header>
  );
}
