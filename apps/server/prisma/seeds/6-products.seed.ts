import { PrismaClient, ProductStatus } from '../generated/prisma/client'

export const name = 'products'
export const description = 'Seed for products'

export async function run(prisma: PrismaClient): Promise<void> {
  const brand = await prisma.brand.findFirst()
  const category = await prisma.category.findFirst()
  if (!brand || !category) throw new Error('Brand/Category missing!')

  await prisma.product.create({
    data: {
      name: 'Air Max Shoes',
      slug: 'air-max-shoes',
      description: 'Comfortable running shoes',
      brandId: brand.id,
      categoryId: category.id,
      status: ProductStatus.ACTIVE,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Classic T-Shirt',
      slug: 'classic-tshirt',
      description: 'Soft cotton t-shirt',
      brandId: brand.id,
      categoryId: category.id,
      status: ProductStatus.ACTIVE,
    },
  })

  console.log(`Products seeded successfully`)
}
