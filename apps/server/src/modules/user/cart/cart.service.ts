import { PrismaClient } from '@prisma/client'
import AppError from '../../../utils/appError'
import { Cart } from '@canto/types/cart'
class CartService {
  private readonly prisma = new PrismaClient()

  private async getOrCreateCart(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) throw new AppError('User not found', 404)
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    })
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      })
    }
    return cart
  }

  async getCartByUser(userId: number): Promise<Cart> {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { variant: { include: { product: true, images: true } } },
        },
      },
    })
    if (!cart)
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { variant: { include: { product: true, images: true } } },
          },
        },
      })
    const items = await Promise.all(
      cart.items.map(async item => {
        const brand = await this.prisma.brand.findUnique({
          where: { id: item.variant.product.brandId },
        })
        return {
          name: item.variant.product.name,
          brand: {
            name: brand?.name,
            slug: brand?.slug,
          },
          slug: item.variant.product.slug,
          price: item.variant.price,
          image:
            item.variant.images.find(img => img.url).url ??
            '/placeholder-image.jpg',
          stock: item.variant.stock,
          variantId: item.variant.id,
          quantity: item.quantity,
        }
      })
    )
    return {
      items,
      count: items.length,
      price: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (!cart) throw new AppError('Cart not found', 404)

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }
  async addItem(userId: number, variantId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId)
    if (!cart) throw new AppError('Cart not found', 404)
    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    })
    if (!item)
      return await this.prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      })

    if (quantity == null || quantity < 0)
      throw new AppError('quantity must be ≥ 0', 400)
    if (quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: item.id } })
      return
    }
    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    })
  }

  /** Remove one cart item */
  async deleteItem(variantId: number, userId: number) {
    const found = await this.prisma.cartItem.findFirst({
      where: {
        variantId,
        cart: {
          userId,
        },
      },
    })
    if (!found) throw new AppError('Cart item not found', 404)
    return this.prisma.cartItem.delete({ where: { id: found.id } })
  }

  async syncCart(
    userId: number,
    items: { variantId: number; quantity: number }[]
  ) {
    const cart = await this.getOrCreateCart(userId)
    const existingItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        variantId: { in: items.map(item => item.variantId) },
      },
    })
    existingItems.forEach(async item => {
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: {
          quantity: {
            increment: items.find(i => i.variantId === item.variantId).quantity,
          },
        },
      })
    })

    items
      .filter(item => !existingItems.some(i => i.variantId === item.variantId))
      .forEach(async item => {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        })
      })
    return this.getCartByUser(userId)
  }
}

export default CartService
