import { CheckoutSuccess } from "@/components";
import { AppLayout } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been successfully placed and confirmed.",
};

export default function Page() {
  return (
    <AppLayout>
      <CheckoutSuccess />
    </AppLayout>
  );
}
