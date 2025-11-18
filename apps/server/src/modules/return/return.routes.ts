import express from 'express'
import { ReturnController } from './return.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { catchAsync } from '../../utils/catchAsync'

const router = express.Router()
const authMiddleware = new AuthMiddleware()
const returnController = new ReturnController()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(returnController.createReturn.bind(returnController))
)

router.get(
  '/all',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole('ADMIN').bind(authMiddleware),
  catchAsync(returnController.getAllReturns.bind(returnController))
)

router.put(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole('ADMIN').bind(authMiddleware),
  catchAsync(returnController.updateReturn.bind(returnController))
)

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(returnController.getUserReturns.bind(returnController))
)

export default router
