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
  getWishlistItems(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        next(new AppError('User not authenticated', 401, true))
      }
      return this.wishlistService.getWishlistItems(req.user.id)
    } catch (error) {
      next(new AppError(error, 500, true))
    }
  }
}
