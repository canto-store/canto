export type OrderStatus =
  | 'PROCESSING'
  | 'OUT_FOR_DELIVERY'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type OrderItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  thumbnailUrl: string
}

export type Order = {
  id: string
  userId: string
  orderCode?: string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: string
  customerName?: string
  customerEmail?: string
  user?: {
    name: string
    phone_number: string
    email: string
  }
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}
