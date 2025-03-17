import { createContext } from "react";
import { LoginRequest } from "@/types/auth";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  accessToken: string;
  name: string;
  refreshToken: string;
  login: (userData: LoginRequest) => Promise<void>;
  logout: () => void;
}>({
  isAuthenticated: false,
  accessToken: "",
  refreshToken: "",
  name: "",
  login: async () => {},
  logout: () => {},
});
