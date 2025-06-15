import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }),
  setLoading: loading => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
}))
