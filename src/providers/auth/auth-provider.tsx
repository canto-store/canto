"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AuthContextType, AuthState, User } from "@/types/auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const t = useTranslations("auth");
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Mock auth check - check localStorage for mock user
      const mockUser = localStorage.getItem("mockUser");
      if (mockUser) {
        setState({
          user: JSON.parse(mockUser),
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setState({
        user: null,
        isLoading: false,
        error: "Failed to check authentication status",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      if (email === "omar@example.com" && password === "omar") {
        const mockUser: User = {
          id: "1",
          email: "omar@example.com",
          name: "Omar",
          role: "user",
          createdAt: new Date(),
        };

        localStorage.setItem("mockUser", JSON.stringify(mockUser));

        setState({
          user: mockUser,
          isLoading: false,
          error: null,
        });

        toast.success(t("loginSuccess"));
        router.refresh();
        return;
      }

      throw new Error("Invalid credentials");
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        error: err instanceof Error ? err.message : "Login failed",
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      setState({ ...state, isLoading: true, error: null });
      // Remove mock user from localStorage
      localStorage.removeItem("mockUser");

      setState({
        user: null,
        isLoading: false,
        error: null,
      });

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setState({
        ...state,
        isLoading: false,
        error: "Logout failed",
      });
    }
  };

  const register = async (name: string, email: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      // Mock register logic
      const mockUser: User = {
        id: "1",
        email,
        name,
        role: "user",
        createdAt: new Date(),
      };

      // Store mock user in localStorage
      localStorage.setItem("mockUser", JSON.stringify(mockUser));

      setState({
        user: mockUser,
        isLoading: false,
        error: null,
      });

      router.refresh();
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        error: err instanceof Error ? err.message : "Registration failed",
      });
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      // TODO: Replace with your actual password reset endpoint
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setState({
        ...state,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        error: err instanceof Error ? err.message : "Password reset failed",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      // TODO: Replace with your actual profile update endpoint
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Profile update failed");
      }

      setState({
        ...state,
        user: responseData.user,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        ...state,
        isLoading: false,
        error: err instanceof Error ? err.message : "Profile update failed",
      });
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
