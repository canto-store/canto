import { PrismaClient } from '@prisma/client'

export const name = 'product-options'
export const description = 'Seed for product options: Size and Color'

export async function run(prisma: PrismaClient): Promise<void> {
  // Create Size option
  const sizeOption = await prisma.productOption.create({
    data: {
      name: 'Size',
      values: {
        create: [
          { value: 'XS' },
          { value: 'S' },
          { value: 'M' },
          { value: 'L' },
          { value: 'XL' },
          { value: 'XXL' },
          { value: 'S/M' },
          { value: 'L/XL' },
          { value: 'XS/S' },
          { value: 'M/L' },
          { value: 'XL/XXL' },
          ...Array.from({ length: 11 }, (_, i) => ({
            value: (i + 32).toString(),
          })),
        ],
      },
    },
  })

  console.log(`Created Size option with id: ${sizeOption.id}`)

  // Create Color option
  const colorOption = await prisma.productOption.create({
    data: {
      name: 'Color',
      values: {
        create: [
          { value: 'Red' },
          { value: 'Blue' },
          { value: 'Green' },
          { value: 'Yellow' },
          { value: 'Black' },
          { value: 'White' },
          { value: 'Purple' },
          { value: 'Orange' },
          { value: 'Pink' },
          { value: 'Gray' },
        ],
      },
    },
  })

  console.log(`Created Color option with id: ${colorOption.id}`)
}
