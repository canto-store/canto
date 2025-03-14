"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <div
        className={cn(
          "relative container mx-auto flex h-18 items-center justify-between px-4",
          className,
        )}
      >
        {/* Left section: Mobile menu button and language selector */}
        <div className="z-10 flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <LanguageSelector className="h-7 w-[80px] scale-90 transform" />
        </div>

        {/* Center section: Logo */}
        <div className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/logo.svg"
            alt="Canto Store Logo"
            width={90}
            height={90}
            onClick={() => handleNavigation("/")}
          />
        </div>

        {/* Right section: Cart dropdown */}
        <div className="z-10 flex items-center">
          <CartDropdown />
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} />
    </>
  );
}
