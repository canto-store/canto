import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api'

interface LoginCredentials {
  username: string
  password: string
}

interface User {
  id: string
  email: string
  name?: string
  role: string
}

const api = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post('/auth/admin-login', credentials)
    return response.data
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}

export function useLogin() {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: api.login,
    onSuccess: user => {
      setUser(user)
      queryClient.setQueryData(['me'], user)
    },
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: api.me,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })
}
