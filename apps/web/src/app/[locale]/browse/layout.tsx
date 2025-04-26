import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Browse Products",
  description:
    "Browse and filter through our extensive collection of products. Find exactly what you're looking for with our advanced search and filtering options.",
  keywords: ["browse", "products", "filter", "search", "categories", "canto"],
};

export default function BrowseLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
