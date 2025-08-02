import { PrismaClient, ProductStatus } from '@prisma/client'
import { stringifyActivities } from './dashboard.core'
class DashboardService {
  private readonly prisma = new PrismaClient()

  async getLatestActivities() {
    const activities = await this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return stringifyActivities(activities)
  }

  async getProductCount() {
    const products = await this.prisma.product.findMany({
      where: { OR: [{ status: 'ACTIVE' }, { status: 'PENDING' }] },
    })

    const activeProductsCount = products.filter(
      p => p.status === ProductStatus.ACTIVE
    ).length

    const pendingProductsCount = products.filter(
      p => p.status === ProductStatus.PENDING
    ).length

    return {
      activeProductsCount,
      pendingProductsCount,
    }
  }
}

export default DashboardService
