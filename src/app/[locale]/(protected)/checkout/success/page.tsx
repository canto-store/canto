import { CheckoutSuccess } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been successfully placed and confirmed.",
};

export default function Page() {
  return <CheckoutSuccess />;
}
