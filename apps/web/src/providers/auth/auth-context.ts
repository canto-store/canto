import { createContext } from "react";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user";

export const AuthContext = createContext<{
  user: User;
  isAuthenticated: boolean;
  login: UseMutationResult<User, Error, LoginRequest>;
  sellerLogin: UseMutationResult<User, Error, LoginRequest>;
  logout: UseMutationResult<void, Error>;
  userQuery: UseQueryResult<User | null | undefined, Error>;
  register: UseMutationResult<User, Error, RegisterRequest>;
  sellerRegister: UseMutationResult<User, Error, RegisterRequest>;
}>({
  user: {} as User,
  isAuthenticated: false,
  login: {} as UseMutationResult<User, Error, LoginRequest>,
  sellerLogin: {} as UseMutationResult<User, Error, LoginRequest>,
  logout: {} as UseMutationResult<void, Error>,
  userQuery: {} as UseQueryResult<User | null | undefined, Error>,
  register: {} as UseMutationResult<User, Error, RegisterRequest>,
  sellerRegister: {} as UseMutationResult<User, Error, RegisterRequest>,
});
