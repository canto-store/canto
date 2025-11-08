"use client";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return <>{children}</>;
}
