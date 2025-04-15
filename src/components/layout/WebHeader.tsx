"use client";

import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { UserDropdown } from "@/components/home/UserDropdown";
import { MainNavigation } from "@/components/layout/MainNavigation";
import { Button } from "../ui/button";

interface WebHeaderProps {
  className?: string;
}

export function WebHeader({ className }: WebHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  const handleLanguageChange = () => {
    const value = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: value });
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
          height={40}
          priority
          onClick={() => handleNavigation("/")}
          className="hover:cursor-pointer"
        />
      </div>

      <MainNavigation />

      <div className="flex items-center gap-4 md:w-1/5 md:justify-end">
        <Button
          variant="ghost"
          onClick={handleLanguageChange}
          aria-label="Select language"
        >
          <span
            className={cn(
              "text-sm font-medium",
              locale === "en" && "font-arabic",
            )}
          >
            {locale === "ar" ? "English" : "العربية"}
          </span>
        </Button>
        <CartDropdown />
        <UserDropdown />
      </div>
    </div>
  );
}
