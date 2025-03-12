"use client";

import { useState, useRef, useEffect } from "react";
import { CircleUser, User, Heart, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";

export function UserDropdown() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("header");
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    if (typeof window !== "undefined") {
      setIsRTL(document.dir === "rtl");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    setUserDropdownOpen(false);
  };

  const handleButtonClick = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const dropDownItems = [
    {
      label: t("account"),
      href: "/account",
      icon: <User className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
    {
      label: t("favorites"),
      href: "/favorites",
      icon: <Heart className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: <Settings className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
    {
      label: t("logout"),
      href: "/logout",
      icon: <LogOut className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="hidden md:block" ref={dropdownRef}>
      <button
        className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:cursor-pointer"
        onClick={handleButtonClick}
      >
        <CircleUser className="h-6 w-6" />
      </button>

      {/* User Dropdown */}
      {userDropdownOpen && (
        <div
          onMouseLeave={handleMouseLeave}
          className={`ring-opacity-5 ring-primary absolute mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ${isRTL ? "left-5" : "right-5"}`}
        >
          {dropDownItems.map((item) => (
            <Button
              variant="ghost"
              key={item.label}
              className="text-primary hover:bg-primary/10 flex w-full items-center justify-normal px-4 py-2.5 text-sm transition-colors"
              onClick={() => handleNavigation(item.href)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
