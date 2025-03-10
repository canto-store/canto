"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  CircleUser,
  LogOut,
  User,
  Settings,
  Heart,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  cartCount: number;
  className?: string;
}

export function Header({ cartCount, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const navigationItems = [
    { label: t("home"), href: "/" },
    { label: t("browse"), href: "/browse" },
    { label: t("sell"), href: "#" },
  ];
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <header
      className={cn("fixed top-0 z-50 w-full bg-white shadow-sm", className)}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3 md:w-1/5 md:flex-initial">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Logo"
              width="100"
              height="100"
              priority
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Center Section: Desktop Navigation */}
        <nav className="hidden md:flex md:w-3/5 md:justify-center">
          <ul className="flex items-center space-x-12">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-base font-medium text-gray-600 transition-colors hover:text-black"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section: Cart, Language Selector and User */}
        <div className="flex items-center gap-1 md:w-1/5 md:justify-end md:gap-4">
          {/* Language Selector */}
          <div className="relative">
            <Select onValueChange={handleLanguageChange} defaultValue={locale}>
              <SelectTrigger className="h-10 w-[120px] border-none hover:bg-gray-100 focus:ring-0">
                <SelectValue placeholder={<Globe className="h-5 w-5" />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 {t("en")}</SelectItem>
                <SelectItem value="ar">🇪🇬 {t("ar")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cart */}
          <a
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all hover:bg-gray-100 hover:text-black"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                {cartCount}
              </span>
            )}
          </a>

          {/* User Menu (Desktop) */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all hover:bg-gray-100 hover:text-black"
            >
              <CircleUser className="h-6 w-6" />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="ring-opacity-5 absolute right-0 mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1 ring-black">
                <a
                  href="/account"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Account
                </a>
                <a
                  href="/wishlist"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Heart className="mr-3 h-4 w-4" />
                  Wishlist
                </a>
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </a>
                <div className="my-1 h-px bg-gray-200" />
                <a
                  href="/logout"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-all hover:bg-gray-100 hover:text-black md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg md:hidden">
          <nav className="container mx-auto">
            <ul className="divide-y divide-gray-100">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/account"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="/wishlist"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <Heart className="mr-3 h-4 w-4" />
                  Wishlist
                </a>
              </li>
              <li>
                <a
                  href="/settings"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="/logout"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </a>
              </li>

              {/* Mobile Language Selector */}
              <li>
                <div className="px-4 py-3">
                  <Select
                    onValueChange={handleLanguageChange}
                    defaultValue={locale}
                  >
                    <SelectTrigger className="w-full border-gray-200">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        <span>{t("language")}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 {t("en")}</SelectItem>
                      <SelectItem value="ar">🇸🇦 {t("ar")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
