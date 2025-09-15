import express from 'express'
import { OrderController } from './order.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = express.Router()
const authMiddleware = new AuthMiddleware()
const orderController = new OrderController()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  orderController.createOrder.bind(orderController)
)
router.get(
  '/my-orders',
  authMiddleware.checkAuth.bind(authMiddleware),
  orderController.getMyorders.bind(orderController)
)

export default router
