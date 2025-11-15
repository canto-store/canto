import { Response } from 'express'
import { OrderService } from './order.service'
import AppError from '../../utils/appError'
import { AuthRequest } from '../../middlewares/auth.middleware'

export class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    const take = req.query.take ?? 5
    const skip = req.query.skip ?? 0

    const result = await this.orderService.getUserOrders(userId, +take, +skip)
    res.status(200).json(result)
  }

  async createOrder(req: AuthRequest, res: Response) {
    const { addressId } = req.body
    const { id: userId } = req.user

    if (!userId || !addressId) {
      throw new AppError('UserId and AddressId are required', 400)
    }

    const order = await this.orderService.createOrder({
      userId,
      addressId,
    })
    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    })
  }
}
