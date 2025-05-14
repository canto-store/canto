import { z } from "zod";

export type Brand = {
  id: number;
  name: string;
  slug: string | null;
  email: string;
  logo: string | null;
  instagramUrl: string | null;
  sellerId: number;
};

export const brandFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters." })
    .max(50, { message: "Brand name must not exceed 50 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  instagramUrl: z
    .string()
    .url({ message: "Please enter a valid Instagram URL." })
    .optional()
    .or(z.literal("")),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
