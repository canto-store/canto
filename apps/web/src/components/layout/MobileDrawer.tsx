"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Menu,
  XIcon,
  SearchIcon,
  User,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

function MobileDrawer() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
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
              src="/logo.png"
              alt="Canto Store Logo"
              width={80}
              height={60}
              priority
            />
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4 py-4">
          <Button variant="outline" onClick={() => handleNavigation("/browse")}>
            <SearchIcon className="h-5 w-5" />
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
          <Button variant="outline" onClick={() => handleNavigation("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MobileDrawer;
