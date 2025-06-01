import { useMediaQuery } from "react-haiku";
import { WebCategory } from "./WebCategory";
import MobileCategory from "./MobileCategory";
import { useCategories } from "@/lib/categories";
import { HomeCategoriesSkeleton } from "./HomeCategoriesSkeleton";

export function HomeCategories() {
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories) {
    return <HomeCategoriesSkeleton />;
  }

  if (isMobile) {
    return <MobileCategory categories={categories} />;
  } else {
    return <WebCategory categories={categories} />;
  }
}
