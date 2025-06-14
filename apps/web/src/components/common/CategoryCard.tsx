import { useRouter } from "@/i18n/navigation";
import { type Category } from "@/types/category";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  index?: number;
  variant?: "square" | "rectangle";
}

export function CategoryCard({
  category,
  index = 0,
  variant = "square",
}: CategoryCardProps) {
  const router = useRouter();
  const handleCategoryClick = (category: Category) => {
    router.push(`/browse?category=${category.slug}`);
  };
  return (
    <button
      key={category.name}
      onClick={() => handleCategoryClick(category)}
      className={cn(
        "group overflow-hidden rounded-lg hover:cursor-pointer",
        variant === "rectangle" ? "aspect-video" : "aspect-square",
      )}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          className="object-fit h-full w-full transition-transform duration-300 group-hover:scale-105"
          width={variant === "rectangle" ? 400 : 300}
          height={variant === "rectangle" ? 225 : 300}
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
          quality={80}
        />
      </div>
    </button>
  );
}
