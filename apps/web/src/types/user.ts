import { z } from "zod";

export type User = {
  id: number;
  role: string;
  firstName: string;
  email: string;
};

export type Seller = User & {
  brandId: number | null;
};

export type AddressType = "HOUSE" | "APARTMENT" | "OFFICE";

export type UserAddress = {
  id: number;
  address_label: string;
  street_name: string;
  building_number: string;
  apartment_number: string;
  floor: number;
  area: string;
  city: string;
  type: AddressType;
  company_name: string;
  office_number: string;
};

export const userAddressFormSchema = z
  .object({
    type: z.enum(["HOUSE", "APARTMENT", "OFFICE"]),
    street_name: z.string().min(3, "checkout.errors.streetRequired"),
    building_number: z.string().optional(),
    apartment_number: z.string().optional(),
    floor: z.number().optional(),
    area: z.string().min(2, "checkout.errors.areaRequired"),
    city: z.string().min(2, "checkout.errors.cityRequired"),
    phone_number: z.string().min(10, "checkout.errors.phoneRequired"),
    additional_direction: z.string().optional(),
    address_label: z.string(),
    company_name: z.string().optional(),
    office_number: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "APARTMENT" && !data.apartment_number) {
        return false;
      }
      if (data.type === "OFFICE") {
        return !!(data.company_name && data.office_number);
      }
      return true;
    },
    {
      message: "checkout.errors.addressTypeRequired",
    },
  );

export type UserAddressForm = z.infer<typeof userAddressFormSchema>;
