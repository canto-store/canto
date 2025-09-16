/*
  Warnings:

  - You are about to drop the column `delivery_status` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_status` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."deliveric_orders" ADD COLUMN     "delivery_status" TEXT NOT NULL DEFAULT 'created';

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "delivery_status";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "delivery_status";
