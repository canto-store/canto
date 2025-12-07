import { UserRole } from '../../utils/db'

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
  guestId: number
  name: string
  email: string
  password: string
  phone_number: string
}

export type LoginDto = {
  guestId: number
  email: string
  password: string
  role: UserRole
}
