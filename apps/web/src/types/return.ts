import { OrderStatus } from "./order";

export type ReturnStatus = "PENDING" | "REFUNDED" | "REJECTED";

export type Return = {
  orderItem: {
    order: {
      id: number;
      createdAt: string;
      updatedAt: string;
      orderCode: string;
      userId: number;
      addressId: number;
      deliveredAt: string | null;
      status: OrderStatus;
    };
    variant?: {
      id: number;
      sku: string;
      stock: number;
      product: {
        id: number;
        name: string;
        image: string;
        description?: string;
      };
    };
  } & {
    id: number;
    orderId: number;
    variantId: number;
    quantity: number;
    priceAtOrder: number;
    returnDeadline: string | null;
  };
} & {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: ReturnStatus;
  orderItemId: number;
  reason: string;
};
