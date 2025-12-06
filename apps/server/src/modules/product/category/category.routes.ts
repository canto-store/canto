import { Router } from 'express'
import CategoryController from './category.controller'
import AuthMiddleware from '../../../middlewares/auth.middleware'
import { UserRole } from '@prisma/client'
import { catchAsync } from '../../../utils/catchAsync'
import { CategoryValidator } from './category.validator'

const router = Router()
const categoryController = new CategoryController()
const authMiddleware = new AuthMiddleware()

router.get('/', categoryController.getActiveCategories.bind(categoryController))
router.get('/all', categoryController.getAll.bind(categoryController))
router.get('/:id', categoryController.getOne.bind(categoryController))

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  CategoryValidator.validateCreate,
  catchAsync(categoryController.create.bind(categoryController))
)

router.put(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  CategoryValidator.validateUpdate,
  catchAsync(categoryController.update.bind(categoryController))
)

export default router
