import { prisma, ProductStatus, UserRole } from '../../utils/db'
import { stringifyActivities } from './dashboard.core'
class DashboardService {
  async getLatestActivities() {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return stringifyActivities(activities)
  }

  async getDashboardCounts() {
    const products = await prisma.product.findMany()

    const totalProducts = products.length

    const active = products.filter(
      p => p.status === ProductStatus.ACTIVE
    ).length

    const pending = products.filter(
      p => p.status === ProductStatus.PENDING
    ).length

    const totalBrands = await prisma.brand.count()
    const totalUsers = await prisma.user.findMany()

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
    const users = await prisma.user.findMany()
    return users.map(user => ({
      ...user,
      password: null,
    }))
  }
}

export default DashboardService
