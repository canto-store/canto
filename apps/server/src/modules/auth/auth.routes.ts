import { Router } from 'express'
import { AuthControllerV1, AuthControllerV2 } from './auth.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { catchAsync } from '../../utils/catchAsync'
class AuthRoutesV1 {
  public router: Router
  private authController: AuthControllerV1
  private authMiddleware: AuthMiddleware

  constructor() {
    this.router = Router()
    this.authController = new AuthControllerV1()
    this.authMiddleware = new AuthMiddleware()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      '/register',
      this.authMiddleware.checkAuth.bind(this.authMiddleware),
      this.authController.register.bind(this.authController)
    )

    this.router.post(
      '/login',
      this.authMiddleware.checkAuth.bind(this.authMiddleware),
      this.authController.login.bind(this.authController)
    )

    this.router.get(
      '/me',
      this.authMiddleware.checkAuth.bind(this.authMiddleware),
      this.authController.me.bind(this.authController)
    )

    this.router.post(
      '/logout',
      this.authController.logout.bind(this.authController)
    )
  }
}
class AuthRoutesV2 {
  public router: Router
  private authController: AuthControllerV2
  private authMiddleware: AuthMiddleware

  constructor() {
    this.router = Router()
    this.authController = new AuthControllerV2()
    this.authMiddleware = new AuthMiddleware()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      this.authMiddleware.validateLogin.bind(this.authMiddleware),
      this.authMiddleware.checkGuest.bind(this.authMiddleware),
      catchAsync(this.authController.login.bind(this.authController))
    )

    this.router.post(
      '/register',
      this.authMiddleware.validateRegister.bind(this.authMiddleware),
      this.authMiddleware.checkGuest.bind(this.authMiddleware),
      catchAsync(this.authController.register.bind(this.authController))
    )

    this.router.post(
      '/create-guest',
      catchAsync(this.authController.createGuest.bind(this.authController))
    )

    this.router.post(
      '/forgot-password',
      catchAsync(this.authController.forgotPassword.bind(this.authController))
    )
    this.router.post(
      '/reset-password',
      catchAsync(this.authController.resetPassword.bind(this.authController))
    )
  }
}

export const authRouterV1 = new AuthRoutesV1().router
export const authRouterV2 = new AuthRoutesV2().router
