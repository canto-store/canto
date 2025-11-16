import { PrismaClient } from '@prisma/client'
import AppError from '../../utils/appError'
import { CreateOrderInput } from './order.types'
import DeliveryService from '../delivery/delivery.service'
import { Order } from '@canto/types/order'
import CartService from '../user/cart/cart.service'

export class OrderService {
  private deliveryService: DeliveryService
  private cartService: CartService
  private prisma: PrismaClient

  constructor() {
    this.deliveryService = new DeliveryService()
    this.cartService = new CartService()
    this.prisma = new PrismaClient()
  }
  private generateOrderCode(): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()
    return `ORD-${timestamp}-${randomSuffix}`
  }

  async createOrder(input: CreateOrderInput) {
    const { userId, addressId } = input

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    })
    if (!address) {
      throw new AppError('Address not found', 404)
    }
    if (address.user_id !== userId) {
      throw new AppError('Address does not belong to the user', 403)
    }

    const cart = await this.cartService.getCartByUserId(userId)

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart not found or is empty', 404)
    }

    const orderItemsData = []
    for (const item of cart.items) {
      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtOrder: item.variant.price,
        productName: item.variant.product.name,
        productDescription: item.variant.product.description,
      })
    }

    const orderCode = this.generateOrderCode()

    const newOrder = await this.prisma.$transaction(async tx => {
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          orderCode,
          items: {
            create: orderItemsData.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtOrder: item.priceAtOrder,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return order
    })

    const deliveryData = orderItemsData.map(item => ({
      address: address.address_string,
      client_name: user.name,
      phone_1: user.phone_number,
      price: item.priceAtOrder * item.quantity,
      sector_id: address.sector_id,
      client_id: user.id,
      product_name: item.productName,
      product_desc: item.productDescription,
      quantity: item.quantity,
    }))

    await this.deliveryService.createDelivery(deliveryData, newOrder.id)

    return newOrder
  }

  async getUserOrders(
    userId: number,
    take: number,
    skip: number
  ): Promise<{ orders: Order[]; totalPages: number }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true, images: true },
            },
          },
        },
        address: true,
      },
      take,
      skip,
    })

    const total = await this.prisma.order.count({ where: { userId } })

    const orderRes = orders.map(o => ({
      id: o.id.toString(),
      userId: o.userId.toString(),
      items: o.items.map(oi => ({
        id: oi.id.toString(),
        productId: oi.variantId.toString(),
        productName: oi.variant.product.name,
        quantity: oi.quantity,
        price: oi.priceAtOrder,
        thumbnailUrl: oi.variant.product.image,
      })),
      totalPrice: o.items.reduce(
        (total, item) => total + item.priceAtOrder * item.quantity,
        0
      ),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      shippingAddress: {
        name: o.address.address_label,
        street: o.address.street_name,
      },
    }))

    const totalPages = Math.ceil(total / take)
    return {
      orders: orderRes,
      totalPages,
    }
  }

  async getOrderById(orderId: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        // include full address info
        address: true,

        // include full order items details
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                  },
                },
                images: true,
                optionLinks: {
                  include: {
                    optionValue: true,
                    productOption: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) return null

    // calculate totalPrice
    const totalPrice = order.items.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    )

    return {
      ...order,
      totalPrice,
    }
  }

  async deleteOrder(orderId: number): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    if (order.status === 'CANCELLED') {
      throw new AppError('Order is already cancelled', 400)
    }

    if (order.status === 'SHIPPED') {
      throw new AppError('Shipped orders cannot be cancelled', 400)
    }

    if (order.status === 'OUT_FOR_DELIVERY') {
      throw new AppError('Orders out for delivery cannot be cancelled', 400)
    }

    if (order.status === 'RETURNED') {
      throw new AppError('Returned orders cannot be cancelled', 400)
    }

    if (order.status === 'DELIVERED') {
      await this.prisma.$transaction(async tx => {
        await tx.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: 'RETURN_REQUESTED',
          },
        })
      })
      return 'Return request initiated for the delivered order.'
    }

    if (order.status === 'PROCESSING') {
      await this.prisma.$transaction(async tx => {
        const order = await tx.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: 'CANCELLED',
          },
          include: {
            items: true,
          },
        })

        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
        }
      })

      return 'Order has been successfully cancelled.'
    }
  }

  async canDeleteOrder(orderId: number, userId: number): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    if (order.userId !== userId) {
      throw new AppError("You don't have permission to cancel this order", 403)
    }
  }
}
