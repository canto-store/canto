export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type TrackingInfo = {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  currentLocation?: string;
  updates: {
    status: string;
    location: string;
    timestamp: string;
  }[];
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  thumbnailUrl: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingInfo?: TrackingInfo;
};
