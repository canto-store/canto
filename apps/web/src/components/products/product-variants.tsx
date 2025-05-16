import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useProductOptions } from "@/lib/product";

interface SelectedVariant {
  optionId: number;
  valueId: number;
}

export default function ProductVariants() {
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    [],
  );

  const { data: options } = useProductOptions();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <span className="font-medium">Product Variants</span>
        <span className="text-sm text-gray-500">(optional)</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {options?.map((option) => (
          <FormField
            key={option.id}
            name={option.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{option.name}</FormLabel>
                <Select
                  onValueChange={(valueId) => {
                    field.onChange(valueId);
                    setSelectedVariants((prev) => {
                      // Filter out any existing selection for this option
                      const filtered = prev.filter(
                        (v) => v.optionId !== option.id,
                      );
                      // Add the new selection
                      return [
                        ...filtered,
                        { optionId: option.id, valueId: +valueId },
                      ];
                    });
                  }}
                  value={
                    selectedVariants
                      .find((v) => v.optionId === option.id)
                      ?.valueId.toString() || field.value
                  }
                >
                  <FormControl>
                    <SelectTrigger>
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
            )}
          />
        ))}
      </div>
    </div>
  );
}
