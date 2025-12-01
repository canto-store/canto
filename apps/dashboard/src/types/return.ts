export type ReturnStatus = 'PENDING' | 'REFUNDED' | 'REJECTED'

export type Return = {
  id: number
  orderItemId: number
  reason: string
  status: ReturnStatus
  createdAt: string
  updatedAt: string
  orderItem: {
    id: number
    orderId: number
    variantId: number
    quantity: number
    priceAtOrder: number
    returnDeadline: string | null
    order: {
      id: number
      userId: number
      orderCode: string
      totalPrice: number
      status: string
      createdAt: string
      user?: {
        id: number
        name: string
        email: string
        phone_number: string
      }
    }
    variant?: {
      id: number
      sku: string
      stock: number
      product: {
        id: number
        name: string
        image: string
        description?: string
      }
    }
  }
}
