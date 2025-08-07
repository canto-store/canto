import { Request, Response, NextFunction } from 'express'
import { verifyJwt, JwtPayload } from '../utils/jwt'
import AuthService from '../modules/auth/auth.service'
import { UserRole } from '@prisma/client'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

class AuthMiddleware {
  private readonly authService = new AuthService()

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  }

  private async rotateTokens(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    refreshToken: string
  ) {
    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.rotateRefresh(refreshToken)
      this.setAuthCookies(res, accessToken, newRefreshToken)
      req.user = verifyJwt(accessToken)
      next()
    } catch {
      res
        .status(401)
        .clearCookie('token')
        .clearCookie('refreshToken')
        .json({ message: `Authentication failed` })
    }
  }

  async checkAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken

    if (!token) {
      if (refreshToken) {
        // Try to use refresh token if access token is missing
        await this.rotateTokens(req, res, next, refreshToken)
      } else {
        // No tokens available
        res.status(401).json({ message: 'Authentication required' })
      }
      return
    }

    try {
      const payload = verifyJwt(token)
      req.user = payload
      next()
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === 'jwt expired' &&
        refreshToken
      ) {
        // Access token expired but refresh token is available
        await this.rotateTokens(req, res, next, refreshToken)
      } else {
        // Clear invalid cookies
        res
          .clearCookie('token')
          .clearCookie('refreshToken')
          .status(401)
          .json({ message: 'Invalid or expired token' })
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
      const productId = Number(req.params.id)
      const user = await this.authService.checkProductAccess(userId, productId)
      if (!user) return res.status(403).json({ message: 'Forbidden' })
      next()
    }
  }
}

export default AuthMiddleware
