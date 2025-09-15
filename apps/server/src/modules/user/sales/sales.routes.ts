import { Router } from 'express'
import AuthMiddleware from '../../../middlewares/auth.middleware'
import { SalesController } from './sales.controller'

const router = Router()
const authMiddleware = new AuthMiddleware()
const salesController = new SalesController()

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  salesController.getSales.bind(salesController)
)

export default router
