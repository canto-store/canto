"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
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
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={cn(
        "relative container mx-auto flex h-18 items-center justify-between px-4",
        className,
      )}
    >
      {/* Left section: Mobile menu button and language selector */}
      <div className="z-10 flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Canto Store Logo"
          width={90}
          height={90}
          onClick={() => handleNavigation("/")}
        />
      </div>
      <AnimatePresence mode="wait">
        {searchOpen ? (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center"
          >
            <SearchBar showButton={false} autoFocus />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
              className="transition-transform duration-200 hover:scale-105"
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
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="transition-all duration-200 hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
