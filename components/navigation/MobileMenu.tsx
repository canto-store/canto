"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { InstallPWA } from "@/components/pwa";
import { Home, Search, Store, Heart, User, Settings } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface MobileMenuProps {
  isOpen: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
  const router = useRouter();
  const t = useTranslations("header");
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  const navigationItems: NavigationItem[] = [
    { label: t("home"), href: "/", icon: <Home className="h-5 w-5" /> },
    {
      label: t("browse"),
      href: "/browse",
      icon: <Search className="h-5 w-5" />,
    },
    { label: t("sell"), href: "#", icon: <Store className="h-5 w-5" /> },
    {
      label: t("favorites"),
      href: "/favorites",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      label: t("account"),
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the app is already installed
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      setIsAppInstalled(isStandalone);

      // Check if the document direction is RTL
      setIsRTL(document.dir === "rtl");
    }
  }, []);

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  if (!isOpen) return null;

  return (
    <div className="border-primary/20 border-t shadow-lg md:hidden">
      <nav className="container mx-auto">
        <ul className="divide-primary/10 divide-y">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Button
                variant="ghost"
                onClick={() => handleNavigation(item.href)}
                className="flex items-center gap-2 px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
              >
                <span
                  className={`flex items-center ${isRTL ? "flex-row" : "flex-row"} gap-2`}
                >
                  {item.icon}
                  {item.label}
                </span>
              </Button>
            </li>
          ))}
          {!isAppInstalled && (
            <li>
              <InstallPWA variant="menu" />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
