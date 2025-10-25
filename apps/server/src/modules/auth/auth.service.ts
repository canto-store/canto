import { PrismaClient, UserRole } from '@prisma/client'
import { CreateUserDto, LoginDto } from './auth.types'
import { signJwt, signRefreshToken, verifyJwt } from '../../utils/jwt'
import Bcrypt from '../../utils/bcrypt'
import AppError from '../../utils/appError'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

class AuthService {
  private readonly prisma = new PrismaClient()

  async register(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (exists) throw new AppError('User already exists', 409)

    dto.password = await Bcrypt.hash(dto.password)
    const user = await this.prisma.user.create({
      data: { ...dto, role: [UserRole.USER] },
    })
    const { password: _, ...rest } = user
    return rest
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (!user) throw new AppError('User not found', 404)

    const valid = await Bcrypt.compare(dto.password, user.password)
    if (!valid) throw new AppError('Invalid credentials', 401)

    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

    const { password: _, ...rest } = user
    return rest
  }

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    })
    if (!user) throw new AppError('User not found', 404)
    return user
  }

  async createRefreshToken(id: number, role: UserRole[], name: string) {
    const token = signRefreshToken({ id, role, name })
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.prisma.refreshToken.create({ data: { token, expiresAt } })
    return token
  }

  async logout(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
    })
    if (!stored) throw new AppError('Invalid refresh', 401)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    })
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

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res
      .cookie('token', accessToken, {
        ...(process.env.NODE_ENV === 'production' && {
          domain: process.env.DOMAIN,
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie('refreshToken', refreshToken, {
        ...(process.env.NODE_ENV === 'production' && {
          domain: process.env.DOMAIN,
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .status(200)
  }
  async rotateTokens(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    oldToken: string
  ) {
    try {
      const verifiedUser = verifyJwt<{
        id: number
        role: UserRole[]
        name: string
      }>(oldToken)
      const stored = await this.prisma.refreshToken.findUnique({
        where: { token: oldToken },
      })
      if (!stored || stored.isRevoked || stored.expiresAt < new Date())
        throw new AppError('Invalid refresh', 401)
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { isRevoked: true },
      })
      const accessToken = signJwt({
        id: verifiedUser.id,
        role: verifiedUser.role,
        name: verifiedUser.name,
      })
      const refreshToken = await this.createRefreshToken(
        verifiedUser.id,
        verifiedUser.role,
        verifiedUser.name
      )
      this.setAuthCookies(res, accessToken, refreshToken)
      req.user = {
        id: verifiedUser.id,
        role: verifiedUser.role,
        name: verifiedUser.name,
      }
      next()
    } catch {
      throw new AppError('Error rotating tokens', 401)
    }
  }
}

export default AuthService
