import { type Category } from "@/types/category";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  variant?: "square" | "rectangle";
  type?: "category" | "banner";
}

export function CategoryCard({
  category,
  variant = "square",
  type = "category",
}: CategoryCardProps) {
  return (
    <a
      href={`/shop?category=${category.slug}`}
      key={category.name}
      className={cn(
        "shadow-lg transition-transform duration-300 hover:scale-102 hover:cursor-pointer hover:shadow-xl",
        variant === "rectangle" ? "aspect-video" : "aspect-square",
        type === "banner" ? "h-[60px] lg:h-[100px]" : "",
      )}
    >
      <Image
        src={category.image}
        alt={category.name}
        className="object-fit h-full w-full rounded-lg"
        width={variant === "rectangle" ? 400 : 300}
        height={variant === "rectangle" ? 225 : 300}
        priority={true}
        loading="eager"
        quality={80}
      />
    </a>
  );
}
