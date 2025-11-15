import { PrismaClient, ProductOptionValue } from '@prisma/client'

export class OptionService {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getSizeOptions(): Promise<ProductOptionValue[]> {
    return this.prisma.productOptionValue.findMany({
      where: { productOption: { name: 'Size' } },
    })
  }
}
