import { Order, OrderStatus } from "@/types";

// Sample order data for demonstration
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD123456789",
    userId: "user1",
    items: [
      {
        id: "item1",
        productId: "prod1",
        productName: "Premium Denim Jeans",
        quantity: 1,
        price: 89.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&h=300",
      },
      {
        id: "item2",
        productId: "prod2",
        productName: "Classic White T-Shirt",
        quantity: 2,
        price: 29.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&h=300",
      },
    ],
    totalPrice: 149.97,
    status: "Shipped",
    orderDate: "2023-04-15T10:30:00Z",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingInfo: {
      carrier: "FedEx",
      trackingNumber: "FDX1234567890",
      estimatedDelivery: "Apr 20, 2023",
      currentLocation: "Distribution Center, NJ",
      updates: [
        {
          status: "Package received",
          location: "Shipping Facility, CA",
          timestamp: "Apr 16, 2023 08:30 AM",
        },
        {
          status: "In transit",
          location: "Regional Hub, OH",
          timestamp: "Apr 17, 2023 10:45 PM",
        },
        {
          status: "In transit",
          location: "Distribution Center, NJ",
          timestamp: "Apr 18, 2023 04:15 PM",
        },
      ],
    },
  },
  {
    id: "ORD987654321",
    userId: "user1",
    items: [
      {
        id: "item3",
        productId: "prod3",
        productName: "Premium Sneakers",
        quantity: 1,
        price: 129.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&h=300",
      },
    ],
    totalPrice: 129.99,
    status: "Delivered",
    orderDate: "2023-03-28T14:45:00Z",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingInfo: {
      carrier: "UPS",
      trackingNumber: "UPS9876543210",
      estimatedDelivery: "Apr 4, 2023",
      updates: [
        {
          status: "Package received",
          location: "Shipping Facility, CA",
          timestamp: "Mar 29, 2023 09:15 AM",
        },
        {
          status: "In transit",
          location: "Regional Hub, CO",
          timestamp: "Mar 30, 2023 11:30 PM",
        },
        {
          status: "In transit",
          location: "Local Facility, NY",
          timestamp: "Apr 1, 2023 05:45 PM",
        },
        {
          status: "Out for delivery",
          location: "New York, NY",
          timestamp: "Apr 2, 2023 08:00 AM",
        },
        {
          status: "Delivered",
          location: "New York, NY",
          timestamp: "Apr 2, 2023 02:30 PM",
        },
      ],
    },
  },
  {
    id: "ORD567891234",
    userId: "user1",
    items: [
      {
        id: "item4",
        productId: "prod4",
        productName: "Designer Sunglasses",
        quantity: 1,
        price: 159.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=300&h=300",
      },
      {
        id: "item5",
        productId: "prod5",
        productName: "Leather Watch",
        quantity: 1,
        price: 199.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1532667449560-72a95c8d381b?auto=format&fit=crop&w=300&h=300",
      },
      {
        id: "item6",
        productId: "prod6",
        productName: "Premium Backpack",
        quantity: 1,
        price: 89.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&h=300",
      },
    ],
    totalPrice: 449.97,
    status: "Processing",
    orderDate: "2023-04-18T09:15:00Z",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    trackingInfo: {
      carrier: "DHL",
      trackingNumber: "DHL5678912345",
      estimatedDelivery: "Apr 25, 2023",
      currentLocation: "Processing Center, CA",
      updates: [
        {
          status: "Order confirmed",
          location: "Online",
          timestamp: "Apr 18, 2023 09:15 AM",
        },
        {
          status: "Processing",
          location: "Warehouse, CA",
          timestamp: "Apr 18, 2023 03:45 PM",
        },
      ],
    },
  },
  {
    id: "ORD123789456",
    userId: "user1",
    items: [
      {
        id: "item7",
        productId: "prod7",
        productName: "Casual Hoodie",
        quantity: 1,
        price: 59.99,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=300&h=300",
      },
    ],
    totalPrice: 59.99,
    status: "Cancelled",
    orderDate: "2023-04-10T16:20:00Z",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
];

/**
 * Get all orders for a user
 * @param userId User ID
 * @returns Array of orders
 */
export function getUserOrders(userId: string): Order[] {
  return SAMPLE_ORDERS.filter((order) => order.userId === userId);
}

/**
 * Filter orders by status and/or time range
 * @param orders Array of orders to filter
 * @param status Order status filter
 * @param timeRange Time range filter
 * @returns Filtered array of orders
 */
export function filterOrders(
  orders: Order[],
  status: OrderStatus | "All" = "All",
  timeRange: string = "all",
  searchTerm: string = "",
): Order[] {
  let filtered = [...orders];

  // Filter by status
  if (status !== "All") {
    filtered = filtered.filter((order) => order.status === status);
  }

  // Filter by time range
  if (timeRange !== "all") {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case "last30":
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "last90":
        cutoffDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case "last180":
        cutoffDate = new Date(now.setDate(now.getDate() - 180));
        break;
      case "last365":
        cutoffDate = new Date(now.setDate(now.getDate() - 365));
        break;
      default:
        cutoffDate = new Date(0); // Beginning of time
    }

    filtered = filtered.filter(
      (order) => new Date(order.orderDate) >= cutoffDate,
    );
  }

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        // Search by order ID
        order.id.toLowerCase().includes(term) ||
        // Search by product name
        order.items.some((item) =>
          item.productName.toLowerCase().includes(term),
        ),
    );
  }

  return filtered;
}
