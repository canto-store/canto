"use client";

import { useState, useRef, useEffect } from "react";
import { CircleUser, User, Heart, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/auth/auth-provider";
import { LoginModal } from "../auth/LoginModal";
import { RegisterModal } from "../auth/RegisterModal";

export function UserDropdown() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("header");
  const router = useRouter();
  const { user, logout } = useAuth();

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
    if (!user) {
      setLoginModalOpen(true);
      return;
    }
    setUserDropdownOpen(!userDropdownOpen);
  };

  const switchToRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
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
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setUserDropdownOpen(false);
  };

  return (
    <>
      <div className="hidden md:block" ref={dropdownRef}>
        <button
          className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:cursor-pointer"
          onClick={handleButtonClick}
          title={user ? user.name || user.email : t("login")}
        >
          <CircleUser className="h-6 w-6" />
        </button>

        {/* User Dropdown - Only shown when user is logged in and dropdown is open */}
        {user && userDropdownOpen && (
          <div
            onMouseLeave={handleMouseLeave}
            className={`bg-global ring-opacity-5 ring-primary absolute mt-2 w-56 rounded-md py-2 shadow-lg ring-1 ${isRTL ? "left-5" : "right-5"}`}
          >
            <div className="border-primary/10 mb-2 border-b px-4 pb-2">
              <p className="text-primary font-medium">
                {user.name || user.email}
              </p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>

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

            <div className="border-primary/10 mt-2 border-t pt-2">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 flex w-full items-center justify-normal px-4 py-2.5 text-sm transition-colors"
                onClick={handleLogout}
              >
                <LogOut className={`h-4 w-4 ${isRTL ? "mr-3" : "mr-3"}`} />
                {t("logout")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </>
  );
}
