export default class WishlistService {
  async getWishlistItems(userId: number) {
    await new Promise(resolve => setTimeout(resolve, 1)) // Simulate async operation
    return { message: `Wishlist items for user ${userId}` }
  }
}
