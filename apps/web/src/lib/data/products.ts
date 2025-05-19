export type PriceRange = {
  label: string;
  min: number;
  max: number;
};

// Price ranges for filtering
export const PRICE_RANGES: PriceRange[] = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

// Product sizes
export const SIZES = ["XS", "S", "M", "L", "XL"];

// Product colors
export const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#808080" },
  { name: "Blue", value: "#0000FF" },
];
