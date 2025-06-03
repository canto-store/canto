import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { ProductVariant } from "@/types/product";

interface ProductOptionsProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | undefined) => void;
}

export default function ProductOptions({
  variants,
  onVariantChange,
}: ProductOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Extract all option types that exist across variants
  const requiredOptionTypes = useMemo(() => {
    const types = new Set<string>();
    variants.forEach((variant) => {
      Object.keys(variant.options).forEach((key) => types.add(key));
    });
    return Array.from(types);
  }, [variants]);

  // Get available values for each option type based on current selection
  const getAvailableOptions = (optionType: string) => {
    const availableValues = new Set<string>();

    variants.forEach((variant) => {
      const matchesOtherSelections = Object.entries(selectedOptions)
        .filter(([key]) => key !== optionType)
        .every(([key, value]) => variant.options[key] === value);

      if (matchesOtherSelections && variant.options[optionType]) {
        availableValues.add(variant.options[optionType]);
      }
    });

    return Array.from(availableValues);
  };

  const handleOptionSelect = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions };

    // Toggle selection - deselect if clicking the same option
    if (newOptions[optionName] === value) {
      delete newOptions[optionName];
    } else {
      newOptions[optionName] = value;
    }

    setSelectedOptions(newOptions);

    // Only return a variant if ALL required options are selected
    const allOptionsSelected = requiredOptionTypes.every(
      (type) => newOptions[type],
    );

    if (allOptionsSelected) {
      const matchingVariant = variants.find((variant) =>
        Object.entries(newOptions).every(
          ([key, value]) => variant.options[key] === value,
        ),
      );
      onVariantChange(matchingVariant || undefined);
    } else {
      onVariantChange(undefined);
    }
  };

  return (
    <div className="space-y-4">
      {requiredOptionTypes.map((optionName) => {
        const availableValues = getAvailableOptions(optionName);

        return (
          <div key={optionName} className="mb-4">
            <h3 className="mb-2 font-medium">{optionName}</h3>
            {optionName === "Size" ? (
              <div className="flex flex-wrap gap-2">
                {availableValues.map((size) => (
                  <Button
                    key={size}
                    variant={
                      selectedOptions.Size === size ? "default" : "outline"
                    }
                    size="sm"
                    className="h-auto px-3 py-1.5 text-sm"
                    onClick={() => handleOptionSelect("Size", size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            ) : optionName === "Color" ? (
              <div className="flex flex-wrap gap-2 md:gap-3">
                {availableValues.map((color) => (
                  <button
                    key={color}
                    className={`h-6 w-6 rounded-full border md:h-8 md:w-8 ${
                      selectedOptions.Color === color
                        ? "ring-2 ring-black ring-offset-1 md:ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleOptionSelect("Color", color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableValues.map((value) => (
                  <Button
                    key={value}
                    variant={
                      selectedOptions[optionName] === value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="h-auto px-3 py-1.5 text-sm"
                    onClick={() => handleOptionSelect(optionName, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
