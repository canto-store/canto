"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  CircleUser,
  LogOut,
  User,
  Settings,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  cartCount: number;
}

// Navigation items array
const navigationItems = [
  { label: "Home", href: "#" },
  { label: "Explore", href: "#" },
  { label: "Collections", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Sell", href: "#" },
];

export function Header({ cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b bg-white/80 text-black backdrop-blur-md">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="canto"
                width={120}
                height={40}
                className="h-18 w-auto"
              />
            </a>
            <div className="hidden items-center gap-6 lg:flex">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search..."
                className="w-64 pr-8 placeholder:text-gray-400"
              />
              <Search className="absolute top-2.5 right-2 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="hover:text-primary flex items-center justify-center transition-colors"
                  aria-label="User profile"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <CircleUser />
                </button>

                {/* User dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-white py-1 shadow-lg">
                    <div className="border-b px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        My Account
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        user@example.com
                      </p>
                    </div>

                    <a
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>

                    <a
                      href="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </a>

                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>

                    <div className="my-1 border-t"></div>

                    <a
                      href="/logout"
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
              <div className="relative">
                <a
                  href="/cart"
                  className="hover:text-primary flex items-center justify-center transition-colors"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart />
                  {cartCount > 0 && (
                    <span className="bg-accent absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform bg-white transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-4 pt-20">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary text-xl transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
