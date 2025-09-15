import { Router } from 'express'
import { BalanceController } from './balance.controller'
import AuthMiddleware from '../../../middlewares/auth.middleware'

const router = Router()
const balanceController = new BalanceController()
const authMiddleware = new AuthMiddleware()

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  balanceController.getBalance.bind(balanceController)
)

export default router
