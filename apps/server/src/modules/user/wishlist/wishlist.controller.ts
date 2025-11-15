import { AuthRequest } from '../../../middlewares/auth.middleware'
import { Response } from 'express'
import WishlistService from './wishlist.service'
import AppError from '../../../utils/appError'
export default class WishlistController {
  private readonly wishlistService: WishlistService
  constructor() {
    this.wishlistService = new WishlistService()
  }

  async getWishlistItems(req: AuthRequest, res: Response) {
    const response = await this.wishlistService.getWishlistItems(req.user.id)
    res.status(200).json(response)
  }

  async toggleWishlistItem(req: AuthRequest, res: Response) {
    const { productId } = req.body
    if (!productId) {
      throw new AppError('Product ID is required', 400)
    }
    const response = await this.wishlistService.toggleWishlistItem(
      req.user.id,
      Number(productId)
    )
    res.status(200).json(response)
  }

  async removeWishlistItem(req: AuthRequest, res: Response) {
    const productId = Number(req.params.productId)
    if (!productId) {
      throw new AppError('Product ID is required', 400)
    }
    await this.wishlistService.removeWishlistItem(req.user.id, productId)
    res.status(200).json({ success: true })
  }
}
