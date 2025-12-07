import { prisma, User, UserRole } from '../../utils/db'
import AppError from '../../utils/appError'
import Bcrypt from '../../utils/bcrypt'

class SellerService {
  async getAllSellers() {
    return await prisma.user.findMany({})
  }

  async getSellerById(id: number) {
    const seller = await prisma.user.findUnique({
      where: { id },
    })
    if (!seller) {
      throw new AppError('Seller not found', 404)
    }
    return seller
  }

  async createSeller(data: User) {
    const existingSeller = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingSeller) {
      throw new AppError('Seller with this email already exists', 400)
    }
    data.password = await Bcrypt.hash(data.password)

    data.role = [UserRole.USER, UserRole.SELLER]

    const seller = await prisma.$transaction(async t => {
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

    const { password: _, ...sellerWithoutPassword } = seller

    return sellerWithoutPassword
  }

  async updateSeller(id: number, data: User) {
    const existingSeller = await prisma.user.findUnique({
      where: { id },
    })
    if (!existingSeller) {
      throw new AppError('Seller not found', 404)
    }

    return await prisma.user.update({
      where: { id },
      data,
    })
  }
}

export default SellerService
