/*
  Warnings:

  - A unique constraint covering the columns `[qr_code]` on the table `deliveric_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qr_code` to the `deliveric_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliveric_orders" ADD COLUMN     "qr_code" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "deliveric_orders_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "deliveric_orders_qr_code_key" ON "deliveric_orders"("qr_code");
