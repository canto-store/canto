import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET)
}

async function main() {
  const token = signJwt({
    id: 17,
    name: 'Omar Soubky',
    role: ['USER', 'SELLER', 'ADMIN'],
  })
  console.log('##### — token =>', token)
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
