import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const prisma = new PrismaClient()

  const products = await prisma.product.findMany()

  for (const product of products) {
    // Get all variants for this product
    const variants = await prisma.productVariant.findMany({
      where: { productId: product.id },
      select: { id: true },
    })

    if (!variants.length) continue // skip products with no variants

    // Find the first variant that has at least one image
    let firstImageUrl: string | null = null

    for (const variant of variants) {
      const firstImage = await prisma.productVariantImage.findFirst({
        where: { variantId: variant.id },
        orderBy: { id: 'asc' }, // optional, ensures consistent result
      })

      if (firstImage?.url) {
        firstImageUrl = firstImage.url
        break // stop once you find the first valid image
      }
    }

    // Update the product with the found image or a placeholder
    await prisma.product.update({
      where: { id: product.id },
      data: { image: firstImageUrl ?? '/placeholder-image.jpg' },
    })
  }
}
main().catch(err => {
  console.error('Fatal error during startup:', err)
  process.exit(1)
})
