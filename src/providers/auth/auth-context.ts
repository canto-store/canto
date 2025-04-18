import { createContext } from "react";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

type User = {
  firstName: string;
};

export const AuthContext = createContext<{
  user: User | null | undefined;
  isAuthenticated: boolean;
  login: UseMutationResult<User, Error, LoginRequest>;
  logout: UseMutationResult<void, Error>;
  userQuery: UseQueryResult<User | null | undefined, Error>;
  register: UseMutationResult<User, Error, RegisterRequest>;
}>({
  user: null,
  isAuthenticated: false,
  login: {} as UseMutationResult<User, Error, LoginRequest>,
  logout: {} as UseMutationResult<void, Error>,
  userQuery: {} as UseQueryResult<User | null | undefined, Error>,
  register: {} as UseMutationResult<User, Error, RegisterRequest>,
});
