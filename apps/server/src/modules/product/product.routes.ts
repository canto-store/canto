import { Router } from 'express'
import ProductController from './product.controller'
import AuthMiddleware from '../../middlewares/auth.middleware'

const router = Router()
const productController = new ProductController()
const authMiddleware = new AuthMiddleware()

router.post('/', productController.createProduct.bind(productController))
router.get('/', productController.getAllProducts.bind(productController))
router.get('/search', productController.searchProducts.bind(productController))
router.get(
  '/filters',
  productController.getProductFilters.bind(productController)
)
router.get(
  '/home-products',
  productController.getHomeProducts.bind(productController)
)
router.get('/id/:id', productController.getProductById.bind(productController))
router.put(
  '/id/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  productController.updateProduct.bind(productController)
)
router.delete(
  '/id/:id',
  productController.deleteProduct.bind(productController)
)

router.get(
  '/slug/:slug',
  productController.getProductBySlug.bind(productController)
)

router.post('/options', productController.createOption.bind(productController))
router.get('/options', productController.getOptions.bind(productController))
router.delete(
  '/options/:id',
  productController.deleteOption.bind(productController)
)

router.post(
  '/option-values',
  productController.createOptionValue.bind(productController)
)
router.delete(
  '/option-values/:id',
  productController.deleteOptionValue.bind(productController)
)

router.post(
  '/variants',
  productController.createVariant.bind(productController)
)
router.put(
  '/variants/:id',
  productController.updateVariant.bind(productController)
)
router.delete(
  '/variants/:id',
  productController.deleteVariant.bind(productController)
)

router.post(
  '/submit',
  authMiddleware.checkAuth.bind(authMiddleware),
  productController.submitProductForm.bind(productController)
)

router.get(
  '/brands/:brandId',
  authMiddleware.checkAuth.bind(authMiddleware),
  productController.getProductsByBrand.bind(productController)
)
export default router
