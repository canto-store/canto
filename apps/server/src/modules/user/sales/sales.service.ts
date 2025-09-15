import { PrismaClient } from '@prisma/client'

export class SalesService {
  private readonly prisma = new PrismaClient()

  async getSales(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    })
    return user.balance
  }
}
