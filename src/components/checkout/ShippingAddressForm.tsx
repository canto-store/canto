"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { FormInput } from "@/components/ui/form-input";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Building2, Home, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export type AddressType = "apartment" | "house" | "office";

export interface ShippingAddress {
  addressType: AddressType;
  // Apartment fields
  apartmentNumber?: string;
  floor?: string;
  // House fields
  houseNumber?: string;
  // Office fields
  companyName?: string;
  officeNumber?: string;
  // Common fields
  street: string;
  area: string;
  city: string;
  directions?: string;
  phone: string;
  addressLabel?: string;
  saveAddress: boolean;
}

interface ShippingAddressFormProps {
  onAddressSubmit: (address: ShippingAddress) => void;
  className?: string;
}

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
      onClick={onClick}
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
  onAddressSubmit,
  className,
}: ShippingAddressFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});
  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    addressType: "apartment",
    saveAddress: false,
  });

  // Define validation schema
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.addressType) {
      errors.addressType = t("checkout.errors.addressTypeRequired");
    }

    // Validate based on address type
    if (formData.addressType === "apartment") {
      if (!formData.apartmentNumber || formData.apartmentNumber.length < 1) {
        errors.apartmentNumber = t("checkout.errors.apartmentNumberRequired");
      }
    } else if (formData.addressType === "house") {
      if (!formData.houseNumber || formData.houseNumber.length < 1) {
        errors.houseNumber = t("checkout.errors.houseNumberRequired");
      }
    } else if (formData.addressType === "office") {
      if (!formData.companyName || formData.companyName.length < 2) {
        errors.companyName = t("checkout.errors.companyNameRequired");
      }
      if (!formData.officeNumber || formData.officeNumber.length < 1) {
        errors.officeNumber = t("checkout.errors.officeNumberRequired");
      }
    }

    // Common field validation
    if (!formData.street || formData.street.length < 3) {
      errors.street = t("checkout.errors.streetRequired");
    }

    if (!formData.area || formData.area.length < 2) {
      errors.area = t("checkout.errors.areaRequired");
    }

    if (!formData.city || formData.city.length < 2) {
      errors.city = t("checkout.errors.cityRequired");
    }

    if (!formData.phone || formData.phone.length < 10) {
      errors.phone = t("checkout.errors.phoneRequired");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressTypeChange = (value: AddressType) => {
    setFormData((prev) => ({ ...prev, addressType: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveAddress: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      onAddressSubmit(formData as ShippingAddress);
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <h2 className="mb-4 text-lg font-medium text-gray-900 sm:text-xl">
        {t("checkout.shippingAddress")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("checkout.addressType")}
            <span className="ml-1 text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <AddressTypeTab
              label={t("checkout.apartment")}
              icon={<Building2 className="h-5 w-5" />}
              isActive={formData.addressType === "apartment"}
              onClick={() => handleAddressTypeChange("apartment")}
            />
            <AddressTypeTab
              label={t("checkout.house")}
              icon={<Home className="h-5 w-5" />}
              isActive={formData.addressType === "house"}
              onClick={() => handleAddressTypeChange("house")}
            />
            <AddressTypeTab
              label={t("checkout.office")}
              icon={<Briefcase className="h-5 w-5" />}
              isActive={formData.addressType === "office"}
              onClick={() => handleAddressTypeChange("office")}
            />
          </div>
          {formErrors.addressType && (
            <p className="text-sm text-red-500">{formErrors.addressType}</p>
          )}
        </div>

        {/* Apartment specific fields */}
        {formData.addressType === "apartment" && (
          <div className="space-y-4">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <FormInput
                  name="apartmentNumber"
                  label={t("checkout.apartmentNumber")}
                  placeholder={t("checkout.apartmentNumberPlaceholder")}
                  value={formData.apartmentNumber || ""}
                  onChange={handleInputChange}
                  error={formErrors.apartmentNumber}
                  required
                />
              </div>
              <div className="flex-1">
                <FormInput
                  name="floor"
                  label={t("checkout.floor")}
                  placeholder={t("checkout.floorPlaceholder")}
                  value={formData.floor || ""}
                  onChange={handleInputChange}
                  error={formErrors.floor}
                />
              </div>
            </div>
          </div>
        )}

        {/* House specific fields */}
        {formData.addressType === "house" && (
          <FormInput
            name="houseNumber"
            label={t("checkout.houseNumber")}
            placeholder={t("checkout.houseNumberPlaceholder")}
            value={formData.houseNumber || ""}
            onChange={handleInputChange}
            error={formErrors.houseNumber}
            required
          />
        )}

        {/* Office specific fields */}
        {formData.addressType === "office" && (
          <div className="space-y-4">
            <FormInput
              name="companyName"
              label={t("checkout.companyName")}
              placeholder={t("checkout.companyNamePlaceholder")}
              value={formData.companyName || ""}
              onChange={handleInputChange}
              error={formErrors.companyName}
              required
            />

            <FormInput
              name="officeNumber"
              label={t("checkout.officeNumber")}
              placeholder={t("checkout.officeNumberPlaceholder")}
              value={formData.officeNumber || ""}
              onChange={handleInputChange}
              error={formErrors.officeNumber}
              required
            />
          </div>
        )}

        {/* Common fields for all address types */}
        <FormInput
          name="street"
          label={t("checkout.street")}
          placeholder={t("checkout.streetPlaceholder")}
          value={formData.street || ""}
          onChange={handleInputChange}
          error={formErrors.street}
          required
        />

        <FormInput
          name="area"
          label={t("checkout.area")}
          placeholder={t("checkout.areaPlaceholder")}
          value={formData.area || ""}
          onChange={handleInputChange}
          error={formErrors.area}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            name="city"
            label={t("checkout.city")}
            placeholder={t("checkout.cityPlaceholder")}
            value={formData.city || ""}
            onChange={handleInputChange}
            error={formErrors.city}
            required
          />

          <FormInput
            name="directions"
            label={t("checkout.directions")}
            placeholder={t("checkout.directionsPlaceholder")}
            value={formData.directions || ""}
            onChange={handleInputChange}
          />
        </div>

        <FormInput
          name="phone"
          label={t("checkout.phone")}
          placeholder={t("checkout.phonePlaceholder")}
          value={formData.phone || ""}
          onChange={handleInputChange}
          error={formErrors.phone}
          required
        />

        <FormInput
          name="addressLabel"
          label={t("checkout.addressLabel")}
          placeholder={t("checkout.addressLabelPlaceholder")}
          value={formData.addressLabel || ""}
          onChange={handleInputChange}
        />

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id="saveAddress"
            checked={formData.saveAddress}
            onCheckedChange={handleCheckboxChange}
          />
          <div className="space-y-1 leading-none">
            <Label htmlFor="saveAddress">{t("checkout.saveAddress")}</Label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.saving") : t("checkout.saveAddress")}
        </Button>
      </form>
    </div>
  );
}
