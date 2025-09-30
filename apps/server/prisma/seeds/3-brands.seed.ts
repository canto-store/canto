import { PrismaClient } from '@prisma/client'

export const name = 'brands'
export const description = 'Seed for brands'

export async function run(prisma: PrismaClient): Promise<void> {
  const seller = await prisma.user.findFirst({ where: { email: 'seller@example.com' } })
  if (!seller) throw new Error('Seller user not found! Run users.seed.ts first.')

  await prisma.brand.create({
    data: {
      name: 'Nike',
      slug: 'nike',
      email: 'contact@nike.com',
      logo: 'https://example.com/nike.png',
      description: 'Sports brand',
      sellerId: seller.id,
    },
  })

  await prisma.brand.create({
    data: {
      name: 'Adidas',
      slug: 'adidas',
      email: 'contact@adidas.com',
      logo: 'https://example.com/adidas.png',
      description: 'Another sports brand',
      sellerId: seller.id,
    },
  })

  console.log(`Brands seeded successfully`)
}
