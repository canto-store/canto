import { Router } from 'express'
import { authRouterV1, authRouterV2 } from './modules/auth/auth.routes'
import sellerRouter from './modules/seller/seller.routes'
import brandRoutes from './modules/seller/brand/brand.routes'
import categoryRoutes from './modules/product/category/category.routes'
import productRoutes from './modules/product/product.routes'
import addressRouter from './modules/user/address/address.routes'
import cartRouter from './modules/user/cart/cart.routes'
import orderRouter from './modules/order/order.routes'
import deliveryRouter from './modules/delivery/delivery.routes'
import dashboardRouter from './modules/dashboard/dashboard.routes'
import balanceRouter from './modules/user/balance/balance.routes'
import salesRouter from './modules/seller/sales/sales.routes'
import wishlistRouter from './modules/user/wishlist/wishlist.routes'

const router = Router()

router.use('/v1/auth', authRouterV1)
router.use('/v2/auth', authRouterV2)
router.use('/seller', sellerRouter)
router.use('/brand', brandRoutes)
router.use('/categories', categoryRoutes)
router.use('/product', productRoutes)
router.use('/address', addressRouter)
router.use('/cart', cartRouter)
router.use('/orders', orderRouter)
router.use('/delivery', deliveryRouter)
router.use('/dashboard', dashboardRouter)
router.use('/balance', balanceRouter)
router.use('/sales', salesRouter)
router.use('/wishlist', wishlistRouter)

export default router
