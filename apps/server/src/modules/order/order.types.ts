export interface CreateOrderInput {
  userId: number;
  addressId: number;
}

export interface UpdateOrderItemStatusInput {
  orderItemId: number;
  deliveryStatus: 'NOT_DELIVERED_YET' | 'DELIVERED';
}
