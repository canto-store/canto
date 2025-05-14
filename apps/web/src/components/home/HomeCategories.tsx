import { useMediaQuery } from "react-haiku";
import { WebCategory } from "./WebCategory";
import MobileCategory from "./MobileCategory";
import { useCategories } from "@/lib/categories";

export function HomeCategories() {
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  const { data: categories } = useCategories();

  if (!categories) {
    return null;
  }

  if (isMobile) {
    return <MobileCategory categories={categories} />;
  } else {
    return <WebCategory categories={categories} />;
  }
}
