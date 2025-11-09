import { Request, Response, NextFunction } from 'express'
import { AuthServiceV1, AuthServiceV2 } from './auth.service'
import { CreateUserDto, LoginDto } from './auth.types'
import { signJwt } from '../../utils/jwt'
import { AuthRequest } from '../../middlewares/auth.middleware'
import CartService from '../user/cart/cart.service'
import UserService from '../user/user.service'

export class AuthControllerV1 {
  private readonly authService = new AuthServiceV1()

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

  public async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken as string
      if (token) {
        await this.authService.logout(token)
      }
      await this.authService.registerGuest(req, res)
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
      next(err)
    }
  }
}

export class AuthControllerV2 {
  private readonly authService = new AuthServiceV2()
  private readonly cartService = new CartService()
  private readonly userService = new UserService()

  public async login(req: AuthRequest, res: Response) {
    const user = await this.authService.login(req.body)
    if (req.user) {
      try {
        await this.cartService.mergeCarts(req.user.id, user.id)
        await this.userService.deleteUserById(req.user.id)
      } catch {
        // ignore
      }
    }
    res.status(200).json(user)
  }
  public async register(req: AuthRequest, res: Response) {
    const user = await this.authService.register(req.body)
    if (req.user) {
      try {
        await this.cartService.updateCartUserId(req.user.id, user.id)
        await this.userService.deleteUserById(req.user.id)
      } catch {
        // ignore
      }
    } else {
      void this.cartService.createCart(user.id)
    }
    res.status(201).json(user)
  }
  public async createGuest(req: Request, res: Response) {
    const guest = await this.authService.createGuest()
    void this.cartService.createCart(guest.id)
    res.status(201).json(guest)
  }
}
