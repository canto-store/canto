export type Category = {
  id: number;
  name: string;
  image: string;
  slug: string;
  aspect: "SQUARE" | "RECTANGLE";
  coming_soon?: boolean;
  children?: Category[];
};
