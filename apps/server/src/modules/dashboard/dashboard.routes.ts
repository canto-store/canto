import { Router } from 'express'
import DashboardController from './dashboard.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = Router()
const authMiddleware = new AuthMiddleware()
const dashboardController = new DashboardController()

router.get(
  '/latest-activities',
  authMiddleware.checkAuth.bind(authMiddleware),
  dashboardController.getLatestActivities.bind(dashboardController)
)

router.get(
  '/product-count',
  authMiddleware.checkAuth.bind(authMiddleware),
  dashboardController.getProductCount.bind(dashboardController)
)

export default router
