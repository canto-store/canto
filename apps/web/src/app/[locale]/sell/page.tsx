import { Metadata } from "next";
import SellPage from "@/components/sell";

export const metadata: Metadata = {
  title: "Become a Seller on Canto",
  description:
    "Join our marketplace and start selling your products to customers easily",
};

export default function Page() {
  return <SellPage />;
}
