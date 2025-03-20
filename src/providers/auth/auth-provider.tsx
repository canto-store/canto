import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AUTH_STORAGE_KEY = "auth";

const saveAuthState = (authState: {
  isAuthenticated: boolean;
  accessToken: string | unknown;
  refreshToken: string | unknown;
  name: string | unknown;
}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }
};

const loadAuthState = () => {
  if (typeof window !== "undefined") {
    const storedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (error) {
        console.error("Failed to parse stored auth state:", error);
        return null;
      }
    }
  }
  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or use defaults
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [name, setName] = useState<string>("");

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedAuthState = loadAuthState();
    if (storedAuthState) {
      setIsAuthenticated(storedAuthState.isAuthenticated);
      setAccessToken(storedAuthState.accessToken);
      setRefreshToken(storedAuthState.refreshToken);
      setName(storedAuthState.name);
    }
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    saveAuthState({
      isAuthenticated,
      accessToken,
      refreshToken,
      name,
    });
  }, [isAuthenticated, accessToken, refreshToken, name]);

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await api.post("/login", {
        email,
        password,
      });
      return response;
    },
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setAccessToken(data.access as string);
      setRefreshToken(data.refresh as string);
      setName(data.name as string);
    },
  });

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken("");
    setRefreshToken("");
    setName("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        accessToken,
        refreshToken,
        name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
