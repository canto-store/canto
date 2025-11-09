import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const prisma = new PrismaClient()

  const users = await prisma.user.findMany({ where: { role: { has: 'USER' } } })
  console.log(`Found ${users.length} users.`)

  for (const user of users) {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    })
    if (!cart) {
      await prisma.cart.create({
        data: { userId: user.id },
      })
      console.log(`Created cart for user ID ${user.id}`)
    }
  }
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
