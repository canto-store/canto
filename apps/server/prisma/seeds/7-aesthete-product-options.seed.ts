import { PrismaClient } from '@prisma/client'

export const name = 'aesthete-product-options'
export const description = 'Seed for product options customized for Aesthete'

export async function run(prisma: PrismaClient): Promise<void> {
  const sizeOption = await prisma.productOption.findFirst({
    where: { name: 'Size' },
  })

  if (sizeOption) {
    await prisma.productOptionValue.createMany({
      data: [
        { value: 'S/M', productOptionId: sizeOption.id },
        { value: 'L/XL', productOptionId: sizeOption.id },
        { value: 'XS/S', productOptionId: sizeOption.id },
        { value: 'M/L', productOptionId: sizeOption.id },
        { value: 'XL/XXL', productOptionId: sizeOption.id },
        ...Array.from({ length: 11 }, (_, i) => ({
          value: (i + 32).toString(),
          productOptionId: sizeOption.id,
        })),
      ],
      skipDuplicates: true,
    })
    console.log(
      `Created Size option values for productOption id: ${sizeOption.id}`
    )
  } else {
    console.log('Size option not found or not updated.')
  }
}
