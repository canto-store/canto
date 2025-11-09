import { Button } from "@/components/ui/button";
import { XOctagon, LogOut } from "lucide-react";
import { redirect } from "@/i18n/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useQueryClient } from "@tanstack/react-query";

export const ForbiddenError = () => {
  const logout = useUserStore((s) => s.logout);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.setQueryData(["cart"], { items: [], count: 0, price: 0 });
    redirect({ href: "/sell", locale: "en" });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <XOctagon className="text-orange-red h-20 w-20" />
      <h1 className="mt-4 text-4xl font-bold">403 - Forbidden</h1>
      <p className="mt-2 text-center text-xl text-gray-500">
        Sorry you can&apos;t access seller form while logged in as a customer.
        Please logout and log in with your seller account to access this page.
      </p>
      <Button className="mt-4" onClick={handleLogout}>
        <LogOut />
        Logout
      </Button>
    </main>
  );
};
