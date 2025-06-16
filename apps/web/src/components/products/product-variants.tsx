/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { Plus, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { SelectedVariant } from "@/types/product";
import { Alert, AlertDescription } from "../ui/alert";

export default function ProductVariants() {
  const form = useFormContext();
  const [variantSets, setVariantSets] = useState<SelectedVariant[]>(() => {
    const initialVariants = form.getValues("variants");
    if (!initialVariants || initialVariants.length === 0) {
      const defaultVariant: SelectedVariant = {
        price: 0,
        stock: 0,
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

  const addVariantSet = () => {
    const newVariantSet: SelectedVariant = {
      price: 0,
      stock: 0,
      options: [],
      images: [],
    };
    const updatedVariants = [...variantSets, newVariantSet];
    setVariantSets(updatedVariants);
    form.setValue("variants", updatedVariants);
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
  };

  const updateVariantSet = (index: number, variant: SelectedVariant) => {
    const newVariantSets = [...variantSets];
    newVariantSets[index] = variant;
    setVariantSets(newVariantSets);
    form.setValue("variants", newVariantSets);
  };

  const handleImageUpload = (variantIndex: number, res: any) => {
    if (res && res[0]) {
      toast("Image Uploaded Successfully!");
      const variant = variantSets[variantIndex];
      updateVariantSet(variantIndex, {
        ...variant,
        images: [...variant.images, res[0].ufsUrl],
      });
    }
  };

  const removeImage = (variantIndex: number, imageIndex: number) => {
    const variant = variantSets[variantIndex];
    const newImages = variant.images.filter(
      (_: string, i: number) => i !== imageIndex,
    );
    updateVariantSet(variantIndex, {
      ...variant,
      images: newImages,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Product Variants</span>
        </div>
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
          {variant.images.length > 0 ? (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {variant.images.map((image: string, imageIndex: number) => (
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
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="relative flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">No images uploaded</p>
                  </div>
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
                    <input
                      type="number"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        updateVariantSet(setIndex, {
                          ...variant,
                          price: Number(e.target.value),
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
                    <input
                      type="number"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        updateVariantSet(setIndex, {
                          ...variant,
                          stock: Number(e.target.value),
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
                    const newOptions = [...variant.options];
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
                    .find(
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

          <Alert>
            <AlertDescription>
              Please upload high quality images that are square shaped (equal
              width and height) for the best display. Images not following the
              guidlines may be rejected.
            </AlertDescription>
          </Alert>

          <UploadButton
            endpoint="imageUploader"
            className="ut-button:bg-primary ut-button:py-2 ut-button:rounded-md ut-button:text-sm ut-button:font-medium ut-button:text-white ut-button:shadow-sm ut-button:hover:bg-primary/90 ut-button:transition-colors"
            onClientUploadComplete={(res) => {
              handleImageUpload(setIndex, res);
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message);
              setIsUploading(false);
            }}
            content={{
              allowedContent: "Max Size: 4MB",
              button: (
                <div className="flex items-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Image</span>
                    </>
                  )}
                </div>
              ),
            }}
            onUploadBegin={() => setIsUploading(true)}
            disabled={isUploading}
          />
        </div>
      ))}
    </div>
  );
}
