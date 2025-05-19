import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const productFormSchema = z.object({
  name: z.string(),
  category: z.string().min(1, { message: "Please select a category" }),
  price: z.coerce
    .number()
    .int()
    .positive({ message: "Price must be a positive number" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  stock: z.coerce
    .number()
    .int()
    .positive({ message: "Stock must be a positive number" }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  progress: number;
};

export default function ProductsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const { data: categories } = useCategories();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: undefined,
      description: "",
      stock: undefined,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedImages.length === 0) {
      toast.error("Image required", {
        description: "Please upload at least one product image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newProduct = {
        id: Date.now().toString(),
        name: data.name,
        price: data.price,
        images: imagesPreview,
        progress: 100,
      };

      setProducts([newProduct, ...products]);

      setShowSuccess(true);

      setTimeout(() => {
        form.reset();
        setSelectedImages([]);
        setImagesPreview([]);
        setShowSuccess(false);
      }, 2000);

      toast.success("Product added successfully", {
        description: `${data.name} has been added to your products.`,
      });
    } catch {
      toast.error("Error", {
        description:
          "There was an error adding your product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = () => {
    const values = form.getValues();
    localStorage.setItem(
      "productDraft",
      JSON.stringify({
        ...values,
        imagesPreview,
      }),
    );

    toast.success("Draft saved", {
      description: "Your product draft has been saved.",
    });
  };

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
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-gray-600">
                          EGP {product.price.toLocaleString()}
                        </p>
                      </div>
                      <Check className="h-4 w-4 text-gray-400" />
                    </div>
                    {product.progress < 100 ? (
                      <Progress value={product.progress} className="mt-2 h-2" />
                    ) : (
                      <div className="mt-2 h-2 w-full rounded-full bg-green-500" />
                    )}
                    <div className="mt-1 text-right text-sm text-gray-500">
                      {product.progress}%
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
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Image upload area */}
                <UploadDropzone
                  endpoint="imageUploader"
                  className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:px-2 ut-button:ut-readying:px-2"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      toast("Image Uploaded Successfully!");
                      setImagesPreview((prev) => [...prev, res[0].ufsUrl]);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message);
                  }}
                />

                <div className="relative flex w-full gap-2">
                  {imagesPreview.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="Product Image"
                      className="rounded-md object-cover"
                      width={200}
                      height={200}
                    />
                  ))}
                </div>

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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Price (EGP) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="EGP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stock */}
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Stock <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
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
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
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
