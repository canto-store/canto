"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { Home, Search, Store } from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function MainNavigation() {
  const t = useTranslations("header");
  const router = useRouter();
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsRTL(document.dir === "rtl");
    }
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      label: t("home"),
      href: "/",
      icon: <Home className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
    {
      label: t("browse"),
      href: "/browse",
      icon: <Search className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
    {
      label: t("sell"),
      href: "/sell",
      icon: <Store className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="flex w-3/5 justify-center">
      <ul className="flex items-center space-x-12">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <Button
              variant="ghost"
              onClick={() => handleNavigation(item.href)}
              className="text-primary hovers:bg-primary/10 text-base font-medium transition-colors"
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
