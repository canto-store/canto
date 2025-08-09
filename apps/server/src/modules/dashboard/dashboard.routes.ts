import { Router } from 'express'
import DashboardController from './dashboard.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '@prisma/client'

const router = Router()
const authMiddleware = new AuthMiddleware()
const dashboardController = new DashboardController()

router.get(
  '/latest-activities',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  dashboardController.getLatestActivities.bind(dashboardController)
)

router.get(
  '/dashboard-counts',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  dashboardController.getDashboardCounts.bind(dashboardController)
)

router.get(
  '/users',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  dashboardController.getUsers.bind(dashboardController)
)

export default router
