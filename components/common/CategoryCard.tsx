import { type Category } from "@/lib/data/categories";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a
      href={`/browse?category=${encodeURIComponent(category.name)}`}
      className="group relative aspect-square overflow-hidden rounded-lg hover:cursor-pointer"
    >
      <Image
        src={category.image}
        alt={category.name}
        className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-110"
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, 300px"
      />
      <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-white">
          {category.name}
        </span>
      </div>
    </a>
  );
}
