import { Star } from "lucide-react";

export default function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 md:h-5 md:w-5"
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
      <span className="ml-2 text-xs text-gray-600 md:text-sm">
        ({reviewCount} reviews)
      </span>
    </div>
  );
}
