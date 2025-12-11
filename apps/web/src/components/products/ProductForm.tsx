import { useState, useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Plus, X, Loader2 } from "lucide-react";

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
import ProductVariants, {
  ProductVariantsRef,
} from "@/components/products/product-variants";
import { useAllCategories } from "@/lib/categories";
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
import { toast } from "sonner";
import Image from "next/image";
import { useUploadMutation } from "@/hooks/useUpload";

export default function ProductForm({
  products,
}: {
  products: ProductFormValues | null;
}) {
  const { data: categories } = useAllCategories();
  const { data: brand } = useMyBrand();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useSubmitProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<ProductFormValues | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const productVariantsRef = useRef<ProductVariantsRef>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localImageFile, setLocalImageFile] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const uploadMutation = useUploadMutation();

  const isUpdateMode = !!products?.id;
  const isPending = isCreating || isUpdating || isUploadingImages;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: products?.id,
      name: products?.name ?? "",
      image: products?.image ?? "",
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
        returnWindow: products.returnWindow || 0,
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
        returnWindow: 0,
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

  // Cleanup local image file on unmount
  useEffect(() => {
    return () => {
      if (localImageFile) {
        URL.revokeObjectURL(localImageFile.preview);
      }
    };
  }, [localImageFile]);

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
    if (currentValues.returnWindow !== originalValues.returnWindow) {
      changes.returnWindow = currentValues.returnWindow;
      hasChanges = true;
    }

    if (currentValues.image !== originalValues.image) {
      changes.image = currentValues.image;
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

  const uploadMainImage = async () => {
    if (!localImageFile) return;

    try {
      const uploadedUrl = await uploadMutation.mutateAsync({
        file: localImageFile.file,
        folder: "products",
      });

      // Update the form with the uploaded URL
      form.setValue("image", uploadedUrl);

      // Clean up the local file
      URL.revokeObjectURL(localImageFile.preview);
      setLocalImageFile(null);
    } catch (error) {
      console.error("Error uploading main image:", error);
      throw error;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setLocalImageFile({ file, preview });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMainImage = () => {
    if (localImageFile) {
      URL.revokeObjectURL(localImageFile.preview);
      setLocalImageFile(null);
    }
    form.setValue("image", "");
  };

  const onSubmit = async () => {
    try {
      // Upload main image first
      if (localImageFile) {
        setIsUploadingImages(true);
        await uploadMainImage();
        setIsUploadingImages(false);
      }

      // Upload any pending images first
      if (productVariantsRef.current) {
        setIsUploadingImages(true);
        await productVariantsRef.current.uploadImages();
        setIsUploadingImages(false);
      }

      // Get fresh form data after image uploads
      const freshData = form.getValues();

      // Validate required fields for create mode
      if (!isUpdateMode) {
        if (!freshData.image || freshData.image.trim() === "") {
          toast.error("Product image is required");
          return;
        }
        if (!freshData.name || freshData.name.trim() === "") {
          toast.error("Product name is required");
          return;
        }
        if (!freshData.category || freshData.category === 0) {
          toast.error("Category is required");
          return;
        }
        if (!freshData.returnWindow && freshData.returnWindow !== 0) {
          toast.error("Return window is required");
          return;
        }
      }

      if (isUpdateMode && products?.id) {
        const changedFields = getChangedFields(freshData);

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
          name: freshData.name!,
          category: freshData.category!,
          description: freshData.description,
          returnWindow: freshData.returnWindow!,
          image: freshData.image!,
          variants: freshData.variants!.map((variant) => ({
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
      setIsUploadingImages(false);

      // Show error message to user
      if (error instanceof Error) {
        toast.error(
          `Failed to ${isUpdateMode ? "update" : "create"} product: ${error.message}`,
        );
      } else {
        toast.error(
          `Failed to ${isUpdateMode ? "update" : "create"} product. Please try again.`,
        );
      }
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

            {/* Product Image */}
            <div className="space-y-2">
              <FormLabel className="text-base">
                Product Image <span className="text-red-500">*</span>
              </FormLabel>
              {localImageFile ? (
                <div className="relative inline-block">
                  <Image
                    src={localImageFile.preview}
                    alt="Product image"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : form.watch("image") ? (
                <div className="relative inline-block">
                  <Image
                    src={form.watch("image")!}
                    alt="Product image"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex aspect-square w-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploadingImages ? (
                      <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <Plus className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Add product image
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <>
                    <FormMessage />
                  </>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="returnWindow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Return Window (days) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Enter return window in days"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Variants */}
            <ProductVariants ref={productVariantsRef} />

            {/* Form actions */}
            <div className="flex justify-center">
              <Button type="submit" disabled={isPending}>
                {isUploadingImages
                  ? "Uploading Images..."
                  : isPending
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
