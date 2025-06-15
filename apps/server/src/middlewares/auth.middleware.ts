import { Request, Response, NextFunction } from 'express'
import { verifyJwt, JwtPayload } from '../utils/jwt'
import AuthService from '../modules/auth/auth.service'

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
      maxAge: 7 * 24 * 3600_000, // 7 days
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
      res.status(401).json({ message: 'Invalid refresh token' })
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
        await this.rotateTokens(req, res, next, refreshToken)
      } else {
        res.status(401).json({ message: 'Unauthorized' })
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
        await this.rotateTokens(req, res, next, refreshToken)
      } else {
        res.status(401).json({ message: 'Invalid token' })
      }
    }
  }
}

export default AuthMiddleware
