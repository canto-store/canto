import { PrismaClient, UserRole } from '@prisma/client'
import { CreateUserDto, LoginDto } from './auth.types'
import {
  JwtPayload,
  signJwt,
  signRefreshToken,
  verifyJwt,
} from '../../utils/jwt'
import Bcrypt from '../../utils/bcrypt'
import AppError from '../../utils/appError'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware'

class AuthService {
  private readonly prisma = new PrismaClient()

  async registerGuest(req: AuthRequest, res: Response) {
    const guest = await this.prisma.user.create({
      data: {
        role: [UserRole.GUEST],
      },
    })
    req.user = { id: guest.id, role: guest.role }
    this.setAuthCookies(
      res,
      signJwt({ id: guest.id, role: guest.role }),
      await this.createRefreshToken(guest.id, guest.role)
    )
  }

  async register(dto: CreateUserDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone_number: dto.phone_number }] },
    })

    if (exists)
      throw new AppError('User with email or phone number already exists', 409)

    const { guestId, ...userInput } = dto
    userInput.password = await Bcrypt.hash(dto.password)
    const user = await this.prisma.user.update({
      where: { id: guestId },
      data: { ...userInput, role: [UserRole.USER] },
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

    const guestCart = await this.prisma.cart.findUnique({
      where: { userId: dto.guestId },
    })
    const userCart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
    })
    if (guestCart && userCart) {
      // Get all guest cart items
      const guestCartItems = await this.prisma.cartItem.findMany({
        where: { cartId: guestCart.id },
      })

      // Process each guest cart item
      for (const guestItem of guestCartItems) {
        // Check if user cart already has this variant
        const existingUserItem = await this.prisma.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
          },
        })

        if (existingUserItem) {
          // Update existing item quantity
          await this.prisma.cartItem.update({
            where: { id: existingUserItem.id },
            data: { quantity: existingUserItem.quantity + guestItem.quantity },
          })
        } else {
          // Move guest item to user cart
          await this.prisma.cartItem.update({
            where: { id: guestItem.id },
            data: { cartId: userCart.id },
          })
        }
      }

      await this.prisma.cart.delete({
        where: { id: guestCart.id },
      })
    } else if (guestCart && !userCart) {
      await this.prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId: user.id },
      })
      await this.prisma.cart.delete({
        where: { id: guestCart.id },
      })
    }
    await this.prisma.user.delete({
      where: { id: dto.guestId, role: { has: UserRole.GUEST } },
    })
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

  async createRefreshToken(id: number, role: UserRole[], name?: string) {
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
    res.clearCookie('token').clearCookie('refreshToken')
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
      const verifiedUser = verifyJwt<JwtPayload>(oldToken)
      const stored = await this.prisma.refreshToken.findUnique({
        where: { token: oldToken },
      })
      if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
        res.clearCookie('token').clearCookie('refreshToken')
        return next(new AppError('Invalid refresh', 401))
      }
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
      res.clearCookie('token').clearCookie('refreshToken')
      const error = new AppError('Error rotating tokens', 401)
      next(error)
    }
  }
}

export default AuthService
