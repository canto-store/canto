import { apiClient } from '@/lib/api'
import type { AuthResponse, LoginDto } from '@canto/types/auth'

export const api = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/v2/auth/login', credentials)
    return response.data
  },
}
