"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { UploadButton } from "@/utils/uploadthing";

// Define the form schema with zod
const productFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  size: z.string().optional(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  color: z.string().optional(),
  style: z.string().optional(),
  material: z.string().optional(),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock must be a positive number" }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Define the product type for the list
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  progress: number;
};

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      price: undefined,
      size: "",
      description: "",
      color: "",
      style: "",
      material: "",
      stock: 1,
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
      // Create a new product object
      const newProduct = {
        id: Date.now().toString(),
        name: data.name,
        price: data.price,
        image: imagePreview || "/placeholder.svg?height=80&width=80",
        progress: 100,
      };

      // Add the new product to the list
      setProducts([newProduct, ...products]);

      // Show success message
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        form.reset();
        setSelectedImages([]);
        setImagePreview(null);
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
        imagePreview,
      })
    );

    toast.success("Draft saved", {
      description: "Your product draft has been saved.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        {/* Left panel - Product list */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-auto min-h-full">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 border-b"
                >
                  <div className="h-16 w-16 relative bg-gray-100 rounded-md overflow-hidden">
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
                        <p className="text-gray-600">
                          EGP {product.price.toLocaleString()}
                        </p>
                      </div>
                      <Check className="h-4 w-4 text-gray-400" />
                    </div>
                    {product.progress < 100 ? (
                      <Progress value={product.progress} className="h-2 mt-2" />
                    ) : (
                      <div className="h-2 w-full bg-green-500 mt-2 rounded-full" />
                    )}
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {product.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="items-center justify-center flex h-full">
              <span>no products uploaded yet</span>
            </div>
          )}
        </div>

        {/* Right panel - Product form */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-center">
                  Product Added Successfully!
                </h3>
                <p className="text-gray-500 mt-2 text-center">
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
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        toast("Image Uploaded Successfully!");
                        setImagePreview(res[0].ufsUrl);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(error.message);
                    }}
                  />

                  {imagePreview && (
                    <div className="relative w-full rounded-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={imagePreview}
                        alt="Product Image"
                        className="object-cover"
                        width={200}
                        height={200}
                      />
                    </div>
                  )}

                  {/* Form fields */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Input
                              placeholder="Enter product name"
                              {...field}
                            />
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
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="shoes">Shoes</SelectItem>
                              <SelectItem value="accessories">
                                Accessories
                              </SelectItem>
                              <SelectItem value="electronics">
                                Electronics
                              </SelectItem>
                              <SelectItem value="furniture">
                                Furniture
                              </SelectItem>
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
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">
                      Product Variants{" "}
                      <span className="text-sm font-normal text-gray-500">
                        (optional)
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Size */}
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="XS">XS</SelectItem>
                                <SelectItem value="S">S</SelectItem>
                                <SelectItem value="M">M</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="XL">XL</SelectItem>
                                <SelectItem value="XXL">XXL</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Color */}
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="white">White</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="gray">Gray</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Material */}
                      <FormField
                        control={form.control}
                        name="material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select material" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="polyester">
                                  Polyester
                                </SelectItem>
                                <SelectItem value="leather">Leather</SelectItem>
                                <SelectItem value="silk">Silk</SelectItem>
                                <SelectItem value="wool">Wool</SelectItem>
                                <SelectItem value="linen">Linen</SelectItem>
                                <SelectItem value="denim">Denim</SelectItem>
                                <SelectItem value="metal">Metal</SelectItem>
                                <SelectItem value="plastic">Plastic</SelectItem>
                                <SelectItem value="wood">Wood</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Style */}
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="sporty">Sporty</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="bohemian">Bohemian</SelectItem>
                            <SelectItem value="streetwear">
                              Streetwear
                            </SelectItem>
                            <SelectItem value="minimalist">
                              Minimalist
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Form actions */}
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
