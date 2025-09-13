import express from 'express'
import {
  createOrderHandler,
  getOrdersByUserIdHandler,
  getOrderByIdHandler,
  updateOrderItemStatusHandler,
  OrderController,
} from './order.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = express.Router()
const authMiddleware = new AuthMiddleware()
const orderController = new OrderController()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  createOrderHandler
)
router.get(
  '/my-orders',
  authMiddleware.checkAuth.bind(authMiddleware),
  orderController.getMyorders.bind(orderController)
)
router.get('/user/:userId', getOrdersByUserIdHandler)
router.get('/:orderId', getOrderByIdHandler)
router.patch('/item/:orderItemId/status', updateOrderItemStatusHandler)

export default router
