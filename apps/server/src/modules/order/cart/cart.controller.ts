import { Request, Response, NextFunction } from 'express'
import CartService from './cart.service'
import { AuthRequest } from '../../../middlewares/auth.middleware'

class CartController {
  private readonly service = new CartService()

  async getCartByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const cart = await this.service.getCartByUser(userId)
      res.status(200).json(cart)
    } catch (err) {
      next(err)
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId)
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
      const item = await this.service.addItem({ userId, variantId, quantity })
      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { variantId, quantity } = req.body
      await this.service.updateItem(userId, variantId, quantity)
      res.status(200).json({ message: 'Cart item updated' })
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
  async syncCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const { items } = req.body
      const result = await this.service.syncCart(userId, items)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}

export default CartController
