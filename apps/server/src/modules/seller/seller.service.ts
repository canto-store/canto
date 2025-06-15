import { PrismaClient, Seller } from '@prisma/client'
import AppError from '../../utils/appError'
import Bcrypt from '../../utils/bcrypt'
import { signJwt, signRefreshToken } from '../../utils/jwt'

class SellerService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getAllSellers() {
    return await this.prisma.seller.findMany({})
  }

  async getSellerById(id: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    })
    if (!seller) {
      throw new AppError('Seller not found', 404)
    }
    return seller
  }

  async createSeller(data: Seller) {
    const existingSeller = await this.prisma.seller.findUnique({
      where: { email: data.email },
    })
    if (existingSeller) {
      throw new AppError('Seller with this email already exists', 400)
    }
    data.password = await Bcrypt.hash(data.password)

    const seller = await this.prisma.seller.create({
      data,
    })

    // Generate authentication tokens
    const accessToken = signJwt({
      id: seller.id,
      role: 'SELLER',
      name: seller.name,
    })
    const refreshToken = await this.createRefreshToken(seller.id, seller.name)

    return {
      seller: { ...seller, password: undefined },
      tokens: {
        accessToken,
        refreshToken,
      },
    }
  }

  async updateSeller(id: number, data: Seller) {
    const existingSeller = await this.prisma.seller.findUnique({
      where: { id },
    })
    if (!existingSeller) {
      throw new AppError('Seller not found', 404)
    }

    return await this.prisma.seller.update({
      where: { id },
      data,
    })
  }

  async createRefreshToken(sellerId: number, name: string) {
    const token = signRefreshToken({ id: sellerId, role: 'SELLER', name })
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.prisma.refreshToken.create({ data: { token, expiresAt } })
    return token
  }

  async loginSeller(email: string, password: string) {
    const seller: Seller = await this.prisma.seller.findUnique({
      where: { email },
    })
    if (!seller) {
      throw new AppError('Seller not found', 404)
    }

    const isPasswordValid = await Bcrypt.compare(password, seller.password)
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    const brand = await this.prisma.brand.findFirst({
      where: { sellerId: seller.id },
      select: {
        id: true,
      },
    })

    // Generate authentication tokens
    const accessToken = signJwt({
      id: seller.id,
      role: 'SELLER',
      name: seller.name,
    })
    const refreshToken = await this.createRefreshToken(seller.id, seller.name)

    return {
      seller: { ...seller, password: undefined },
      tokens: {
        accessToken,
        refreshToken,
      },
      brandId: brand?.id ?? null,
    }
  }
}

export default SellerService
