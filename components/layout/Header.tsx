"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { UserDropdown } from "@/components/user/UserDropdown";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { MobileMenu } from "@/components/navigation/MobileMenu";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <header
      className={cn(
        "border-primary fixed top-0 z-50 w-full border-b bg-white",
        className,
      )}
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        <div className="flex items-center gap-3 md:w-1/5 md:flex-initial">
          <Image
            src="/logo.svg"
            alt="Canto Store Logo"
            width={100}
            height={100}
            onClick={() => handleNavigation("/")}
            className="hover:cursor-pointer"
          />
        </div>

        <MainNavigation />

        <div className="flex items-center gap-1 md:w-1/5 md:justify-end md:gap-4">
          <LanguageSelector />

          <CartDropdown />

          <UserDropdown />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} />
    </header>
  );
}
