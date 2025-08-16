"use client";

import { useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../ui/search-bar";
import { AnimatePresence, motion } from "framer-motion";
import { WishlistIcon, CartIcon } from "@/components";
import MobileDrawer from "./MobileDrawer";

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
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
      <AnimatePresence mode="wait">
        {searchOpen ? (
          <motion.div
            key="search-mode"
            className="relative container mx-auto flex h-14 items-center justify-between px-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
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
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <SearchBar showButton={false} autoFocus className="w-48" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="normal-mode"
            className="relative container mx-auto flex h-14 items-center justify-between px-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <MobileDrawer />
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
