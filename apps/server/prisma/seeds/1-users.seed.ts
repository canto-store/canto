import { PrismaClient, UserRole } from '@prisma/client'
import Bcrypt from '../../src/utils/bcrypt'

export const name = 'users'
export const description = 'Seed for users'

export async function run(prisma: PrismaClient): Promise<void> {
  const hashed = await Bcrypt.hash('password123')

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashed,
      phone_number: '+201000000001',
      role: [UserRole.ADMIN],
    },
  })

  const seller = await prisma.user.create({
    data: {
      name: 'Seller User',
      email: 'seller@example.com',
      password: hashed,
      phone_number: '+201000000002',
      role: [UserRole.SELLER],
    },
  })

  const customer = await prisma.user.create({
    data: {
      name: 'Customer User',
      email: 'customer@example.com',
      password: hashed,
      phone_number: '+201000000003',
      role: [UserRole.USER],
    },
  })

  console.log(`Users seeded: admin=${admin.id}, seller=${seller.id}, customer=${customer.id}`)
}
