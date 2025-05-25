export type User = {
  id: number;
  role: string;
  firstName: string;
};

export type Seller = User & {
  brandId: number | null;
};
