import { Router } from 'express'
import BrandController from './brand.controller'
import AuthMiddleware from '../../../middlewares/auth.middleware'
import { UserRole } from '../../../utils/db'
import { catchAsync } from '../../../utils/catchAsync'

const router = Router()
const controller = new BrandController()
const authMiddleware = new AuthMiddleware()

router.get('/', controller.getAllBrands.bind(controller))
router.get(
  '/my-brand',
  authMiddleware.checkAuth.bind(authMiddleware),
  catchAsync(controller.getMyBrand.bind(controller))
)
router.get(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN).bind(authMiddleware),
  controller.getBrandById.bind(controller)
)
router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.createBrand.bind(controller)
)

export default router
