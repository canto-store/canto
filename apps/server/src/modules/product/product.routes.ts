import { Router } from 'express'
import ProductController from './product.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '@prisma/client'

const router = Router()
const productController = new ProductController()
const authMiddleware = new AuthMiddleware()

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  productController.getAllProducts.bind(productController)
)
router.get('/search', productController.searchProducts.bind(productController))
router.get(
  '/autocomplete',
  productController.autocompleteProducts.bind(productController)
)
router.get(
  '/filters',
  productController.getProductFilters.bind(productController)
)
router.get(
  '/home-products',
  productController.getHomeProducts.bind(productController)
)
router.get(
  '/id/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkProductAccess(),
  productController.getProductById.bind(productController)
)

router.get(
  '/slug/:slug',
  productController.getProductBySlug.bind(productController)
)

router.get('/options', productController.getOptions.bind(productController))
router.post(
  '/options/values',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  productController.createOptionValue.bind(productController)
)
router.delete(
  '/options/values/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  productController.deleteOptionValue.bind(productController)
)
router.post(
  '/submit',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.SELLER),
  productController.submitProductForm.bind(productController)
)

router.put(
  '/update-form',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.SELLER),
  productController.updateProductForm.bind(productController)
)

router.get(
  '/brands/:brandId',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.SELLER),
  productController.getProductsByBrand.bind(productController)
)
export default router
