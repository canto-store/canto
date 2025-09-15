import { PrismaClient } from '@prisma/client'

export class BalanceService {
  private readonly prisma = new PrismaClient()

  async getBalance(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    })
    return user.balance
  }
}
