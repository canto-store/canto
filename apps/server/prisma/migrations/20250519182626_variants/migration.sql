/*
  Warnings:

  - The primary key for the `variant_option_values` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `productOptionId` to the `variant_option_values` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOUSE', 'APARTMENT', 'OFFICE');

-- AlterTable
ALTER TABLE "variant_option_values" DROP CONSTRAINT "variant_option_values_pkey",
ADD COLUMN     "productOptionId" INTEGER NOT NULL,
ADD CONSTRAINT "variant_option_values_pkey" PRIMARY KEY ("variantId", "productOptionId");

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "AddressType" NOT NULL,
    "street_name" TEXT NOT NULL,
    "building_number" TEXT NOT NULL,
    "apartment_number" TEXT,
    "floor" INTEGER,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "additional_direction" TEXT,
    "address_label" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "variant_option_values" ADD CONSTRAINT "variant_option_values_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "product_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
