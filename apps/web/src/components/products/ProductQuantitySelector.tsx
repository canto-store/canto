import { Button } from "@/components/ui/button";

export default function ProductQuantitySelector({
  quantity,
  stock,
  onQuantityChange,
}: {
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div>
      <h3 className="font-medium">Quantity</h3>
      <div className="flex w-24 items-center md:w-32">
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="flex-1 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9"
          disabled={quantity >= stock}
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>
      {stock <= 5 && stock > 0 && (
        <span className="mt-4 block text-xs text-red-500 md:text-sm">
          Hurry up! Only {stock} left in stock.
        </span>
      )}
      {stock === 0 && (
        <span className="mt-4 block text-xs text-gray-500 md:text-sm">
          Sorry, this item is out of stock.
        </span>
      )}
    </div>
  );
}
