import express from 'express'
import {
  createOrderHandler,
  getOrdersHandler,
  getOrdersByUserIdHandler,
  getOrderByIdHandler,
  updateOrderItemStatusHandler,
} from './order.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = express.Router()
const authMiddleware = new AuthMiddleware()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  createOrderHandler
)
router.get('/', getOrdersHandler)
router.get('/user/:userId', getOrdersByUserIdHandler)
router.get('/:orderId', getOrderByIdHandler)
router.patch('/item/:orderItemId/status', updateOrderItemStatusHandler)

export default router
