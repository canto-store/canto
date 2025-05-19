import { Button } from "../ui/button";
import { useState } from "react";
import { ProductOptionTemp } from "@/types/product";

interface ProductOptionsProps {
  options: ProductOptionTemp[];
}

export default function ProductOptions({ options }: ProductOptionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!options) return null;

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name} className="mb-4">
          <h3 className="mb-2 font-medium">{option.name}</h3>
          {option.name === "Size" ? (
            <div className="flex flex-wrap gap-2">
              {option.values.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  className="h-auto px-3 py-1.5 text-sm"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          ) : option.name === "Color" ? (
            <div className="flex flex-wrap gap-2 md:gap-3">
              {option.values.map((color) => (
                <button
                  key={color}
                  className={`h-6 w-6 rounded-full border md:h-8 md:w-8 ${
                    selectedColor === color
                      ? "ring-2 ring-black ring-offset-1 md:ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
