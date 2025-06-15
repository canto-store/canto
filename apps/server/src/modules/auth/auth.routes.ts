import { Router } from 'express'
import AuthController from './auth.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = Router()
const authController = new AuthController()
const authMiddleware = new AuthMiddleware()

router.post('/register', authController.register.bind(authController))
router.post('/login', authController.login.bind(authController))
router.post('/admin-login', authController.adminLogin.bind(authController))
router.post('/refresh', authController.refresh.bind(authController))
router.get(
  '/me',
  authMiddleware.checkAuth.bind(authMiddleware),
  authController.me.bind(authController)
)
router.post(
  '/logout',
  authMiddleware.checkAuth.bind(authMiddleware),
  authController.logout.bind(authController)
)

export default router
