"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ProductGrid, ProductList } from "@/components/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Filter } from "lucide-react";
import {
  CATEGORIES,
  BRANDS,
  PRICE_RANGES,
  filterProducts,
} from "@/lib/products";
import { type Product } from "@/components/products";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortMenu, type SortOption } from "@/components/common/SortMenu";
import { SearchBar } from "@/components/ui/SearchBar";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialTab = searchParams.get("tab") || "grid";
  const initialSort = searchParams.get("sort") || "featured";
  const initialBrand = searchParams.get("brand") || "All";

  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(
    initialSort as SortOption,
  );
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedBrand !== "All") params.set("brand", selectedBrand);
    if (sortOption !== "featured") params.set("sort", sortOption);
    if (activeTab !== "grid") params.set("tab", activeTab);

    const newUrl = `/browse${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [searchQuery, selectedCategory, selectedBrand, sortOption, activeTab]);

  // Filter and sort products
  useEffect(() => {
    let products = filterProducts(
      searchQuery,
      selectedCategory,
      selectedPriceRange,
      selectedBrand,
    );

    // Sort products based on selected option
    switch (sortOption) {
      case "price-low":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products = [...products].sort((a, b) => b.name.localeCompare(a.name));
        break;
      // featured is default, no sorting needed
    }

    setFilteredProducts(products);
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    sortOption,
  ]);

  const handleQuickAdd = (productName: string) => {
    setCartCount((prev) => prev + 1);
    toast(`${productName} has been added to your cart.`, {
      description: "You can view your cart anytime.",
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSortOption("featured");
  };

  return (
    <PageShell cartCount={cartCount}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Browse Products</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-black">Filter by:</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Categories */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Categories
                </h4>
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
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

              {/* Brands */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Brands
                </h4>
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {BRANDS.map((brand) => (
                    <Button
                      key={brand}
                      variant={selectedBrand === brand ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand}
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
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search products..."
            defaultValue={searchQuery}
            onSubmit={handleSearch}
            containerClassName="mb-4 bg-white p-4 shadow-sm rounded-md"
            className="border-gray-200 bg-white"
            buttonText="Search"
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
          <Separator className="mt-2" />
        </div>

        {/* View Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            <SortMenu value={sortOption} onValueChange={setSortOption} />
          </div>

          {/* Products Display */}
          {filteredProducts.length > 0 ? (
            <>
              <TabsContent value="grid" className="mt-0">
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={handleQuickAdd}
                  className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                />
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-0">
                <ProductList
                  products={filteredProducts}
                  onAddToCart={handleQuickAdd}
                />
              </TabsContent>
            </>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="mb-2 text-xl font-medium text-black">
                No products found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </PageShell>
  );
}
