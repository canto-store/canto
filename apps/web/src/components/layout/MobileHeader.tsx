"use client";

import { useState } from "react";
import { ArrowLeft, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../ui/search-bar";
import { WishlistIcon, CartIcon } from "@/components";
import MobileDrawer from "./MobileDrawer";

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const onMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  if (pathname === "/browse") {
    return (
      <div className="relative container mx-auto flex h-14 items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-2xl font-semibold">Browse</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation("/wishlist")}
        >
          <WishlistIcon />
        </Button>
      </div>
    );
  } else if (pathname.includes("/sell")) {
    return (
      <div className="relative flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="mx-auto text-2xl font-semibold">Sell</h1>
      </div>
    );
  } else if (pathname.includes("/product")) {
    return (
      <div className="relative container mx-auto flex h-14 items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Product</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation("/cart")}
        >
          <CartIcon />
        </Button>
      </div>
    );
  } else if (pathname !== "/") {
    return (
      <div className="relative flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="mx-auto text-2xl font-semibold">
          {pathname.split("/").pop()}
        </h1>
      </div>
    );
  } else {
    return (
      <div className="relative h-14">
        <div
          className={`absolute inset-0 container mx-auto flex h-14 w-full items-center justify-between px-4 transition-all duration-200 ease-in-out ${
            searchOpen
              ? "pointer-events-none translate-x-5 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <Button variant="ghost" size="icon" onClick={onMenuOpen}>
            <Menu className="h-6 w-6" />
          </Button>
          <MobileDrawer open={menuOpen} onOpenChange={onMenuOpen} />
          <Image
            src="/logo.png"
            alt="Canto Store Logo"
            width={80}
            height={60}
            priority
            onClick={() => handleNavigation("/")}
            className="cursor-pointer"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="transition-all duration-200"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div
          className={`absolute inset-0 container mx-auto flex h-14 w-full items-center justify-between px-4 transition-all duration-200 ease-in-out ${
            searchOpen
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-5 opacity-0"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Canto Store Logo"
            width={80}
            height={60}
            priority
            onClick={() => handleNavigation("/")}
            className="cursor-pointer"
          />
          <div className="flex items-center gap-2 transition-all duration-200 ease-in-out">
            <SearchBar showButton={false} autoFocus className="w-48" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
