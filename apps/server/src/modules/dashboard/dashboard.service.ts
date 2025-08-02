import { PrismaClient } from '@prisma/client'
import { stringifyActivities } from './dashboard.core'
class Dashboard {
  private readonly prisma = new PrismaClient()

  async getActivity() {
    const activities = await this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return stringifyActivities(activities)
  }
}

export default Dashboard
