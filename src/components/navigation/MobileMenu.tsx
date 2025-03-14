"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { InstallPWA } from "@/components/pwa";
import {
  Home,
  Search,
  Store,
  LogIn,
  Heart,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/providers/auth/auth-provider";

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
  const { user, logout } = useAuth(); // Get user and logout from auth provider
  const isAuthenticated = !!user;

  // Common navigation items for all users
  const commonNavigationItems: NavigationItem[] = [
    { label: t("home"), href: "/", icon: <Home className="h-5 w-5" /> },
    {
      label: t("browse"),
      href: "/browse",
      icon: <Search className="h-5 w-5" />,
    },
    { label: t("sell"), href: "/sell", icon: <Store className="h-5 w-5" /> },
  ];

  // User-specific navigation items (only shown when logged in)
  const authenticatedNavigationItems: NavigationItem[] = [
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

  // Login navigation item (only shown when logged out)
  const unauthenticatedNavigationItems: NavigationItem[] = [
    {
      label: t("login"),
      href: "/login",
      icon: <LogIn className="h-5 w-5" />,
    },
  ];

  // Combine navigation items based on authentication status
  const navigationItems = [
    ...commonNavigationItems,
    ...(isAuthenticated
      ? authenticatedNavigationItems
      : unauthenticatedNavigationItems),
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

  const handleLogout = async () => {
    await logout();
    // No need to close the menu as the page will refresh
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
      </nav>
    </div>
  );
}
