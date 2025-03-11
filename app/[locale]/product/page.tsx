"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ProductGrid } from "@/components/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { CATEGORIES, PRICE_RANGES, filterProducts } from "@/lib/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [filteredProducts, setFilteredProducts] = useState(
    filterProducts(initialQuery, initialCategory, PRICE_RANGES[0]),
  );
  const [showFilters] = useState(false);

  // Filter products when search, category, or price range changes
  useEffect(() => {
    setFilteredProducts(
      filterProducts(searchQuery, selectedCategory, selectedPriceRange),
    );
  }, [searchQuery, selectedCategory, selectedPriceRange]);

  const handleQuickAdd = (productName: string) => {
    toast(`${productName} has been added to your cart.`, {
      description: "You can view your cart anytime.",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange(PRICE_RANGES[0]);
  };

  return (
    <PageShell>
      {/* Page Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">All Products</h1>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-medium">Filter by:</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Categories */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Category
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Price
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => (
                    <Button
                      key={range.label}
                      variant={
                        selectedPriceRange === range ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedPriceRange(range)}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleQuickAdd}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="mb-2 text-xl font-medium">No products found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </PageShell>
  );
}
