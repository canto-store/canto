"use client";

import { useAuth } from "@/hooks/auth";
import { useRouter } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import Spinner from "@/components/common/Spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userQuery } = useAuth();
  const router = useRouter();
  const pathname = usePathname().split("/").slice(2).join("/");

  if (userQuery.isLoading) {
    return <Spinner />;
  }
  if (!user) {
    router.push({
      pathname: "/login",
      query: { returnUrl: pathname },
    });
  }

  if (user) {
    return <>{children}</>;
  }
}
