import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/appError";
import {
  CreateCartItemDto,
  UpdateCartItemDto,
} from "./cart.types";

class CartService {
  private readonly prisma = new PrismaClient();

  private async getOrCreateCart(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new AppError("User not found", 404);
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCartByUser(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { variant: { include: { product: true, images: true } } },
        },
      },
    });
    if (!cart) throw new AppError("Cart not found", 404);
    return cart;
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new AppError("Cart not found", 404);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async addItem(dto: CreateCartItemDto) {
    const { userId, variantId, quantity } = dto;
    if (!userId) throw new AppError("userId is required", 400);
    if (!variantId) throw new AppError("variantId is required", 400);
    if (!quantity || quantity <= 0)
      throw new AppError("quantity must be > 0", 400);

    // 1) ensure variant exists & check stock
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) throw new AppError("Variant not found", 404);
    if (variant.stock < quantity)
      throw new AppError("Insufficient stock", 400);

    // 2) get or create the cart
    const cart = await this.getOrCreateCart(userId);

    // 3) see if item already in cart
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > variant.stock)
        throw new AppError("Insufficient stock for total quantity", 400);
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    }

    // 4) otherwise create new cartItem
    return this.prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  /** Update quantity (0 will remove) */
  async updateItem(id: number, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id },
      include: { variant: true },
    });
    if (!item) throw new AppError("Cart item not found", 404);

    const { quantity } = dto;
    if (quantity == null || quantity < 0)
      throw new AppError("quantity must be ≥ 0", 400);
    if (quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id } });
      return;
    }
    if (quantity > item.variant.stock)
      throw new AppError("Insufficient stock", 400);

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  /** Remove one cart item */
  async deleteItem(id: number) {
    const found = await this.prisma.cartItem.findUnique({
      where: { id },
    });
    if (!found) throw new AppError("Cart item not found", 404);
    return this.prisma.cartItem.delete({ where: { id } });
  }
}

export default CartService;
