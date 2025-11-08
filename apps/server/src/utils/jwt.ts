import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret'
// const JWT_EXPIRES_IN = '5m'
const REFRESH_EXPIRES_IN = '7d'

export interface JwtPayload {
  id: number
  role: UserRole[]
  name?: string
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET)
}

export function signRefreshToken(p: JwtPayload) {
  return jwt.sign(p, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN })
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T
}
