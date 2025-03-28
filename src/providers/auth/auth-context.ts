import { createContext } from "react";
import { LoginRequest } from "@/types/auth";
import { UseMutationResult } from "@tanstack/react-query";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  name: string;
  login: UseMutationResult<unknown, Error, LoginRequest>;
  logout: () => void;
}>({
  isAuthenticated: false,
  name: "",
  login: {} as UseMutationResult<unknown, Error, LoginRequest>,
  logout: () => {},
});
