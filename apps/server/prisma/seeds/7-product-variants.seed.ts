import { PrismaClient } from '../generated/prisma/client'

export const name = 'product-variants'
export const description = 'Seed for product variants and variant options'

export async function run(prisma: PrismaClient): Promise<void> {
  const product = await prisma.product.findFirst()
  const sizeValue = await prisma.productOptionValue.findFirst({
    where: { value: 'M' },
  })
  const colorValue = await prisma.productOptionValue.findFirst({
    where: { value: 'Red' },
  })

  if (!product || !sizeValue || !colorValue)
    throw new Error('Dependencies missing!')

  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: 'SKU-RED-M',
      price: 99.99,
      stock: 50,
      optionLinks: {
        create: [
          {
            optionValueId: sizeValue.id,
            productOptionId: sizeValue.productOptionId,
          },
          {
            optionValueId: colorValue.id,
            productOptionId: colorValue.productOptionId,
          },
        ],
      },
      images: {
        create: [
          {
            url: 'https://example.com/shoe-red-m.png',
            alt_text: 'Red shoe size M',
          },
        ],
      },
    },
  })

  console.log(`Created variant with id: ${variant.id}`)
}
