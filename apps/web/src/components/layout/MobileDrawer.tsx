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
  ChevronDown,
  StoreIcon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { getUserRole } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionItem } from "@heroui/react";
import { HomeCategories } from "../home/HomeCategories";
import MobileCategoryDrawer from "../home/MobileCategoryDrawer";
import { useAllCategories } from "@/lib/categories";

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
  const queryClient = useQueryClient();

  const handleNavigation = (href: string) => {
    onOpenChange();
    router.push(href);
  };

  const handleLogout = () => {
    queryClient.setQueryData(["cart"], { items: [], count: 0, price: 0 });
    logout();
  };

  const { data: categories, isLoading } = useAllCategories();

  return (
    <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* Header */}
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

        {/* Drawer Body */}
        <div className="flex flex-col gap-2 px-4 py-4">
          {/* 🛍 Shop Accordion (replaces Shop button) */}
          <Accordion
            variant="bordered"
            className="rounded-lg border border-gray-950 px-3 py-2 data-[open=true]:border-gray-950"
          >
            <AccordionItem
              key="shop"
              aria-label="Shop"
              indicator={
                <ChevronRight className="ml-auto h-4 w-4" color="black" />
              }
              title={
                <div className="flex w-full items-center gap-2">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  <span className="font-sans font-medium uppercase">Shop</span>
                </div>
              }
              classNames={{
                title:
                  "flex items-center justify-between w-full text-base font-normal p-0",
                content: "flex flex-col gap-2 mt-2 border-t border-gray-200",
                trigger: "p-0",
              }}
            >
              {!isLoading && categories && (
                <MobileCategoryDrawer categories={categories} />
              )}
            </AccordionItem>
          </Accordion>

          {/* ❤️ Wishlist */}
          <Button
            variant="outline"
            onClick={() => handleNavigation("/wishlist")}
          >
            <Heart className="mr-2 h-5 w-5" />
            <span className="uppercase">Wishlist</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>

          {/* 🛒 Cart */}
          <Button variant="outline" onClick={() => handleNavigation("/cart")}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span className="uppercase">Cart</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>

          {/* 🏬 Sell */}
          <Button variant="outline" onClick={() => handleNavigation("/sell")}>
            <StoreIcon className="mr-2 h-5 w-5" />
            <p className="w-full text-left uppercase">Sell with Canto</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>

          {/* ⚙️ Settings */}
          <Button
            variant="outline"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span className="uppercase">Settings</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <DrawerFooter>
          {user && role !== "GUEST" ? (
            <Button variant="ghost" onClick={handleLogout}>
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
