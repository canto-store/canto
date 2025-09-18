import { z } from "zod";

export const WishlistItemSchema = z.object({
  id: z.number().optional(), // Add this for the removal feature
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  slug: z.string().optional(),
  image: z.object({
    url: z.string().nullable(),
    alt: z.string().nullable(),
  }),
});

export type WishlistItem = z.infer<typeof WishlistItemSchema>;

export const WishlistResponseSchema = z.object({
  data: z.array(WishlistItemSchema),
});

export type WishlistResponse = z.infer<typeof WishlistResponseSchema>;
