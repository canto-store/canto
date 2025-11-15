import { Response, NextFunction } from 'express'
import CartService from './cart.service'
import { AuthRequest } from '../../../middlewares/auth.middleware'
import AppError from '../../../utils/appError'

class CartController {
  private readonly service = new CartService()

  async getCartByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const cart = await this.service.getUserCart(userId)
      res.status(200).json(cart)
    } catch (err) {
      next(err)
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user.id)
      await this.service.clearCart(userId)
      res.status(200).json({ message: 'Cart cleared' })
    } catch (err) {
      next(err)
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { variantId, quantity } = req.body
      if (!variantId || !quantity) {
        throw new AppError('variantId and quantity are required', 400)
      }
      const item = await this.service.addItem(userId, variantId, quantity)
      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  }

  async deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const variantId = req.body.variantId
      await this.service.deleteItem(variantId, userId)
      res.status(200).json({ message: 'Cart item removed' })
    } catch (err) {
      next(err)
    }
  }
}

export default CartController
