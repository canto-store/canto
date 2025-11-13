import { Cart, PrismaClient } from '@prisma/client'
import AppError from '../../../utils/appError'
import { Cart as CartType } from '@canto/types/cart'
import ProductService from '../../product/product.service'
import UserService from '../user.service'
class CartService {
  private readonly prisma = new PrismaClient()
  private readonly productService: ProductService
  private readonly userService: UserService

  constructor() {
    this.productService = new ProductService()
    this.userService = new UserService()
  }

  private async getCartByUserId(userId: number): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    })
    return cart
  }

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

  async createCart(userId: number) {
    return await this.prisma.cart.create({
      data: { userId },
    })
  }

  async getCartByUser(userId: number): Promise<CartType> {
    await this.productService.validateCartItems(userId)
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { include: { brand: true } }, images: true },
            },
          },
        },
      },
    })

    const items = cart.items.map(item => {
      return {
        name: item.variant.product.name,
        brand: {
          name: item.variant.product.brand.name,
          slug: item.variant.product.brand.slug,
        },
        slug: item.variant.product.slug,
        price: item.variant.price,
        image: item.variant.product.image,
        stock: item.variant.stock,
        variantId: item.variant.id,
        quantity: item.quantity,
      }
    })
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
  async getCartItem(cartId: number, variantId: number) {
    return this.prisma.cartItem.findFirst({
      where: { cartId, variantId },
    })
  }
  async getOrCreateCartItem(cartId: number, variantId: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { cartId, variantId },
    })
    if (!item)
      return await this.prisma.cartItem.create({
        data: { cartId, variantId, quantity: 0 },
      })
    return item
  }

  async addItem(userId: number, variantId: number, quantity: number) {
    if (quantity == null || quantity < 0)
      throw new AppError('quantity must be ≥ 0', 400)
    const variant = await this.productService.getProductVariantById(variantId)
    if (!variant) throw new AppError('Product variant not found', 404)
    const inStock = await this.productService.isProductVariantInStock(variant)

    if (!inStock)
      throw new AppError('Cannot add out-of-stock item to cart', 400)

    const cart = await this.getOrCreateCart(userId)
    const item = await this.getOrCreateCartItem(cart.id, variantId)
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

  async deleteItemById(cartItemId: number) {
    return await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    })
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

  async mergeCarts(guestId: number, userId: number) {
    const guestCart = await this.getCartByUserId(guestId)
    const userCart = await this.getCartByUserId(userId)

    if (guestCart && userCart) {
      const guestCartItems = await this.prisma.cartItem.findMany({
        where: { cartId: guestCart.id },
      })

      for (const guestItem of guestCartItems) {
        const existingUserItem = await this.prisma.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
          },
        })

        if (existingUserItem) {
          this.updateItemQuantity(
            existingUserItem.id,
            existingUserItem.quantity + guestItem.quantity
          )
        } else {
          this.updateCartId(guestItem.id, userCart.id)
        }
      }
    } else if (guestCart && !userCart) {
      await this.updateCartUserId(guestId, userId)
    }
  }

  async updateItemQuantity(cartItemId: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })
  }

  async updateCartUserId(oldUserId: number, newUserId: number) {
    return this.prisma.cart.update({
      where: { userId: oldUserId },
      data: { userId: newUserId },
    })
  }

  async updateCartId(cartItemId: number, cartId: number) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { cartId },
    })
  }
}

export default CartService
