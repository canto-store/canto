/*
  Warnings:

  - Added the required column `address_string` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector_id` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector_name` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address_string" TEXT NOT NULL,
ADD COLUMN     "sector_id" INTEGER NOT NULL,
ADD COLUMN     "sector_name" TEXT NOT NULL;
