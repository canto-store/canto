import type React from "react";
import { useState, useEffect, useRef } from "react";

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
import ProductVariants from "@/components/products/product-variants";
import { useCategories } from "@/lib/categories";
import {
  productFormSchema,
  ProductFormValues,
  UpdateProductFormValues,
  CreateProductFormValues,
} from "@/types/product";
import {
  useProductsByBrand,
  useSubmitProduct,
  useUpdateProduct,
} from "@/lib/product";
import { useMyBrand } from "@/lib/brand";
import { useRouter } from "@/i18n/navigation";

export default function ProductForm({
  products,
}: {
  products: ProductFormValues | null;
}) {
  const { data: categories } = useCategories();
  const { data: brand } = useMyBrand();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useSubmitProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const [showSuccess, setShowSuccess] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<ProductFormValues | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const isUpdateMode = !!products?.id;
  const isPending = isCreating || isUpdating;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: products?.id,
      name: products?.name ?? "",
      category: products?.category ?? 0,
      description: products?.description ?? "",
      variants: products?.variants ?? [],
    },
  });

  // Keep the form in sync with incoming product data (e.g., after an update refetch)
  useEffect(() => {
    if (products) {
      const nextValues: ProductFormValues = {
        id: products.id,
        name: products.name || "",
        category: products.category || 0,
        description: products.description || "",
        variants: products.variants || [],
      };
      form.reset(nextValues);
      setOriginalValues(nextValues);
    } else {
      const emptyValues: ProductFormValues = {
        id: undefined,
        name: "",
        category: 0,
        description: "",
        variants: [],
      };
      form.reset(emptyValues);
      setOriginalValues(null);
    }
  }, [products, form]);

  const router = useRouter();
  const { refetch } = useProductsByBrand(brand?.id ?? 0);

  // Smoothly scroll to the success message when it appears
  useEffect(() => {
    if (showSuccess) {
      // Wait for DOM to paint the success block
      const id = window.setTimeout(() => {
        successRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [showSuccess]);

  // Function to detect changes in form values
  const getChangedFields = (
    currentValues: ProductFormValues,
  ): UpdateProductFormValues | null => {
    if (!originalValues || !products?.id) return null;

    const changes: UpdateProductFormValues = {
      id: products.id,
      slug: products.slug || "",
    };
    let hasChanges = false;

    if (currentValues.name !== originalValues.name) {
      changes.name = currentValues.name;
      hasChanges = true;
    }
    if (currentValues.category !== originalValues.category) {
      changes.category = currentValues.category;
      hasChanges = true;
    }
    if (currentValues.description !== originalValues.description) {
      changes.description = currentValues.description;
      hasChanges = true;
    }

    if (currentValues.variants) {
      const variantChanges: Array<{
        id?: number;
        price?: number;
        stock?: number;
        options?: Array<{
          optionId: number;
          valueId: number;
        }>;
        images?: string[];
      }> = [];

      currentValues.variants.forEach((currentVariant, index) => {
        const originalVariant = originalValues?.variants?.[index];

        if (currentVariant.id) {
          const variantChange: {
            id: number;
            price?: number;
            stock?: number;
            options?: Array<{
              optionId: number;
              valueId: number;
            }>;
            images?: string[];
          } = { id: currentVariant.id };

          if (originalVariant) {
            if (currentVariant.price !== originalVariant.price) {
              variantChange.price = currentVariant.price;
            }
            if (currentVariant.stock !== originalVariant.stock) {
              variantChange.stock = currentVariant.stock;
            }
            if (
              JSON.stringify(currentVariant.options) !==
              JSON.stringify(originalVariant.options)
            ) {
              variantChange.options = currentVariant.options;
            }
            if (
              JSON.stringify(currentVariant.images) !==
              JSON.stringify(originalVariant.images)
            ) {
              variantChange.images = currentVariant.images;
            }
          }

          variantChanges.push(variantChange);
        } else {
          if (currentVariant.price && currentVariant.stock) {
            variantChanges.push({
              price: currentVariant.price,
              stock: currentVariant.stock,
              options: currentVariant.options || [],
              images: currentVariant.images || [],
            });
          }
        }
      });

      if (variantChanges.length > 0) {
        changes.variants = variantChanges;
        hasChanges = true;
      }
    }

    return hasChanges ? changes : null;
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isUpdateMode && products?.id) {
        const changedFields = getChangedFields(data);

        if (!changedFields) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            router.push("/sell/products");
          }, 2000);
          return;
        }

        await updateProduct(changedFields);
      } else {
        // Create mode - send all required fields
        const createData: CreateProductFormValues = {
          name: data.name!,
          category: data.category!,
          description: data.description,
          variants: data.variants!.map((variant) => ({
            price: variant.price!,
            stock: variant.stock!,
            options: variant.options!,
            images: variant.images!,
          })),
        };

        await createProduct({ ...createData, brandId: brand?.id ?? 0 });
      }

      form.reset();
      refetch();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/sell/products");
      }, 2000);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  return (
    <div className="w-full rounded-lg p-4 shadow-sm">
      {showSuccess ? (
        <div
          ref={successRef}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-center text-xl font-medium">
            {isUpdateMode
              ? "Product Updated Successfully!"
              : "Product Added Successfully!"}
          </h3>
          <p className="mt-2 text-center text-gray-500">
            {isUpdateMode
              ? "Your product has been updated in the catalog."
              : "Your product has been added to the catalog."}
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                      defaultValue={field.value?.toString() || "0"}
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
                {isPending
                  ? isUpdateMode
                    ? "Updating..."
                    : "Submitting..."
                  : isUpdateMode
                    ? "Update Product"
                    : "Submit Product"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
