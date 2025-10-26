import { Request, Response, NextFunction } from 'express'
import AuthService from './auth.service'
import { CreateUserDto, LoginDto } from './auth.types'
import { signJwt } from '../../utils/jwt'
import { AuthRequest } from '../../middlewares/auth.middleware'

class AuthController {
  private readonly authService = new AuthService()

  public async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDto = req.body
      dto.guestId = req.user.id
      const user = await this.authService.register(dto)
      const token = signJwt({
        id: user.id,
        role: user.role,
        name: user.name,
      })
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user.role,
        user.name
      )
      this.authService.setAuthCookies(res, token, refreshToken)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  public async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto: LoginDto = req.body
      dto.guestId = req.user.id
      const user = await this.authService.login(dto)
      const token = signJwt({
        id: user.id,
        role: user.role,
        name: user.name,
      })
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user.role,
        user.name
      )
      this.authService.setAuthCookies(res, token, refreshToken)
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }

  public async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        id: req.user.id,
        role: req.user.role,
        name: req.user.name,
      })
    } catch (err) {
      next(err)
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken as string
      if (token) {
        await this.authService.logout(token)
      }
      await this.authService.registerGuest(res)
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
      next(err)
    }
  }
}

export default AuthController
