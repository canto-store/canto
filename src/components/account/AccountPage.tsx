"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth/use-auth";
import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  CreditCard,
  Download,
  Globe,
  Heart,
  LogOut,
  MapPin,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { If, useMediaQuery } from "react-haiku";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function AccountPage() {
  const { isAuthenticated, name, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)", false);
  const router = useRouter();
  const pathname = usePathname();
  if (isMobile) {
    return (
      <div className="mt-2 flex min-h-screen flex-col gap-2">
        {isAuthenticated ? (
          <h1 className="text-2xl font-bold">Hello, {name}</h1>
        ) : (
          <div className="bg-primary-foreground flex flex-col gap-2 rounded-lg p-5">
            <h1 className="text-xl font-bold">Hello! Welcome to Canto</h1>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
              }
            >
              Login/Register
            </Button>
          </div>
        )}
        <If isTrue={isAuthenticated}>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => router.push("/orders")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Button>
            <Button variant="outline">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Returns
            </Button>
            <Button variant="outline">
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
        </If>
        <div className="flex flex-col gap-2">
          <h2 className="text-md">Settings</h2>
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            <p className="w-full text-left">Language</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            <p className="w-full text-left">Notifications</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            <p className="w-full text-left">Download App</p>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </div>
        <If isTrue={isAuthenticated}>
          <Button variant="ghost" onClick={() => logout()} className="mt-4">
            <LogOut className="text-orange-red mr-2 h-5 w-5" />
            <p className="text-orange-red text-lg">Logout</p>
          </Button>
        </If>
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
