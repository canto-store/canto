import { prisma } from '../../../utils/db'

export class BalanceService {
  async getBalance(userId: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    })
    return user.balance
  }
}
