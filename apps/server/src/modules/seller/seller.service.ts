import { PrismaClient, User, UserRole } from '@prisma/client'
import AppError from '../../utils/appError'
import Bcrypt from '../../utils/bcrypt'

class SellerService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getAllSellers() {
    return await this.prisma.user.findMany({})
  }

  async getSellerById(id: number) {
    const seller = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!seller) {
      throw new AppError('Seller not found', 404)
    }
    return seller
  }

  async createSeller(data: User) {
    const existingSeller = await this.prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingSeller) {
      throw new AppError('Seller with this email already exists', 400)
    }
    data.password = await Bcrypt.hash(data.password)

    data.role = [UserRole.USER, UserRole.SELLER]

    const seller = await this.prisma.$transaction(async t => {
      const seller = await t.user.create({
        data,
      })
      await t.activity.create({
        data: {
          entityId: seller.id,
          entityName: seller.name,
          type: 'SELLER_REGISTERED',
        },
      })
      return seller
    })

    const { password, ...sellerWithoutPassword } = seller

    return sellerWithoutPassword
  }

  async updateSeller(id: number, data: User) {
    const existingSeller = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!existingSeller) {
      throw new AppError('Seller not found', 404)
    }

    return await this.prisma.user.update({
      where: { id },
      data,
    })
  }
}

export default SellerService
