import { Router } from 'express'
import sellerController from './seller.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = Router()
const controller = new sellerController()
const authMiddleware = new AuthMiddleware()
router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.getAllSellers.bind(controller)
)
router.get(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.getSellerById.bind(controller)
)
router.put(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.updateSeller.bind(controller)
)
router.post('/register', controller.createSeller.bind(controller))
export default router
