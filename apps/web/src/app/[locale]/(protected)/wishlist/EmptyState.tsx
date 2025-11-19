"use client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function EmptyState() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-gray-100 p-8">
        <Heart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold">Your wishlist is empty</h2>
      <p className="text-muted-foreground max-w-md">
        Items added to your wishlist will appear here. Start browsing and add
        products you love!
      </p>
      <Button size="lg" asChild>
        <Link href="/shop">Shop Products</Link>
      </Button>
    </div>
  );
}
