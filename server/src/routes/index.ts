import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes';
import sellerRouter from '../modules/Seller/seller.routes'
import brandRoutes from '../modules/Seller/brand/brand.routes';
import categoryRoutes from '../modules/category/category.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/seller', sellerRouter);
router.use('/brand', brandRoutes);
router.use('/categories', categoryRoutes);


export default router;
