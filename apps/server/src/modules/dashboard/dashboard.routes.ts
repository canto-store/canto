import { Router } from 'express'
import DashboardController from './dashboard.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '../../utils/db'

const router = Router()
const authMiddleware = new AuthMiddleware()
const dashboardController = new DashboardController()

router.get(
  '/latest-activities',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  dashboardController.getLatestActivities.bind(dashboardController)
)

router.get(
  '/dashboard-counts',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  dashboardController.getDashboardCounts.bind(dashboardController)
)

router.get(
  '/users',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  dashboardController.getUsers.bind(dashboardController)
)

export default router
