import { createContext } from "react";
import { LoginRequest } from "@/types/auth";
import { UseMutationResult } from "@tanstack/react-query";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  accessToken: string | unknown;
  refreshToken: string | unknown;
  name: string;
  login: UseMutationResult<unknown, Error, LoginRequest>;
  logout: () => void;
}>({
  isAuthenticated: false,
  accessToken: "",
  refreshToken: "",
  name: "",
  login: {} as UseMutationResult<unknown, Error, LoginRequest>,
  logout: () => {},
});
