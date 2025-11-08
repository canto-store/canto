type UserRole = 'GUEST' | 'USER' | 'SELLER' | 'ADMIN'

export type LoginDto = {
  email: string
  password: string
}

export type User = {
  id: number
  role: UserRole[]
  name: string
}

export type AuthResponse = User & {
  accessToken: string
}

export type RegisterDto = {
  name: string
  email: string
  password: string
  phone_number: string
}
