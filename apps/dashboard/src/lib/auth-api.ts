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

export const api = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post('/auth/admin-login', credentials)
    return response.data
  },

  me: async () => {
    return await apiClient.get('/auth/me')
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
  },
}
