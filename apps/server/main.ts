import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const prisma = new PrismaClient()

  const users = await prisma.user.findMany({})
  console.log(`Found ${users.length} users.`)

  for (const user of users) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    })
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
      await prisma.cart.delete({
        where: { id: cart.id },
      })
    }
  }
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
