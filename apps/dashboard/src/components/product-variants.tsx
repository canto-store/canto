import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define types for our data structure
interface OptionValue {
  id: number;
  value: string;
}

interface ProductOption {
  id: number;
  name: string;
  values: OptionValue[];
}

interface SelectedVariant {
  optionId: number;
  valueId: number;
}

export default function ProductVariants() {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    []
  );
  useEffect(() => {
    // fetch("https://api.canto-store.com/api/product/options")
    fetch("http://localhost:8000/api/product/options")
      .then((res) => res.json())
      .then((data: ProductOption[]) => {
        setOptions(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">
        Product Variants
        <span className="text-sm font-normal text-gray-500">(optional)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => (
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
                        (v) => v.optionId !== option.id
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
