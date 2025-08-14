"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { UserDropdown } from "@/components/home/UserDropdown";
import { MainNavigation } from "@/components/layout/MainNavigation";
import LanguageSelector from "@/components/common/LanguageSelector";

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
        "container mx-auto flex h-14 items-center justify-between px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 md:w-1/5 md:flex-initial">
        <Image
          src="/logo.png"
          alt="Canto Store Logo"
          width={80}
          height={60}
          priority
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
