export type OrderStatus =
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "RETURN_REQUESTED";

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

export type OptionLinks = {
  id: number;
  variantId: number;
  optionValueId: number;
  productOptionId: number;
  optionValue: {
    id: number;
    value: string;
    productOptionId: number;
  };
  productOption: {
    id: number;
    name: string;
  };
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  thumbnailUrl: string;
  optionLinks?: OptionLinks[];
};

export type Address = {
  id: number;
  user_id: number;
  type: string; // e.g., "APARTMENT", "HOUSE"
  street_name: string;
  building_number?: string;
  apartment_number?: string;
  floor?: string | null;
  phone_number: string;
  additional_direction?: string | null;
  address_label?: string | null;
  company_name?: string | null;
  office_number?: string | null;
  address_string: string;
  sector_id: number;
  sector_name: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  orderCode?: string;
  address?: Address;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  returnDeadline: string;
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
