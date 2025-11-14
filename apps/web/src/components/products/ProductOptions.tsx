import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { ProductVariant } from "@/types/product";

interface ProductOptionsProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | undefined) => void;
  showImage: (matchingVariant: ProductVariant) => void;
}

export default function ProductOptions({
  variants,
  onVariantChange,
  showImage,
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

  // Check if an option value would result in an out-of-stock variant
  const isOptionDisabled = (optionType: string, optionValue: string) => {
    // Create a potential selection with this option
    const potentialSelection = {
      ...selectedOptions,
      [optionType]: optionValue,
    };

    // Find variants that match this potential selection
    const matchingVariants = variants.filter((variant) =>
      Object.entries(potentialSelection).every(
        ([key, value]) => variant.options[key] === value,
      ),
    );

    // If we have all required options selected, check if the exact variant is out of stock
    const allOptionsSelected = requiredOptionTypes.every(
      (type) => potentialSelection[type],
    );
    if (allOptionsSelected) {
      return (
        matchingVariants.length > 0 &&
        matchingVariants.every((v) => v.stock === 0)
      );
    }

    // If not all options are selected, only disable if ALL possible variants with this option are out of stock
    // and there are actually variants that match the current partial selection
    if (matchingVariants.length === 0) return false;
    return matchingVariants.every((v) => v.stock === 0);
  };

  const handleOptionSelect = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions };

    // Toggle selection
    if (newOptions[optionName] === value) {
      delete newOptions[optionName];
    } else {
      newOptions[optionName] = value;
    }

    setSelectedOptions(newOptions);

    // Try to find the matching variant directly
    const matchingVariant = variants.find((variant) =>
      Object.entries(variant.options).every(
        ([key, val]) => newOptions[key] === val,
      ),
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
      showImage(matchingVariant);
    } else {
      onVariantChange(undefined);
    }
  };

  return (
    <div className="space-y-4">
      {requiredOptionTypes.map((optionName) => {
        const availableValues = getAvailableOptions(optionName);

        if (availableValues.length === 0) return null;
        return (
          <div key={optionName} className="mb-4">
            <h3 className="mb-2 font-medium">{optionName}</h3>
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
                  className={`h-auto px-3 py-1.5 text-sm ${
                    isOptionDisabled(optionName, value)
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(optionName, value)}
                  disabled={isOptionDisabled(optionName, value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
