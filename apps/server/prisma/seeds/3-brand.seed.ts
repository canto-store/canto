import { PrismaClient } from '@prisma/client'

export const name = 'brand'
export const description = 'Seed for brand'

export async function run(prisma: PrismaClient): Promise<void> {
  const brand = await prisma.brand.create({
    data: {
      name: 'Brand',
      slug: 'brand',
      description: 'Brand description',
      email: 'omar@soubky.com',
      instagram_url: 'https://instagram.com/omar.soubky',
      seller: { connect: { id: 1 } },
    },
  })
  console.log(`Created seller with id: ${brand.id}`)
}
