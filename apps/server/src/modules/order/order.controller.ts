import { Response } from 'express'
import { OrderService } from './order.service'
import AppError from '../../utils/appError'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { OrderStatus } from '../../utils/db'

export class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async getUserOrders(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    const take = req.query.take ?? 6
    const skip = req.query.skip ?? 0
    const status = req.query.status as OrderStatus | undefined

    const result = await this.orderService.getUserOrders(
      userId,
      +take,
      +skip,
      status
    )
    res.status(200).json(result)
  }

  async getOrders(req: AuthRequest, res: Response) {
    const result = await this.orderService.getOrders()
    res.status(200).json(result)
  }

  async updateOrder(req: AuthRequest, res: Response) {
    const { id, data } = req.body

    if (!id || !data) {
      throw new AppError('Order ID and data are required', 400)
    }

    const updatedOrder = await this.orderService.updateOrder(+id, data)

    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder,
      },
    })
  }
  async getOrderById(req: AuthRequest, res: Response) {
    const { id } = req.params
    const userId = req.user.id

    const order = await this.orderService.getOrderById(+id, userId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({ order })
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

  async deleteOrder(req: AuthRequest, res: Response) {
    const { id } = req.params
    const { id: userId } = req.user

    if (!id) {
      throw new AppError('Order ID is required', 400)
    }

    await this.orderService.canDeleteOrder(+id, userId)
    const response = await this.orderService.deleteOrder(+id)
    res.status(202).send(response)
  }
}
