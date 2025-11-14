import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET)
}

async function main() {
  throw new Error('Test error for debugging purposes')
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
