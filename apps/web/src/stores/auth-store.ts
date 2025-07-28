import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, Seller } from "@/types/user";

interface AuthState {
  user: User | Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | Seller | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => {
        // Clear localStorage first
        localStorage.removeItem("auth-storage");
        // Then update state
        return set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
