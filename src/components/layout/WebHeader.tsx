"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { UserDropdown } from "@/components/user/UserDropdown";
import { MainNavigation } from "@/components/layout/MainNavigation";

interface WebHeaderProps {
  className?: string;
}

export function WebHeader({ className }: WebHeaderProps) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={cn(
        "container mx-auto flex h-18 items-center justify-between px-4",
        className,
      )}
    >
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

      <div className="flex items-center gap-4 md:w-1/5 md:justify-end">
        <LanguageSelector />
        <CartDropdown />
        <UserDropdown />
      </div>
    </div>
  );
}
