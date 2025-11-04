import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const prisma = new PrismaClient()

  const products = await prisma.product.findMany()

  for (const product of products) {
    const firstVariant = await prisma.productVariant.findFirst({
      where: { productId: product.id },
    })

    const firstImage = await prisma.productVariantImage.findFirst({
      where: { variantId: firstVariant.id },
    })

    await prisma.product.update({
      where: { id: product.id },
      data: { image: firstImage?.url ?? 'placeholder-image.jpg' },
    })
  }
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
