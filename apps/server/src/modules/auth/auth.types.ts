export type UserRole = 'CUSTOMER' | 'ADMIN'

export type User = {
  id: number
  name: string
  email: string
  password: string
  email_verified: boolean
  phone_number: string
  role: UserRole
  last_login: Date | null
  created_at: Date
  updated_at: Date
}

export type CreateUserDto = {
  name: string
  email: string
  password: string
  phone_number: string
  role?: UserRole
}

export type LoginDto = {
  email: string
  password: string
}

export type AdminLoginDto = {
  username: string
  password: string
  ip_address: string
}
