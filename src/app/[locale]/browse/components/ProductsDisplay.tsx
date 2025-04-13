import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid, ProductList } from "@/components/products";
import { ProductSummary } from "@/types";
import { useTranslations } from "next-intl";

interface ProductsDisplayProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredProducts: ProductSummary[];
  paginatedProducts: ProductSummary[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  clearFilters: () => void;
  isRTL: boolean;
}

export function ProductsDisplay({
  activeTab,
  setActiveTab,
  filteredProducts,
  paginatedProducts,
  currentPage,
  totalPages,
  onPageChange,
  clearFilters,
  isRTL,
}: ProductsDisplayProps) {
  const productsT = useTranslations("products");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      id="products-section"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {filteredProducts.length > 0 ? (
        <>
          <TabsContent value="grid">
            <ProductGrid
              products={paginatedProducts}
              className={`xs:grid-cols-2 grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isRTL ? "rtl" : ""}`}
            />
          </TabsContent>

          <TabsContent value="list">
            <ProductList products={paginatedProducts} />
          </TabsContent>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mt-6 sm:mt-8"
          />
        </>
      ) : (
        <div
          className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center sm:h-64 sm:p-8"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p className="mb-2 text-lg font-medium text-black sm:text-xl">
            {productsT("noProductsFound")}
          </p>
          <p className="text-sm text-gray-500 sm:text-base">
            {productsT("tryAdjusting")}
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            {productsT("clearFilters")}
          </Button>
        </div>
      )}
    </Tabs>
  );
}
