import { Router } from 'express'
import AuthMiddleware from '../../../middlewares/auth.middleware'
import WishlistController from './wishlist.controller'

const router = Router()
const authMiddleware = new AuthMiddleware()
const wishlistController = new WishlistController()

// Get all wishlist items
router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  wishlistController.getWishlistItems.bind(wishlistController)
)

// Toggle item in wishlist (add or remove)
router.post(
  '/toggle',
  authMiddleware.checkAuth.bind(authMiddleware),
  wishlistController.toggleWishlistItem.bind(wishlistController)
)

// Remove item from wishlist
router.delete(
  '/:productId',
  authMiddleware.checkAuth.bind(authMiddleware),
  wishlistController.removeWishlistItem.bind(wishlistController)
)

export default router
