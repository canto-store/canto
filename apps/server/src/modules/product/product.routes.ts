import { Router } from 'express';
import ProductController from './product.controller';

const router = Router();
const productController = new ProductController();

router.post('/', productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/id/:id', productController.getProductById.bind(productController));
router.put('/id/:id', productController.updateProduct.bind(productController));
router.delete('/id/:id', productController.deleteProduct.bind(productController));

router.get('/slug/:slug', productController.getProductBySlug.bind(productController));

router.post('/options', productController.createOption.bind(productController));
router.get('/options', productController.getOptions.bind(productController));
router.delete('/options/:id', productController.deleteOption.bind(productController));

router.post('/option-values', productController.createOptionValue.bind(productController));
router.delete('/option-values/:id', productController.deleteOptionValue.bind(productController));

router.post('/variants', productController.createVariant.bind(productController));
router.put('/variants/:id', productController.updateVariant.bind(productController));
router.delete('/variants/:id', productController.deleteVariant.bind(productController));

export default router;