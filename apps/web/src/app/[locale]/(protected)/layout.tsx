"use client";

import { useAuth } from "@/hooks/auth";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userQuery } = useAuth();
  const router = useRouter();
  const pathname = usePathname().split("/").slice(2).join("/");

  useEffect(() => {
    // Only redirect if query is not loading and user is not authenticated
    if (!userQuery.isLoading && !user) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [user, userQuery.isLoading, router, pathname]);

  // Show loading while checking authentication
  if (userQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading is complete, show nothing (redirect will happen)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
