import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import AppError from '../../utils/appError';
import { DeliveryStatus } from '@prisma/client';

export const createOrderHandler = async (
  req: Request<{}, {}, { userId: number; addressId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {
      return next(new AppError('UserId and AddressId are required', 400));
    }

    const order = await orderService.createOrder({ userId, addressId });
    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserIdHandler = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return next(new AppError('Invalid user ID', 400));
    }
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdHandler = async (
  req: Request<{ orderId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return next(new AppError('Invalid order ID', 400));
    }
    const order = await orderService.getOrderById(orderId);
    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderItemStatusHandler = async (
  req: Request<
    { orderItemId: string },
    {},
    { deliveryStatus: 'NOT_DELIVERED_YET' | 'DELIVERED' }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderItemId = parseInt(req.params.orderItemId, 10);
    const { deliveryStatus } = req.body;

    if (isNaN(orderItemId)) {
      return next(new AppError('Invalid order item ID', 400));
    }

    if (
      !deliveryStatus ||
      !Object.values(DeliveryStatus).includes(
        deliveryStatus as DeliveryStatus
      )
    ) {
      return next(new AppError('Invalid delivery status', 400));
    }

    const updatedOrderItem = await orderService.updateOrderItemDeliveryStatus({
      orderItemId,
      deliveryStatus,
    });

    res.status(200).json({
      status: 'success',
      data: {
        orderItem: updatedOrderItem,
      },
    });
  } catch (error) {
    next(error);
  }
};
