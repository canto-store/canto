import { PrismaClient, DeliveryStatus } from '@prisma/client'
import AppError from '../../utils/appError'
import { CreateOrderInput, UpdateOrderItemStatusInput } from './order.types'

const prisma = new PrismaClient()

function generateOrderCode(): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ORD-${timestamp}-${randomSuffix}`
}

export const createOrder = async (input: CreateOrderInput) => {
  const { userId, addressId } = input

  // 1. Validate User
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) {
    throw new AppError('User not found', 404)
  }

  // 2. Validate Address and its ownership
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  })
  if (!address) {
    throw new AppError('Address not found', 404)
  }
  if (address.user_id !== userId) {
    throw new AppError('Address does not belong to the user', 403)
  }

  // 3. Fetch Cart and Cart Items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          variant: true, // Include variant to check stock and get price
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart not found or is empty', 404)
  }

  // 4. Check stock for each item and prepare order items data
  const orderItemsData = []
  for (const item of cart.items) {
    if (item.quantity > item.variant.stock) {
      throw new AppError(
        `Insufficient stock for product variant: ${item.variant.sku}`,
        400
      )
    }
    orderItemsData.push({
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtOrder: item.variant.price, // Use current price
    })
  }

  // 5. Create Order and OrderItems in a transaction
  const orderCode = generateOrderCode()

  try {
    const newOrder = await prisma.$transaction(async tx => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          orderCode,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true, // Include items in the response
        },
      })

      // Decrement stock for each variant
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

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return order
    })

    return newOrder
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('Failed to create order', 500)
  }
}

export const getOrders = async () => {
  return prisma.order.findMany({
    include: {
      items: true,
      user: true,
      address: true,
    },
  })
}

export const getOrdersByUserId = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError('User not found', 404)
  }
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
    },
  })
}

export const getOrderById = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
      address: true,
    },
  })
  if (!order) {
    throw new AppError('Order not found', 404)
  }
  return order
}

export const updateOrderItemDeliveryStatus = async (
  input: UpdateOrderItemStatusInput
) => {
  const { orderItemId, deliveryStatus } = input

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: { include: { items: true } } },
  })

  if (!orderItem) {
    throw new AppError('Order item not found', 404)
  }

  const updatedOrderItem = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { deliveryStatus: deliveryStatus as DeliveryStatus },
  })

  // Check if all items in the order are delivered
  const order = await prisma.order.findUnique({
    where: { id: orderItem.orderId },
    include: { items: true },
  })

  if (order) {
    const allItemsDelivered = order.items.every(
      item => item.deliveryStatus === DeliveryStatus.DELIVERED
    )

    if (allItemsDelivered) {
      await prisma.order.update({
        where: { id: orderItem.orderId },
        data: { deliveryStatus: DeliveryStatus.DELIVERED },
      })
    }
  }

  return updatedOrderItem
}
