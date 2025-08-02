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

export default router
