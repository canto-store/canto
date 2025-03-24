import { useMediaQuery } from "react-haiku";
import { CATEGORIES } from "@/lib/data/categories";
import { WebCategory } from "./WebCategory";
import MobileCategory from "./MobileCategory";

export function HomeCategories() {
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  if (isMobile) {
    return <MobileCategory categories={CATEGORIES} />;
  } else {
    return <WebCategory categories={CATEGORIES} />;
  }
}
