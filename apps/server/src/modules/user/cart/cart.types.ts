// DTOs for Cart & CartItem operations

export interface CreateCartItemDto {
  userId: number
  variantId: number
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}
