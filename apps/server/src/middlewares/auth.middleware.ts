import { Request, Response, NextFunction } from 'express'
import { verifyJwt, JwtPayload } from '../utils/jwt'
import AuthService from '../modules/auth/auth.service'
import { UserRole } from '@prisma/client'
import AppError from '../utils/appError'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

class AuthMiddleware {
  private readonly authService = new AuthService()

  async checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken

    if (!token || !refreshToken) {
      await this.authService.registerGuest(req, res)
      return next()
    }

    try {
      const payload = verifyJwt(token)
      req.user = payload
      next()
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        await this.authService.rotateTokens(req, res, next, refreshToken)
      } else {
        const error = new AppError('Unauthorized', 401)
        res.clearCookie('token').clearCookie('refreshToken')
        next(error)
      }
    }
  }

  checkRole(role: UserRole) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const user = await this.authService.getById(req.user?.id)
      if (!user || !user.role || !user.role.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' })
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
      const user = await this.authService.checkProductAccess(userId, productId)
      if (!user) return res.status(403).json({ message: 'Forbidden' })
      next()
    }
  }
}

export default AuthMiddleware
