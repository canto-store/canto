import { Request, Response, NextFunction } from 'express'
import { verifyJwt, JwtPayload } from '../utils/jwt'
import { UserRole } from '../utils/db'
import AppError from '../utils/appError'
import UserService from '../modules/user/user.service'
import z from 'zod'
import parsePhoneNumberFromString from 'libphonenumber-js'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

class AuthMiddleware {
  private readonly userService = new UserService()

  async checkAuth(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header missing or malformed', 401)
    }
    const token = authHeader.split(' ')[1]
    const payload = verifyJwt(token)
    if (!payload) {
      throw new AppError('Invalid token', 401)
    }
    req.user = payload
    next()
  }

  async checkGuest(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const payload = verifyJwt(token)
      req.user = payload
    }

    next()
  }

  checkRole(role: UserRole) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const user = await this.userService.getById(req.user?.id)
      if (!user || !user.role || !user.role.includes(role)) {
        throw new AppError("You don't have permission to do this action", 403)
      }
      next()
    }
  }

  checkProductAccess() {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const userId = req.user?.id
      const roles = req.user?.role
      const productId = Number(req.params.id)
      if (roles?.includes(UserRole.ADMIN)) {
        next()
        return
      }
      const user = await this.userService.checkProductAccess(userId, productId)
      if (!user)
        throw new AppError("You don't have permission to do this action", 403)
      next()
    }
  }

  validateLogin = (req: Request, _res: Response, next: NextFunction) => {
    const schema = z.object({
      email: z.email(),
      password: z.string().min(6),
    })

    const result = schema.safeParse(req.body)
    if (!result.success) {
      throw new AppError(
        result.error.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join('\n'),
        400
      )
    }

    req.body = result.data
    next()
  }
  validateRegister = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(
        'Registration data is required and cannot be empty',
        400
      )
    }

    const schema = z.object({
      name: z
        .string({ message: 'Name is required' })
        .min(2, 'Name must be at least 2 characters'),
      email: z.email({ message: 'Email is required' }),
      password: z
        .string({ message: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
      phone_number: z
        .string({ message: 'Phone number is required' })
        .trim()
        .refine(val => {
          const phone = parsePhoneNumberFromString(val, 'EG')
          return phone?.isValid() ?? false
        }, 'Invalid Egyptian phone number'),
    })

    const result = schema.safeParse(req.body)

    if (!result.success) {
      const message = result.error.issues.map(i => i.message).join(', ')
      throw new AppError(message, 400)
    }

    req.body = result.data
    next()
  }
}

export default AuthMiddleware
