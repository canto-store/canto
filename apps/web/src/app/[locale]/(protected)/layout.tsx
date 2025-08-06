"use client";

import { useUserQuery } from "@/hooks/auth";
import { usePathname, redirect } from "@/i18n/navigation";
import Spinner from "@/components/common/Spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: isUserLoading, isSuccess: isAuthenticated } =
    useUserQuery();
  const pathname = usePathname();

  if (isUserLoading) {
    return <Spinner />;
  }
  if (!isAuthenticated) {
    redirect({
      href: {
        pathname: "/login",
        query: { returnUrl: pathname },
      },
      locale: "en",
    });
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }
}
