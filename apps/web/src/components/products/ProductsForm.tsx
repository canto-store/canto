import type React from "react";
import { useState } from "react";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Package, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ProductVariants from "@/components/products/product-variants";
import { useCategories } from "@/lib/categories";
import {
  productFormSchema,
  ProductFormValues,
  ProductStatus,
} from "@/types/product";
import { useProductsByBrand, useSubmitProduct } from "@/lib/product";
import { useMyBrand } from "@/lib/brand";

export default function ProductsForm() {
  const { data: categories } = useCategories();
  const { data: brand } = useMyBrand();
  const { mutateAsync: createProduct, isPending } = useSubmitProduct();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: 0,
      description: "",
      variants: [],
    },
  });

  const {
    data: products,
    refetch,
    isLoading: isFetchingProducts,
  } = useProductsByBrand(brand?.id ?? 0);
  const onSubmit = (data: ProductFormValues) => {
    createProduct({ ...data, brandId: brand?.id ?? 0 }).then(() => {
      refetch();
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        form.reset({
          name: "",
          category: 0,
          description: "",
          variants: [],
        });
      }, 3000);
      return () => clearTimeout(timer);
    });
  };

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Left panel - Product list */}
        <div className="min-h-full overflow-auto rounded-lg p-4 shadow-sm">
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border-b p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                      {product.status === ProductStatus.ACTIVE && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                      {product.status === ProductStatus.PENDING && (
                        <span className="text-sm text-yellow-500">Pending</span>
                      )}
                      {product.status === ProductStatus.INACTIVE && (
                        <span className="text-sm text-red-500">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isFetchingProducts ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b p-3"
                >
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <Package className="text-primary mb-4 h-16 w-16" />
              <span className="text-gray-500">No products uploaded yet.</span>
            </div>
          )}
        </div>

        {/* Right panel - Product form */}
        <div className="rounded-lg p-4 shadow-sm">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-center text-xl font-medium">
                Product Added Successfully!
              </h3>
              <p className="mt-2 text-center text-gray-500">
                Your product has been added to the catalog.
              </p>
            </div>
          ) : isPending ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <span className="ml-2 text-lg">Uploading product...</span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-center">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Form fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Product Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Product Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                          }}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Categories" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Variants */}
                <ProductVariants />

                {/* Form actions */}
                <div className="flex justify-center">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Uploading..." : "Upload Product"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
