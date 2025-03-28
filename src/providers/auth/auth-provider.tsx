import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const name = Cookies.get("name");
    if (accessToken && name) {
      setIsAuthenticated(true);
      setName(name);
    }
  }, []);

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
      Cookies.set("accessToken", data.access as string, COOKIE_CONFIG);
      Cookies.set("refreshToken", data.refresh as string, COOKIE_CONFIG);
      Cookies.set("name", data.name as string, COOKIE_CONFIG);

      setIsAuthenticated(true);
      setName(data.name as string);
    },
  });

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("name");

    setIsAuthenticated(false);
    setName("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
