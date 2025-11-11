import { PrismaClient, User, UserRole } from '@prisma/client'
import AppError from '../../utils/appError'

export default class UserService {
  private readonly prisma = new PrismaClient()

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) throw new AppError('User not found', 404)
    return user
  }

  async checkProductAccess(userId: number, productId: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        brand: {
          sellerId: userId,
        },
      },
    })
    if (!product) return false
    return true
  }

  async createGuest(): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        role: [UserRole.GUEST],
        name: this.generateName(),
      },
    })
    return user
  }

  generateName(): string {
    const adjectives = [
      'Swift',
      'Brave',
      'Clever',
      'Mighty',
      'Nimble',
      'Fierce',
      'Wise',
      'Bold',
      'Loyal',
      'Fearless',
    ]
    const animals = [
      'Lion',
      'Eagle',
      'Wolf',
      'Tiger',
      'Falcon',
      'Bear',
      'Shark',
      'Panther',
      'Fox',
      'Hawk',
    ]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]
    return `${adjective} ${animal} ${Math.floor(Math.random() * 1000)}`
  }

  async deleteUserById(id: number) {
    await this.prisma.user.delete({
      where: { id },
    })
  }

  async updateUser(id: number, data: Partial<User>) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    })
    return user
  }
}
