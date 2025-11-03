import { PrismaClient } from '@prisma/client'
import AppError from '../../../utils/appError'
import { WishlistItem } from '@canto/types/wishlist'
export default class WishlistService {
  private readonly prisma = new PrismaClient()

  async getWishlistItems(userId: number): Promise<{ data: WishlistItem[] }> {
    // Get user's wishlist, create if it doesn't exist
    const wishlist = await this.getOrCreateWishlist(userId)

    // Get all items in the wishlist with product details
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            variants: { include: { images: true } },
          },
        },
      },
    })

    return {
      data: wishlistItems.map(item => {
        return {
          id: item.productId, // Include the product ID for removal
          name: item.product.name,
          brand: item.product.brand.name,
          category: item.product.category.name,
          slug: item.product.slug,
          image: {
            url: item.product.variants[0]?.images[0]?.url || null,
            alt: item.product.variants[0]?.images[0]?.alt_text || null,
          },
        }
      }),
    }
  }

  private async getOrCreateWishlist(userId: number) {
    let wishlist = await this.prisma.wishlist.findFirst({
      where: { userId },
    })

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
      })
    }

    return wishlist
  }

  async toggleWishlistItem(userId: number, productId: number) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const wishlist = await this.getOrCreateWishlist(userId)

    // Check if item already exists in wishlist
    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    })

    if (existingItem) {
      // If item exists, remove it
      await this.prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      })
      return { added: false, removed: true }
    } else {
      // If item doesn't exist, add it
      await this.prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      })
      return { added: true, removed: false }
    }
  }

  async removeWishlistItem(userId: number, productId: number) {
    const wishlist = await this.getOrCreateWishlist(userId)

    // Find the wishlist item
    const wishlistItem = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    })

    if (!wishlistItem) {
      throw new AppError('Item not found in wishlist', 404)
    }

    // Delete the wishlist item
    await this.prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    })

    return true
  }
}
