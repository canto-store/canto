"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth/auth-provider";

export function useProtectedRoute(
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
    roles?: Array<"user" | "admin">;
  } = {},
) {
  const {
    redirectTo = "/login",
    requireAuth = true,
    roles = ["user", "admin"],
  } = options;

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAuthenticated = !!user;
    const hasRequiredRole = user ? roles.includes(user.role) : false;

    if (requireAuth && !isAuthenticated) {
      // Redirect to login if authentication is required but user is not authenticated
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
    } else if (isAuthenticated && !hasRequiredRole) {
      // Redirect to home if user is authenticated but doesn't have required role
      router.push("/");
    } else if (isAuthenticated && pathname === "/login") {
      // Redirect to home if user is already authenticated and tries to access login page
      router.push("/");
    }
  }, [user, isLoading, requireAuth, roles, router, pathname, redirectTo]);

  return {
    isLoading,
    isAuthenticated: !!user,
    user,
  };
}
