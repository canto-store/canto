"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth/auth-provider";
import { useEffect, useState } from "react";

export function MobileBottomNavigation() {
  const router = useRouter();
  const t = useTranslations("header");
  const { user } = useAuth();
  const [isRTL, setIsRTL] = useState(false);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the document direction is RTL
      setIsRTL(document.dir === "rtl");

      // Set active path based on current URL
      setActivePath(window.location.pathname);
    }
  }, []);

  const navigationItems = [
    {
      label: t("home"),
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: t("browse"),
      href: "/browse",
      icon: <Search className="h-5 w-5" />,
    },
    {
      label: user ? t("account") : t("login"),
      href: user ? "/profile" : "/login",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setActivePath(href);
  };

  return (
    <div className="border-primary/20 fixed right-0 bottom-0 left-0 z-40 h-16 border-t bg-white shadow-lg md:hidden">
      <nav className="container mx-auto h-full">
        <ul className="flex h-full items-center justify-around">
          {navigationItems.map((item) => (
            <li key={item.label} className="flex-1">
              <button
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 px-2 py-2 text-sm transition-colors",
                  activePath === item.href
                    ? "text-primary"
                    : "hover:text-primary text-gray-500",
                )}
              >
                {item.icon}
                <span className={cn("text-xs", isRTL ? "rtl" : "ltr")}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
