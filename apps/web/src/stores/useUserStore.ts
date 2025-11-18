import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthResponse, User } from "@canto/types/auth";
import { getUserRole } from "@/lib/utils";

type UserState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  set: (fn: (state: UserState) => Partial<UserState>) => void;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        hasHydrated: false,

        set: (fn) => set(fn(get())),

        setAuth: (data) => {
          const { id, name, role, accessToken } = data;
          set({
            user: { id, name, role },
            accessToken,
            isAuthenticated: getUserRole(role) !== "GUEST",
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
        onRehydrateStorage: () => (state) => {
          state?.set(() => ({ hasHydrated: true }));
        },
      },
    ),
  ),
);
