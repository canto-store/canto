export type TrackingInfo = {
  carrier: string
  trackingNumber: string
  estimatedDelivery: string
  currentLocation?: string
  updates: {
    status: string
    location: string
    timestamp: string
  }[]
}

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
  items: OrderItem[]
  totalPrice: number
  status: string
  createdAt: string
  shippingAddress: {
    name: string
    street: string
  }
  trackingInfo?: TrackingInfo
}
