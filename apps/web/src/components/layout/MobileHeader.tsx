"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Home,
  Link,
  Menu,
  Search,
  SearchCheck,
  ShoppingCart,
  User,
  X,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "../ui/search-bar";
import { AnimatePresence, motion } from "framer-motion";
import { WishlistIcon, CartIcon } from "@/components";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
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
      <div className="relative container mx-auto flex h-14 items-center justify-between px-4">
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
          <WishlistIcon />
        </Button>
      </div>
    );
  } else if (pathname.includes("/product")) {
    return (
      <div className="relative container mx-auto flex h-14 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
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
          onClick={() => window.history.back()}
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
      <div
        className={cn(
          "relative container mx-auto flex h-14 items-center justify-between px-4",
          className,
        )}
      >
        <Drawer direction="left">
          <DrawerTrigger>
            <Menu className="h-6 w-6" />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-row items-center justify-between border-b border-gray-500">
              <DrawerClose>
                <XIcon className="h-6 w-6" />
              </DrawerClose>
              <DrawerTitle>
                <Image
                  src="/logo.svg"
                  alt="Canto Store Logo"
                  width={80}
                  height={20}
                  priority
                />
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-4 px-4">
              <Button
                variant="outline"
                onClick={() => handleNavigation("/browse")}
              >
                <SearchCheck className="h-5 w-5" />
                <span>Browse</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/account")}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/wishlist")}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
        <Image
          src="/logo.svg"
          alt="Canto Store Logo"
          width={80}
          height={20}
          priority
          onClick={() => handleNavigation("/")}
        />
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-bar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex items-center"
              >
                <SearchBar showButton={false} autoFocus className="w-48" />
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
