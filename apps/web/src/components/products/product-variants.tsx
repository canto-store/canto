/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useProductOptions } from "@/lib/product";
import { Button } from "../ui/button";
import { Plus, X, Loader2, PlusIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { SelectedVariant } from "@/types/product";
import { Input } from "../ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductVariants() {
  const form = useFormContext();
  const [variantSets, setVariantSets] = useState<SelectedVariant[]>(() => {
    const initialVariants = form.getValues("variants");
    if (!initialVariants || initialVariants.length === 0) {
      const defaultVariant: SelectedVariant = {
        price: "" as any,
        stock: "" as any,
        options: [],
        images: [],
      };
      form.setValue("variants", [defaultVariant]);
      return [defaultVariant];
    }
    return initialVariants;
  });
  const { data: options } = useProductOptions();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVariantIndex, setNewVariantIndex] = useState<number | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Smooth scroll to newly added variant
  useEffect(() => {
    if (newVariantIndex !== null) {
      const variantElement = document.getElementById(
        `variant-${newVariantIndex}`,
      );
      if (variantElement) {
        setTimeout(() => {
          variantElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
      setNewVariantIndex(null);
    }
  }, [newVariantIndex]);

  const addVariantSet = () => {
    const newVariantSet: SelectedVariant = {
      price: "" as any,
      stock: "" as any,
      options: [],
      images: [],
    };
    const updatedVariants = [...variantSets, newVariantSet];
    setVariantSets(updatedVariants);
    form.setValue("variants", updatedVariants);
    setNewVariantIndex(updatedVariants.length - 1);
  };

  const removeVariantSet = (index: number) => {
    if (variantSets.length <= 1) {
      return;
    }
    const newVariantSets = variantSets.filter(
      (_: SelectedVariant, i: number) => i !== index,
    );
    setVariantSets(newVariantSets);
    form.setValue("variants", newVariantSets);

    // Scroll to the previous variant (or the last one if removing the last)
    const targetIndex = index > 0 ? index - 1 : newVariantSets.length - 1;
    setNewVariantIndex(targetIndex);
  };

  const updateVariantSet = (index: number, variant: SelectedVariant) => {
    const newVariantSets = [...variantSets];
    newVariantSets[index] = variant;
    setVariantSets(newVariantSets);
    form.setValue("variants", newVariantSets);
  };

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const variant = variantSets[variantIndex];
    let newImages = (variant.images || []).filter(
      (_: string, i: number) => i !== imageIndex,
    );

    if (newImages.length === 0) {
      newImages = [];
    }
    updateVariantSet(variantIndex, {
      ...variant,
      images: newImages,
    });
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to upload ${file.name}`,
      );
      throw error;
    }
  };

  const handleFileChange = (
    variantIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array for easier handling
    const filesArray = Array.from(files);

    // Check if any file exceeds the size limit
    const oversizedFile = filesArray.find(
      (file) => file.size > 4 * 1024 * 1024,
    );
    if (oversizedFile) {
      toast.error("One or more files exceed the 4MB limit");
      return;
    }

    // Set uploading state once for all files
    setIsUploading(true);

    // Upload each file
    const uploadPromises = filesArray.map((file) => uploadToS3(file));

    // Once all uploads are complete, reset the uploading state
    Promise.all(uploadPromises)
      .then((uploadedUrls) => {
        const variant = variantSets[variantIndex];
        const newImages = [...(variant.images || []), ...uploadedUrls];
        updateVariantSet(variantIndex, {
          ...variant,
          images: newImages,
        });
      })
      .then(() => {
        toast.success("Images uploaded successfully!");
        // Clear the file input after upload
        if (fileInputRefs.current[variantIndex]) {
          fileInputRefs.current[variantIndex].value = "";
        }
      })
      .catch((error) => {
        console.error("Error in batch upload:", error);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Variants</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariantSet}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Variant Set
        </Button>
      </div>

      {variantSets.map((variant: SelectedVariant, setIndex: number) => (
        <div
          key={setIndex}
          id={`variant-${setIndex}`}
          className="relative space-y-4 rounded-lg border p-4"
        >
          {variantSets.length > 1 && (
            <button
              type="button"
              onClick={() => removeVariantSet(setIndex)}
              className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {(variant.images || []).length > 0 ? (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {(variant.images || []).map(
                  (image: string, imageIndex: number) => (
                    <div key={imageIndex} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`Variant image ${imageIndex + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(setIndex, imageIndex)}
                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="flex aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center"
                    data-accept="image/*"
                    data-multiple="true"
                    data-max-file-size="4194304"
                    onClick={() => {
                      setShowUploadModal(true);
                    }}
                  >
                    {isUploading ? (
                      <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <PlusIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">Add images</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[setIndex] = el;
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileChange(setIndex, e)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`variants.${setIndex}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(value);
                        updateVariantSet(setIndex, {
                          ...variant,
                          price: value as any,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${setIndex}.stock`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);
                        field.onChange(value);
                        updateVariantSet(setIndex, {
                          ...variant,
                          stock: value as any,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {options?.map((option) => (
              <FormItem key={option.id} className="w-full">
                <div className="flex items-center gap-1">
                  <FormLabel>{option.name}</FormLabel>
                  <span className="text-xs text-gray-400">(optional)</span>
                </div>
                <Select
                  onValueChange={(valueId) => {
                    const newOptions = [...(variant.options || [])];
                    const existingIndex = newOptions.findIndex(
                      (o: { optionId: number; valueId: number }) =>
                        o.optionId === option.id,
                    );

                    if (existingIndex !== -1) {
                      newOptions[existingIndex] = {
                        optionId: option.id,
                        valueId: Number(valueId),
                      };
                    } else {
                      newOptions.push({
                        optionId: option.id,
                        valueId: Number(valueId),
                      });
                    }

                    updateVariantSet(setIndex, {
                      ...variant,
                      options: newOptions,
                    });
                  }}
                  value={variant.options
                    ?.find(
                      (o: { optionId: number; valueId: number }) =>
                        o.optionId === option.id,
                    )
                    ?.valueId.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            ))}
          </div>
          <AlertDialog open={showUploadModal} onOpenChange={setShowUploadModal}>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Image Upload Guidelines</AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Please follow these guidelines for the best display quality:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Square aspect ratio (1:1)</li>
                  <li>High quality images (minimum 800x800px)</li>
                  <li>Maximum file size (4MB per image)</li>
                  <li>Supported formats (JPG, PNG, WebP)</li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => fileInputRefs.current[setIndex]?.click()}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
