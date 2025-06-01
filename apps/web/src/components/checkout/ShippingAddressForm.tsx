"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2, Home, Briefcase } from "lucide-react";
import { cn, parseApiError } from "@/lib/utils";
import { useCreateAddress } from "@/lib/address";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userAddressFormSchema } from "@/types/user";
import { UserAddressForm } from "@/types/user";
import { ErrorAlert } from "../ui/error-alert";

interface AddressTypeTabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function AddressTypeTab({
  label,
  icon,
  isActive,
  onClick,
}: AddressTypeTabProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "flex flex-1 flex-col items-center justify-center rounded-md border p-3 text-center transition-all",
        isActive
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50",
      )}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export function ShippingAddressForm({
  onClose,
}: {
  onClose: (addressId: number) => void;
}) {
  const t = useTranslations();
  const { mutateAsync: createAddress } = useCreateAddress();
  const form = useForm<UserAddressForm>({
    resolver: zodResolver(userAddressFormSchema),
    defaultValues: {
      type: "APARTMENT",
      address_label: "",
      street_name: "",
      building_number: "",
      apartment_number: "",
      floor: undefined,
      area: "",
      city: "",
      phone_number: "",
      additional_direction: "",
      company_name: "",
      office_number: "",
    },
  });

  const { formState, watch, handleSubmit, control } = form;
  const addressType = watch("type");

  const onSubmit = async (data: UserAddressForm) => {
    await createAddress(data)
      .then((res) => {
        toast.success("Address created successfully");
        onClose(res.id);
      })
      .catch((err) => {
        toast.error(parseApiError(err));
      });
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-medium text-gray-900 sm:text-xl">
        {t("checkout.shippingAddress")}
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorAlert message={formState.errors?.root?.message || ""} />
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("checkout.addressType")}
              <span className="ml-1 text-red-500">*</span>
            </Label>
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <AddressTypeTab
                      label={t("checkout.apartment")}
                      icon={<Building2 className="h-5 w-5" />}
                      isActive={field.value === "APARTMENT"}
                      onClick={() => field.onChange("APARTMENT")}
                    />
                    <AddressTypeTab
                      label={t("checkout.house")}
                      icon={<Home className="h-5 w-5" />}
                      isActive={field.value === "HOUSE"}
                      onClick={() => field.onChange("HOUSE")}
                    />
                    <AddressTypeTab
                      label={t("checkout.office")}
                      icon={<Briefcase className="h-5 w-5" />}
                      isActive={field.value === "OFFICE"}
                      onClick={() => field.onChange("OFFICE")}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Apartment specific fields */}
          {addressType === "APARTMENT" && (
            <div className="space-y-4">
              <div className="flex flex-row gap-4">
                <div className="flex-1">
                  <FormField
                    control={control}
                    name="apartment_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.apartmentNumber")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(
                              "checkout.apartmentNumberPlaceholder",
                            )}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.floor")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("checkout.floorPlaceholder")}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* House specific fields */}
          {addressType === "HOUSE" && (
            <FormField
              control={control}
              name="building_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.houseNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.houseNumberPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Office specific fields */}
          {addressType === "OFFICE" && (
            <div className="space-y-4">
              <FormField
                control={control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("checkout.companyName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("checkout.companyNamePlaceholder")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="office_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("checkout.officeNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("checkout.officeNumberPlaceholder")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Common fields for all address types */}
          <FormField
            control={control}
            name="street_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("checkout.street")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("checkout.streetPlaceholder")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("checkout.area")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("checkout.areaPlaceholder")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.city")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.cityPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="additional_direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.directions")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("checkout.directionsPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("checkout.phone")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("checkout.phonePlaceholder")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="address_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("checkout.addressLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("checkout.addressLabelPlaceholder")}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting
              ? t("common.saving")
              : t("checkout.saveAddress")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
