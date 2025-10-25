import { Router } from 'express'
import AuthController from './auth.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = Router()
const authController = new AuthController()
const authMiddleware = new AuthMiddleware()

router.post(
  '/register',
  authMiddleware.checkAuth.bind(authMiddleware),
  authController.register.bind(authController)
)
router.post(
  '/login',
  authMiddleware.checkAuth.bind(authMiddleware),
  authController.login.bind(authController)
)
router.get(
  '/me',
  authMiddleware.checkAuth.bind(authMiddleware),
  authController.me.bind(authController)
)
router.post('/logout', authController.logout.bind(authController))

export default router
