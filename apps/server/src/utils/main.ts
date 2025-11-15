import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'

dotenv.config()

async function main() {
  throw new Error('Test error for debugging purposes')
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
