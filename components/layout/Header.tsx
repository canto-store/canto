"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  CircleUser,
  LogOut,
  User,
  Settings,
  Heart,
  Home,
  Search,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { CartDropdown } from "../cart/CartDropdown";
import { LanguageSelector } from "../language/LanguageSelector";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("header");
  const router = useRouter();

  const navigationItems = [
    { label: t("home"), href: "/", icon: <Home className="mr-3 h-4 w-4" /> },
    {
      label: t("browse"),
      href: "/browse",
      icon: <Search className="mr-3 h-4 w-4" />,
    },
    { label: t("sell"), href: "#", icon: <Store className="mr-3 h-4 w-4" /> },
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

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <header
      className={cn(
        "border-primary fixed top-0 z-50 w-full border-b bg-white",
        className,
      )}
    >
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3 md:w-1/5 md:flex-initial">
          <Image
            src="/logo.svg"
            alt="Canto Store Logo"
            width={100}
            height={100}
            onClick={() => handleNavigation("/")}
            className="hover:cursor-pointer"
          />
        </div>

        {/* Center Section: Desktop Navigation */}
        <nav className="hidden md:flex md:w-3/5 md:justify-center">
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

        {/* Right Section: Cart, Language Selector and User */}
        <div className="flex items-center gap-1 md:w-1/5 md:justify-end md:gap-4">
          {/* Language Selector */}
          <div className="relative">
            <LanguageSelector />
          </div>

          {/* Cart with Dropdown */}
          <CartDropdown />

          {/* User Menu (Desktop) */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:cursor-pointer"
            >
              <CircleUser className="h-6 w-6" />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="ring-opacity-5 ring-primary absolute right-0 mt-2 w-56 rounded-md bg-white py-2 shadow-lg ring-1">
                <Link
                  href="/account"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-2.5 text-sm transition-colors"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-2.5 text-sm transition-colors"
                >
                  <Heart className="mr-3 h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  href="/settings"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-2.5 text-sm transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
                <div className="bg-primary/20 my-1 h-px" />
                <Link
                  href="/logout"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-2.5 text-sm transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition-all md:hidden"
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
        <div className="border-primary/20 border-t shadow-lg md:hidden">
          <nav className="container mx-auto">
            <ul className="divide-primary/10 divide-y">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/account"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-3 text-base transition-colors"
                >
                  <User className="mr-3 h-4 w-4" />
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-primary hover:bg-primary/10 flex items-center px-4 py-3 text-base transition-colors"
                >
                  <Heart className="mr-3 h-4 w-4" />
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  className="flex items-center px-4 py-3 text-base text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
