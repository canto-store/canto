"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, Plus, Check, X } from "lucide-react";

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
  stock: z.coerce.number().int().nonnegative().optional(),
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "T-shirt",
      price: 250,
      image: "/placeholder.svg?height=80&width=80",
      progress: 100,
    },
    {
      id: "2",
      name: "Black Sneaker",
      price: 1200,
      image: "/placeholder.svg?height=80&width=80",
      progress: 100,
    },
    {
      id: "3",
      name: "Silver Watch",
      price: 800,
      image: "/placeholder.svg?height=80&width=80",
      progress: 100,
    },
    {
      id: "4",
      name: "Armchair",
      price: 1500,
      image: "/placeholder.svg?height=80&width=80",
      progress: 100,
    },
  ]);

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
      stock: undefined,
    },
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload a JPEG, PNG, WebP, or GIF image.",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image must be less than 5MB.",
        });
        return;
      }

      setSelectedImages([file]);

      // Create a local preview
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedImages.length === 0) {
      toast.error("Image required", {
        description: "Please upload at least one product image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">Add New Product</h2>
          </div>

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
                  <div
                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          fill
                          className="object-contain"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setSelectedImages([]);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-lg font-medium">Upload Images</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Drag and drop or click to browse
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </div>

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
                                <SelectValue placeholder="Search" />
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

                    {/* Size */}
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Size</FormLabel>
                          <FormControl>
                            <Input placeholder="S" {...field} />
                          </FormControl>
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
                          <FormLabel className="text-base">Color</FormLabel>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                            <Input placeholder="GR" {...field} />
                          </div>
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
                          <FormLabel className="text-base">Material</FormLabel>
                          <FormControl>
                            <Input placeholder="Material" {...field} />
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
                          <FormLabel className="text-base">Stock</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Style */}
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Style</FormLabel>
                        <FormControl>
                          <Input placeholder="Style" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
