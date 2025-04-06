"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../ui/search-bar";
import { AnimatePresence, motion } from "framer-motion";
interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  if (pathname === "/browse") {
    return (
      <div className="relative container mx-auto flex h-18 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-2xl font-semibold">Browse</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation("/wishlist")}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    );
  } else if (pathname !== "/") {
    return (
      <div className="relative container mx-auto flex h-18 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">{pathname.split("/").pop()}</h1>
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          "relative container mx-auto flex h-18 items-center justify-between px-4",
          className,
        )}
      >
        {/* Left section: Logo */}
        <div className="z-10 flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Canto Store Logo"
            width={90}
            height={90}
            priority
            onClick={() => handleNavigation("/")}
          />
        </div>

        {/* Right section: Search functionality */}
        <div className="relative flex items-center justify-end">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-bar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex w-full items-center"
              >
                <SearchBar showButton={false} autoFocus className="w-48" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 transition-transform duration-200 hover:scale-105"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="search-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
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
        </div>
      </div>
    );
  }
}
