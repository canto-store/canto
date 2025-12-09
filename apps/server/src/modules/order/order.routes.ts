import express from 'express'
import { OrderController } from './order.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { catchAsync } from '../../utils/catchAsync'
import { UserRole } from '../../utils/db'

const router = express.Router()
const authMiddleware = new AuthMiddleware()
const orderController = new OrderController()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(orderController.createOrder.bind(orderController))
)

router.delete(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(orderController.deleteOrder.bind(orderController))
)

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  catchAsync(orderController.getOrders.bind(orderController))
)

router.put(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  catchAsync(orderController.updateOrder.bind(orderController))
)

router.get(
  '/my-orders',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(orderController.getUserOrders.bind(orderController))
)

router.get(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(orderController.getOrderById.bind(orderController))
)

export default router
