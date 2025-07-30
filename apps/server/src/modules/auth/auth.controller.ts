import { Request, Response, NextFunction } from 'express'
import AuthService from './auth.service'
import { AdminLoginDto, CreateUserDto, LoginDto } from './auth.types'
import { signJwt } from '../../utils/jwt'
import { AuthRequest } from '../../middlewares/auth.middleware'
import BrandService from '../seller/brand/brand.service'

class AuthController {
  private readonly authService = new AuthService()
  private readonly brandService = new BrandService()

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDto = req.body
      const user = await this.authService.register(dto)
      const token = signJwt({
        id: user.id,
        role: 'CUSTOMER',
        name: user.name,
      })
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        'CUSTOMER',
        user.name
      )
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(user)
    } catch (err) {
      next(err)
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDto = req.body
      const user = await this.authService.login(dto)
      const token = signJwt({
        id: user.id,
        role: 'CUSTOMER',
        name: user.name,
      })
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        'CUSTOMER',
        user.name
      )
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(user)
    } catch (err) {
      next(err)
    }
  }

  public async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: AdminLoginDto = req.body
      const user = await this.authService.adminLogin({
        ...dto,
        ip_address: req.ip,
      })
      const token = signJwt({
        id: user.id,
        role: 'ADMIN',
        name: user.username,
      })
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        'ADMIN',
        user.username
      )
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60,
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(user)
    } catch (err) {
      next(err)
    }
  }

  public async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user.role === 'SELLER') {
        const brand = await this.brandService.getMyBrand(req.user.id)
        return res.status(200).json({
          ...req.user,
          brandId: brand?.id ?? null,
        })
      }
      res.status(200).json({
        id: req.user.id,
        role: req.user.role,
        name: req.user.name,
      })
    } catch (err) {
      next(err)
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const old = req.cookies.refreshToken as string
      const { accessToken, refreshToken } =
        await this.authService.rotateRefresh(old)
      res
        .cookie('token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60, // 1 hour
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .json()
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
      res
        .clearCookie('token')
        .clearCookie('refreshToken')
        .status(200)
        .json({ message: 'Logged out successfully' })
    } catch (err) {
      next(err)
    }
  }
}

export default AuthController
