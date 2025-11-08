import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthResponse, User } from "@canto/types/auth";

type UserState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,

        setAuth: (data) => {
          const { id, name, role, accessToken } = data;
          set({
            user: { id, name, role },
            accessToken,
            isAuthenticated: true,
          });
        },

        logout: () => {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        },
      }),
      {
        name: "user-store",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);
