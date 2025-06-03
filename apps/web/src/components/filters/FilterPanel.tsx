import { Button } from "@/components/ui/button";
import { useCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  translations: {
    categories: string;
    brands: string;
  };
}

export function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  translations,
}: FilterPanelProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  return (
    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Categories */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            {translations.categories}
          </h4>
          {categoriesLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {categories
                ?.filter((category) => category.name && category.slug)
                .map((category) => (
                  <Button
                    key={category.slug}
                    variant={
                      selectedCategory === category.slug ? "default" : "outline"
                    }
                    size="sm"
                    className="text-sm"
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            {translations.brands}
          </h4>
          {brandsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {brands
                ?.filter((brand) => brand.name && brand.slug)
                .map((brand) => (
                  <Button
                    key={brand.slug}
                    variant={
                      selectedBrand === brand.slug ? "default" : "outline"
                    }
                    size="sm"
                    className="text-sm"
                    onClick={() => setSelectedBrand(brand.slug || "")}
                  >
                    {brand.name}
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
