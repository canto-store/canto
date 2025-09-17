import { PrismaClient } from '@prisma/client'

export class SalesService {
  private readonly prisma = new PrismaClient()

  async getSales(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { sales: true },
    })
    return user.sales.map(sale => sale.priceAtOrder).reduce((a, b) => a + b, 0)
  }
}
