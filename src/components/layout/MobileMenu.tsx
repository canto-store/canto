"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { InstallPWA } from "@/components/pwa";
import { Store, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth/use-auth";

import { useClickOutside } from "react-haiku";

interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  const router = useRouter();
  const t = useTranslations("header");
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Get user and logout from auth provider
  const menuRef = useRef(null);

  const handleClickOutside = () => setIsOpen(false);

  useClickOutside(menuRef, handleClickOutside);

  // Common navigation items for all users (removed home and browse)
  const commonNavigationItems: NavigationItem[] = [
    { label: t("sell"), href: "/sell", icon: <Store className="h-5 w-5" /> },
    {
      label: t("settings"),
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const navigationItems = [...commonNavigationItems];

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
    setIsOpen(false);
  };

  const handleLogout = async () => {
    logout();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="border-primary/20 bg-global absolute z-50 container border-t shadow-lg md:hidden"
    >
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

        {/* Sign out button - only shown when logged in */}
        {isAuthenticated && (
          <li>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
            >
              <span
                className={`flex items-center ${isRTL ? "flex-row" : "flex-row"} gap-2`}
              >
                <LogOut className="h-5 w-5" />
                {t("logout")}
              </span>
            </Button>
          </li>
        )}

        {!isAppInstalled && (
          <li>
            <InstallPWA variant="menu" />
          </li>
        )}
      </ul>
    </div>
  );
}
