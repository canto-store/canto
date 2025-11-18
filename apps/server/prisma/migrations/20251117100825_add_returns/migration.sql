/*
  Warnings:

  - The values [RETURNED,RETURN_REQUESTED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `return_deadline` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ReturnStatus" AS ENUM ('PENDING', 'REFUNDED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrderStatus_new" AS ENUM ('PROCESSING', 'OUT_FOR_DELIVERY', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."orders" ALTER COLUMN "status" TYPE "public"."OrderStatus_new" USING ("status"::text::"public"."OrderStatus_new");
ALTER TYPE "public"."OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "public"."OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "public"."orders" ALTER COLUMN "status" SET DEFAULT 'PROCESSING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."order_items" ADD COLUMN     "return_deadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "return_deadline";

-- CreateTable
CREATE TABLE "public"."returns" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "public"."ReturnStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."returns" ADD CONSTRAINT "returns_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
