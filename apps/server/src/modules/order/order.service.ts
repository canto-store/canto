import { PrismaClient } from '@prisma/client'
import AppError from '../../utils/appError'
import { CreateOrderInput } from './order.types'
import DeliveryService from '../delivery/delivery.service'
import { Order } from '@canto/types/order'
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
    const product = await prisma.product.findFirst({
      where: { id: item.variant.productId },
      select: { name: true, description: true },
    })
    orderItemsData.push({
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtOrder: item.variant.price, // Use current price
      productName: product.name,
      productDescription: product.description,
    })
  }

  // 5. Create Order and OrderItems in a transaction
  const orderCode = generateOrderCode()

  const deliveryService = new DeliveryService()
  const newOrder = await prisma.$transaction(async tx => {
    // Create Order
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

  await deliveryService.createDelivery(deliveryData, newOrder.id)

  return newOrder
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

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError('User not found', 404)
  }
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc', // 🔥 newest (nearest) first
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
  })
  const delivericOrder = await prisma.delivericOrders.findMany({
    where: { orderId: { in: orders.map(o => o.id) } },
    select: { orderId: true, deliveryStatus: true },
  })
  const ordersResponse: Order[] = orders.map(o => ({
    id: o.id.toString(),
    userId: o.userId.toString(),
    items: o.items.map(oi => ({
      id: oi.id.toString(),
      productId: oi.variantId.toString(),
      productName: oi.variant.product.name,
      quantity: oi.quantity,
      price: oi.priceAtOrder,
      thumbnailUrl: oi.variant?.images?.[0]?.url ?? '/placeholder-image.jpg',
    })),
    totalPrice: o.items.reduce(
      (total, item) => total + item.priceAtOrder * item.quantity,
      0
    ),
    status: delivericOrder.find(d => d.orderId === o.id)?.deliveryStatus,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: {
      name: o.address.address_label,
      street: o.address.street_name,
    },
  }))
  return ordersResponse
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
