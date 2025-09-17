import { Router } from 'express'
import AuthMiddleware from '../../../middlewares/auth.middleware'
import WishlistController from './wishlist.controller'

const router = Router()
const authMiddleware = new AuthMiddleware()
const wishlistController = new WishlistController()

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  wishlistController.getWishlistItems.bind(wishlistController)
)

export default router
