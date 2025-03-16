import { CheckoutPage } from "@/components";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Checkout",
    description: "Checkout page",
  };
}

export default function Page() {
  return <CheckoutPage />;
}
