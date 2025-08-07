import type React from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";

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
import { productFormSchema, ProductFormValues } from "@/types/product";
import { useProductsByBrand, useSubmitProduct } from "@/lib/product";
import { useMyBrand } from "@/lib/brand";
import { useRouter } from "@/i18n/navigation";

export default function ProductForm({
  products,
}: {
  products: ProductFormValues | null;
}) {
  const { data: categories } = useCategories();
  const { data: brand } = useMyBrand();
  const { mutateAsync: createProduct, isPending } = useSubmitProduct();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: products?.name ?? "",
      category: products?.category ?? 0,
      description: products?.description ?? "",
      variants: products?.variants ?? [],
    },
  });

  const router = useRouter();

  const { refetch } = useProductsByBrand(brand?.id ?? 0);
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
      clearTimeout(timer);
      router.push({ pathname: "/sell" });
    });
  };

  return (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
  );
}
