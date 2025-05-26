import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { UploadDropzone } from "@/utils/uploadthing";
import ProductVariants from "@/components/products/product-variants";
import { useCategories } from "@/lib/categories";
import {
  productFormSchema,
  ProductFormValues,
  ProductStatus,
  SavedProductForm,
} from "@/types/product";
import { useProductsByBrand, useSubmitProduct } from "@/lib/product";
import { useMyBrand } from "@/lib/brand";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductsForm() {
  const { data: categories } = useCategories();
  const { data: brand } = useMyBrand();
  const { mutate: createProduct, isPending, isSuccess } = useSubmitProduct();
  const queryClient = useQueryClient();

  const { data: products = [] } = useProductsByBrand(brand?.id ?? 0);
  const onSubmit = (data: ProductFormValues) => {
    createProduct({ ...data, brandId: brand?.id ?? 0 });
    queryClient.invalidateQueries({ queryKey: ["products-by-brand"] });
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: 0,
      description: "",
      variants: [],
    },
  });

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Left panel - Product list */}
        <div className="min-h-full overflow-auto rounded-lg p-4 shadow-sm">
          {products.length > 0 ? (
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
          ) : (
            <div className="flex h-full items-center justify-center">
              <span>no products uploaded yet</span>
            </div>
          )}
        </div>

        {/* Right panel - Product form */}
        <div className="rounded-lg p-4 shadow-sm">
          {isSuccess ? (
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
                      <FormLabel className="text-base">
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
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
                    {isPending ? "Saving..." : "Save"}
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
