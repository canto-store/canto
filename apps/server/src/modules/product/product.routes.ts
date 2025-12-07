import { Router } from 'express'
import ProductController from './product.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '../../utils/db'
import { catchAsync } from '../../utils/catchAsync'

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
  '/price-range',
  productController.getPriceRange.bind(productController)
)
router.get(
  '/home-products',
  productController.getHomeProducts.bind(productController)
)
router.get(
  '/id/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkProductAccess(),
  catchAsync(productController.getProductById.bind(productController))
)

router.get(
  '/slug/:slug',
  productController.getProductBySlug.bind(productController)
)

router.get('/options', productController.getOptions.bind(productController))
router.post(
  '/options',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  productController.createOption.bind(productController)
)
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
  catchAsync(productController.submitProductForm.bind(productController))
)

router.put(
  '/update-form',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.SELLER),
  catchAsync(productController.updateProductForm.bind(productController))
)

router.get(
  '/brands/:brandId',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.SELLER),
  productController.getProductsByBrand.bind(productController)
)
export default router
