import { type UserAddress } from "@/types/user";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export function UserAddress({
  userAddresses,
  selectedAddressId,
  setSelectedAddressId,
  setShowShippingAddressForm,
}: {
  userAddresses: UserAddress[] | undefined;
  selectedAddressId: number | undefined;
  setSelectedAddressId: (id: number) => void;
  setShowShippingAddressForm: (show: boolean) => void;
}) {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {t("checkout.shippingAddress")}
        </h2>
        <Button
          variant="outline"
          className="text-sm font-medium"
          onClick={() => setShowShippingAddressForm(true)}
        >
          {t("checkout.add")}
        </Button>
      </div>
      {userAddresses &&
        userAddresses.map((address) => (
          <div
            key={address.id}
            className={`cursor-pointer rounded-md p-3 text-sm transition-colors ${
              selectedAddressId === address.id
                ? "bg-primary/10 border-primary border-1"
                : "bg-gray-50"
            }`}
            onClick={() => setSelectedAddressId(address.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-bold">{address.address_label}</p>
                  <p className="text-xs text-gray-500">{address.type}</p>
                  {address.type === "HOUSE" && (
                    <p>
                      {address.building_number}, {address.street_name}
                    </p>
                  )}
                  {address.type === "APARTMENT" && (
                    <p>
                      {address.street_name}, {address.apartment_number},{" "}
                      {address.floor}
                    </p>
                  )}
                  {address.type === "OFFICE" && (
                    <p>
                      {address.office_number} {address.company_name}
                    </p>
                  )}

                  <p>
                    {address.area}, {address.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
