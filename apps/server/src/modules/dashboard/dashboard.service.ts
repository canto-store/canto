import { PrismaClient, ProductStatus, UserRole } from '@prisma/client'
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

  async getDashboardCounts() {
    const products = await this.prisma.product.findMany()

    const totalProducts = products.length

    const active = products.filter(
      p => p.status === ProductStatus.ACTIVE
    ).length

    const pending = products.filter(
      p => p.status === ProductStatus.PENDING
    ).length

    const totalBrands = await this.prisma.brand.count()
    const totalUsers = await this.prisma.user.findMany()

    const totalSellers = totalUsers.filter(u =>
      u.role.includes(UserRole.SELLER)
    )

    return {
      product: {
        total: totalProducts,
        active,
        pending,
      },
      brand: {
        total: totalBrands,
      },
      seller: {
        total: totalSellers.length,
      },
      user: {
        total: totalUsers.length,
      },
    }
  }

  async getUsers() {
    const users = await this.prisma.user.findMany()
    return users.map(user => ({
      ...user,
      password: null,
    }))
  }
}

export default DashboardService
