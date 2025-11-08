"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  XIcon,
  SearchIcon,
  Heart,
  ShoppingCart,
  Settings,
  ChevronRight,
  StoreIcon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { getUserRole } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";

function MobileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const role = getUserRole(user?.role);
  const logout = useUserStore((s) => s.logout);
  const handleNavigation = (href: string) => {
    onOpenChange();
    router.push(href);
  };

  return (
    <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
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
            <SearchIcon className="mr-2 h-5 w-5" />
            <span>Browse</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNavigation("/wishlist")}
          >
            <Heart className="mr-2 h-5 w-5" />
            <span>Wishlist</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleNavigation("/cart")}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Cart</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => handleNavigation("/sell")}>
            <StoreIcon className="mr-2 h-5 w-5" />
            <p className="w-full text-left">Sell with Canto</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span>Settings</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>
        <DrawerFooter>
          {user && role !== "GUEST" ? (
            <Button variant="ghost" onClick={() => logout()}>
              <LogOut className="text-orange-red mr-2 h-5 w-5" />
              <p className="text-orange-red text-lg">Logout</p>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleNavigation("/login")}
            >
              Login/Register
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MobileDrawer;
