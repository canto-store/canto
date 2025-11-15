"use client";

import { XCircle } from "lucide-react";

export default function OrderNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <XCircle className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Order Not Found
      </h1>
      <p className="mb-4 text-gray-600">
        The order you are looking for does not exist or has been removed.
      </p>
      <a
        href="/orders"
        className="bg-primary hover:bg-primary/90 inline-block rounded-md px-4 py-2 text-white shadow"
      >
        Back to Orders
      </a>
    </div>
  );
}
