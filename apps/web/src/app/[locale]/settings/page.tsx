"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  Heart,
  LogOut,
  MapPin,
  Receipt,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { InstallPWA } from "@/components/pwa/InstallPWA";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useLogout } from "@/lib/auth";
import { getUserRole } from "@/lib/utils";

export default function Page() {
  const { user } = useAuthStore();
  const role = getUserRole(user?.role);
  const isMobile = useMediaQuery("(max-width: 768px)", false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { mutate: logout } = useLogout();

  const handleLanguageChange = () => {
    const value = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: value });
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  if (isMobile) {
    return (
      <div className="mt-2 flex min-h-screen flex-col gap-2">
        {user ? (
          <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
        ) : (
          <div className="bg-primary-foreground flex flex-col gap-2 rounded-lg p-5">
            <h1 className="text-xl font-bold">Hello! Welcome to Canto</h1>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleNavigation(`/login`)}
            >
              Login/Register
            </Button>
          </div>
        )}
        {Boolean(user) && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleNavigation("/orders")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/wishlist")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/returns")}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Returns
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNavigation("/wallet")}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-md">Account</h2>
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                <p className="w-full text-left">Addresses</p>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                <p className="w-full text-left">Cards</p>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </div>
            {role === "SELLER" && (
              <div className="flex flex-col gap-2">
                <h2 className="text-md">Seller</h2>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/sales")}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  <p className="w-full text-left">Sales</p>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-md">Settings</h2>
          <Button variant="outline" onClick={handleLanguageChange}>
            <Globe className="mr-2 h-4 w-4" />
            <p className="w-full text-left">Language</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            <p className="w-full text-left">Notifications</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <InstallPWA variant="menu" className="p-0" />
        </div>
        {Boolean(user) && (
          <Button variant="ghost" onClick={() => logout()} className="mt-4">
            <LogOut className="text-orange-red mr-2 h-5 w-5" />
            <p className="text-orange-red text-lg">Logout</p>
          </Button>
        )}
      </div>
    );
  } else {
    return (
      <div className="min-h-screen">
        <h1>Account</h1>
      </div>
    );
  }
}
