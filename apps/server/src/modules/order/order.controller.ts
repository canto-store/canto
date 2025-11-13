import { Request, Response, NextFunction } from 'express'
import * as orderService from './order.service'
import AppError from '../../utils/appError'
import { AuthRequest } from '../../middlewares/auth.middleware'

export class OrderController {
  async getMyorders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return next(new AppError('User not authenticated', 401))
      }
      const orders = await orderService.getOrdersByUserId(userId)
      res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
          orders,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.body
      const { id: userId } = req.user

      if (!userId || !addressId) {
        throw new AppError('UserId and AddressId are required', 400)
      }

      const order = await orderService.createOrder({
        userId,
        addressId,
      })
      res.status(201).json({
        status: 'success',
        data: {
          order,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const getOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderService.getOrders()
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getOrdersByUserIdHandler = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId, 10)
    if (isNaN(userId)) {
      return next(new AppError('Invalid user ID', 400))
    }
    const orders = await orderService.getOrdersByUserId(userId)
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderByIdHandler = async (
  req: Request<{ orderId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = parseInt(req.params.orderId, 10)
    if (isNaN(orderId)) {
      return next(new AppError('Invalid order ID', 400))
    }
    const order = await orderService.getOrderById(orderId)
    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    })
  } catch (error) {
    next(error)
  }
}
