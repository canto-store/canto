import { Router } from 'express'
import sellerController from './seller.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '../../utils/db'

const router = Router()
const controller = new sellerController()
const authMiddleware = new AuthMiddleware()
router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  controller.getAllSellers.bind(controller)
)
router.get(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  controller.getSellerById.bind(controller)
)
router.put(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  controller.updateSeller.bind(controller)
)
export default router
