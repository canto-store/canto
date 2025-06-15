import { PrismaClient } from '@prisma/client'

export const name = 'sale'
export const description = 'Seed for sale'
export async function run(prisma: PrismaClient): Promise<void> {
  const sale = await prisma.sale.create({
    data: {
      type: 'PERCENTAGE',
      value: 20,
      start_at: new Date(),
      end_at: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  })
  console.log(`Created sale with id: ${sale.id}`)
}
