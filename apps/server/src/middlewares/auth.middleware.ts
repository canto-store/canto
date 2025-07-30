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
    } catch (error) {
      // Clear cookies on refresh token error
      res.clearCookie('token')
      res.clearCookie('refreshToken')

      if (error instanceof Error) {
        res
          .status(401)
          .json({ message: `Authentication failed: ${error.message}` })
      } else {
        res.status(401).json({ message: 'Invalid refresh token' })
      }
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
        res.clearCookie('token')
        if (!refreshToken) {
          res.clearCookie('refreshToken')
        }

        res.status(401).json({ message: 'Invalid or expired token' })
      }
    }
  }
}

export default AuthMiddleware
