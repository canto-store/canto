import { prisma, Return } from '../../utils/db'
import AppError from '../../utils/appError'

export class ReturnService {
  async canReturnOrderItem(orderItemId: number, userId: number): Promise<void> {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
      },
    })

    const returnRequest = await prisma.return.findFirst({
      where: { orderItemId },
    })

    if (returnRequest) {
      throw new AppError('Return request already exists for this item', 400)
    }

    if (!orderItem) {
      throw new AppError('Order Item not found', 404)
    }

    if (orderItem.order.userId !== userId) {
      throw new AppError('You are not authorized to return this item', 403)
    }

    if (orderItem.returnDeadline < new Date()) {
      throw new AppError('Return period has expired for this item', 400)
    }
  }

  async createReturn(orderItemId: number, reason: string) {
    const returnRequest = await prisma.return.create({
      data: {
        orderItemId,
        reason,
        status: 'PENDING',
      },
    })

    return returnRequest
  }

  async getReturnsByUser(userId: number) {
    const returnRequests = await prisma.return.findMany({
      where: {
        orderItem: {
          order: {
            userId,
          },
        },
      },
      include: {
        orderItem: {
          include: {
            order: true,
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return returnRequests
  }

  async getAllReturns() {
    const returnRequests = await prisma.return.findMany({
      include: {
        orderItem: {
          include: {
            order: {
              include: {
                user: true,
              },
            },
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return returnRequests
  }

  async updateReturns(id: number, data: Partial<Return>) {
    const returnRequest = await prisma.return.findUnique({
      where: { id },
      include: {
        orderItem: {
          include: {
            order: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })
    if (returnRequest.status === 'PENDING' && data.status === 'REFUNDED') {
      await prisma.user.update({
        where: { id: returnRequest.orderItem.order.user.id },
        data: {
          balance: {
            increment: returnRequest.orderItem.priceAtOrder,
          },
        },
      })
    } else if (
      returnRequest.status === 'REFUNDED' &&
      data.status !== undefined
    ) {
      await prisma.user.update({
        where: { id: returnRequest.orderItem.order.user.id },
        data: {
          balance: Math.max(
            0,
            returnRequest.orderItem.order.user.balance -
              returnRequest.orderItem.priceAtOrder
          ),
        },
      })
    }

    const updatedReturn = await prisma.return.update({
      where: { id },
      data,
    })

    return updatedReturn
  }
}
