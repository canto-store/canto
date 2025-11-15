"use client";

import { cn } from "@/lib/utils";
import { Address } from "@/types";

interface OrderAddressProps {
  className?: string;
  address: Address;
}

export function OrderAddress({ className, address }: OrderAddressProps) {
  if (!address) return null;

  return (
    <div
      className={cn(
        "h-auto rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <h2 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
        Delivery Address
      </h2>

      <div className="space-y-2 text-sm text-gray-700 sm:space-y-3">
        <p>
          <span className="font-medium">Address Type: </span>
          {address.type}
        </p>
        <p>
          <span className="font-medium">Address: </span>
          {address.address_string}
        </p>
        {address.building_number && (
          <p>
            <span className="font-medium">Building Number: </span>
            {address.building_number}
          </p>
        )}
        {address.apartment_number && (
          <p>
            <span className="font-medium">Apartment Number: </span>
            {address.apartment_number}
          </p>
        )}
        {address.floor && (
          <p>
            <span className="font-medium">Floor: </span>
            {address.floor}
          </p>
        )}
        <p>
          <span className="font-medium">Phone Number: </span>
          {address.phone_number}
        </p>
        {address.additional_direction && (
          <p>
            <span className="font-medium">Additional Direction: </span>
            {address.additional_direction}
          </p>
        )}
        {address.company_name && (
          <p>
            <span className="font-medium">Company Name: </span>
            {address.company_name}
          </p>
        )}
        {address.office_number && (
          <p>
            <span className="font-medium">Office Number: </span>
            {address.office_number}
          </p>
        )}
        <p>
          <span className="font-medium">Sector/Area: </span>
          {address.sector_name}
        </p>
      </div>
    </div>
  );
}
