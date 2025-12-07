import { prisma } from '../../../utils/db'

export class SalesService {
  async getSales(userId: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { sales: true },
    })
    return user.sales.map(sale => sale.priceAtOrder).reduce((a, b) => a + b, 0)
  }
}
