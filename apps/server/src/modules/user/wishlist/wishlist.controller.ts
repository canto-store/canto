import { NextFunction } from 'express'
import { AuthRequest } from '../../../middlewares/auth.middleware'
import { Response } from 'express'
import WishlistService from './wishlist.service'
import AppError from '../../../utils/appError'
export default class WishlistController {
  private readonly wishlistService: WishlistService
  constructor() {
    this.wishlistService = new WishlistService()
  }

  async getWishlistItems(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401, true))
      }
      const response = await this.wishlistService.getWishlistItems(req.user.id)
      res.status(200).json(response)
    } catch (error) {
      next(new AppError(error, 500, true))
    }
  }

  async toggleWishlistItem(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401, true))
      }
      const { productId } = req.body
      if (!productId) {
        return next(new AppError('Product ID is required', 400, true))
      }
      const response = await this.wishlistService.toggleWishlistItem(
        req.user.id,
        Number(productId)
      )
      res.status(200).json(response)
    } catch (error) {
      next(new AppError(error, 500, true))
    }
  }

  async removeWishlistItem(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated', 401, true))
      }
      const productId = Number(req.params.productId)
      if (!productId) {
        return next(new AppError('Product ID is required', 400, true))
      }
      await this.wishlistService.removeWishlistItem(req.user.id, productId)
      res.status(200).json({ success: true })
    } catch (error) {
      next(new AppError(error, 500, true))
    }
  }
}
